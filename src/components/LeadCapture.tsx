import React, { useState, useEffect } from "react";
import { LeadProfile } from "../types";
import { Sparkles, Mail, Lock, User as UserIcon, Phone as PhoneIcon, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  doc,
  setDoc,
  getDoc
} from "../lib/firebase";

interface LeadCaptureProps {
  onCapture: (profile: LeadProfile) => void;
  alertMessage?: string;
  onOpenAdmin?: () => void;
}

export default function LeadCapture({ onCapture, alertMessage, onOpenAdmin }: LeadCaptureProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [targetCourse, setTargetCourse] = useState("Medicina");
  const [targetScore, setTargetScore] = useState(750);
  const [error, setError] = useState(alertMessage || "");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (alertMessage) {
      setError(alertMessage);
    }
  }, [alertMessage]);

  const syncLoginWithServer = async (p: LeadProfile, type: "auth" | "guest" | "google") => {
    try {
      const res = await fetch("/api/auth/record-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: p.uid,
          email: p.email,
          name: p.name,
          phone: p.phone,
          targetCourse: p.targetCourse,
          targetScore: p.targetScore,
          type
        })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn("Aviso ao registrar login no servidor:", e);
      return { success: true };
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 15) {
      setPhone(formatted);
    }
  };

  // Email and Password Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      // 1. Cadastrar diretamente no banco de dados do servidor
      const regResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          phone: phone.trim(),
          targetCourse,
          targetScore
        })
      });

      const regData = await regResponse.json();
      if (!regResponse.ok || !regData.success) {
        setIsLoading(false);
        setError(regData.error || "Não foi possível criar a conta. Tente novamente.");
        return;
      }

      const serverUser = regData.user;
      let finalUid = serverUser.uid;

      // 2. Sincronizar em paralelo com Firebase Auth (se ativo)
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        finalUid = userCredential.user.uid;
      } catch (fbErr: any) {
        console.warn("[Firebase Register notice - conta salva com sucesso no banco]", fbErr);
      }

      const profile: LeadProfile = {
        name: serverUser.name || name.trim(),
        email: serverUser.email || email.trim(),
        phone: serverUser.phone || phone.trim(),
        targetCourse: serverUser.targetCourse || targetCourse,
        targetScore: serverUser.targetScore || targetScore,
        isLeadCaptured: true,
        uid: finalUid,
        createdAt: serverUser.createdAt || new Date().toISOString()
      };

      // 3. Salvar perfil localmente
      localStorage.setItem("enemflix_user_profile", JSON.stringify(profile));

      // 4. Salvar documento no Firestore
      try {
        await Promise.race([
          setDoc(doc(db, "users", finalUid), {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            targetCourse: profile.targetCourse,
            targetScore: profile.targetScore,
            createdAt: profile.createdAt,
            streak: 1,
            lastStudyDate: new Date().toISOString()
          }),
          new Promise((resolve) => setTimeout(resolve, 2000))
        ]);
      } catch (fsErr) {
        console.warn("[Firestore sync warning]", fsErr);
      }

      onCapture(profile);
    } catch (err: any) {
      console.error("[Register Error]", err);
      setError("Ocorreu um erro ao criar sua conta: " + (err.message || "Tente novamente."));
    } finally {
      setIsLoading(false);
    }
  };

  // Email and Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      // 1. Autenticar diretamente no banco de dados do servidor
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok || !loginData.success) {
        setIsLoading(false);
        setError(loginData.error || "E-mail ou senha incorretos.");
        return;
      }

      const serverUser = loginData.user;
      let finalUid = serverUser.uid;

      // 2. Sincronizar em paralelo com Firebase Auth (se disponível)
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        finalUid = userCredential.user.uid;
      } catch (fbErr) {
        console.warn("[Firebase Login notice - autenticado pelo banco de dados]", fbErr);
      }

      const profile: LeadProfile = {
        name: serverUser.name || email.split("@")[0],
        email: serverUser.email || email.trim(),
        phone: serverUser.phone || "",
        targetCourse: serverUser.targetCourse || "Medicina",
        targetScore: serverUser.targetScore || 750,
        isLeadCaptured: true,
        uid: finalUid,
        createdAt: serverUser.createdAt || new Date().toISOString()
      };

      localStorage.setItem("enemflix_user_profile", JSON.stringify(profile));

      // Atualizar preferências do Firestore em segundo plano se existirem
      try {
        const userDocRef = doc(db, "users", finalUid);
        getDoc(userDocRef).then((snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.targetCourse) profile.targetCourse = data.targetCourse;
            if (data.targetScore) profile.targetScore = data.targetScore;
            localStorage.setItem("enemflix_user_profile", JSON.stringify(profile));
          }
        }).catch(() => {});
      } catch (e) {}

      onCapture(profile);
    } catch (err: any) {
      console.error("[Login Error]", err);
      setError("Erro ao realizar login: " + (err.message || "Verifique seus dados."));
    } finally {
      setIsLoading(false);
    }
  };

  // Password Recovery
  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, insira o seu e-mail.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err: any) {
      console.error("[Reset Password Error]", err);
      setError("Erro ao enviar e-mail de recuperação: " + (err.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // Hidden Guest Access via F2
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === "F2" || e.code === "F2") {
        e.preventDefault();
        const guestUid = "guest_" + Date.now();
        const guestProfile: LeadProfile = {
          name: "Estudante Convidado",
          email: "convidado@enemflix.com",
          phone: "",
          targetCourse: "Medicina",
          targetScore: 700,
          isLeadCaptured: true,
          isGuest: true,
          uid: guestUid,
          createdAt: new Date().toISOString()
        };

        const syncResult = await syncLoginWithServer(guestProfile, "guest");
        if (syncResult && syncResult.isBanned) {
          setError("O acesso como convidado está desativado pelo administrador.");
          return;
        }

        onCapture(guestProfile);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCapture]);

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-black px-4 py-12 overflow-hidden select-none"
      id="lead-container"
    >
      {/* Cinematic grid background */}
      <div className="absolute inset-0 z-0 opacity-25">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/95 z-10" />
        <div className="grid grid-cols-6 gap-3 rotate-12 scale-125 translate-y-[-10%] opacity-15">
          {Array.from({ length: 24 }).map((_, i) => (
            <div 
              key={i} 
              className="h-44 rounded bg-zinc-900 border border-zinc-800 overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1515847049296-a281d6401047?auto=format&fit=crop&w=150&q=50" 
                alt="EnemFlix Poster" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg bg-[#141414] border border-white/10 rounded sm:p-10 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-1">
            <h1 className="text-[#e50914] text-4xl font-black tracking-tighter">ENEMFLIX</h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            Maratone seus estudos, trace seu plano e garanta sua aprovação no ENEM.
          </p>
          <div className="mt-3.5 inline-flex items-center gap-1.5 bg-red-950/20 border border-red-900/40 px-3 py-1 rounded-full text-[11px] text-red-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Sincronização & Progresso Inteligente</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-900/20 border border-red-800/40 text-red-300 text-xs rounded text-left">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-xs rounded text-left">
            {success}
          </div>
        )}

        {/* 1. SIGN IN MODE */}
        {mode === "signin" && (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[10px] font-bold text-zinc-500 hover:text-white transition cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Sua senha secreta..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-10 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e50914] hover:bg-[#ff1a26] disabled:bg-zinc-800 text-white font-extrabold py-3 rounded text-xs transition shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Entrar no ENEMFLIX</span>
              )}
            </button>
          </form>
        )}

        {/* 2. SIGN UP MODE */}
        {mode === "signup" && (
          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-4 w-4 text-zinc-500" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Nome..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded pl-9 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                  WhatsApp
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <PhoneIcon className="h-4 w-4 text-zinc-500" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-white/5 border border-white/10 rounded pl-9 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#71717a] text-[10px] font-black uppercase tracking-wider mb-1.5">
                Definir Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-10 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                  Curso Objetivo
                </label>
                <select
                  value={targetCourse}
                  onChange={(e) => setTargetCourse(e.target.value)}
                  className="w-full bg-[#141414] border border-white/10 rounded p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition cursor-pointer"
                >
                  <option value="Medicina">Medicina</option>
                  <option value="Direito">Direito</option>
                  <option value="Engenharia">Engenharia</option>
                  <option value="Psicologia">Psicologia</option>
                  <option value="Administração">Administração</option>
                  <option value="Ciência da Computação">Computação</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                  Meta de Média (ENEM)
                </label>
                <input
                  type="number"
                  min="400"
                  max="1000"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e50914] hover:bg-[#ff1a26] disabled:bg-zinc-800 text-white font-extrabold py-3 rounded text-xs transition shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Criar Conta & Começar</span>
              )}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {mode === "forgot" && (
          <form onSubmit={handlePasswordRecovery} className="space-y-4 text-left">
            <div>
              <label className="block text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
                Seu e-mail de cadastro
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#e50914] transition"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setSuccess("");
                  setError("");
                }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 bg-[#e50914] hover:bg-[#ff1a26] disabled:bg-zinc-800 text-white font-extrabold py-2.5 rounded text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Recuperar Senha</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Toggle options */}
        {mode !== "forgot" && (
          <div className="mt-5 text-center text-xs">
            {mode === "signin" ? (
              <p className="text-zinc-400">
                Novo por aqui?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="text-[#e50914] font-black hover:underline cursor-pointer"
                >
                  Crie sua conta.
                </button>
              </p>
            ) : (
              <p className="text-zinc-400">
                Já tem uma conta?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setError("");
                  }}
                  className="text-[#e50914] font-black hover:underline cursor-pointer"
                >
                  Conecte-se aqui.
                </button>
              </p>
            )}
          </div>
        )}

        {/* Confidential footer */}
        <p className="text-center text-[9px] text-zinc-500 mt-5 leading-relaxed">
          Sua privacidade é nossa prioridade. Ao continuar, você aceita o armazenamento seguro dos seus dados de estudo.
        </p>

        {/* Discrete Admin Link */}
        {onOpenAdmin && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-600">
            <span>EnemFlix v2.5</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded hover:bg-white/5"
              title="Acessar Painel Administrativo (Atalho: F3)"
            >
              <Shield className="w-3 h-3 text-[#e50914]" />
              <span>Painel Admin (F3)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
