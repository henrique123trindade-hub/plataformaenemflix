import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

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
  // SISTEMA DE ADMINISTRAÇÃO & CONTROLE DE LOGINS
  // Senha de Acesso: "pirulitobaby"
  // Limite de Uso: 1 ano / 365 dias
  // ==========================================
  const ADMIN_PASSWORD = "pirulitobaby";
  const LIMIT_DAYS = 365;
  const DATA_DIR = path.join(process.cwd(), "data");
  const LOGINS_FILE = path.join(DATA_DIR, "admin_logins.json");

  interface UserLoginRecord {
    uid: string;
    email: string;
    name: string;
    phone?: string;
    targetCourse?: string;
    targetScore?: number;
    type: "auth" | "guest" | "google";
    createdAt: string; // Data do primeiro login / cadastro
    lastLoginAt: string; // Data do último login efetuado
    lastActiveAt: string; // Última atividade
    loginCount: number;
    isBanned: boolean;
    bannedAt?: string;
    banReason?: string;
    isDisconnected: boolean;
    disconnectedAt?: string;
    userAgent?: string;
  }

  function ensureDataDir(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(LOGINS_FILE)) {
        fs.writeFileSync(LOGINS_FILE, JSON.stringify([], null, 2), "utf-8");
      }
    } catch (e) {
      console.warn("Aviso ao criar diretório de dados:", e);
    }
  }

  function getStoredLogins(): UserLoginRecord[] {
    ensureDataDir();
    try {
      if (!fs.existsSync(LOGINS_FILE)) return [];
      const content = fs.readFileSync(LOGINS_FILE, "utf-8");
      return JSON.parse(content || "[]");
    } catch (e) {
      console.error("Erro ao ler admin_logins.json:", e);
      return [];
    }
  }

  function saveStoredLogins(records: UserLoginRecord[]): boolean {
    ensureDataDir();
    try {
      fs.writeFileSync(LOGINS_FILE, JSON.stringify(records, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("Erro ao salvar admin_logins.json:", e);
      return false;
    }
  }

  function calculateUsage(createdAtIso: string) {
    const start = new Date(createdAtIso).getTime();
    const now = Date.now();
    const diffMs = Math.max(0, now - start);
    
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeUsingFormatted = "";
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remDays = diffDays % 365;
      timeUsingFormatted = `${diffDays} dias (${years} ano${years > 1 ? "s" : ""}${remDays > 0 ? ` e ${remDays}d` : ""})`;
    } else if (diffDays > 0) {
      const remHours = diffHours % 24;
      timeUsingFormatted = `${diffDays} dia${diffDays > 1 ? "s" : ""}${remHours > 0 ? ` e ${remHours}h` : ""}`;
    } else if (diffHours > 0) {
      const remMins = diffMinutes % 60;
      timeUsingFormatted = `${diffHours} hora${diffHours > 1 ? "s" : ""}${remMins > 0 ? ` e ${remMins}m` : ""}`;
    } else if (diffMinutes > 0) {
      timeUsingFormatted = `${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
    } else {
      timeUsingFormatted = "Menos de 1 minuto";
    }

    const daysUsing = diffDays;
    const daysRemaining = Math.max(0, LIMIT_DAYS - daysUsing);
    const isExpired = daysUsing >= LIMIT_DAYS;
    const progressPercentage = Math.min(100, Math.round((daysUsing / LIMIT_DAYS) * 100));

    return {
      daysUsing,
      daysRemaining,
      isExpired,
      progressPercentage,
      timeUsingFormatted,
      limitDays: LIMIT_DAYS
    };
  }

  // 1. Gravar ou atualizar login de usuário
  app.post("/api/auth/record-login", (req, res) => {
    try {
      const { uid, email, name, phone, targetCourse, targetScore, type } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ success: false, error: "UID e e-mail são obrigatórios" });
      }

      const logins = getStoredLogins();
      const existingIndex = logins.findIndex(u => u.uid === uid || u.email.toLowerCase() === email.toLowerCase());
      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        const existing = logins[existingIndex];
        const usage = calculateUsage(existing.createdAt);

        // Se estiver banido
        if (existing.isBanned) {
          return res.status(403).json({
            success: false,
            isBanned: true,
            isDisconnected: true,
            isExpired: usage.isExpired,
            message: "Esta conta foi banida pelo administrador do sistema."
          });
        }

        // Se expirou o limite de 365 dias
        if (usage.isExpired) {
          return res.status(403).json({
            success: false,
            isBanned: false,
            isDisconnected: true,
            isExpired: true,
            message: "O período de uso desta conta atingiu o limite de 365 dias (1 ano)."
          });
        }

        // Ao fazer login novamente, limpa a flag de desconectado
        existing.lastLoginAt = now;
        existing.lastActiveAt = now;
        existing.loginCount = (existing.loginCount || 1) + 1;
        existing.isDisconnected = false;
        existing.name = name || existing.name;
        existing.phone = phone !== undefined ? phone : existing.phone;
        existing.targetCourse = targetCourse || existing.targetCourse;
        existing.targetScore = targetScore || existing.targetScore;
        existing.userAgent = req.headers["user-agent"] || existing.userAgent;
        if (type) existing.type = type;

        logins[existingIndex] = existing;
        saveStoredLogins(logins);

        return res.json({
          success: true,
          user: {
            ...existing,
            ...usage
          }
        });
      }

      // Novo login/cadastro
      const newRecord: UserLoginRecord = {
        uid,
        email,
        name: name || email.split("@")[0] || "Estudante",
        phone: phone || "",
        targetCourse: targetCourse || "Medicina",
        targetScore: targetScore || 750,
        type: type || (email.includes("convidado") ? "guest" : "auth"),
        createdAt: now,
        lastLoginAt: now,
        lastActiveAt: now,
        loginCount: 1,
        isBanned: false,
        isDisconnected: false,
        userAgent: req.headers["user-agent"] || ""
      };

      logins.unshift(newRecord);
      saveStoredLogins(logins);

      const usage = calculateUsage(newRecord.createdAt);
      return res.json({
        success: true,
        user: {
          ...newRecord,
          ...usage
        }
      });
    } catch (err: any) {
      console.error("Erro em /api/auth/record-login:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Verificar status da sessão (para desconexão imediata ou checagem de ban/expiração)
  app.post("/api/auth/check-status", (req, res) => {
    try {
      const { uid, email } = req.body;
      if (!uid && !email) {
        return res.json({ isBanned: false, isDisconnected: false, isExpired: false });
      }

      const logins = getStoredLogins();
      const user = logins.find(u => (uid && u.uid === uid) || (email && u.email.toLowerCase() === email.toLowerCase()));

      if (!user) {
        return res.json({ isBanned: false, isDisconnected: false, isExpired: false });
      }

      const usage = calculateUsage(user.createdAt);
      // Atualiza lastActiveAt
      user.lastActiveAt = new Date().toISOString();
      saveStoredLogins(logins);

      return res.json({
        isBanned: user.isBanned,
        isDisconnected: user.isDisconnected,
        isExpired: usage.isExpired,
        daysUsing: usage.daysUsing,
        daysRemaining: usage.daysRemaining,
        timeUsingFormatted: usage.timeUsingFormatted,
        limitDays: LIMIT_DAYS
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Autenticação do Administrador
  app.post("/api/admin/auth", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.json({ success: true });
    }
    return res.status(401).json({ success: false, error: "Senha administrativa incorreta" });
  });

  // Middleware de autorização para o painel admin
  const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const password = req.headers["x-admin-password"] || req.query.password || req.body.password;
    if (password === ADMIN_PASSWORD) {
      return next();
    }
    return res.status(401).json({ success: false, error: "Acesso não autorizado. Senha de administrador incorreta." });
  };

  // 4. Listar todos os logins e cadastros
  app.get("/api/admin/users", checkAdminAuth, (req, res) => {
    try {
      const logins = getStoredLogins();
      
      const enrichedUsers = logins.map(user => {
        const usage = calculateUsage(user.createdAt);
        
        let status: "active" | "disconnected" | "banned" | "expired" = "active";
        if (user.isBanned) {
          status = "banned";
        } else if (usage.isExpired) {
          status = "expired";
        } else if (user.isDisconnected) {
          status = "disconnected";
        }

        return {
          ...user,
          ...usage,
          status
        };
      });

      // Ordenar por último login (mais recentes primeiro)
      enrichedUsers.sort((a, b) => new Date(b.lastLoginAt).getTime() - new Date(a.lastLoginAt).getTime());

      res.json({
        success: true,
        users: enrichedUsers,
        totalLogins: enrichedUsers.length,
        stats: {
          total: enrichedUsers.length,
          active: enrichedUsers.filter(u => u.status === "active").length,
          disconnected: enrichedUsers.filter(u => u.status === "disconnected").length,
          banned: enrichedUsers.filter(u => u.status === "banned").length,
          expired: enrichedUsers.filter(u => u.status === "expired").length
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Desconectar usuário
  app.post("/api/admin/disconnect", checkAdminAuth, (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const logins = getStoredLogins();
      const user = logins.find(u => u.uid === uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      user.isDisconnected = true;
      user.disconnectedAt = new Date().toISOString();
      saveStoredLogins(logins);

      res.json({ success: true, message: `Usuário ${user.name} desconectado com sucesso.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Reconectar usuário (remover flag de desconexão forçada)
  app.post("/api/admin/reconnect", checkAdminAuth, (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const logins = getStoredLogins();
      const user = logins.find(u => u.uid === uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      user.isDisconnected = false;
      user.disconnectedAt = undefined;
      saveStoredLogins(logins);

      res.json({ success: true, message: `Sessão de ${user.name} restabelecida.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Banir ou Desbanir usuário
  app.post("/api/admin/ban", checkAdminAuth, (req, res) => {
    try {
      const { uid, banned, reason } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const shouldBan = banned !== false;
      const logins = getStoredLogins();
      const user = logins.find(u => u.uid === uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      user.isBanned = shouldBan;
      user.bannedAt = shouldBan ? new Date().toISOString() : undefined;
      user.banReason = shouldBan ? (reason || "Violação das regras de acesso") : undefined;
      if (shouldBan) {
        user.isDisconnected = true;
      }

      saveStoredLogins(logins);

      res.json({ 
        success: true, 
        message: shouldBan ? `Usuário ${user.name} banido com sucesso.` : `Banimento de ${user.name} revogado.` 
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Resetar prazo de 365 dias (renovar acesso)
  app.post("/api/admin/reset-time", checkAdminAuth, (req, res) => {
    try {
      const { uid } = req.body;
      const logins = getStoredLogins();
      const user = logins.find(u => u.uid === uid);
      if (!user) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      user.createdAt = new Date().toISOString();
      user.isDisconnected = false;
      saveStoredLogins(logins);

      res.json({ success: true, message: `Prazo de 365 dias de ${user.name} renovado com sucesso.` });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 9. Excluir registro do histórico
  app.post("/api/admin/delete-user", checkAdminAuth, (req, res) => {
    try {
      const { uid } = req.body;
      let logins = getStoredLogins();
      const filtered = logins.filter(u => u.uid !== uid);
      saveStoredLogins(filtered);
      res.json({ success: true, message: "Registro removido com sucesso." });
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
