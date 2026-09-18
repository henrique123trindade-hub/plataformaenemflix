import React, { useState, useMemo } from "react";
import { 
  UserStats, 
  LeadProfile, 
  VideoProgress, 
  SimulatedExamResult, 
  EssaySubmission, 
  AIConversation, 
  Video 
} from "../types";
import { VIDEOS_DATA } from "../data/courses";
import { 
  Flame, 
  Award, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  PenTool, 
  Brain, 
  Calendar, 
  User, 
  ChevronRight, 
  Play, 
  Trash2, 
  Search, 
  TrendingUp, 
  History, 
  Trophy,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

interface UserProfileTabProps {
  userProfile: LeadProfile;
  userStats: UserStats;
  videoProgress: VideoProgress[];
  simulatedExams: SimulatedExamResult[];
  essays: EssaySubmission[];
  aiConversations: AIConversation[];
  onPlayVideo: (video: Video) => void;
  onSelectConversation: (chatId: string) => void;
  onDeleteConversation: (chatId: string) => void;
}

export default function UserProfileTab({
  userProfile,
  userStats,
  videoProgress,
  simulatedExams,
  essays,
  aiConversations,
  onPlayVideo,
  onSelectConversation,
  onDeleteConversation
}: UserProfileTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "exams" | "essays" | "ai" | "achievements">("overview");
  const [examRange, setExamRange] = useState<7 | 30 | 90>(30);
  const [aiSearch, setAiSearch] = useState("");

  // Calculate stats
  const totalCompletedAulas = useMemo(() => {
    return videoProgress.filter(p => p.status === "completed").length;
  }, [videoProgress]);

  const totalInProgessAulas = useMemo(() => {
    return videoProgress.filter(p => p.status === "in_progress").length;
  }, [videoProgress]);

  const totalAIChatMessages = useMemo(() => {
    return aiConversations.reduce((acc, conv) => acc + conv.messages.length, 0);
  }, [aiConversations]);

  // Days utilizing platform
  const daysRegistered = useMemo(() => {
    if (!userProfile.createdAt) return 1;
    const registerDate = new Date(userProfile.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - registerDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  }, [userProfile.createdAt]);

  // Achievements Definition & Calculation
  const achievements = useMemo(() => {
    const list = [
      {
        id: "first_class",
        title: "Primeira Maratona",
        description: "Concluiu a primeira videoaula na plataforma.",
        icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
        unlocked: totalCompletedAulas >= 1,
        progress: totalCompletedAulas >= 1 ? 100 : 0,
        label: `${Math.min(totalCompletedAulas, 1)}/1`
      },
      {
        id: "streak_7",
        title: "Em Chamas (7 dias)",
        description: "Alcançou uma sequência de 7 dias de estudos.",
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        unlocked: userStats.streak >= 7,
        progress: Math.min((userStats.streak / 7) * 100, 100),
        label: `${userStats.streak}/7 dias`
      },
      {
        id: "streak_30",
        title: "Imbatível (30 dias)",
        description: "Alcançou uma sequência de 30 dias de estudos.",
        icon: <Flame className="w-6 h-6 text-red-500 fill-red-500" />,
        unlocked: userStats.streak >= 30,
        progress: Math.min((userStats.streak / 30) * 100, 100),
        label: `${userStats.streak}/30 dias`
      },
      {
        id: "classes_10",
        title: "Maratonista Iniciante",
        description: "Concluiu 10 videoaulas na plataforma.",
        icon: <BookOpen className="w-6 h-6 text-blue-400" />,
        unlocked: totalCompletedAulas >= 10,
        progress: Math.min((totalCompletedAulas / 10) * 100, 100),
        label: `${totalCompletedAulas}/10`
      },
      {
        id: "first_exam",
        title: "Primeiro Simulado",
        description: "Realizou o seu primeiro simulado completo.",
        icon: <Activity className="w-6 h-6 text-purple-400" />,
        unlocked: simulatedExams.length >= 1,
        progress: simulatedExams.length >= 1 ? 100 : 0,
        label: `${Math.min(simulatedExams.length, 1)}/1`
      },
      {
        id: "first_essay",
        title: "Primeira Redação",
        description: "Enviou a primeira redação para correção da IA.",
        icon: <PenTool className="w-6 h-6 text-yellow-400" />,
        unlocked: essays.length >= 1,
        progress: essays.length >= 1 ? 100 : 0,
        label: `${Math.min(essays.length, 1)}/1`
      }
    ];
    return list;
  }, [totalCompletedAulas, userStats.streak, simulatedExams.length, essays.length]);

  const unlockedCount = useMemo(() => {
    return achievements.filter(a => a.unlocked).length;
  }, [achievements]);

  // Filtered lists for continue watching & completed
  const continueWatchingVideos = useMemo(() => {
    const inProgress = videoProgress.filter(p => p.status === "in_progress");
    return inProgress.map(p => {
      const video = VIDEOS_DATA.find(v => v.id === p.videoId);
      return video ? { ...video, progress: p } : null;
    }).filter(v => v !== null) as (Video & { progress: VideoProgress })[];
  }, [videoProgress]);

  const completedVideosList = useMemo(() => {
    const completed = videoProgress.filter(p => p.status === "completed");
    return completed.map(p => {
      const video = VIDEOS_DATA.find(v => v.id === p.videoId);
      return video ? { ...video, progress: p } : null;
    }).filter(v => v !== null) as (Video & { progress: VideoProgress })[];
  }, [videoProgress]);

  // Exam chart data based on selected range
  const examChartData = useMemo(() => {
    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - examRange);

    const filtered = simulatedExams.filter(exam => {
      const examDate = new Date(exam.date);
      return examDate >= cutoffDate;
    });

    // Sort chronologically
    const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sorted.map((exam, idx) => ({
      name: `Simulado ${idx + 1}`,
      title: exam.examTitle,
      score: exam.score,
      acertos: exam.correctAnswers,
      data: new Date(exam.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    }));
  }, [simulatedExams, examRange]);

  // AI Conversations list with search filter
  const filteredConversations = useMemo(() => {
    if (!aiSearch.trim()) return aiConversations;
    return aiConversations.filter(conv => 
      conv.title.toLowerCase().includes(aiSearch.toLowerCase()) ||
      conv.messages.some(msg => msg.content.toLowerCase().includes(aiSearch.toLowerCase()))
    );
  }, [aiConversations, aiSearch]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8" id="profile-view-root">
      {/* 1. Profile Header Hero */}
      <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-[#e50914] to-red-500 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            {userStats.streak >= 3 && (
              <span className="absolute -bottom-1 -right-1 bg-black border border-white/10 p-1.5 rounded-full shadow-lg" title="ON FIRE!">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-bounce" />
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">{userProfile.name}</h2>
              {userProfile.isGuest && (
                <span className="bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded w-fit mx-auto sm:mx-0">
                  Conta Convidado
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm">{userProfile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Criado em {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString("pt-BR") : "Julho de 2026"}
              </span>
              <span>•</span>
              <span className="text-[#e50914] font-black uppercase">
                Meta: {userProfile.targetCourse} ({userProfile.targetScore} pts)
              </span>
            </div>
          </div>
        </div>

        {/* Level Banner */}
        <div className="bg-[#0a0a0a]/80 border border-white/5 px-6 py-4 rounded text-center min-w-[160px] z-10 shadow-inner">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Nível Atual</p>
          <p className="text-4xl font-black text-[#e50914] mt-0.5">{userStats.level}</p>
          <div className="mt-2.5 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#e50914] to-red-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-400 mt-1.5 font-mono">
            {userStats.xp} / {userStats.xpToNextLevel} XP
          </p>
        </div>
      </div>

      {/* 2. Bento Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Streak */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition">
          <div className="mx-auto bg-orange-950/20 border border-orange-900/30 p-2 rounded-full w-fit">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{userStats.streak} d</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Estudos Seguidos</p>
          </div>
        </div>

        {/* Hours Studied */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition">
          <div className="mx-auto bg-blue-950/20 border border-blue-900/30 p-2 rounded-full w-fit">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{userStats.hoursStudied.toFixed(1)} h</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Tempo Estudado</p>
          </div>
        </div>

        {/* Classes Completed */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition">
          <div className="mx-auto bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-full w-fit">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{totalCompletedAulas}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Aulas Concluídas</p>
          </div>
        </div>

        {/* Simulated Exams */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition">
          <div className="mx-auto bg-purple-950/20 border border-purple-900/30 p-2 rounded-full w-fit">
            <Activity className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{simulatedExams.length}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Simulados Feitos</p>
          </div>
        </div>

        {/* Essays Sent */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition">
          <div className="mx-auto bg-yellow-950/20 border border-yellow-900/30 p-2 rounded-full w-fit">
            <PenTool className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{essays.length}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Redações Enviadas</p>
          </div>
        </div>

        {/* IA Conversations */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition">
          <div className="mx-auto bg-pink-950/20 border border-pink-900/30 p-2 rounded-full w-fit">
            <Brain className="w-5 h-5 text-pink-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{totalAIChatMessages}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Mensagens IA</p>
          </div>
        </div>

        {/* Days on Platform */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 text-center flex flex-col justify-between hover:scale-[1.02] transition col-span-2 sm:col-span-1">
          <div className="mx-auto bg-zinc-900 border border-zinc-800 p-2 rounded-full w-fit">
            <Calendar className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-white">{daysRegistered} d</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Dias na Plataforma</p>
          </div>
        </div>
      </div>

      {/* 3. Sub-navigation tabs inside profile */}
      <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setActiveSubTab("overview")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === "overview" ? "border-[#e50914] text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("exams")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === "exams" ? "border-[#e50914] text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>Simulados ({simulatedExams.length})</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("essays")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === "essays" ? "border-[#e50914] text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <PenTool className="w-4 h-4" />
            <span>Redações ({essays.length})</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("ai")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === "ai" ? "border-[#e50914] text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>Conversas IA ({aiConversations.length})</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("achievements")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === "achievements" ? "border-[#e50914] text-white" : "border-transparent text-zinc-400 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Conquistas ({unlockedCount}/{achievements.length})</span>
          </div>
        </button>
      </div>

      {/* 4. Sub-tab Content Area */}
      <div className="min-h-[400px]">
        {/* OVERVIEW SUB-TAB */}
        {activeSubTab === "overview" && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Metas e Desempenho */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Metas Semanais/Mensais */}
              <div className="bg-[#141414] border border-white/5 rounded p-6 space-y-5">
                <h3 className="font-black uppercase tracking-tight text-sm text-[#e50914] flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Suas Metas de Estudo</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Meta 1: Aulas assistidas na semana */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-400">
                      <span>Aulas Concluídas nesta semana</span>
                      <span className="text-white">{Math.min(totalCompletedAulas, 5)}/5 aulas</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min((totalCompletedAulas / 5) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {/* Meta 2: Tempo de estudo mensal */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-400">
                      <span>Tempo Estudado (Mês)</span>
                      <span className="text-white">{Math.min(userStats.hoursStudied, 20).toFixed(1)}/20 h</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${Math.min((userStats.hoursStudied / 20) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {/* Meta 3: Simulados */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-400">
                      <span>Simulados Realizados</span>
                      <span className="text-white">{Math.min(simulatedExams.length, 2)}/2 feitos</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${Math.min((simulatedExams.length / 2) * 100, 100)}%` }} />
                    </div>
                  </div>

                  {/* Meta 4: Redação */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-zinc-400">
                      <span>Redações de Treino</span>
                      <span className="text-white">{Math.min(essays.length, 1)}/1 redação</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-full transition-all" style={{ width: `${Math.min((essays.length / 1) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded text-xs text-zinc-400 leading-relaxed">
                  🔥 Complete atividades diárias como assistir videoaulas, realizar simulados ou enviar redações para manter sua chama ativa no Duolingo-style Streak!
                </div>
              </div>

              {/* Evolução de Notas em Simulados */}
              <div className="bg-[#141414] border border-white/5 rounded p-6 lg:col-span-2 flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-tight text-sm text-[#e50914] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Evolução em Simulados</span>
                  </h3>
                  <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-white/5 rounded p-0.5">
                    {[7, 30, 90].map((range) => (
                      <button
                        key={range}
                        onClick={() => setExamRange(range as any)}
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase transition cursor-pointer ${
                          examRange === range ? "bg-[#e50914] text-white" : "text-zinc-500 hover:text-white"
                        }`}
                      >
                        {range} Dias
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-56 w-full">
                  {examChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={examChartData}>
                        <defs>
                          <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e50914" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#e50914" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                        <XAxis dataKey="data" stroke="#71717a" fontSize={11} tickLine={false} />
                        <YAxis stroke="#71717a" domain={[400, 1000]} fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#141414", borderColor: "#27272a", borderRadius: "4px" }}
                          itemStyle={{ color: "#fff", fontWeight: "bold" }}
                          labelStyle={{ color: "#e50914", fontWeight: "black" }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#e50914" strokeWidth={3} fillOpacity={1} fill="url(#scoreGlow)" name="Nota TRI" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs text-center py-6">
                      <Activity className="w-10 h-10 text-zinc-600 mb-2" />
                      <p className="font-bold">Nenhum simulado registrado neste período.</p>
                      <p className="text-[10px] mt-1 max-w-xs">Realize um simulado na aba "Simulados" para visualizar seu gráfico de notas e rendimento!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recents: Continuar assistindo */}
            {continueWatchingVideos.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-black uppercase tracking-tight text-sm text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#e50914]" />
                  <span>Continuar Assistindo</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {continueWatchingVideos.slice(0, 4).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => onPlayVideo(item)}
                      className="bg-[#141414] border border-white/5 rounded overflow-hidden group cursor-pointer hover:border-[#e50914]/30 hover:ring-2 hover:ring-[#e50914]/20 transition-all duration-300"
                    >
                      <div className="relative h-32 bg-black">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            if (item.youtubeId) {
                              e.currentTarget.src = `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                        <span className="absolute top-2 left-2 bg-[#0a0a0a]/90 text-[10px] px-1.5 py-0.5 border border-white/10 text-[#e50914] rounded-sm font-black uppercase">
                          {item.subject}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-[#e50914] transition">{item.title}</h4>
                        <div className="space-y-1">
                          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-[#e50914] h-full" style={{ width: `${item.progress.percentComplete}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                            <span>{item.progress.percentComplete}% visto</span>
                            <span>{item.progress.watchTime.toFixed(0)}m assistidos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SIMULADOS SUB-TAB */}
        {activeSubTab === "exams" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="bg-[#141414] border border-white/5 rounded p-6">
              <h3 className="font-black uppercase tracking-tight text-sm text-[#e50914] mb-4">
                Histórico de Simulados
              </h3>

              {simulatedExams.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#0a0a0a] uppercase text-zinc-500 font-bold border-b border-white/5">
                      <tr>
                        <th className="p-3">Simulado</th>
                        <th className="p-3">Data</th>
                        <th className="p-3 text-center">Acertos</th>
                        <th className="p-3 text-right">Nota Calculada (TRI)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {simulatedExams.map((exam) => (
                        <tr key={exam.id} className="hover:bg-white/5 transition">
                          <td className="p-3 font-semibold text-white">{exam.examTitle}</td>
                          <td className="p-3 text-zinc-500">{new Date(exam.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                          <td className="p-3 text-center font-bold text-blue-400">
                            {exam.correctAnswers} / {exam.totalQuestions}
                          </td>
                          <td className="p-3 text-right font-black text-[#e50914] text-sm">
                            {exam.score} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <Activity className="w-10 h-10 mx-auto text-zinc-600" />
                  <p className="font-bold">Você ainda não realizou nenhum simulado.</p>
                  <p className="text-[10px]">Acesse a aba "Simulados" e teste seus conhecimentos com questões reais do ENEM.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REDACOES SUB-TAB */}
        {activeSubTab === "essays" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="bg-[#141414] border border-white/5 rounded p-6">
              <h3 className="font-black uppercase tracking-tight text-sm text-[#e50914] mb-4">
                Histórico de Redações
              </h3>

              {essays.length > 0 ? (
                <div className="space-y-4">
                  {essays.map((essay) => (
                    <div 
                      key={essay.id} 
                      className="border border-white/5 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] transition p-5 rounded space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                        <div>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tema Escolhido</p>
                          <h4 className="font-bold text-sm text-white mt-0.5">{essay.theme}</h4>
                          <p className="text-[10px] text-zinc-500 mt-1">Enviado em {new Date(essay.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Nota Obtida</p>
                          <span className="text-2xl font-black text-yellow-500">{essay.score} <span className="text-xs text-zinc-500">/1000</span></span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-zinc-400">
                        {/* Redação Escrita */}
                        <div className="space-y-2 bg-[#141414] p-4 rounded border border-white/5">
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-white/5 pb-1.5">Seu Texto</p>
                          <p className="whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto no-scrollbar font-serif text-[13px] text-zinc-300">
                            {essay.content}
                          </p>
                        </div>

                        {/* Feedback & Correção IA */}
                        <div className="space-y-2 bg-[#141414] p-4 rounded border border-white/5">
                          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-widest border-b border-white/5 pb-1.5">Feedback da IA</p>
                          <div className="space-y-3 max-h-56 overflow-y-auto no-scrollbar text-zinc-300 leading-relaxed text-[12px]">
                            <div>
                              <p className="font-extrabold text-white uppercase text-[10px] text-yellow-500 mb-0.5">Correção Detalhada:</p>
                              {typeof essay.correction === "object" && essay.correction !== null ? (
                                <div className="space-y-1 mt-1 bg-black/40 p-2.5 rounded border border-white/5 font-mono text-[11px]">
                                  <div className="flex justify-between"><span>C1 (Norma Culta):</span> <span className="text-yellow-500 font-bold">{(essay.correction as any).c1 ?? 0} pts</span></div>
                                  <div className="flex justify-between"><span>C2 (Repertório):</span> <span className="text-yellow-500 font-bold">{(essay.correction as any).c2 ?? 0} pts</span></div>
                                  <div className="flex justify-between"><span>C3 (Coerência):</span> <span className="text-yellow-500 font-bold">{(essay.correction as any).c3 ?? 0} pts</span></div>
                                  <div className="flex justify-between"><span>C4 (Coesão):</span> <span className="text-yellow-500 font-bold">{(essay.correction as any).c4 ?? 0} pts</span></div>
                                  <div className="flex justify-between"><span>C5 (Intervenção):</span> <span className="text-yellow-500 font-bold">{(essay.correction as any).c5 ?? 0} pts</span></div>
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap">{typeof essay.correction === "string" ? essay.correction : JSON.stringify(essay.correction)}</p>
                              )}
                            </div>
                            <div>
                              <p className="font-extrabold text-white uppercase text-[10px] text-yellow-500 mb-0.5">Dicas de Evolução:</p>
                              <p className="whitespace-pre-wrap">{typeof essay.feedback === "string" ? essay.feedback : JSON.stringify(essay.feedback)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <PenTool className="w-10 h-10 mx-auto text-zinc-600" />
                  <p className="font-bold">Nenhuma redação enviada até agora.</p>
                  <p className="text-[10px]">Acesse a aba "Treino de Redação" e redija sua redação Nota 1000 com o corretor IA.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHATS IA SUB-TAB */}
        {activeSubTab === "ai" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="bg-[#141414] border border-white/5 rounded p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                <h3 className="font-black uppercase tracking-tight text-sm text-[#e50914]">
                  Histórico de Conversas com o ENEM Flix IA
                </h3>

                {/* Search Conversations */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-3.5 w-3.5 text-zinc-500" />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar em conversas..."
                    value={aiSearch}
                    onChange={(e) => setAiSearch(e.target.value)}
                    className="bg-black border border-white/10 rounded pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#e50914] w-full sm:w-56"
                  />
                </div>
              </div>

              {filteredConversations.length > 0 ? (
                <div className="space-y-3">
                  {filteredConversations.map((conv) => (
                    <div 
                      key={conv.id}
                      className="bg-[#0a0a0a]/50 hover:bg-[#0a0a0a] transition border border-white/5 p-4 rounded flex items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-pink-400" />
                          <h4 className="font-bold text-xs text-white truncate">{conv.title}</h4>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate">
                          Última msg: {conv.messages[conv.messages.length - 1]?.content || ""}
                        </p>
                        <p className="text-[9px] text-zinc-600 font-mono">
                          Atualizado em {new Date(conv.updatedAt).toLocaleDateString()} às {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectConversation(conv.id)}
                          className="px-3 py-1.5 bg-[#e50914] hover:bg-red-700 text-white font-extrabold text-[10px] uppercase tracking-wider rounded cursor-pointer transition whitespace-nowrap"
                        >
                          Continuar
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteConversation(conv.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-500 rounded hover:bg-white/5 transition opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                          title="Excluir conversa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <Brain className="w-10 h-10 mx-auto text-zinc-600" />
                  <p className="font-bold">Nenhuma conversa encontrada.</p>
                  <p className="text-[10px]">Inicie um chat na aba "EnemFlix AI" para interagir com seu tutor inteligente de estudos.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONQUISTAS SUB-TAB */}
        {activeSubTab === "achievements" && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((item) => (
                <div 
                  key={item.id}
                  className={`border p-5 rounded flex items-start gap-4 transition-all duration-300 relative overflow-hidden ${
                    item.unlocked 
                      ? "bg-[#141414] border-[#e50914]/30 ring-1 ring-[#e50914]/10 shadow-lg" 
                      : "bg-[#141414]/40 border-white/5 opacity-50"
                  }`}
                >
                  <div className={`p-3 rounded-full border ${
                    item.unlocked ? "bg-black/40 border-[#e50914]/20" : "bg-zinc-900 border-zinc-800"
                  }`}>
                    {item.unlocked ? item.icon : <Trophy className="w-6 h-6 text-zinc-600" />}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono text-[#e50914] font-black uppercase">
                        {item.unlocked ? "Desbloqueada" : "Bloqueada"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
                    
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Progresso</span>
                        <span>{item.label}</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${item.unlocked ? "bg-[#e50914]" : "bg-zinc-600"}`} 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
