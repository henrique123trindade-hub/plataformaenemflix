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
  getUserProgressFromFirestore,
  saveUserProgressToFirestore,
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

  // CORS middleware for AI Studio iframe and reverse proxy
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // JSON and URL-encoded parsing middleware with larger limits for essay image analysis
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // In-memory cache for playlists and video metadata
  const playlistCache = new Map<string, { timestamp: number; videos: any[] }>();
  const videoTitleCache = new Map<string, string>();
  const PLAYLIST_CACHE_TTL = 1000 * 60 * 60; // 1 hour

  // API Route: Get title and metadata for an individual YouTube video
  app.get("/api/video-info", async (req, res) => {
    try {
      const videoId = req.query.id;
      if (!videoId || typeof videoId !== "string") {
        return res.status(400).json({ success: false, error: "Missing video id" });
      }

      if (videoTitleCache.has(videoId)) {
        return res.json({ success: true, id: videoId, title: videoTitleCache.get(videoId) });
      }

      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await globalThis.fetch(oembedUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      if (response.ok) {
        const data: any = await response.json();
        if (data && data.title) {
          videoTitleCache.set(videoId, data.title);
          return res.json({ success: true, id: videoId, title: data.title, author: data.author_name });
        }
      }

      return res.json({ success: false, id: videoId, title: null });
    } catch (err: any) {
      return res.json({ success: false, error: err.message });
    }
  });

  // API Route: Get complete and live list of videos from a YouTube playlist
  app.get("/api/playlist", async (req, res) => {
    try {
      const playlistId = req.query.list;
      if (!playlistId || typeof playlistId !== "string") {
        return res.status(400).json({ success: true, videos: [] });
      }

      // Check in-memory cache
      const cached = playlistCache.get(playlistId);
      if (cached && Date.now() - cached.timestamp < PLAYLIST_CACHE_TTL && cached.videos.length > 0) {
        return res.json({ success: true, playlistId, videos: cached.videos, cached: true });
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
      let videos: any[] = [];
      const seenIds = new Set<string>();

      // Look for ytInitialData
      const match = html.match(/var ytInitialData = (\{.+?\});<\/script>/) ||
                    html.match(/window\["ytInitialData"\] = (\{.+?\});<\/script>/);

      if (match && match[1]) {
        try {
          const data = JSON.parse(match[1]);

          const findVideosRecursive = (obj: any) => {
            if (!obj || typeof obj !== "object") return;

            // 1. Support modern YouTube UI (lockupViewModel)
            if (obj.lockupViewModel) {
              const vm = obj.lockupViewModel;
              const title = vm.metadata?.lockupMetadataViewModel?.title?.content ||
                            vm.rendererContext?.accessibilityContext?.label;
              const videoId = vm.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId ||
                              vm.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.animationActivationTargetId;
              const duration = vm.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text || "Vídeo";

              if (videoId && title && !seenIds.has(videoId)) {
                seenIds.add(videoId);
                videoTitleCache.set(videoId, title);
                videos.push({
                  id: videoId,
                  title: title.trim(),
                  duration,
                  youtubeId: videoId
                });
              }
            }

            // 2. Support classic YouTube UI (playlistVideoRenderer)
            if (obj.playlistVideoRenderer) {
              const renderer = obj.playlistVideoRenderer;
              const videoId = renderer.videoId;
              const title = renderer.title?.runs?.[0]?.text ||
                            renderer.title?.simpleText ||
                            renderer.title?.accessibility?.accessibilityData?.label;
              const duration = renderer.lengthText?.simpleText || "Vídeo";

              if (videoId && title && !seenIds.has(videoId)) {
                seenIds.add(videoId);
                videoTitleCache.set(videoId, title);
                videos.push({
                  id: videoId,
                  title: title.trim(),
                  duration,
                  youtubeId: videoId
                });
              }
            }

            if (Array.isArray(obj)) {
              for (const item of obj) {
                findVideosRecursive(item);
              }
            } else {
              for (const key of Object.keys(obj)) {
                findVideosRecursive(obj[key]);
              }
            }
          };

          findVideosRecursive(data);
        } catch (jsonErr) {
          console.error("Erro ao fazer parse do JSON do YouTube:", jsonErr);
        }
      }

      // Fallback: If parsing found no videos or very few, extract video IDs via regex and fetch accurate titles via oEmbed
      if (videos.length === 0) {
        const videoIdMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
        const uniqueVideoIds = Array.from(new Set(videoIdMatches)).slice(0, 50);

        if (uniqueVideoIds.length > 0) {
          const fetchedVideos = await Promise.all(
            uniqueVideoIds.map(async (id, index) => {
              // Try cached title first
              if (videoTitleCache.has(id)) {
                return {
                  id,
                  title: videoTitleCache.get(id)!,
                  duration: "Vídeo",
                  youtubeId: id
                };
              }

              // Try oEmbed for true title
              try {
                const oembedRes = await globalThis.fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
                if (oembedRes.ok) {
                  const odata: any = await oembedRes.json();
                  if (odata && odata.title) {
                    videoTitleCache.set(id, odata.title);
                    return {
                      id,
                      title: odata.title,
                      duration: "Vídeo",
                      youtubeId: id
                    };
                  }
                }
              } catch (_) {}

              return {
                id,
                title: `Aula ${index + 1} da Playlist`,
                duration: "Vídeo",
                youtubeId: id
              };
            })
          );
          videos = fetchedVideos;
        }
      }

      if (videos.length > 0) {
        playlistCache.set(playlistId, { timestamp: Date.now(), videos });
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
  // 1. Cadastrar novo usuário (Salvo diretamente no Firestore Cloud)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, phone, targetCourse, targetScore } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "E-mail e senha são obrigatórios." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (String(password).trim().length < 4) {
        return res.status(400).json({ success: false, error: "A senha deve conter no mínimo 4 caracteres." });
      }

      const existingUser = await getUserByEmailFromFirestore(normalizedEmail);
      if (existingUser) {
        const rawPassword = String(password).trim();
        // Se já tem senha e a senha confere, faz o login direto com sucesso
        if (existingUser.password && verifyPassword(rawPassword, existingUser.password)) {
          const now = new Date().toISOString();
          await updateUserInFirestore(existingUser.uid, {
            lastLogin: now,
            lastLoginAt: now,
            lastActiveAt: now,
            loginCount: (existingUser.loginCount || 1) + 1
          });
          const { password: _, ...safeUser } = existingUser;
          return res.json({
            success: true,
            user: { ...safeUser, lastLogin: now, loginCount: (existingUser.loginCount || 1) + 1 }
          });
        }

        // Se a conta existia sem senha salva (ex: do lead capture), define a senha agora e conclui com sucesso
        if (!existingUser.password) {
          const now = new Date().toISOString();
          const newPasswordHash = hashPassword(rawPassword);
          await updateUserInFirestore(existingUser.uid, {
            password: newPasswordHash,
            lastLogin: now,
            lastLoginAt: now,
            lastActiveAt: now,
            name: name ? name.trim() : existingUser.name,
            phone: phone ? phone.trim() : existingUser.phone,
            loginCount: (existingUser.loginCount || 1) + 1
          });
          const { password: _, ...safeUser } = existingUser;
          return res.json({
            success: true,
            user: { ...safeUser, lastLogin: now, loginCount: (existingUser.loginCount || 1) + 1 }
          });
        }

        return res.status(400).json({ 
          success: false, 
          error: "Este e-mail já está cadastrado. Faça login com sua senha." 
        });
      }

      const now = new Date().toISOString();
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
        loginCount: 1,
        // Progresso inicial seguro
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        streak: 1,
        hoursStudied: 0,
        completedVideos: [],
        bookmarkedVideos: [],
        solvedQuestionsCount: 0,
        correctAnswersCount: 0,
        lastStudyDate: now,
        videoProgress: [],
        simulatedExams: [],
        essays: []
      };

      await saveUserToFirestore(newRecord);

      const { password: _, ...safeUser } = newRecord;
      return res.json({
        success: true,
        user: safeUser
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
        return res.status(404).json({ 
          success: false, 
          notFound: true,
          error: "Nenhuma conta encontrada com este e-mail. Caso seja seu primeiro acesso, crie sua conta." 
        });
      }

      const rawPassword = String(password).trim();
      if (user.password && !verifyPassword(rawPassword, user.password)) {
        return res.status(401).json({ success: false, error: "Senha incorreta. Verifique seus dados." });
      }

      // Se a conta não possuía senha ainda no Firestore, salva a senha informada para persistência
      let currentPasswordHash = user.password;
      if (!currentPasswordHash) {
        currentPasswordHash = hashPassword(rawPassword);
        await updateUserInFirestore(user.uid, { password: currentPasswordHash });
        user.password = currentPasswordHash;
      }

      const now = new Date().toISOString();
      await updateUserInFirestore(user.uid, {
        lastLogin: now,
        lastLoginAt: now,
        lastActiveAt: now,
        loginCount: (user.loginCount || 1) + 1
      });

      const { password: _, ...safeUser } = user;
      return res.json({
        success: true,
        user: {
          ...safeUser,
          lastLogin: now,
          lastLoginAt: now,
          loginCount: (user.loginCount || 1) + 1
        }
      });
    } catch (err: any) {
      console.error("Erro em /api/auth/login:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Gravar ou atualizar perfil de usuário no Firestore Cloud
  app.post("/api/auth/record-login", async (req, res) => {
    try {
      const { uid, email, name, phone, targetCourse, targetScore, type } = req.body;
      if (!uid && !email) {
        return res.status(400).json({ success: false, error: "UID ou e-mail é obrigatório" });
      }

      const normalizedEmail = email ? email.trim().toLowerCase() : "";
      const now = new Date().toISOString();
      let existing = uid ? await getUserByUidFromFirestore(uid) : null;
      if (!existing && normalizedEmail) {
        existing = await getUserByEmailFromFirestore(normalizedEmail);
      }

      if (existing) {
        await updateUserInFirestore(existing.uid, {
          lastLogin: now,
          lastLoginAt: now,
          lastActiveAt: now,
          loginCount: (existing.loginCount || 1) + 1,
          name: name || existing.name,
          phone: phone || existing.phone,
          targetCourse: targetCourse || existing.targetCourse,
          targetScore: targetScore || existing.targetScore
        });

        const { password: _, ...safeUser } = existing;
        return res.json({
          success: true,
          user: {
            ...safeUser,
            lastLogin: now,
            lastLoginAt: now
          }
        });
      }

      // Novo registro
      const finalUid = uid || ("usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7));
      const newRecord: FirestoreUser = {
        uid: finalUid,
        email: normalizedEmail,
        name: name || (normalizedEmail ? normalizedEmail.split("@")[0] : "Estudante"),
        phone: phone || "",
        targetCourse: targetCourse || "Medicina",
        targetScore: targetScore || 750,
        type: type || "auth",
        createdAt: now,
        lastLogin: now,
        lastLoginAt: now,
        lastActiveAt: now,
        loginCount: 1,
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        streak: 1,
        hoursStudied: 0,
        completedVideos: [],
        bookmarkedVideos: [],
        solvedQuestionsCount: 0,
        correctAnswersCount: 0,
        lastStudyDate: now,
        videoProgress: [],
        simulatedExams: [],
        essays: []
      };

      await saveUserToFirestore(newRecord);
      const { password: _, ...safeUser } = newRecord;
      return res.json({
        success: true,
        user: safeUser
      });
    } catch (err: any) {
      console.error("Erro em /api/auth/record-login:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Salvar progresso do usuário no Firestore Cloud
  app.post("/api/user/progress", async (req, res) => {
    try {
      const { uid, stats, videoProgress, simulatedExams, essays, aiConversations } = req.body;
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const updates: any = {};
      if (stats) {
        if (typeof stats.level === "number") updates.level = stats.level;
        if (typeof stats.xp === "number") updates.xp = stats.xp;
        if (typeof stats.xpToNextLevel === "number") updates.xpToNextLevel = stats.xpToNextLevel;
        if (typeof stats.streak === "number") updates.streak = stats.streak;
        if (typeof stats.hoursStudied === "number") updates.hoursStudied = stats.hoursStudied;
        if (Array.isArray(stats.completedVideos)) updates.completedVideos = stats.completedVideos;
        if (Array.isArray(stats.bookmarkedVideos)) updates.bookmarkedVideos = stats.bookmarkedVideos;
        if (typeof stats.solvedQuestionsCount === "number") updates.solvedQuestionsCount = stats.solvedQuestionsCount;
        if (typeof stats.correctAnswersCount === "number") updates.correctAnswersCount = stats.correctAnswersCount;
        if (stats.lastStudyDate) updates.lastStudyDate = stats.lastStudyDate;
      }
      if (Array.isArray(videoProgress)) updates.videoProgress = videoProgress;
      if (Array.isArray(simulatedExams)) updates.simulatedExams = simulatedExams;
      if (Array.isArray(essays)) updates.essays = essays;
      if (Array.isArray(aiConversations)) updates.aiConversations = aiConversations;

      await saveUserProgressToFirestore(uid, updates);
      return res.json({ success: true });
    } catch (err: any) {
      console.error("Erro ao salvar progresso:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Carregar progresso do usuário do Firestore Cloud
  app.get("/api/user/progress", async (req, res) => {
    try {
      const uid = String(req.query.uid || "");
      if (!uid) {
        return res.status(400).json({ success: false, error: "UID é obrigatório" });
      }

      const progress = await getUserProgressFromFirestore(uid);
      if (!progress) {
        return res.status(404).json({ success: false, error: "Usuário não encontrado" });
      }

      return res.json({ success: true, progress });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
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
