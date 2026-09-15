import React, { useState, useEffect } from "react";
import { Clock, Calendar, CheckSquare, Plus, AlertCircle, Play, Pause, RotateCcw, Award, Flame, Brain } from "lucide-react";
import { UserStats } from "../types";

interface StudyCalendarProps {
  userStats: UserStats;
  onTimerComplete: (hours: number, xp: number) => void;
}

export default function StudyCalendar({ userStats, onTimerComplete }: StudyCalendarProps) {
  // Pomodoro Timer States
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"foco" | "descanso">("foco");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // Auto-dismiss Toast effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Calendar States
  const [schedule, setSchedule] = useState([
    { day: "Segunda-feira", subject: "Matemática", topic: "Matemática Básica e Razão/Proporção", done: true },
    { day: "Terça-feira", subject: "Linguagens", topic: "Interpretação de Texto e Variação Linguística", done: true },
    { day: "Quarta-feira", subject: "Redação", topic: "Estrutura e Competência 5", done: false },
    { day: "Quinta-feira", subject: "Ciências Humanas", topic: "Era Vargas e Geografia Física", done: false },
    { day: "Sexta-feira", subject: "Ciências da Natureza", topic: "Ecologia e Cadeias Alimentares", done: false },
    { day: "Sábado", subject: "Simulado ENEM", topic: "Simulado de 18 Questões e Revisão de Erros", done: false },
    { day: "Domingo", subject: "Folga Ativa", topic: "Vídeos do EnemFlix AI e Planejamento", done: false }
  ]);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer Complete
            setIsActive(false);
            if (mode === "foco") {
              // Award 0.4 hours and 50 XP
              onTimerComplete(0.4, 50);
              setCompletedSessions(prev => prev + 1);
              setToast({
                message: "Excelente trabalho! Sessão de Foco concluída. Você ganhou +50 XP e acumulou +0.4h de estudo!",
                type: "success"
              });
              setMode("descanso");
              setMinutes(5);
            } else {
              setToast({
                message: "Descanso finalizado! Hora de voltar ao foco.",
                type: "info"
              });
              setMode("foco");
              setMinutes(25);
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode]);

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "foco" ? 25 : 5);
    setSeconds(0);
  };

  const handleToggleSchedule = (index: number) => {
    setSchedule(
      schedule.map((item, i) => i === index ? { ...item, done: !item.done } : item)
    );
  };

  return (
    <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded p-6 space-y-6 text-white shadow-xl" id="study-planner-container">
      
      {/* Custom Toast Alert */}
      {toast && (
        <div className={`p-4 rounded border flex items-center gap-3 transition-all duration-300 animate-fade-in ${
          toast.type === "success" 
            ? "bg-green-600/15 border-green-600/40 text-green-300" 
            : "bg-blue-600/15 border-blue-600/40 text-blue-300"
        }`}>
          <div className="flex items-center justify-center shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${toast.type === "success" ? "bg-green-500 animate-pulse" : "bg-blue-500 animate-pulse"}`} />
          </div>
          <span className="text-xs font-semibold leading-relaxed text-left">{toast.message}</span>
          <button 
            type="button"
            onClick={() => setToast(null)} 
            className="ml-auto text-[10px] font-black uppercase text-gray-400 hover:text-white transition cursor-pointer shrink-0"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#e50914]" />
          <span>Agenda Semanal & Cronômetro Pomodoro</span>
        </h3>
        
        <div className="flex items-center gap-1.5 bg-[#e50914]/10 border border-[#e50914]/20 px-3 py-1 rounded text-[#e50914] text-xs font-semibold">
          <Flame className="w-3.5 h-3.5" />
          <span>Foco Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Col 1-2): Calendar Grid */}
        <div className="lg:col-span-2 space-y-4">
          <p className="text-gray-400 text-xs sm:text-sm text-left">
            Siga seu cronograma diário recomendável. Marque as caixas para registrar seu cumprimento.
          </p>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {schedule.map((item, index) => (
              <div 
                key={index}
                className={`p-3.5 rounded border transition flex items-center justify-between gap-4 ${
                  item.done 
                    ? "bg-green-950/10 border-green-900/40 text-gray-400" 
                    : "bg-[#0a0a0a]/60 border-white/5 hover:border-white/10 text-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox"
                    checked={item.done}
                    onChange={() => handleToggleSchedule(index)}
                    className="mt-1 w-4.5 h-4.5 text-[#e50914] bg-black border-white/10 rounded focus:ring-[#e50914] focus:ring-opacity-50 cursor-pointer"
                  />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 font-extrabold uppercase">{item.day}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        item.subject === "Matemática" ? "bg-[#e50914]/20 text-[#e50914]" :
                        item.subject === "Linguagens" ? "bg-blue-900/30 text-blue-400" :
                        item.subject === "Redação" ? "bg-green-900/30 text-green-400" :
                        item.subject === "Ciências Humanas" ? "bg-amber-900/30 text-amber-400" :
                        "bg-purple-900/30 text-purple-400"
                      }`}>
                        {item.subject}
                      </span>
                    </div>
                    <p className={`text-xs font-bold mt-1 ${item.done ? "line-through text-gray-500" : "text-gray-200"}`}>
                      {item.topic}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 font-semibold italic hidden sm:inline">
                  {item.done ? "Cumprido" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Pomodoro Focus Timer */}
        <div className="bg-[#0a0a0a]/40 border border-white/5 p-6 rounded flex flex-col justify-between space-y-6">
          <div className="text-center">
            <span className={`text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
              mode === "foco" ? "bg-[#e50914]/15 text-[#e50914]" : "bg-green-600/10 text-green-500"
            }`}>
              {mode === "foco" ? "Sessão de Foco" : "Tempo de Descanso"}
            </span>

            {/* Huge Clock */}
            <div className="text-5xl font-black text-white font-mono tracking-wider mt-6 select-none bg-black/40 py-4 rounded border border-white/5">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>

            <p className="text-gray-400 text-xs mt-3">
              {mode === "foco" 
                ? "Conclua os 25 minutos para pontuar +50 XP!" 
                : "Aproveite para alongar e tomar uma água."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleToggleTimer}
              className={`p-3 rounded-full cursor-pointer text-white transition ${
                isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-[#e50914] hover:bg-[#e50914]/90"
              }`}
              title={isActive ? "Pausar cronômetro" : "Iniciar cronômetro"}
            >
              {isActive ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={handleResetTimer}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full cursor-pointer transition"
              title="Reiniciar cronômetro"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-white/10 pt-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Brain className="w-3.5 h-3.5 text-[#e50914]" />
              <span>Sessões concluídas hoje: <strong>{completedSessions}</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
