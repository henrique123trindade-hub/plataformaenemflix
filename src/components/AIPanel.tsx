import React, { useState, useEffect, useMemo } from "react";
import { UserStats, LeadProfile, AIConversation, AIMessage } from "../types";
import { 
  Brain, 
  Send, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Search,
  MessageSquare,
  History
} from "lucide-react";

interface AIPanelProps {
  userStats: UserStats;
  userProfile: LeadProfile;
  conversations: AIConversation[];
  activeConversationId: string | null;
  onSaveConversation: (chatId: string, title: string, messages: AIMessage[]) => void;
  onDeleteConversation: (chatId: string) => void;
  onSelectConversation: (chatId: string) => void;
  onTriggerStreakActivity: () => void;
}

export default function AIPanel({
  userStats,
  userProfile,
  conversations,
  activeConversationId,
  onSaveConversation,
  onDeleteConversation,
  onSelectConversation,
  onTriggerStreakActivity
}: AIPanelProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [sidebarSearch, setSidebarSearch] = useState("");

  // Get active conversation messages or load default greeting
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const messages = useMemo(() => {
    if (activeConversation) {
      return activeConversation.messages;
    }
    // Default greeting if no active conversation is opened yet
    return [
      { 
        role: "assistant" as const, 
        content: `Olá, **${userProfile.name.split(" ")[0]}**! Eu sou o **EnemFlix IA**, seu tutor pessoal inteligente de estudos. 
        
Estou aqui para acelerar sua aprovação no ENEM. Posso te ajudar de várias formas:
1. **Recomendar** as próximas maratonas de estudo baseadas no seu nível.
2. **Montar** um cronograma personalizado de estudos de 7 dias sob medida para a sua rotina.
3. **Explicar** qualquer assunto ou tirar dúvidas de exercícios de forma super didática.

Como posso te guiar hoje? Escolha um dos modelos rápidos ou envie uma dúvida personalizada!`,
        timestamp: new Date().toISOString()
      }
    ];
  }, [activeConversation, userProfile.name]);

  const filteredConversations = useMemo(() => {
    if (!sidebarSearch.trim()) return conversations;
    return conversations.filter(c => c.title.toLowerCase().includes(sidebarSearch.toLowerCase()));
  }, [conversations, sidebarSearch]);

  const quickPrompts = [
    { 
      title: "Recomendar Próximas Maratonas", 
      desc: "Análise baseada no seu nível", 
      type: "recommend", 
      prompt: "Sugira uma maratona de estudos baseada no meu desempenho de simulados e foco de vestibular." 
    },
    { 
      title: "Montar Cronograma 7 Dias", 
      desc: "Planejamento intensivo personalizado", 
      type: "schedule", 
      prompt: `Crie um cronograma completo de 7 dias com foco em ${userProfile.targetCourse === "Medicina" ? "Biologia e Química" : "Matemática e Redação"}` 
    },
    { 
      title: "Tirar Dúvida: Logaritmos", 
      desc: "Didática simplificada de exatas", 
      type: "explain", 
      prompt: "Me explique as propriedades dos logaritmos de forma simples e direta com exemplos cobrados no ENEM." 
    }
  ];

  const handleSendMessage = async (textToSend: string, type: string = "general") => {
    if (!textToSend.trim() || isLoading) return;

    setErrorText("");
    setIsLoading(true);
    setInputText("");

    // Trigger streak activity (makes use of IA a valid streak action)
    onTriggerStreakActivity();

    // Determine target conversation ID and updated message history
    let currentChatId = activeConversationId;
    let isNewChat = false;

    if (!currentChatId) {
      currentChatId = `chat-${Date.now()}`;
      isNewChat = true;
    }

    const newUserMessage: AIMessage = {
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    // Calculate updated messages list
    const updatedMessages = isNewChat 
      ? [newUserMessage] 
      : [...messages, newUserMessage];

    // Determine conversational title based on prompt
    const chatTitle = isNewChat 
      ? (textToSend.length > 25 ? textToSend.substring(0, 25) + "..." : textToSend)
      : (activeConversation?.title || "Dúvida de Estudos");

    // Temporarily save user message to sync UI instantly
    onSaveConversation(currentChatId, chatTitle, updatedMessages);
    if (isNewChat) {
      onSelectConversation(currentChatId);
    }

    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type,
          userPrompt: textToSend,
          userContext: {
            favoriteSubject: "Matemática",
            performance: "Intermediário",
            hoursStudied: userStats.hoursStudied,
            weakSubjects: ["Ciências da Natureza", "Química Orgânica"],
            dailyHours: 4
          }
        })
      });

      const data = await response.json();
      if (data.success && data.text) {
        const newAIMessage: AIMessage = {
          role: "assistant",
          content: data.text,
          timestamp: new Date().toISOString()
        };
        onSaveConversation(currentChatId, chatTitle, [...updatedMessages, newAIMessage]);
      } else {
        throw new Error(data.error || "A API do Gemini retornou um resultado vazio.");
      }
    } catch (err: any) {
      console.warn("Gemini Live API fallback used due to absence of API keys in server environment", err);
      
      // Highly pedagogical fallback response in case GEMINI_API_KEY is not defined, to ensure flawless usability
      let fallbackText = "";
      if (type === "recommend") {
        fallbackText = `### 🎬 Maratonas de Estudos Recomendadas para **${userProfile.name}**
        
Para sua meta de **${userProfile.targetCourse}** (${userProfile.targetScore} pontos no ENEM), nosso sistema inteligente mapeou as maiores taxas de conversão de acerto:

1. **Série Especial: Redação Nota 1000**
   - *Por que maratona:* A redação é o único setor do ENEM que permite obter nota 1000 inteira de forma garantida. Assistir aos episódios de Competência 5 e modelos de rascunhos nota 1000 te dará vantagem absurda.
   - *Episódio Sugerido:* **Competência 5: Proposta de Intervenção Nota 200**.

2. **Temporada Prática: Razão, Proporção e Regra de Três**
   - *Por que maratona:* Representa cerca de 25% de toda a prova de matemática. Garantir esses acertos fáceis joga seu TRI nas alturas.
   - *Episódio Sugerido:* **Razão e Proporção: Regra de Três Simples e Composta**.

3. **Cena de Ação: Ecologia Básica**
   - *Por que maratona:* Ecologia é disparado o tema mais recorrente em Ciências da Natureza. Dominando cadeias alimentares você garante 3 a 4 questões exatas.
   - *Episódio Sugerido:* **Ecologia Básica: Cadeia Alimentar e Pirâmides**.`;
      } else if (type === "schedule") {
        fallbackText = `### 📅 Seu Cronograma de 7 Dias de Maratona Intensiva

Com base na sua meta de **${userProfile.targetCourse}**, dividimos sua rotina em blocos dinâmicos de foco de 3 horas por dia:

| Dia | Disciplina | Assunto Recomendado | Truque de Estudo / Técnica |
| :--- | :--- | :--- | :--- |
| **Dia 1** | Matemática | Razão e Proporção | Realizar simulador de 5 questões logo após ver o vídeo. |
| **Dia 2** | Redação | Estrutura de Introdução | Escrever 2 introduções para temas de redação recentes. |
| **Dia 3** | C. Natureza | Ecologia e Cadeias Alimentares | Resumir conceitos de bioacumulação em tópicos coloridos. |
| **Dia 4** | Linguagens | Variação Linguística | Resolver questões de charges e poemas focando no distrator. |
| **Dia 5** | C. Humanas | Era Vargas (História) | Criar linha do tempo rápida cobrindo as 3 fases do governo. |
| **Dia 6** | C. Natureza | Eletrodinâmica (Física) | Memorizar as fórmulas de potência elétrica e primeira Lei de Ohm. |
| **Dia 7** | Simulado | Simulado ENEM Completo | Realizar simulação de tempo e analisar as resoluções explicadas. |

*Frase inspiradora do dia:* **"O sucesso é a soma de pequenos esforços repetidos dia após dia."** — Maratone sua rotina!`;
      } else {
        fallbackText = `### 🧠 Dica do Especialista EnemFlix AI

Aqui está um resumo de propriedades cruciais para você acelerar seus estudos:

1. **Simplifique**: Sempre conecte novos conceitos teóricos com exercícios práticos rápidos em sequência. Estudo passivo cansa e não fixa.
2. **Ciclo de Revisões**: Revise seus rascunhos de redação e fórmulas de exatas a cada 7 dias para combater a Curva do Esquecimento.
3. **Equilíbrio**: Seus acertos fáceis no TRI contam mais pontos do que as questões extremamente difíceis que tomam tempo excessivo. Garanta a base primeiro!

*Nota do Desenvolvedor: Para respostas dinâmicas reais conectadas ao modelo da Google, configure sua **GEMINI_API_KEY** nas configurações.*`;
      }

      setErrorText("Nota: Mostrando recomendações de contingência (Chave API do Gemini não configurada nos Secrets da aplicação).");
      const newAIMessage: AIMessage = {
        role: "assistant",
        content: fallbackText,
        timestamp: new Date().toISOString()
      };
      onSaveConversation(currentChatId, chatTitle, [...updatedMessages, newAIMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText, "general");
  };

  // Helper to parse simple markdown to react elements inside bubbles
  const renderMarkdownText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h3 key={lineIdx} className="text-base font-black text-red-400 mt-4 mb-2">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={lineIdx} className="text-lg font-black text-red-500 mt-4 mb-2">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
        return <p key={lineIdx} className="text-xs sm:text-sm pl-3 text-zinc-300 font-medium leading-relaxed my-1.5">{line}</p>;
      }
      if (line.startsWith("- ")) {
        return <p key={lineIdx} className="text-xs sm:text-sm pl-4 text-zinc-300 list-item leading-relaxed my-1">{line.replace("- ", "")}</p>;
      }
      if (line.startsWith("|")) {
        // Table line mockup
        return <div key={lineIdx} className="font-mono text-[10px] sm:text-xs bg-black/40 px-3 py-1 text-zinc-400 border-x border-zinc-900 leading-normal">{line}</div>;
      }

      // Bold parsing
      const boldRegex = /\*\*(.*?)\*\*/g;
      if (boldRegex.test(line)) {
        const parts = line.split(/\*\*/g);
        return (
          <p key={lineIdx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed my-1.5">
            {parts.map((part, partIdx) => partIdx % 2 === 1 ? <strong key={partIdx} className="text-white font-black">{part}</strong> : part)}
          </p>
        );
      }

      return <p key={lineIdx} className="text-xs sm:text-sm text-zinc-300 leading-relaxed my-1.5">{line}</p>;
    });
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white" id="ai-chat-center">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 text-left">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
            <Brain className="w-8 h-8 text-[#e50914]" />
            <span>EnemFlix <span className="text-[#e50914]">Tutor IA</span></span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Seu copiloto inteligente para cronogramas de estudo, análise pedagógica e tira-dúvidas.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#e50914]/10 border border-[#e50914]/20 px-3 py-1.5 rounded-full text-[#e50914] text-xs font-semibold">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Modelo Gemini Ativo</span>
        </div>
      </div>

      {errorText && (
        <div className="p-3 bg-[#141414] border border-white/5 ring-1 ring-white/10 text-gray-400 text-xs rounded text-left flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Workspace: Sidebar + Chat Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column (Col 1): Chat Sidebar Selector */}
        <div className="space-y-4 lg:col-span-1 text-left">
          <button
            type="button"
            onClick={() => onSelectConversation("")} // deselect to show default greeting / ready for new chat
            className="w-full py-3 px-4 bg-[#e50914] hover:bg-red-700 font-extrabold text-xs uppercase tracking-wider rounded text-white flex items-center justify-center gap-2 cursor-pointer transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Conversa</span>
          </button>

          {/* Sidebar Conversations History container */}
          <div className="bg-[#141414] border border-white/5 rounded p-4 space-y-4">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Suas Conversas</span>
            </h3>

            {/* Sidebar search bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar chats..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full bg-black border border-white/5 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Conversations list scrollbox */}
            <div className="space-y-1.5 max-h-[220px] lg:max-h-[350px] overflow-y-auto no-scrollbar">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((c) => (
                  <div 
                    key={c.id}
                    className={`w-full flex items-center justify-between gap-1 p-2.5 rounded text-xs transition border cursor-pointer ${
                      activeConversationId === c.id 
                        ? "bg-[#e50914]/10 border-[#e50914]/30 text-white" 
                        : "bg-black/30 border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div 
                      onClick={() => onSelectConversation(c.id)}
                      className="flex items-center gap-2 min-w-0 flex-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                      <span className="truncate font-medium">{c.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteConversation(c.id)}
                      className="p-1 hover:text-red-500 rounded text-zinc-500 cursor-pointer"
                      title="Deletar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-500 py-4">Nenhuma conversa encontrada.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right columns (Col 2-4): Live Chat Terminal */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt, item.type)}
                disabled={isLoading}
                className="p-4 bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded hover:border-[#e50914]/40 hover:bg-[#141414]/90 transition duration-300 text-left space-y-1 block cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-[#e50914] transition">
                    {item.title}
                  </span>
                  {item.type === "recommend" ? <Sparkles className="w-4 h-4 text-[#e50914]" /> :
                   item.type === "schedule" ? <Calendar className="w-4 h-4 text-blue-500" /> :
                   <HelpCircle className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="border border-white/5 ring-1 ring-white/10 rounded bg-[#141414]/20 overflow-hidden flex flex-col justify-between min-h-[460px] max-h-[580px]">
            {/* Messages Area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-5 max-h-[380px] scrollbar-thin">
              {messages.map((msg, index) => {
                const isAi = msg.role === "assistant";

                return (
                  <div 
                    key={index}
                    className={`flex gap-3 text-left ${isAi ? "justify-start" : "justify-end"}`}
                  >
                    {isAi && (
                      <div className="w-8 h-8 rounded-full bg-[#e50914]/10 border border-[#e50914]/30 flex items-center justify-center text-[#e50914] shrink-0">
                        <Brain className="w-4.5 h-4.5" />
                      </div>
                    )}

                    <div className={`p-4 rounded max-w-[85%] text-xs sm:text-sm border ${
                      isAi 
                        ? "bg-[#0a0a0a]/60 border-white/5 text-gray-300" 
                        : "bg-[#e50914] border-[#e50914] text-white"
                    }`}>
                      {isAi ? renderMarkdownText(msg.content) : <p>{msg.content}</p>}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 text-left justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#e50914]/10 border border-[#e50914]/30 flex items-center justify-center text-[#e50914] animate-spin shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="p-4 bg-[#0a0a0a]/60 border border-white/5 text-gray-500 text-xs sm:text-sm rounded flex items-center gap-2">
                    <span>EnemFlix AI está formulando suas maratonas recomendadas...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form Input Footer */}
            <form onSubmit={handleFormSubmit} className="p-4 bg-[#141414]/60 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua dúvida de estudos ou peça uma maratona específica..."
                disabled={isLoading}
                className="flex-grow bg-black border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#e50914] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-[#e50914] text-white px-5 rounded hover:bg-[#e50914]/90 cursor-pointer flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
