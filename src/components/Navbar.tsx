import React, { useState, useEffect } from "react";
import { Search, Bell, Flame, Award, User, LogOut, Menu, X, Brain } from "lucide-react";
import { UserStats, LeadProfile } from "../types";

interface NavbarProps {
  userProfile: LeadProfile;
  userStats: UserStats;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout: () => void;
}

export default function Navbar({
  userProfile,
  userStats,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onLogout
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Início" },
    { id: "disciplinas", label: "Matérias" },
    { id: "redacao-treino", label: "Treino de Redação" },
    { id: "simulados", label: "Simulados" },
    { id: "ai", label: "EnemFlix AI", highlight: true },
    { id: "profile", label: "Meu Perfil" }
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? "bg-black/95 shadow-xl backdrop-blur-md py-3" : "bg-gradient-to-b from-black/80 to-transparent py-4"
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Side: Logo & Tabs */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => setActiveTab("home")} 
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <h1 className="text-[#e50914] text-2xl sm:text-3xl font-black tracking-tighter transition-transform hover:scale-[1.02] duration-300">
              ENEMFLIX
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchQuery("");
                }}
                className={`text-sm font-medium transition-all duration-200 relative py-1 cursor-pointer ${
                  item.highlight 
                    ? "text-[#e50914] hover:text-[#ff1a26] font-bold flex items-center gap-1"
                    : activeTab === item.id 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {item.highlight && <Brain className="w-3.5 h-3.5 text-[#e50914]" />}
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#e50914] rounded-full transition-all" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tools, Gamification, Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </span>
            <input
              type="text"
              placeholder="Buscar por assunto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 lg:w-60 bg-white/10 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#e50914] focus:w-64 transition-all"
            />
          </div>

          {/* Daily Streak (Flame) */}
          <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-950/20 border border-orange-900/30 px-2.5 py-1 rounded-full shadow-inner cursor-default" title="Dias seguidos de estudos">
            <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
            <span>{userStats.streak} d</span>
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 text-white bg-zinc-800/80 hover:bg-zinc-700 p-1.5 sm:p-2 rounded-full border border-zinc-700 cursor-pointer focus:outline-none"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                {userProfile.name.split(" ")[0]}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-[#141414] border border-white/10 rounded shadow-2xl py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs text-gray-400">Logado como</p>
                  <p className="text-sm font-bold text-white truncate">{userProfile.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{userProfile.email}</p>
                  <div className="mt-2 text-xs font-bold text-[#e50914] flex items-center justify-between">
                    <span>Meta: {userProfile.targetCourse}</span>
                    <span>{userProfile.targetScore} pts</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Meu Perfil</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("redacao-treino");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-gray-400" />
                  <span>Treinar Redação</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#e50914] hover:bg-white/10 transition flex items-center gap-2 border-t border-white/5 mt-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Plataforma</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Hidden as we now use the dedicated premium bottom tab bar */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hidden text-gray-400 hover:text-white p-1 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-4 py-4 space-y-3 z-50">
          <div className="relative mb-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </span>
            <input
              type="text"
              placeholder="Buscar por assunto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e50914]"
            />
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchQuery("");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded text-sm font-semibold transition cursor-pointer ${
                item.highlight
                  ? "bg-[#e50914]/20 text-[#e50914] border border-[#e50914]/30 flex items-center gap-2"
                  : activeTab === item.id
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.highlight && <Brain className="w-4 h-4 text-[#e50914]" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
