import React, { useState, useEffect } from "react";
import { Question } from "../types";
import { MOCK_QUESTIONS } from "../data/courses";
import { 
  Award, Timer, CheckCircle2, AlertCircle, HelpCircle, 
  ArrowRight, RotateCcw, Sparkles, BookOpen, Sliders, 
  BrainCircuit, Calculator, ChevronRight, Loader2, Play, 
  FileEdit, X, Star, ArrowLeft, BarChart3, Target, 
  ShieldCheck, SlidersHorizontal, Layers, Zap
} from "lucide-react";

interface SimulatorProps {
  onScoreComplete: (solved: number, correct: number, xp: number, examTitle: string) => void;
}

const PRESET_SUBJECTS = [
  "Eletrodinâmica e Circuitos",
  "Termoquímica e Cinética",
  "Genética e DNA",
  "Ecologia e Cadeias Alimentares",
  "Função de 1º e 2º Grau",
  "Geometria Espacial e Volumes",
  "Análise Combinatória e Probabilidade",
  "Revolução Francesa e Era Vargas",
  "Globalização e Climas do Brasil",
  "Regras de Crase e Regência",
  "Vanguardas Europeias"
];

export default function Simulator({ onScoreComplete }: SimulatorProps) {
  // Mode selection: "select" | "curated" | "mini" | "ai"
  const [activeMode, setActiveMode] = useState<"select" | "curated" | "mini" | "ai">("select");
  const [activeTab, setActiveTab] = useState<"simulados" | "materias" | "custom" | "ia">("simulados");
  const [examTitle, setExamTitle] = useState("Simulado Integrado");
  
  // Quiz lists and navigation
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Scratchpad (Rascunho)
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState("");

  // Custom Exam Builder State
  const [customArea, setCustomArea] = useState<string>("todas");
  const [customCount, setCustomCount] = useState<number>(15);
  const [customDifficulty, setCustomDifficulty] = useState<string>("equilibrada");

  // AI Generation State
  const [aiSubjectInput, setAiSubjectInput] = useState(PRESET_SUBJECTS[0]);
  const [customAiSubject, setCustomAiSubject] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState<Question | null>(null);
  const [aiSelectedOption, setAiSelectedOption] = useState<number | null>(null);
  const [aiAnswered, setAiAnswered] = useState(false);
  const [aiCorrectCount, setAiCorrectCount] = useState(0);
  const [aiTotalCount, setAiTotalCount] = useState(0);
  const [aiError, setAiError] = useState("");

  // Timer Effect for Curated / Mini Mode
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerActive && timeRemaining > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerActive) {
      setIsFinished(true);
      setIsTimerActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, timeRemaining, isFinished]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Curated/Mini-Exam Handlers
  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    setIsAnswered(true);
    setUserAnswers(prev => ({ ...prev, [currentIndex]: selectedOption }));
    const currentQ = questions[currentIndex];
    if (selectedOption === currentQ.correctOptionIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      setIsTimerActive(false);
      
      const correctAnswers = score + (selectedOption === questions[currentIndex].correctOptionIndex ? 1 : 0);
      const earnedXp = 150 + (correctAnswers * 100);
      onScoreComplete(questions.length, correctAnswers, earnedXp, examTitle);
    }
  };

  // Generic exam launcher
  const startExam = (title: string, selectedQuestions: Question[], durationSec: number, mode: "curated" | "mini") => {
    setQuestions(selectedQuestions);
    setExamTitle(title);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers({});
    setTimeRemaining(durationSec);
    setIsFinished(false);
    setIsTimerActive(true);
    setActiveMode(mode);
  };

  // 1. Ready-Made Subject Simulations
  const startSubjectExam = (subjectKey: string) => {
    let filtered: Question[] = [];
    let title = "";

    switch (subjectKey) {
      case "matematica":
        filtered = MOCK_QUESTIONS.filter(q => q.area === "matematica" || q.subject.includes("Porcentagem") || q.subject.includes("Proporção") || q.subject.includes("Funções") || q.subject.includes("Geometria") || q.subject.includes("Estatística") || q.subject.includes("Probabilidade"));
        title = "Simulado Especializado: Matemática e Raciocínio TRI";
        break;
      case "fisica":
        filtered = MOCK_QUESTIONS.filter(q => q.subject.includes("Mecânica") || q.subject.includes("Eletrodinâmica") || q.subject.includes("Física"));
        title = "Simulado Especializado: Física e Eletrodinâmica TRI";
        break;
      case "quimica":
        filtered = MOCK_QUESTIONS.filter(q => q.subject.includes("Termoquímica") || q.subject.includes("Química") || q.subject.includes("Estequiometria"));
        title = "Simulado Especializado: Química Geral e Orgânica TRI";
        break;
      case "biologia":
        filtered = MOCK_QUESTIONS.filter(q => q.subject.includes("Ecologia") || q.subject.includes("Citologia") || q.subject.includes("Biologia"));
        title = "Simulado Especializado: Biologia, Citologia e Genética TRI";
        break;
      case "historia":
        filtered = MOCK_QUESTIONS.filter(q => q.subject.includes("História"));
        title = "Simulado Especializado: História do Brasil e Geral TRI";
        break;
      case "geografia":
        filtered = MOCK_QUESTIONS.filter(q => q.subject.includes("Geografia"));
        title = "Simulado Especializado: Geografia e Geopolítica TRI";
        break;
      case "filosofia":
        filtered = MOCK_QUESTIONS.filter(q => q.subject.includes("Filosofia") || q.subject.includes("Sociologia"));
        title = "Simulado Especializado: Filosofia e Sociologia TRI";
        break;
      case "linguagens":
        filtered = MOCK_QUESTIONS.filter(q => q.area === "linguagens" || q.subject.includes("Inglês") || q.subject.includes("Espanhol") || q.subject.includes("Literatura") || q.subject.includes("Gramática") || q.subject.includes("Redação"));
        title = "Simulado Especializado: Linguagens, Códigos e Redação TRI";
        break;
      default:
        filtered = MOCK_QUESTIONS.slice(0, 10);
        title = "Simulado Geral";
    }

    if (filtered.length === 0) {
      filtered = MOCK_QUESTIONS.slice(0, 8);
    }

    startExam(title, filtered, filtered.length * 120, "mini");
  };

  // 2. Ready-Made Extensives (More questions)
  const startExtensiveExam = (type: "dia1" | "dia2" | "maratona") => {
    let selectedQs: Question[] = [];
    let title = "";
    let duration = 3600;

    if (type === "dia1") {
      selectedQs = MOCK_QUESTIONS.filter(q => q.area === "humanas" || q.area === "linguagens");
      title = "Simulado Extensivo ENEM - 1º Dia (Linguagens + Humanas + Redação)";
      duration = selectedQs.length * 150;
    } else if (type === "dia2") {
      selectedQs = MOCK_QUESTIONS.filter(q => q.area === "matematica" || q.area === "natureza");
      title = "Simulado Extensivo ENEM - 2º Dia (Matemática + Ciências da Natureza)";
      duration = selectedQs.length * 150;
    } else {
      selectedQs = [...MOCK_QUESTIONS]; // All questions
      title = "Maratona Geral ENEM TRI Nacional (Todas as Áreas)";
      duration = selectedQs.length * 150;
    }

    startExam(title, selectedQs, duration, "curated");
  };

  // 3. Custom Exam Builder
  const handleStartCustomExam = () => {
    let pool = [...MOCK_QUESTIONS];

    if (customArea !== "todas") {
      pool = pool.filter(q => q.area === customArea || q.subject.toLowerCase().includes(customArea));
    }

    if (customDifficulty === "facil") {
      pool.sort((a, b) => (a.triWeight || 1) - (b.triWeight || 1));
    } else if (customDifficulty === "dificil") {
      pool.sort((a, b) => (b.triWeight || 3) - (a.triWeight || 3));
    } else {
      pool.sort(() => Math.sin(Date.now()));
    }

    const finalQuestions = pool.slice(0, Math.min(customCount, pool.length));
    const title = `Simulado Personalizado (${finalQuestions.length} Qs - ${customArea.toUpperCase()})`;
    startExam(title, finalQuestions, finalQuestions.length * 120, "mini");
  };

  // TRI Calculation Engine
  const calculateTriMetrics = () => {
    let totalFacil = 0, hitsFacil = 0;
    let totalMedio = 0, hitsMedio = 0;
    let totalDificil = 0, hitsDificil = 0;

    questions.forEach((q, idx) => {
      const isHit = userAnswers[idx] === q.correctOptionIndex || (idx === currentIndex && selectedOption === q.correctOptionIndex);
      const diff = q.triDifficulty || (q.triWeight === 3 ? "Difícil" : q.triWeight === 2 ? "Médio" : "Fácil");

      if (diff === "Fácil") {
        totalFacil++;
        if (isHit) hitsFacil++;
      } else if (diff === "Médio") {
        totalMedio++;
        if (isHit) hitsMedio++;
      } else {
        totalDificil++;
        if (isHit) hitsDificil++;
      }
    });

    const pctHit = questions.length > 0 ? score / questions.length : 0;
    let baseTri = Math.round(350 + (pctHit * 580));

    // TRI Coherence Check
    const facilRatio = totalFacil > 0 ? hitsFacil / totalFacil : 1;
    const dificilRatio = totalDificil > 0 ? hitsDificil / totalDificil : 0;

    let coherenceStatus = "Excelente Coerência TRI";
    let coherenceNote = "Padrão de respostas consistente. Acertos concentrados em itens fáceis e médios com progressão lógica.";
    let coherenceBonus = 25;

    if (dificilRatio > facilRatio + 0.3 && totalDificil > 0) {
      coherenceStatus = "Aviso de Inconsistência TRI (Chute Provável)";
      coherenceNote = "Você acertou questões de nível Difícil mas errou questões Fáceis da mesma área. A TRI penaliza acertos casuais por falta de consistência.";
      coherenceBonus = -45;
    } else if (pctHit >= 0.8) {
      coherenceStatus = "Alto Desempenho TRI Consistente";
      coherenceNote = "Domínio amplo e coerente em todas as faixas de complexidade da matriz ENEM.";
      coherenceBonus = 40;
    }

    const finalTriScore = Math.min(980, Math.max(350, baseTri + coherenceBonus));

    return {
      finalTriScore,
      totalFacil, hitsFacil,
      totalMedio, hitsMedio,
      totalDificil, hitsDificil,
      coherenceStatus, coherenceNote
    };
  };

  // AI Generation Trigger
  const generateAiQuestion = async () => {
    setAiLoading(true);
    setAiError("");
    setAiQuestion(null);
    setAiSelectedOption(null);
    setAiAnswered(false);

    const subjectToUse = customAiSubject.trim() || aiSubjectInput;

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subjectToUse })
      });

      if (!response.ok) throw new Error("API Route error");
      const data = await response.json();
      if (data.question) {
        setAiQuestion(data.question);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setAiError("Fallback demo active.");
      setAiQuestion({
        id: `ai-demo-${Date.now()}`,
        subject: subjectToUse,
        text: `(ENEM Inédito) No estudo de ${subjectToUse}, observa-se que o domínio dos conceitos fundamentais e a interpretação criteriosa de distratores são cruciais. Ao analisar um problema prático sobre esse tema em uma avaliação nacional, qual estratégia reflete com maior precisão a resolução coerente segundo as competências do ENEM?`,
        options: [
          "Identificar os dados do enunciado, relacionar a teoria ao contexto e eliminar distratores ilógicos.",
          "Memorizar fórmulas decoradas sem analisar o contexto do texto de apoio.",
          "Assinalar aleatoriamente a alternativa com o texto mais longo.",
          "Desconsiderar a unidade de medida das grandezas fornecidas.",
          "Confundir conceitos fundamentais com suposições de senso comum."
        ],
        correctOptionIndex: 0,
        explanation: "O ENEM avalia competências e habilidades. A leitura atenta do texto de apoio e a aplicação direta do conceito científico com eliminação lógica de distratores garantem o acerto."
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiOptionSelect = (idx: number) => {
    if (aiAnswered) return;
    setAiSelectedOption(idx);
  };

  const handleSubmitAiAnswer = () => {
    if (aiSelectedOption === null || aiAnswered || !aiQuestion) return;
    setAiAnswered(true);
    setAiTotalCount(prev => prev + 1);
    if (aiSelectedOption === aiQuestion.correctOptionIndex) {
      setAiCorrectCount(prev => prev + 1);
    }
  };

  const handleBackToMenu = () => {
    setIsTimerActive(false);
    setActiveMode("select");
    setIsFinished(false);
  };

  const triMetrics = isFinished ? calculateTriMetrics() : null;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-zinc-100" id="simulados-view-root">
      
      {/* HEADER STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#e50914]/10 border border-[#e50914]/30 flex items-center justify-center text-[#e50914] shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight flex flex-wrap items-center gap-2.5">
              <span>Simuladores e Treinos <span className="text-[#e50914]">TRI EnemFlix</span></span>
              <span className="text-[10px] bg-[#e50914] text-white font-black px-2.5 py-0.5 rounded tracking-widest">
                TRI 2026
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Calibre sua nota de 0 a 1000 com simulados por matéria, bancas completas e Teoria de Resposta ao Item.
            </p>
          </div>
        </div>

        {activeMode !== "select" && (
          <button
            onClick={handleBackToMenu}
            className="self-start sm:self-auto px-4 py-2 bg-zinc-900 border border-white/10 hover:border-white/20 text-xs font-bold text-zinc-300 rounded flex items-center gap-2 transition cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#e50914]" />
            <span>Voltar aos Simulados</span>
          </button>
        )}
      </div>

      {/* MODE SELECTOR NAVIGATION TABS */}
      {activeMode === "select" && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab("simulados")}
              className={`px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "simulados"
                  ? "bg-[#e50914] text-white shadow-lg shadow-[#e50914]/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Simulados Extensivos TRI</span>
            </button>

            <button
              onClick={() => setActiveTab("materias")}
              className={`px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "materias"
                  ? "bg-[#e50914] text-white shadow-lg shadow-[#e50914]/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Simulados por Matéria</span>
            </button>

            <button
              onClick={() => setActiveTab("custom")}
              className={`px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "custom"
                  ? "bg-[#e50914] text-white shadow-lg shadow-[#e50914]/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Montar Simulado Custom</span>
            </button>

            <button
              onClick={() => setActiveTab("ia")}
              className={`px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                activeTab === "ia"
                  ? "bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-lg shadow-amber-500/10"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Gerador Infinito IA</span>
            </button>
          </div>

          {/* TAB 1: EXTENSIVE EXAMS (DIAS 1, 2, MARATONA) */}
          {activeTab === "simulados" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              
              {/* Dia 1 */}
              <div className="bg-[#141414] border border-white/5 hover:border-red-500/40 rounded-lg p-6 space-y-4 transition group flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      1º DIA ENEM
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">25 Qs • 60 min</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors">
                    Linguagens, Humanas & Redação
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Abarca Interpretação de Texto, Gramática, Literatura, História do Brasil, Geografia, Filosofia e Critérios Oficiais da Redação ENEM.
                  </p>
                </div>
                <button
                  onClick={() => startExtensiveExam("dia1")}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-xs font-black text-white rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Iniciar 1º Dia</span>
                </button>
              </div>

              {/* Dia 2 */}
              <div className="bg-[#141414] border border-white/5 hover:border-blue-500/40 rounded-lg p-6 space-y-4 transition group flex flex-col justify-between shadow-xl">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      2º DIA ENEM
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">25 Qs • 60 min</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors">
                    Matemática & Ciências da Natureza
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Testa Raciocínio Lógico-Matemático, Geometria, Funções, Estatística, Física, Química e Biologia com calibragem TRI.
                  </p>
                </div>
                <button
                  onClick={() => startExtensiveExam("dia2")}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-black text-white rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Iniciar 2º Dia</span>
                </button>
              </div>

              {/* Maratona Geral TRI */}
              <div className="bg-[#141414] border border-amber-500/30 hover:border-amber-500 rounded-lg p-6 space-y-4 transition group flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black px-3 py-1 rounded-bl uppercase tracking-widest">
                  PROVA COMPLETA
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      MARATONA TRI
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">45 Qs • 120 min</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                    Maratona Geral TRI Nacional
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Nossa simulação mais robusta com cálculo de nota TRI oficial de 0 a 1000 e relatório detalhado de coerência pedagógica.
                  </p>
                </div>
                <button
                  onClick={() => startExtensiveExam("maratona")}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:opacity-90 text-xs font-black text-white rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Iniciar Maratona 45 Qs</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: READY-MADE SUBJECT SIMULATIONS */}
          {activeTab === "materias" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {[
                { key: "matematica", title: "Matemática & Lógica", color: "text-red-500", desc: "Geometria, Porcentagem, Funções, Probabilidade e Análise Combinatória." },
                { key: "fisica", title: "Física & Ondulatória", color: "text-sky-400", desc: "Eletrodinâmica, Leis de Ohm, Termologia e Óptica." },
                { key: "quimica", title: "Química & Reações", color: "text-emerald-400", desc: "Termoquímica, Estequiometria, Soluções e Química Orgânica." },
                { key: "biologia", title: "Biologia & Saúde", color: "text-green-500", desc: "Ecologia, Citologia, Genética Mendeliana e Fisiologia." },
                { key: "historia", title: "História Geral & Brasil", color: "text-amber-500", desc: "Era Vargas, Brasil Colônia, Ditadura e Revoluções." },
                { key: "geografia", title: "Geografia & Meio Ambiente", color: "text-teal-400", desc: "Cerrado, Climas, Urbanização e Cartografia." },
                { key: "filosofia", title: "Filosofia & Sociologia", color: "text-purple-400", desc: "Sócrates, Kant, Durkheim e Fatos Sociais." },
                { key: "linguagens", title: "Linguagens & Redação", color: "text-pink-400", desc: "Gramática, Crase, Literatura, Inglês, Espanhol e Redação." },
              ].map((subj) => (
                <div key={subj.key} className="bg-[#141414] border border-white/5 hover:border-white/20 p-5 rounded-lg flex flex-col justify-between space-y-4 hover:bg-black/40 transition">
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${subj.color}`}>
                      Simulado Específico
                    </span>
                    <h4 className="text-sm font-black text-white mt-1">{subj.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">{subj.desc}</p>
                  </div>
                  <button
                    onClick={() => startSubjectExam(subj.key)}
                    className="w-full py-2 bg-zinc-900 hover:bg-[#e50914] text-zinc-300 hover:text-white text-xs font-black rounded transition cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Treinar {subj.title.split("&")[0]}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CUSTOM EXAM BUILDER */}
          {activeTab === "custom" && (
            <div className="bg-[#141414] border border-white/5 rounded-lg p-6 sm:p-8 max-w-xl mx-auto text-left space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#e50914]" />
                  <span>Gerador de Simulado Personalizado</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure o tamanho da prova, a área de conhecimento e a calibragem de dificuldade desejada.
                </p>
              </div>

              <div className="space-y-4">
                {/* Area Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Área do Conhecimento</label>
                  <select
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#e50914]"
                  >
                    <option value="todas">Todas as Áreas (Simulado Integrado Geral)</option>
                    <option value="matematica">Matemática e Suas Tecnologias</option>
                    <option value="natureza">Ciências da Natureza (Física, Química, Biologia)</option>
                    <option value="humanas">Ciências Humanas (História, Geografia, Filosofia)</option>
                    <option value="linguagens">Linguagens e Códigos (Língua Portuguesa, Redação)</option>
                  </select>
                </div>

                {/* Question Count Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Quantidade de Questões</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 25].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCustomCount(cnt)}
                        className={`py-2 text-xs font-bold rounded border cursor-pointer transition ${
                          customCount === cnt
                            ? "bg-[#e50914] text-white border-[#e50914]"
                            : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Select */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 uppercase">Calibragem de Dificuldade TRI</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "equilibrada", label: "Equilibrada (TRI)" },
                      { id: "facil", label: "Nivelamento (Fácil)" },
                      { id: "dificil", label: "Aprofundamento (Difícil)" },
                    ].map((diff) => (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setCustomDifficulty(diff.id)}
                        className={`py-2 px-1 text-[11px] font-bold rounded border cursor-pointer transition ${
                          customDifficulty === diff.id
                            ? "bg-[#e50914] text-white border-[#e50914]"
                            : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartCustomExam}
                  className="w-full py-3 bg-[#e50914] hover:bg-[#e50914]/90 text-xs font-black uppercase text-white rounded tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/20 mt-4"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Gerar e Iniciar Simulado Customizado</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: IA ADAPTATIVE GENERATOR */}
          {activeTab === "ia" && (
            <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded-lg p-6 sm:p-8 space-y-6 max-w-2xl mx-auto text-center">
              <BrainCircuit className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-amber-500 tracking-wider font-extrabold">Gerador Infinito por IA</span>
                <h3 className="text-xl font-black text-white uppercase">Treino de Questões Inéditas ENEM</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Gere questões personalizadas com distratores calibrados para qualquer assunto que você queira praticar agora.
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 max-w-md mx-auto space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Escolha um Tema Recomendado</label>
                  <select
                    value={aiSubjectInput}
                    onChange={(e) => {
                      setAiSubjectInput(e.target.value);
                      setCustomAiSubject("");
                    }}
                    className="w-full bg-black/60 border border-white/10 rounded p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
                  >
                    {PRESET_SUBJECTS.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="text-center text-xs text-zinc-600 font-bold uppercase py-0.5">Ou</div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Digite Qualquer Outro Assunto</label>
                  <input
                    type="text"
                    value={customAiSubject}
                    onChange={(e) => setCustomAiSubject(e.target.value)}
                    placeholder="Ex: Óptica, Imperialismo, Ácidos..."
                    className="w-full bg-black/60 border border-white/10 rounded p-2.5 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <button
                  onClick={() => {
                    setActiveMode("ai");
                    setTimeout(() => {
                      generateAiQuestion();
                    }, 50);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 hover:opacity-90 text-xs font-black text-white rounded uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/10"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Gerar Questão Inédita</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE EXAM WORKSPACE */}
      {(activeMode === "curated" || activeMode === "mini") && !isFinished && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/5 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
              <span className="uppercase text-red-500 font-black">{examTitle}</span>
              <div className="h-4 w-[1px] bg-white/10" />
              <span>Questão {currentIndex + 1} de {questions.length}</span>
              <div className="h-4 w-[1px] bg-white/10" />
              <span>Acertos: <span className="text-green-400 font-mono font-bold">{score}</span></span>
            </div>

            <div className="flex-grow max-w-xs h-2 bg-zinc-800 rounded-full overflow-hidden mx-4 hidden sm:block">
              <div 
                className="h-full bg-[#e50914] transition-all duration-300" 
                style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-4 py-1.5 rounded-full">
              <Timer className={`w-4 h-4 text-[#e50914] ${timeRemaining < 120 ? "animate-pulse" : ""}`} />
              <span className={`font-mono text-sm font-black ${timeRemaining < 120 ? "text-red-500" : ""}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            <div className="lg:col-span-8 bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded-lg p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                <span className="text-zinc-500 flex items-center gap-2">
                  <span>ENEM TRI</span>
                  {questions[currentIndex].triDifficulty && (
                    <span className="text-[10px] bg-zinc-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                      Nível: {questions[currentIndex].triDifficulty}
                    </span>
                  )}
                </span>
                <span className="bg-[#e50914]/15 text-[#e50914] px-2.5 py-1 rounded border border-[#e50914]/25">
                  {questions[currentIndex].subject}
                </span>
              </div>

              <div className="text-sm sm:text-base font-bold text-zinc-100 leading-relaxed bg-[#0a0a0a]/60 border border-white/5 p-5 rounded-md text-left">
                {questions[currentIndex].text}
              </div>

              <div className="space-y-3">
                {questions[currentIndex].options.map((option, idx) => {
                  const letter = ["A", "B", "C", "D", "E"][idx];
                  const isSelected = selectedOption === idx;
                  
                  let optionStyle = "bg-black/35 border-white/5 text-gray-300 hover:border-white/15 hover:bg-black/55";
                  if (isSelected) {
                    optionStyle = "bg-[#e50914]/10 border-[#e50914] text-[#e50914]";
                  }
                  if (isAnswered) {
                    if (idx === questions[currentIndex].correctOptionIndex) {
                      optionStyle = "bg-green-600/10 border-green-600 text-green-400 font-bold";
                    } else if (isSelected) {
                      optionStyle = "bg-[#e50914]/20 border-[#e50914] text-[#e50914]";
                    } else {
                      optionStyle = "bg-[#0a0a0a]/30 border-white/5 text-gray-600 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded text-left text-xs sm:text-sm border flex items-start gap-3.5 cursor-pointer transition-all ${optionStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected ? "bg-[#e50914] text-white" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {letter}
                      </span>
                      <span className="flex-grow pt-0.5 leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="p-5 bg-black/60 border border-white/10 rounded-md text-left space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {selectedOption === questions[currentIndex].correctOptionIndex ? (
                      <>
                        <CheckCircle2 className="w-4.5 h-4.5 text-green-500 fill-green-500/10" />
                        <span className="text-green-500 uppercase tracking-wider text-xs">Resposta Correta!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4.5 h-4.5 text-[#e50914]" />
                        <span className="text-[#e50914] uppercase tracking-wider text-xs">
                          Incorreto. A correta era a letra {["A", "B", "C", "D", "E"][questions[currentIndex].correctOptionIndex]}.
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1.5 border-t border-white/5">
                    <strong className="text-white block mb-1">Explicação Pedagógica:</strong> {questions[currentIndex].explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    showScratchpad ? "bg-amber-500/15 border border-amber-500 text-amber-500" : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>Rascunho de Cálculos</span>
                </button>

                <div>
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null}
                      className="bg-[#e50914] hover:bg-[#e50914]/90 text-white font-black px-6 py-2.5 rounded text-xs uppercase tracking-wider cursor-pointer transition disabled:opacity-40 shadow-lg shadow-[#e50914]/20"
                    >
                      Responder
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="bg-white hover:bg-zinc-200 text-black font-black px-6 py-2.5 rounded text-xs uppercase tracking-wider cursor-pointer transition flex items-center gap-2"
                    >
                      <span>{currentIndex === questions.length - 1 ? "Ver Resultado TRI" : "Próxima Questão"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showScratchpad && (
              <div className="lg:col-span-4 bg-[#141414] border border-amber-500/10 ring-1 ring-amber-500/20 rounded-lg p-5 flex flex-col justify-between shadow-2xl h-fit text-left space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-black uppercase text-amber-500 flex items-center gap-1.5">
                    <FileEdit className="w-4 h-4" />
                    <span>Rascunho Digital</span>
                  </span>
                  <button onClick={() => setShowScratchpad(false)} className="text-zinc-500 hover:text-zinc-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Escreva seus cálculos aqui..."
                  className="w-full h-72 bg-black/40 border border-white/5 rounded p-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500/40"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI GENERATOR MODE */}
      {activeMode === "ai" && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/5 rounded-lg p-5 text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-amber-500 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Gerador IA EnemFlix</span>
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">Treino Adaptativo de Questões Inéditas</h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold bg-black/60 px-4 py-2 rounded border border-white/5">
                <div>Total: <span className="text-white font-mono">{aiTotalCount}</span></div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div>Acertos: <span className="text-green-400 font-mono">{aiCorrectCount}</span></div>
              </div>
            </div>

            <button
              onClick={generateAiQuestion}
              disabled={aiLoading}
              className="py-2.5 px-6 bg-gradient-to-r from-amber-600 to-red-600 text-xs font-black uppercase text-white rounded cursor-pointer hover:opacity-90"
            >
              {aiLoading ? "Gerando Questão..." : "Gerar Nova Questão de " + (customAiSubject || aiSubjectInput)}
            </button>
          </div>

          {aiQuestion && !aiLoading && (
            <div className="bg-[#141414] border border-white/5 rounded-lg p-6 sm:p-8 text-left space-y-6">
              <span className="text-amber-500 font-bold text-xs uppercase">{aiQuestion.subject}</span>
              <div className="text-sm sm:text-base font-bold text-zinc-100 bg-black/50 p-5 rounded border border-white/5">
                {aiQuestion.text}
              </div>

              <div className="space-y-3">
                {aiQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAiOptionSelect(idx)}
                    disabled={aiAnswered}
                    className={`w-full p-4 rounded text-left text-xs sm:text-sm border cursor-pointer transition ${
                      aiSelectedOption === idx ? "bg-amber-500/20 border-amber-500 text-amber-300" : "bg-black/30 border-white/5 text-zinc-300"
                    }`}
                  >
                    <strong className="mr-2">{["A", "B", "C", "D", "E"][idx]}.</strong> {opt}
                  </button>
                ))}
              </div>

              {!aiAnswered ? (
                <button
                  onClick={handleSubmitAiAnswer}
                  disabled={aiSelectedOption === null}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-black px-6 py-2.5 rounded text-xs uppercase"
                >
                  Conferir Resposta
                </button>
              ) : (
                <div className="p-4 bg-black/60 rounded border border-white/10 text-xs text-zinc-300 space-y-2">
                  <span className="font-bold text-amber-400 block">Explicação da IA:</span>
                  <p>{aiQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* COMPLETED EXAM RESULTS SCREEN WITH FULL TRI REPORT */}
      {isFinished && triMetrics && (
        <div className="bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded-lg p-6 sm:p-10 space-y-8 shadow-2xl text-center max-w-3xl mx-auto animate-fade-in">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#e50914]/20 to-red-500/20 text-[#e50914] border-2 border-[#e50914]/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Relatório da Nota TRI ENEM</h2>
              <p className="text-gray-400 text-xs sm:text-sm">{examTitle}</p>
            </div>

            {/* Main TRI Score Banner */}
            <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-red-950/40 border border-[#e50914]/30 p-6 rounded-lg text-center space-y-2">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block">Sua Nota Estimada TRI</span>
              <div className="text-5xl font-black text-white font-mono tracking-tight">
                {triMetrics.finalTriScore} <span className="text-xs font-bold text-red-500">/ 1000 PONTOS</span>
              </div>
              <div className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase mt-2">
                {triMetrics.coherenceStatus}
              </div>
            </div>

            {/* Detailed Performance Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-black/40 border border-white/5 p-4 rounded space-y-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase">Questões Fáceis</span>
                <p className="text-xl font-black text-white font-mono">{triMetrics.hitsFacil} / {triMetrics.totalFacil}</p>
                <span className="text-[10px] text-zinc-500">Base da Coerência TRI</span>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded space-y-1">
                <span className="text-[10px] font-black text-amber-400 uppercase">Questões Médias</span>
                <p className="text-xl font-black text-white font-mono">{triMetrics.hitsMedio} / {triMetrics.totalMedio}</p>
                <span className="text-[10px] text-zinc-500">Consolidação e Ganho</span>
              </div>

              <div className="bg-black/40 border border-white/5 p-4 rounded space-y-1">
                <span className="text-[10px] font-black text-red-400 uppercase">Questões Difíceis</span>
                <p className="text-xl font-black text-white font-mono">{triMetrics.hitsDificil} / {triMetrics.totalDificil}</p>
                <span className="text-[10px] text-zinc-500">Aprofundamento Máximo</span>
              </div>
            </div>

            {/* Pedagogical Commentary */}
            <div className="p-4 bg-zinc-900/60 rounded border border-white/5 text-xs text-zinc-300 leading-relaxed text-left space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#e50914]" />
                <span>Análise de Coerência Teoria de Resposta ao Item (TRI):</span>
              </span>
              <p>{triMetrics.coherenceNote}</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 justify-center pt-2">
              <button
                onClick={handleBackToMenu}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Menu de Simulados</span>
              </button>
              
              <button
                onClick={() => {
                  startExam(examTitle, questions, questions.length * 120, "mini");
                }}
                className="bg-[#e50914] hover:bg-[#e50914]/90 text-white font-bold py-3 px-6 rounded text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Refazer Prova</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
