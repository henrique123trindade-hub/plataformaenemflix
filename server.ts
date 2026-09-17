import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  getAllUsersFromFirestore, 
  getUserByEmailFromFirestore, 
  getUserByUidFromFirestore, 
  saveUserToFirestore, 
  updateUserInFirestore, 
  deleteUserFromFirestore, 
  calculateUsage, 
  hashPassword, 
  verifyPassword,
  FirestoreUser 
} from "./server/firestoreDb";

// Load environment variables
dotenv.config();

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A chave API do Gemini (GEMINI_API_KEY) não está configurada nos Secrets da aplicação.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded parsing middleware with larger limits for essay image analysis
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route: Get complete and live list of videos from a YouTube playlist
  app.get("/api/playlist", async (req, res) => {
    try {
      const playlistId = req.query.list;
      if (!playlistId || typeof playlistId !== "string") {
        return res.status(400).json({ success: true, videos: [] });
      }

      const url = `https://www.youtube.com/playlist?list=${playlistId}`;
      const response = await globalThis.fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        }
      });

      if (!response.ok) {
        throw new Error(`YouTube returned status ${response.status}`);
      }

      const html = await response.text();
      const startStr = "ytInitialData = ";
      const startIndex = html.indexOf(startStr);
      
      let videos: any[] = [];

      if (startIndex !== -1) {
        const dataStart = startIndex + startStr.length;
        const scriptEndIndex = html.indexOf("</script>", dataStart);
        if (scriptEndIndex !== -1) {
          let jsonStr = html.substring(dataStart, scriptEndIndex).trim();
          if (jsonStr.endsWith(";")) {
            jsonStr = jsonStr.slice(0, -1);
          }
          try {
            const data = JSON.parse(jsonStr);
            
            // Ultra-robust recursive search to find the playlist items array
            const findPlaylistVideosInObject = (obj: any): any[] | null => {
              if (!obj || typeof obj !== "object") return null;
              
              if (Array.isArray(obj)) {
                const hasVideoRenderers = obj.some(item => item && (item.playlistVideoRenderer || item.videoRenderer || item.childVideoRenderer));
                if (hasVideoRenderers) {
                  return obj;
                }
                for (const item of obj) {
                  const res = findPlaylistVideosInObject(item);
                  if (res) return res;
                }
              } else {
                for (const key of Object.keys(obj)) {
                  const res = findPlaylistVideosInObject(obj[key]);
                  if (res) return res;
                }
              }
              return null;
            };

            const list = findPlaylistVideosInObject(data);
            
            if (list && Array.isArray(list)) {
              videos = list
                .map((item: any) => {
                  const renderer = item.playlistVideoRenderer || item.videoRenderer || item.childVideoRenderer;
                  if (!renderer) return null;
                  
                  const videoId = renderer.videoId;
                  if (!videoId) return null;

                  const title = renderer.title?.runs?.[0]?.text || renderer.title?.simpleText || renderer.title?.accessibility?.accessibilityData?.label || "Sem título";
                  const duration = renderer.lengthText?.simpleText || "Vídeo";
                  
                  return {
                    id: videoId,
                    title,
                    duration,
                    youtubeId: videoId
                  };
                })
                .filter(Boolean);
            }
          } catch (jsonErr) {
            console.error("Erro ao fazer parse do JSON do YouTube:", jsonErr);
          }
        }
      }

      // Fallback: If parsing failed or playlist was empty, try regex match for videos
      if (videos.length === 0) {
        const videoIdMatches = [...html.matchAll(/"videoId":"([^"]+)"/g)].map(m => m[1]);
        const uniqueVideoIds = Array.from(new Set(videoIdMatches)).slice(0, 100); // limit to 100
        
        if (uniqueVideoIds.length > 0) {
          videos = uniqueVideoIds.map((id, index) => ({
            id,
            title: `Aula ${index + 1} da Playlist`,
            duration: "Vídeo",
            youtubeId: id
          }));
        }
      }

      res.json({ success: true, playlistId, videos });
    } catch (error: any) {
      console.error("Erro ao buscar playlist do YouTube:", error);
      res.json({ success: false, videos: [], error: error.message || "Erro ao buscar playlist." });
    }
  });

  // API Route: AI Generation for Recommendations and Custom Study Calendars
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { type, userContext, userPrompt } = req.body;

      let prompt = "";
      let config: any = {
        temperature: 0.7,
      };

      if (type === "recommend") {
        prompt = `Você é o EnemFlix AI, o assistente virtual da plataforma EnemFlix (estilo Netflix para o ENEM).
        Com base no contexto do estudante:
        - Matéria Favorita: ${userContext?.favoriteSubject || "Não especificado"}
        - Desempenho geral: ${userContext?.performance || "Iniciante"}
        - Horas estudadas: ${userContext?.hoursStudied || 0}h
        - Áreas com mais dificuldade: ${userContext?.weakSubjects?.join(", ") || "Nenhuma"}
        - Foco atual: ${userPrompt || "Geral"}

        Recomende os próximos 3 tópicos ou conteúdos essenciais que este aluno deveria assistir na plataforma para alavancar sua nota do ENEM.
        Estruture sua resposta em português de forma extremamente atraente, motivadora, usando termos do universo cinematográfico (ex: "Sua próxima maratona", "Estreia recomendada", "Cena pós-créditos de estudos"). Use formatação Markdown elegante.`;
      } else if (type === "schedule") {
        prompt = `Você é o EnemFlix AI. Monte um CRONOGRAMA DE ESTUDOS personalizado de 7 dias para o ENEM com foco em: "${userPrompt || "Estudos Gerais"}".
        O estudante tem disponibilidade de ${userContext?.dailyHours || 3} horas por dia.
        
        Sua resposta deve conter:
        1. Um cronograma dia a dia (Dia 1 a Dia 7) detalhando a matéria, o assunto específico do ENEM (ex: "Funções de 1º Grau" em Matemática, ou "Ecologia" em Biologia), tempo sugerido e uma dica rápida de estudo/revisão.
        2. Uma frase motivacional inspirada em grandes produções do cinema ou séries.
        
        Estruture a resposta em português brasileiro usando Markdown bem organizado, com tabelas ou tópicos limpos.`;
      } else if (type === "essay") {
        prompt = `Você é um corretor oficial e especialista da redação do ENEM altamente criterioso. Avalie a redação do aluno com base nas 5 competências oficiais do ENEM (cada uma vale de 0 a 200 pontos):
        
        Tema Proposto: "${userContext?.topic || "Geral"}"
        Meta do Aluno: obter ${userContext?.targetScore || 800} pontos.
        
        Redação do aluno:
        """
        ${userPrompt}
        """
        
        ATENÇÃO CRÍTICA DE NOTA ZERO:
        De acordo com o edital do ENEM, você deve atribuir NOTA ZERO (0 pontos para TODAS as 5 competências) caso o texto:
        - Tenha menos de 7 linhas (ou menos de 70 palavras).
        - Fuja completamente ao tema proposto ("${userContext?.topic || "Geral"}").
        - Não atenda à estrutura do tipo textual dissertativo-argumentativo (por exemplo, seja um poema, história, lista, carta, ou simples frases desconexas).
        - Apresente impropérios, desenhos, deboches, xingamentos, orações religiosas isoladas ou partes deliberadamente desconectadas (como receitas de bolo, hinos de futebol, ou piadas).
        - Apresente cópia integral dos textos motivadores sem nenhuma autoria.
        - Seja incompreensível, ilegível ou contenha amontoados de letras aleatórias ("asdfghjk", "teste de redação apenas", etc.).
        - Consista apenas em frases genéricas como "escrevendo qualquer coisa", "bla bla bla" ou similares para burlar o sistema.
        
        Se qualquer uma dessas regras for violada, classifique a redação como "REDAÇÃO ZERADA", explique em detalhes qual critério oficial do ENEM foi infringido para resultar em nota zero e atribua exatamente a nota 0 para cada competência:
        - Competência 1: 0
        - Competência 2: 0
        - Competência 3: 0
        - Competência 4: 0
        - Competência 5: 0
        
        Caso contrário, avalie a redação de forma extremamente rigorosa com base nas 5 competências oficiais do ENEM, atribuindo notas múltiplas de 40 (0, 40, 80, 120, 160 ou 200) para cada uma delas.
        
        Sua resposta DEVE conter OBRIGATORIAMENTE em seu corpo:
        1. As notas exatas especificadas exatamente neste formato para extração:
           - Competência 1: <nota>
           - Competência 2: <nota>
           - Competência 3: <nota>
           - Competência 4: <nota>
           - Competência 5: <nota>
        2. Uma análise detalhada, construtiva e pedagógica para cada competência, apontando desvios específicos (gramática, tangenciamento, falta de repertório legitimado, problemas de coesão, conectivos, ou proposta de intervenção incompleta).
        3. Um "Feedback de Ouro" prático e inspirador para guiar a próxima escrita do aluno.
        
        Use um tom sério, profissional, mas ao mesmo tempo acolhedor e pedagógico. Escreva tudo em português do Brasil e formate a resposta com Markdown elegante.`;
      } else if (type === "essay-image") {
        prompt = `Você é um corretor oficial e especialista da redação do ENEM altamente criterioso. Analise a imagem da redação manuscrita fornecida pelo aluno, transcreva-a mentalmente e avalie-a de acordo com as 5 competências oficiais do ENEM (cada uma vale de 0 a 200 pontos):
        
        Tema Escolhido: "${userContext?.topic || "Geral"}"
        Meta do Aluno: obter ${userContext?.targetScore || 800} pontos.
        
        ATENÇÃO CRÍTICA DE NOTA ZERO:
        De acordo com o edital do ENEM, você deve atribuir NOTA ZERO (0 pontos para TODAS as 5 competências) caso o texto na imagem:
        - Tenha menos de 7 linhas (ou menos de 70 palavras).
        - Fuja completamente ao tema proposto ("${userContext?.topic || "Geral"}").
        - Não atenda à estrutura do tipo textual dissertativo-argumentativo (por exemplo, seja um poema, história, lista, carta, ou simples frases desconexas).
        - Apresente impropérios, desenhos, deboches, xingamentos, orações religiosas isoladas ou partes deliberadamente desconectadas (como receitas de bolo, hinos de futebol, ou piadas).
        - Apresente cópia integral dos textos motivadores sem nenhuma autoria.
        - Seja incompreensível, ilegível ou contenha amontoados de letras aleatórias.
        
        Se qualquer uma dessas regras for violada, classifique a redação como "REDAÇÃO ZERADA", explique em detalhes qual critério oficial do ENEM foi infringido para resultar em nota zero e atribua exatamente a nota 0 para cada competência:
        - Competência 1: 0
        - Competência 2: 0
        - Competência 3: 0
        - Competência 4: 0
        - Competência 5: 0
        
        Sua resposta DEVE conter OBRIGATORIAMENTE em seu corpo:
        1. A transcrição completa do texto lido na imagem em uma seção intitulada "### 📝 Transcrição da Redação" para que o aluno possa conferir a leitura.
        2. As notas exatas especificadas exatamente neste formato para extração:
           - Competência 1: <nota>
           - Competência 2: <nota>
           - Competência 3: <nota>
           - Competência 4: <nota>
           - Competência 5: <nota>
        3. Uma análise detalhada, construtiva e pedagógica para cada competência, apontando desvios específicos (erros de gramática ou pontuação identificados na escrita manuscrita, adequação ao tema, uso produtivo de repertório legitimado, coesão, conectivos, ou ausência de algum dos 5 elementos da proposta de intervenção).
        4. Um "Feedback de Ouro" prático e inspirador para guiar a próxima escrita do aluno.
        
        Use um tom sério, profissional, mas ao mesmo tempo acolhedor e pedagógico. Escreva tudo em português do Brasil e formate a resposta com Markdown elegante.`;
      } else if (type === "question") {
        prompt = `Gere uma questão inédita e de alta qualidade no formato oficial do ENEM sobre o tema ou matéria: "${userPrompt || "Geral"}".
        A questão deve conter um enunciado detalhado e contextualizado (com texto de apoio relevante no estilo da prova do ENEM), cinco alternativas (A, B, C, D, E) com apenas uma correta, e uma explicação pedagógica profunda do porquê a correta está correta e por que as outras são distratores incorretos.`;
        config = {
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "O enunciado completo da questão, incluindo o texto de apoio/contexto e a pergunta final."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Um vetor contendo exatamente 5 alternativas de resposta para a questão (A, B, C, D, E)."
              },
              correctOptionIndex: {
                type: Type.INTEGER,
                description: "O índice da alternativa correta na lista de opções (número inteiro de 0 a 4)."
              },
              explanation: {
                type: Type.STRING,
                description: "Uma explicação pedagógica minuciosa comentando a alternativa correta e apontando o erro dos distratores."
              },
              subject: {
                type: Type.STRING,
                description: "A matéria ou subtema exato ao qual a questão pertence."
              }
            },
            required: ["text", "options", "correctOptionIndex", "explanation", "subject"]
          }
        };
      } else {
        // Chatbot geral ou livre
        prompt = `Você é o EnemFlix AI, assistente inteligente da plataforma EnemFlix, uma plataforma moderna estilo Netflix para preparação do ENEM.
        Responda à pergunta ou dúvida do aluno sobre o ENEM ou conteúdos de forma didática, direta, descontraída e motivadora, usando termos de filmes/séries sempre que fizer sentido.
        
        Dúvida do aluno: "${userPrompt}"
        
        Responda em português brasileiro usando formatação Markdown elegante.`;
      }

      const ai = getGeminiClient();
      let contents: any = prompt;
      if (type === "essay-image" && req.body.image && req.body.mimeType) {
        let base64Data = req.body.image;
        if (base64Data.includes(";base64,")) {
          base64Data = base64Data.split(";base64,").pop() || "";
        }
        contents = [
          {
            inlineData: {
              data: base64Data,
              mimeType: req.body.mimeType || "image/jpeg"
            }
          },
          prompt
        ];
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: config
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error("Erro no Gemini API:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message || "Erro interno ao processar requisição de Inteligência Artificial." 
      });
    }
  });

  // ==========================================
  // SISTEMA DE ADMINISTRAÇÃO & CONTROLE DE LOGINS VIA FIRESTORE CLOUD DATABASE
  // Senha de Acesso: "pirulitobaby"
  // Limite de Uso: 1 ano / 365 dias
  // ==========================================
  const ADMIN_PASSWORD = "pirulitobaby";

  function isDemoUser(u: any): boolean {
    if (!u) return false;
    const uid = u.uid || "";
    const email = (u.email || "").toLowerCase();
    return (
      uid.startsWith("usr_demo_") ||
      uid.startsWith("guest_demo_") ||
      uid === "test_123" ||
      email === "lucas.medicina@gmail.com" ||
      email === "mariana.direito@outlook.com" ||
      email === "rodrigo.expirado@gmail.com"
    );
  }


  // 1. Cadastrar novo usuário (Salvo diretamente no Firestore Cloud)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, phone, targetCourse, targetScore } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "E-mail e senha são obrigatórios." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (password.length < 6) {
        return res.status(400).json({ success: false, error: "A senha deve conter no mínimo 6 caracteres." });
      }

      const existingUser = await getUserByEmailFromFirestore(normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: "Este e-mail já está cadastrado. Faça login com suas credenciais." 
        });
      }

      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const uid = "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

      const newRecord: FirestoreUser = {
        uid,
        email: normalizedEmail,
        name: (name && name.trim()) || normalizedEmail.split("@")[0] || "Estudante",
        password: hashPassword(String(password).trim()),
        phone: (phone && phone.trim()) || "",
        targetCourse: targetCourse || "Medicina",
        targetScore: Number(targetScore) || 750,
        type: "auth",
        createdAt: now,
        lastLogin: now,
        lastLoginAt: now,
        lastActiveAt: now,
        expiresAt,
        limitDays: 365,
        loginCount: 1,
        status: "active",
        isBanned: false,
        isDisconnected: false,
        userAgent: req.headers["user-agent"] || "Web App"
      };

      await saveUserToFirestore(newRecord);

      const usage = calculateUsage(newRecord.createdAt);
      const { password: _, ...safeUser } = newRecord;

      return res.json({
        success: true,
        user: {
          ...safeUser,
          ...usage,
          status: "active"
        }
      });
    } catch (err: any) {
      console.error("Erro em /api/auth/register:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Autenticação de usuário (Valida diretamente no Firestore Cloud)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "E-mail e senha são obrigatórios." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await getUserByEmailFromFirestore(normalizedEmail);

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: "Nenhuma conta encontrada com este e-mail. Por favor, crie sua conta primeiro." 
        });
      }

      const rawPassword = String(password).trim();
      if (user.password && !verifyPassword(rawPassword, user.password)) {
        return res.status(401).json({ success: false, error: "Senha incorreta. Verifique seus dados." });
      }

      const usage = calculateUsage(user.createdAt);

      if (user.isBanned || user.status === "banned") {
        return res.status(403).json({
          success: false,
          isBanned: true,
          isDisconnected: true,
          error: "Esta conta foi suspensa ou banida pelo administrador do sistema."
        });
      }

      if (usage.isExpired || user.status === "expired") {
        return res.status(403).json({
          success: false,
          isExpired: true,
          isDisconnected: true,
          error: "O período limite de uso de 365 dias (1 ano) expirou para esta conta."
        });
      }

      const now = new Date().toISOString();
      await updateUserInFirestore(user.uid, {
        lastLogin: now,
        lastLoginAt: now,
        lastActiveAt: now,
        isDisconnected: false,
        disconnectedAt: null,
        status: "active",
        loginCount: (user.loginCount || 1) + 1,
        userAgent: req.headers["user-agent"] || user.userAgent
      });

      const { password: _, ...safeUser } = user;
      return res.json({
        success: true,
        user: {
          ...safeUser,
          lastLogin: now,
          lastLoginAt: now,
          isDisconnected: false,
          status: "active",
          ...usage
        }
      });
    } catch (err: any) {
      console.error("Erro em /api/auth/login:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Gravar ou atualizar login de usuário no Firestore Cloud
  app.post("/api/auth/record-login", async (req, res) => {
    try {
      const { uid, email, name, phone, targetCourse, targetScore, type } = req.body;
      if (!uid && !email) {
        return res.status(400).json({ success: false, error: "UID ou e-mail é obrigatório" });
      }

      const normalizedEmail = email ? email.trim().toLowerCase() : "";
      if (isDemoUser({ uid, email: normalizedEmail })) {
        return res.json({ success: true });
      }

      const now = new Date().toISOString();
      let existing = uid ? await getUserByUidFromFirestore(uid) : null;
      if (!existing && normalizedEmail) {
        existing = await getUserByEmailFromFirestore(normalizedEmail);
      }

      if (existing) {
        const usage = calculateUsage(existing.createdAt);

        if (existing.isBanned || existing.status === "banned") {
          return res.status(403).json({
            success: false,
            isBanned: true,
            isDisconnected: true,
            isExpired: usage.isExpired,
            message: "Esta conta foi banida pelo administrador do sistema."
          });
        }

        if (usage.isExpired || existing.status === "expired") {
          return res.status(403).json({
            success: false,
            isBanned: false,
            isDisconnected: true,
            isExpired: true,
            message: "O período de uso desta conta atingiu o limite de 365 dias (1 ano)."
          });
        }

        await updateUserInFirestore(existing.uid, {
          lastLogin: now,
          lastLoginAt: now,
          lastActiveAt: now,
          loginCount: (existing.loginCount || 1) + 1,
          isDisconnected: false,
          disconnectedAt: null,
          status: "active",
          name: name || existing.name,
          phone: phone || existing.phone,
          targetCourse: targetCourse || existing.targetCourse,
          targetScore: targetScore || existing.targetScore,
          userAgent: req.headers["user-agent"] || existing.userAgent,
          type: type || existing.type
        });

        const { password: _, ...safeUser } = existing;
        return res.json({
          success: true,
          user: {
            ...safeUser,
            lastLogin: now,
            lastLoginAt: now,
            isDisconnected: false,
            status: "active",
            ...usage
          }
        });
      }

      // Novo login/cadastro
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const finalUid = uid || ("usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7));
      const newRecord: FirestoreUser = {
        uid: finalUid,
        email: normalizedEmail,
        name: name || (normalizedEmail ? normalizedEmail.split("@")[0] : "Estudante"),
        phone: phone || "",
        targetCourse: targetCourse || "Medicina",
        targetScore: targetScore || 750,
        type: type || (normalizedEmail.includes("convidado") ? "guest" : "auth"),
        createdAt: now,
        lastLogin: now,
        lastLoginAt: now,
        lastActiveAt: now,
        expiresAt,
        limitDays: 365,
        loginCount: 1,
        status: "active",
        isBanned: false,
        isDisconnected: false,
        userAgent: req.headers["user-agent"] || ""
      };

      await saveUserToFirestore(newRecord);

      const usage = calculateUsage(newRecord.createdAt);
      const { password: _, ...safeUser } = newRecord;
      return res.json({
        success: true,
        user: {
          ...safeUser,
          ...usage,
          status: "active"
        }
      });
    } catch (err: any) {
      console.error("Erro em /api/auth/record-login:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Verificar status da sessão
  app.post("/api/auth/check-status", async (req, res) => {
    try {
      const { uid, email } = req.body;
      if (!uid && !email) {
        return res.json({ isBanned: false, isDisconnected: false, isExpired: false });
      }

      let user: FirestoreUser | null = null;
      if (uid) user = await getUserByUidFromFirestore(uid);
      if (!user && email) user = await getUserByEmailFromFirestore(String(email).trim().toLowerCase());

      if (!user) {
        return res.json({ isBanned: false, isDisconnected: false, isExpired: false, exists: false });
      }

      const usage = calculateUsage(user.createdAt);
      const isBanned = !!user.isBanned || user.status === "banned";
      const isDisconnected = !!user.isDisconnected || user.status === "disconnected";
      const isExpired = usage.isExpired || user.status === "expired";

      return res.json({
        exists: true,
        isBanned,
        isDisconnected,
        isExpired,
        status: isBanned ? "banned" : isDisconnected ? "disconnected" : isExpired ? "expired" : "active",
        daysUsing: usage.daysUsing,
        daysRemaining: usage.daysRemaining,
        timeUsingFormatted: usage.timeUsingFormatted,
        limitDays: 365
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Autenticação do Administrador
  app.post("/api/admin/auth", (req, res) => {
    try {
      const { password } = req.body || {};
      const cleanPassword = typeof password === "string" ? password.trim() : "";
      if (cleanPassword.toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
        return res.json({ success: true });
      }
      return res.status(401).json({ success: false, error: "Senha administrativa incorreta" });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Middleware de autorização para o painel admin
  const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const headerPass = req.headers["x-admin-password"];
    const queryPass = req.query.password;
    const bodyPass = req.body ? req.body.password : undefined;
    const password = (headerPass || queryPass || bodyPass || "") as string;

    if (typeof password === "string" && password.trim().toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
      return next();
    }
    return res.status(401).json({ success: false, error: "Acesso não autorizado. Senha de administrador incorreta." });
  };

  // 6. Listar todos os logins e cadastros do Firestore Cloud
  app.get("/api/admin/users", checkAdminAuth, async (req, res) => {
    try {
      const allFirestoreUsers = await getAllUsersFromFirestore(true);
      const realUsers = allFirestoreUsers.filter(u => !isDemoUser(u));
      
      const enrichedUsers = realUsers.map(user => {
        const usage = calculateUsage(user.createdAt);
        
        let status: "active" | "disconnected" | "banned" | "expired" = "active";
        if (user.isBanned || user.status === "banned") {
          status = "banned";
        } else if (usage.isExpired || user.status === "expired") {
          status = "expired";
        } else if (user.isDisconnected || user.status === "disconnected") {
          status = "disconnected";
        }

        const { password: _, ...safeUser } = user;

        return {
          ...safeUser,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || user.lastLoginAt || user.createdAt,
          lastLoginAt: user.lastLoginAt || user.lastLogin || user.createdAt,
          lastActiveAt: user.lastActiveAt || user.lastLoginAt || user.createdAt,
          expiresAt: usage.expirationDate,
          ...usage,
          status,
          isBanned: status === "banned",
          isDisconnected: status === "disconnected"
        };
      });

      // Ordenar por último login (mais recentes primeiro)
      enrichedUsers.sort((a, b) => new Date(b.lastLogin || b.createdAt).getTime() - new Date(a.lastLogin || a.createdAt).getTime());

      const now = new Date();
      res.json({
        success: true,
        users: enrichedUsers,
        totalLogins: enrichedUsers.length,
        stats: {
          total: enrichedUsers.length,
          active: enrichedUsers.filter(u => u.status === "active").length,
          disconnected: enrichedUsers.filter(u => u.status === "disconnected").length,
          banned: enrichedUsers.filter(u => u.status === "banned").length,
          expired: enrichedUsers.filter(u => u.status === "expired").length,
          newToday: enrichedUsers.filter(u => {
            const created = new Date(u.createdAt);
            return created.toDateString() === now.toDateString();
          }).length
        }
      });
    } catch (err: any) {
      console.error("Erro em /api/admin/users:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Desconectar usuário
  app.post("/api/admin/disconnect", checkAdminAuth, async (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const user = await getUserByUidFromFirestore(uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      await updateUserInFirestore(uid, {
        isDisconnected: true,
        disconnectedAt: new Date().toISOString(),
        status: user.isBanned ? "banned" : "disconnected"
      });

      res.json({ success: true, message: `Usuário ${user.name} desconectado com sucesso.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Reconectar usuário (remover flag de desconexão forçada)
  app.post("/api/admin/reconnect", checkAdminAuth, async (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const user = await getUserByUidFromFirestore(uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      await updateUserInFirestore(uid, {
        isDisconnected: false,
        disconnectedAt: null,
        status: user.isBanned ? "banned" : "active"
      });

      res.json({ success: true, message: `Sessão de ${user.name} restabelecida.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Banir ou Desbanir usuário
  app.post("/api/admin/ban", checkAdminAuth, async (req, res) => {
    try {
      const { uid, banned, reason } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const shouldBan = banned !== false;
      const user = await getUserByUidFromFirestore(uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      await updateUserInFirestore(uid, {
        isBanned: shouldBan,
        bannedAt: shouldBan ? new Date().toISOString() : null,
        banReason: shouldBan ? (reason || "Violação das regras de acesso") : null,
        status: shouldBan ? "banned" : "active",
        isDisconnected: shouldBan ? true : user.isDisconnected
      });

      res.json({ 
        success: true, 
        message: shouldBan ? `Usuário ${user.name} banido com sucesso.` : `Banimento de ${user.name} revogado.` 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 10. Resetar prazo de 365 dias (renovar acesso)
  app.post("/api/admin/reset-time", checkAdminAuth, async (req, res) => {
    try {
      const { uid } = req.body;
      const user = await getUserByUidFromFirestore(uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      await updateUserInFirestore(uid, {
        createdAt: now,
        expiresAt,
        isDisconnected: false,
        status: user.isBanned ? "banned" : "active"
      });

      res.json({ success: true, message: `Prazo de 365 dias de ${user.name} renovado com sucesso.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 11. Excluir registro do histórico
  app.post("/api/admin/delete-user", checkAdminAuth, async (req, res) => {
    try {
      const { uid } = req.body;
      await deleteUserFromFirestore(uid);
      res.json({ success: true, message: "Registro removido com sucesso do Firestore." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 12. Criar usuário manualmente pelo painel administrativo
  app.post("/api/admin/create-user", checkAdminAuth, async (req, res) => {
    try {
      const { name, email, password, phone, targetCourse, targetScore } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, error: "E-mail é obrigatório." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await getUserByEmailFromFirestore(normalizedEmail);
      if (existing) {
        return res.status(400).json({ success: false, error: "Este e-mail já existe no banco de dados." });
      }

      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const uid = "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      const userPass = (password && String(password).trim()) || "enem1234";

      const newRecord: FirestoreUser = {
        uid,
        email: normalizedEmail,
        name: (name && name.trim()) || normalizedEmail.split("@")[0] || "Estudante",
        password: hashPassword(userPass),
        phone: (phone && phone.trim()) || "",
        targetCourse: targetCourse || "Medicina",
        targetScore: Number(targetScore) || 750,
        type: "auth",
        createdAt: now,
        lastLogin: now,
        lastLoginAt: now,
        lastActiveAt: now,
        expiresAt,
        limitDays: 365,
        loginCount: 1,
        status: "active",
        isBanned: false,
        isDisconnected: false,
        userAgent: "Criado pelo Administrador"
      };

      await saveUserToFirestore(newRecord);

      const usage = calculateUsage(newRecord.createdAt);
      const { password: _, ...safeUser } = newRecord;

      res.json({
        success: true,
        message: `Conta de ${newRecord.name} criada com sucesso no Firestore!`,
        user: {
          ...safeUser,
          ...usage,
          status: "active"
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 13. Limpar todas as contas de teste/demo definitivamente
  app.post("/api/admin/purge-demos", checkAdminAuth, async (req, res) => {
    try {
      const all = await getAllUsersFromFirestore(true);
      let removed = 0;
      for (const u of all) {
        if (isDemoUser(u)) {
          await deleteUserFromFirestore(u.uid);
          removed++;
        }
      }
      res.json({ success: true, count: removed, message: "Contas de demonstração removidas com sucesso." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Healthcheck endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // Serve static assets/Vite app in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Iniciando Vite em modo desenvolvimento...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Iniciando servidor em modo produção...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
});
