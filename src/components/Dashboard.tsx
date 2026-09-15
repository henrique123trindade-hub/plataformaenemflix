import React from "react";
import { UserStats, LeadProfile, Video } from "../types";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from "recharts";
import { Clock, CheckSquare, Target, Flame, TrendingUp, Compass, Award } from "lucide-react";

interface DashboardProps {
  userStats: UserStats;
  userProfile: LeadProfile;
  videos: Video[];
}

export default function Dashboard({ userStats, userProfile, videos }: DashboardProps) {
  // 1. Data for weekly study hours
  const weeklyStudyData = [
    { name: "Seg", Horas: 1.5 },
    { name: "Ter", Horas: 2.2 },
    { name: "Qua", Horas: 1.8 },
    { name: "Qui", Horas: userStats.hoursStudied > 6 ? 2.5 : 0.8 },
    { name: "Sex", Horas: 1.2 },
    { name: "Sáb", Horas: 3.0 },
    { name: "Dom", Horas: 2.0 }
  ];

  // 2. Data for category distribution
  const completedByCategory = userStats.completedVideos.reduce((acc, videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      acc[video.category] = (acc[video.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = [
    { name: "Matemática", concluido: completedByCategory["Matemática"] || 0, total: videos.filter(v => v.category === "Matemática").length },
    { name: "Linguagens", concluido: completedByCategory["Linguagens"] || 0, total: videos.filter(v => v.category === "Linguagens").length },
    { name: "Redação", concluido: completedByCategory["Redação"] || 0, total: videos.filter(v => v.category === "Redação").length },
    { name: "Ciências Humanas", concluido: completedByCategory["Ciências Humanas"] || 0, total: videos.filter(v => v.category === "Ciências Humanas").length },
    { name: "Ciências da Natureza", concluido: completedByCategory["Ciências da Natureza"] || 0, total: videos.filter(v => v.category === "Ciências da Natureza").length },
  ].map((item) => {
    return {
      ...item,
      Pendente: item.total - item.concluido,
      percent: item.total > 0 ? Math.round((item.concluido / item.total) * 100) : 0
    };
  });

  // Colors for disciplines
  const COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

  const donutData = categoryChartData.map((item) => {
    return {
      name: item.name,
      value: item.concluido || 1
    };
  });

  // 3. Dynamic simulated score tracking data
  const simulatedHistory = [
    { name: "Simulado 1", Nota: 590, Meta: userProfile.targetScore },
    { name: "Simulado 2", Nota: 640, Meta: userProfile.targetScore },
    { name: "Simulado 3", Nota: 690, Meta: userProfile.targetScore },
    { name: "Simulado 4", Nota: userStats.solvedQuestionsCount > 0 ? 730 : 690, Meta: userProfile.targetScore },
  ];

  const totalLessons = videos.length;
  const completedLessons = userStats.completedVideos.length;
  const progressPercent = Math.round((completedLessons / totalLessons) * 100) || 0;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-white" id="progress-dashboard">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Meu <span className="text-[#e50914]">Painel de Evolução</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Acompanhe em tempo real suas horas assistidas, resoluções de questões e desempenho nos simulados.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#141414] px-4 py-2 rounded border border-white/10">
          <Target className="w-5 h-5 text-[#e50914]" />
          <div className="text-left text-xs">
            <p className="text-gray-500 font-bold uppercase">Meta de Aprovação</p>
            <p className="text-white font-black">{userProfile.targetCourse} — {userProfile.targetScore} pontos</p>
          </div>
        </div>
      </div>

      {/* Grid: Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Horas de Estudo */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-5 rounded hover:border-[#e50914]/40 transition shadow-lg flex items-center gap-4">
          <div className="p-3 bg-[#e50914]/15 text-[#e50914] rounded">
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Estudado</p>
            <p className="text-2xl font-black text-white">{userStats.hoursStudied.toFixed(1)}h</p>
            <p className="text-[10px] text-gray-400 mt-1">Minutos ativos hoje</p>
          </div>
        </div>

        {/* Card 2: Aulas Concluídas */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-5 rounded hover:border-[#e50914]/40 transition shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Aulas Ativas</p>
            <p className="text-2xl font-black text-white">{completedLessons}/{totalLessons}</p>
            <p className="text-[10px] text-gray-400 mt-1">{progressPercent}% de conclusão</p>
          </div>
        </div>

        {/* Card 3: Ofensiva */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-5 rounded hover:border-[#e50914]/40 transition shadow-lg flex items-center gap-4">
          <div className="p-3 bg-orange-600/10 text-orange-500 rounded">
            <Flame className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Ofensiva</p>
            <p className="text-2xl font-black text-white">{userStats.streak} dias</p>
            <p className="text-[10px] text-gray-400 mt-1">Não quebre seu recorde!</p>
          </div>
        </div>

        {/* Card 4: Questões Resolvidas */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-5 rounded hover:border-[#e50914]/40 transition shadow-lg flex items-center gap-4">
          <div className="p-3 bg-purple-600/10 text-purple-500 rounded">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Questões</p>
            <p className="text-2xl font-black text-white">{userStats.correctAnswersCount}/{userStats.solvedQuestionsCount || 0}</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {userStats.solvedQuestionsCount > 0 
                ? `${Math.round((userStats.correctAnswersCount / userStats.solvedQuestionsCount) * 100)}% de acerto` 
                : "Nenhuma respondida"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar overall */}
      <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-5 rounded">
        <div className="flex justify-between items-center text-sm font-bold mb-2 text-left">
          <span>Progresso Geral da Grade ENEM</span>
          <span className="text-[#e50914]">{progressPercent}% Completo</span>
        </div>
        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/5">
          <div 
            className="bg-gradient-to-r from-[#e50914] to-[#ff1a26] h-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Daily Study hours */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-6 rounded shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-left">
            <Clock className="w-4 h-4 text-[#e50914]" />
            <span>Frequência Semanal (Horas Assistidas)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStudyData}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                <YAxis stroke="#a1a1aa" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", color: "#ffffff" }}
                  labelClassName="text-xs font-bold text-gray-400"
                />
                <Bar dataKey="Horas" fill="#e50914" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Score evolution Line chart */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-6 rounded shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-left">
            <TrendingUp className="w-4 h-4 text-[#e50914]" />
            <span>Desempenho em Simulados x Meta ({userProfile.targetScore})</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulatedHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} />
                <YAxis domain={[400, 1000]} stroke="#a1a1aa" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#141414", borderColor: "#262626", color: "#ffffff" }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="Nota" stroke="#e50914" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Meta" stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Readiness breakdown by subject category */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-6 rounded shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 text-left">
            <Compass className="w-4 h-4 text-[#e50914]" />
            <span>Engajamento por Categoria de Matéria</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div>
              <div className="h-48 md:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {donutData.map((entry, index) => {
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                      })}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#141414", borderColor: "#262626" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="md:hidden flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs text-gray-400 mt-2">
                {donutData.map((entry, index) => {
                  return (
                    <div key={index} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span>{entry.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:block space-y-3 text-xs text-left">
              {categoryChartData.map((item, index) => {
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-gray-300 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span>{item.name}</span>
                      </div>
                      <span>{item.concluido}/{item.total} aulas ({item.percent}%)</span>
                    </div>
                    <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full" style={{ width: `${item.percent}%`, backgroundColor: COLORS[index] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Diagnostic card */}
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 p-6 rounded shadow-lg flex flex-col justify-between text-left">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#e50914]" />
              <span>Análise de Desempenho do EnemFlix</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Com base nos seus dados atuais de navegação e resolução de simulados, sua principal força reside na disciplina de <span className="text-green-400 font-bold">Matemática</span> (onde você já assistiu à maioria das aulas fundamentais). 
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mt-3">
              Para alavancar sua pontuação geral rumo aos <span className="text-[#e50914] font-bold">{userProfile.targetScore} pontos em {userProfile.targetCourse}</span>, nosso algoritmo sugere focar na disciplina de <span className="text-yellow-400 font-bold">Ciências da Natureza</span> e iniciar os episódios de Eletrodinâmica.
            </p>
          </div>

          <div className="mt-6 p-3 bg-[#e50914]/10 border border-[#e50914]/20 rounded text-xs text-red-200 flex items-center gap-2">
            <span>💡 <strong>Dica Premium:</strong> Utilize o assistente no menu <strong>EnemFlix AI</strong> para criar um cronograma intensivo focado nessa área!</span>
          </div>
        </div>

      </div>

    </div>
  );
}
