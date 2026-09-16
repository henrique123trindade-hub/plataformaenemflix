import React, { useState, useEffect, useMemo } from "react";
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  X, 
  RefreshCw, 
  Search, 
  UserX, 
  UserCheck, 
  Clock, 
  Calendar, 
  Power, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  RotateCcw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Users,
  Compass
} from "lucide-react";

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  targetCourse?: string;
  targetScore?: number;
  type: "auth" | "guest" | "google";
  createdAt: string;
  lastLoginAt: string;
  lastActiveAt?: string;
  loginCount: number;
  isBanned: boolean;
  bannedAt?: string;
  banReason?: string;
  isDisconnected: boolean;
  disconnectedAt?: string;
  daysUsing: number;
  daysRemaining: number;
  isExpired: boolean;
  progressPercentage: number;
  timeUsingFormatted: string;
  status: "active" | "disconnected" | "banned" | "expired";
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("enemflix_admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "disconnected" | "banned" | "expired">("all");
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  // Esc key listener to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Load users when authenticated
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: {
          "x-admin-password": "pirulitobaby"
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        // If password was invalidated
        if (res.status === 401) {
          setIsAuthenticated(false);
          sessionStorage.removeItem("enemflix_admin_auth");
        }
      }
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchUsers();
    }
  }, [isOpen, isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError("Insira a senha de administrador.");
      return;
    }

    setIsSubmittingPassword(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("enemflix_admin_auth", "true");
        setPasswordInput("");
        fetchUsers();
      } else {
        setPasswordError("Senha incorreta. Acesso não autorizado.");
      }
    } catch (err: any) {
      setPasswordError("Erro ao autenticar. Tente novamente.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("enemflix_admin_auth");
    setPasswordInput("");
  };

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => {
      setActionMessage(null);
    }, 4000);
  };

  // User Actions
  const handleToggleDisconnect = async (user: AdminUser) => {
    const endpoint = user.isDisconnected ? "/api/admin/reconnect" : "/api/admin/disconnect";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "pirulitobaby"
        },
        body: JSON.stringify({ uid: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          user.isDisconnected ? `Sessão de ${user.name} restabelecida.` : `Usuário ${user.name} desconectado!`
        );
        fetchUsers();
      } else {
        showNotification(data.error || "Erro na ação.", "error");
      }
    } catch (e: any) {
      showNotification("Erro ao processar solicitação.", "error");
    }
  };

  const handleToggleBan = async (user: AdminUser) => {
    const newBannedState = !user.isBanned;
    try {
      const res = await fetch("/api/admin/ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "pirulitobaby"
        },
        body: JSON.stringify({ uid: user.uid, banned: newBannedState })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          newBannedState ? `Usuário ${user.name} foi BANIDO.` : `Banimento de ${user.name} foi revogado.`
        );
        fetchUsers();
      } else {
        showNotification(data.error || "Erro na ação.", "error");
      }
    } catch (e: any) {
      showNotification("Erro ao processar solicitação.", "error");
    }
  };

  const handleResetTime = async (user: AdminUser) => {
    try {
      const res = await fetch("/api/admin/reset-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "pirulitobaby"
        },
        body: JSON.stringify({ uid: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Limite de 365 dias renovado para ${user.name}!`);
        fetchUsers();
      } else {
        showNotification(data.error || "Erro ao renovar.", "error");
      }
    } catch (e) {
      showNotification("Erro de conexão ao renovar tempo.", "error");
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Deseja remover o registro de login de ${user.name}?`)) return;
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "pirulitobaby"
        },
        body: JSON.stringify({ uid: user.uid })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Registro de ${user.name} removido.`);
        fetchUsers();
      }
    } catch (e) {
      showNotification("Erro ao excluir usuário.", "error");
    }
  };

  const handleCopyEmail = (email: string, uid: string) => {
    navigator.clipboard.writeText(email);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Helper date formatter
  const formatDatePtBr = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSec < 60) return "agora mesmo";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `há ${diffMin} min`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `há ${diffHours} h`;
      const diffDays = Math.floor(diffHours / 24);
      return `há ${diffDays} d`;
    } catch {
      return "";
    }
  };

  // Filter and search
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Status filter
      if (filterStatus !== "all" && user.status !== filterStatus) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = user.name?.toLowerCase().includes(term);
        const matchesEmail = user.email?.toLowerCase().includes(term);
        const matchesUid = user.uid?.toLowerCase().includes(term);
        const matchesCourse = user.targetCourse?.toLowerCase().includes(term);
        return matchesName || matchesEmail || matchesUid || matchesCourse;
      }
      return true;
    });
  }, [users, filterStatus, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      disconnected: users.filter(u => u.status === "disconnected").length,
      banned: users.filter(u => u.status === "banned").length,
      expired: users.filter(u => u.status === "expired").length
    };
  }, [users]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* 1. PASSWORD PROMPT MODAL */}
      {!isAuthenticated ? (
        <div className="w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition p-1 rounded-lg"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#e50914]/15 border border-[#e50914]/30 flex items-center justify-center text-[#e50914] mb-4 shadow-lg shadow-[#e50914]/10">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e50914] bg-[#e50914]/10 px-2.5 py-0.5 rounded-full border border-[#e50914]/20 mb-2">
              Acesso F3
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">Painel Administrativo</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Digite a senha mestra para visualizar e gerenciar todos os logins e permissões.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Senha de Administrador</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  autoFocus
                  placeholder="Digite a senha..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-500 hover:text-zinc-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="w-full bg-[#e50914] hover:bg-[#b80710] text-white font-bold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/20 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingPassword ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-zinc-600 mt-5">
            Pressione <kbd className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[9px] border border-zinc-700">ESC</kbd> para fechar a qualquer momento.
          </p>
        </div>
      ) : (

        /* 2. AUTHENTICATED ADMIN DASHBOARD */
        <div className="w-full max-w-6xl max-h-[92vh] bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-[#141414] border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914] shrink-0 shadow">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white tracking-tight">Painel Administrativo EnemFlix</h2>
                  <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Sessão Master
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Gerenciamento de acessos, histórico de logins e limite de 365 dias
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={fetchUsers}
                disabled={isLoading}
                title="Atualizar lista"
                className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg border border-white/5 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#e50914]" : ""}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>

              <button
                onClick={handleLogoutAdmin}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold transition border border-white/5 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                title="Fechar (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionMessage && (
            <div className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 transition ${
              actionMessage.type === "success" 
                ? "bg-emerald-950/60 text-emerald-300 border-b border-emerald-800/40" 
                : "bg-red-950/60 text-red-300 border-b border-red-800/40"
            }`}>
              {actionMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Top Metric Cards */}
          <div className="p-6 pb-4 border-b border-white/5 bg-[#121212]/50 shrink-0">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {/* Total */}
              <div 
                onClick={() => setFilterStatus("all")}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  filterStatus === "all" ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-zinc-400 mb-1">
                  <span className="text-[11px] font-semibold">Total Logins</span>
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-white">{stats.total}</div>
                <span className="text-[10px] text-zinc-500">Cadastros e acessos</span>
              </div>

              {/* Ativos */}
              <div 
                onClick={() => setFilterStatus("active")}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  filterStatus === "active" ? "bg-emerald-950/30 border-emerald-500/40" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-[11px] font-semibold">Ativos</span>
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-emerald-400">{stats.active}</div>
                <span className="text-[10px] text-emerald-600">Acesso liberado</span>
              </div>

              {/* Desconectados */}
              <div 
                onClick={() => setFilterStatus("disconnected")}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  filterStatus === "disconnected" ? "bg-amber-950/30 border-amber-500/40" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-[11px] font-semibold">Desconectados</span>
                  <Power className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-amber-400">{stats.disconnected}</div>
                <span className="text-[10px] text-amber-600">Sessão suspensa</span>
              </div>

              {/* Banidos */}
              <div 
                onClick={() => setFilterStatus("banned")}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  filterStatus === "banned" ? "bg-red-950/30 border-red-500/40" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-red-400 mb-1">
                  <span className="text-[11px] font-semibold">Banidos</span>
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-red-400">{stats.banned}</div>
                <span className="text-[10px] text-red-600">Acesso revogado</span>
              </div>

              {/* Expirados */}
              <div 
                onClick={() => setFilterStatus("expired")}
                className={`p-3 rounded-xl border col-span-2 sm:col-span-1 transition cursor-pointer ${
                  filterStatus === "expired" ? "bg-orange-950/30 border-orange-500/40" : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between text-orange-400 mb-1">
                  <span className="text-[11px] font-semibold">&gt; 365 Dias</span>
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="text-xl font-black text-orange-400">{stats.expired}</div>
                <span className="text-[10px] text-orange-600">Limite de 1 ano</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-6 py-3 border-b border-white/5 bg-[#141414] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, e-mail ou UID..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e50914] transition"
              />
            </div>

            {/* Quick Filter tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {(["all", "active", "disconnected", "banned", "expired"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterStatus === tab 
                      ? "bg-[#e50914] text-white shadow" 
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab === "all" && "Todos"}
                  {tab === "active" && "Ativos"}
                  {tab === "disconnected" && "Desconectados"}
                  {tab === "banned" && "Banidos"}
                  {tab === "expired" && "Expirados (1 Ano)"}
                </button>
              ))}
            </div>
          </div>

          {/* Users List Table */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {isLoading && users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <RefreshCw className="w-8 h-8 animate-spin text-[#e50914] mb-3" />
                <p className="text-xs">Carregando registros de login...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500 text-center">
                <UserX className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-bold text-zinc-300">Nenhum login encontrado</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {searchTerm ? "Tente alterar os termos de busca." : "Nenhum usuário cadastrado nesta categoria."}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isBanned = user.isBanned;
                const isDisconnected = user.isDisconnected;
                const isExpired = user.isExpired;

                return (
                  <div
                    key={user.uid}
                    className={`border rounded-xl p-4 transition-all duration-200 ${
                      isBanned 
                        ? "bg-red-950/20 border-red-900/40" 
                        : isDisconnected
                        ? "bg-amber-950/20 border-amber-900/40"
                        : isExpired
                        ? "bg-orange-950/20 border-orange-900/40"
                        : "bg-[#141414] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* User Info Column */}
                      <div className="flex items-start gap-3 min-w-[280px]">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow ${
                          isBanned
                            ? "bg-red-950 border-red-800 text-red-400"
                            : isDisconnected
                            ? "bg-amber-950 border-amber-800 text-amber-400"
                            : isExpired
                            ? "bg-orange-950 border-orange-800 text-orange-400"
                            : "bg-[#e50914]/20 border-[#e50914]/30 text-[#e50914]"
                        }`}>
                          {user.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">{user.name}</span>
                            
                            {/* Type badge */}
                            {user.type === "guest" || user.email.includes("convidado") ? (
                              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 flex items-center gap-1">
                                <Compass className="w-2.5 h-2.5 text-zinc-400" />
                                Convidado F2
                              </span>
                            ) : (
                              <span className="text-[10px] bg-blue-950/60 text-blue-400 px-2 py-0.5 rounded border border-blue-800/50">
                                Aluno Cadastrado
                              </span>
                            )}

                            {/* Status Badge */}
                            {isBanned ? (
                              <span className="text-[10px] bg-red-950 text-red-400 font-bold px-2 py-0.5 rounded border border-red-800">
                                Banido
                              </span>
                            ) : isDisconnected ? (
                              <span className="text-[10px] bg-amber-950 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-800">
                                Desconectado
                              </span>
                            ) : isExpired ? (
                              <span className="text-[10px] bg-orange-950 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-800">
                                Expirado (&gt;365d)
                              </span>
                            ) : (
                              <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                                Ativo
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <span className="truncate max-w-[200px] sm:max-w-xs">{user.email}</span>
                            <button
                              onClick={() => handleCopyEmail(user.email, user.uid)}
                              className="text-zinc-500 hover:text-zinc-300 transition"
                              title="Copiar e-mail"
                            >
                              {copiedUid === user.uid ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            {user.targetCourse && (
                              <span className="text-[11px] text-zinc-500">• {user.targetCourse}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Login Timestamps Column */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                        
                        {/* Último Login */}
                        <div className="space-y-1">
                          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>Último Login Efetuado</span>
                          </div>
                          <div className="font-semibold text-zinc-200">
                            {formatDatePtBr(user.lastLoginAt)}
                          </div>
                          <div className="text-[10px] text-[#e50914] font-medium">
                            {formatRelativeTime(user.lastLoginAt)} ({user.loginCount || 1} acesso{user.loginCount > 1 ? "s" : ""})
                          </div>
                        </div>

                        {/* Tempo usando o site (Limite 365 dias) */}
                        <div className="space-y-1 min-w-[200px]">
                          <div className="text-[11px] text-zinc-500 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-zinc-400" />
                              <span>Tempo de Uso (Limite 1 ano)</span>
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400">
                              {user.daysUsing || 0} / 365 dias
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                              className={`h-full transition-all duration-300 ${
                                user.progressPercentage >= 100
                                  ? "bg-red-500"
                                  : user.progressPercentage > 80
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(2, user.progressPercentage || 1))}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400 font-medium">
                              {user.timeUsingFormatted || "0 dias"}
                            </span>
                            <span className={user.daysRemaining <= 30 ? "text-red-400 font-bold" : "text-zinc-500"}>
                              {user.daysRemaining > 0 ? `${user.daysRemaining} dias restantes` : "Período Esgotado"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls / Actions Buttons */}
                      <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-2 lg:pt-0">
                        {/* Botão Desconectar / Reconectar */}
                        <button
                          onClick={() => handleToggleDisconnect(user)}
                          title={isDisconnected ? "Restabelecer sessão do usuário" : "Desconectar sessão imediatamente"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            isDisconnected
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                              : "bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 border border-white/5"
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{isDisconnected ? "Reconectar" : "Desconectar"}</span>
                        </button>

                        {/* Botão Banir / Desbanir */}
                        <button
                          onClick={() => handleToggleBan(user)}
                          title={isBanned ? "Desbanir este usuário" : "Banir conta e bloquear acesso"}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            isBanned
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                              : "bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60"
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>{isBanned ? "Desbanir" : "Banir"}</span>
                        </button>

                        {/* Botão Renovar Prazo 365d */}
                        <button
                          onClick={() => handleResetTime(user)}
                          title="Renovar limite de 1 ano (zerar contagem para mais 365 dias)"
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg border border-white/5 transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        {/* Botão Excluir */}
                        <button
                          onClick={() => handleDeleteUser(user)}
                          title="Excluir este registro do histórico"
                          className="p-1.5 bg-white/5 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 rounded-lg border border-white/5 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-[#141414] border-t border-white/10 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Limite padrão do sistema: <strong>365 dias (1 ano)</strong> para todos os logins.</span>
            </div>
            <div className="text-[11px] text-zinc-600">
              Atalho secreto de acesso: <strong>F3</strong> • Senha: <strong>pirulitobaby</strong>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
