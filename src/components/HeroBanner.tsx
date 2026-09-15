import React from "react";
import { Play, Plus, Check, Info, Sparkles, Volume2 } from "lucide-react";
import { Video } from "../types";

interface HeroBannerProps {
  onPlay: (video: Video) => void;
  featuredVideo: Video;
  isBookmarked: boolean;
  onToggleBookmark: (videoId: string) => void;
}

export default function HeroBanner({
  onPlay,
  featuredVideo,
  isBookmarked,
  onToggleBookmark
}: HeroBannerProps) {
  return (
    <div 
      className="relative h-[480px] sm:h-[600px] md:h-[680px] w-full flex items-center bg-[#0a0a0a] overflow-hidden"
      id="hero-banner"
    >
      {/* Background Poster Image with Gradients */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200" 
          alt="EnemFlix Featured Poster"
          className="w-full h-full object-cover object-center opacity-60 scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Dark Overlays: Horizontal & Vertical */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-24">
        <div className="max-w-2xl text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#e50914]/15 border border-[#e50914]/35 px-3 py-1 rounded text-[#e50914] text-xs font-bold uppercase tracking-widest mb-4 select-none">
            <span className="bg-[#e50914] text-white text-[10px] px-1.5 py-0.5 font-bold rounded">TOP 1</span>
            <span className="text-xs font-bold uppercase tracking-widest">Aulas Mais Vistas de Hoje</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-lg">
            Redação <br />
            <span className="text-[#e50914]">Nota 1000</span>
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium mt-4">
            <span className="text-green-500 font-bold">98% de Relevância</span>
            <span>2026</span>
            <span className="border border-white/20 px-1.5 py-0.2 rounded text-[10px]">A+</span>
            <span>8 Episódios</span>
            <span className="bg-[#e50914]/10 text-[#e50914] px-1.5 rounded text-[10px] font-bold">RECOMENDADO</span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base mt-4 leading-relaxed line-clamp-3 sm:line-clamp-none drop-shadow">
            Aprenda o passo a passo definitivo para construir uma introdução impactante e garantir a Competência 2 do ENEM. Modelos prontos e repertórios coringas incluídos para estruturar sua redação em menos de 50 minutos.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              onClick={() => onPlay(featuredVideo)}
              className="bg-white hover:bg-gray-200 active:bg-gray-300 text-black font-extrabold px-6 sm:px-8 py-3 rounded text-sm sm:text-base flex items-center justify-center gap-2.5 transition shadow-lg cursor-pointer transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              <span>Assistir Agora</span>
            </button>

            <button
              onClick={() => onToggleBookmark(featuredVideo.id)}
              className="bg-gray-500/50 hover:bg-gray-500/70 active:bg-gray-600/50 text-white font-bold px-4 sm:px-6 py-3 rounded text-sm sm:text-base border border-white/10 flex items-center justify-center gap-2 transition cursor-pointer backdrop-blur-md"
              title={isBookmarked ? "Remover da minha lista" : "Adicionar à minha lista"}
            >
              {isBookmarked ? (
                <>
                  <Check className="w-5 h-5 text-red-500 stroke-[3]" />
                  <span className="text-red-400">Na Minha Lista</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Favoritar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Category Tag Row */}
      <div className="absolute right-0 bottom-12 hidden lg:flex items-center gap-4 bg-zinc-950/70 border-l-4 border-red-600 py-2.5 pl-6 pr-12 rounded-l-md backdrop-blur-sm shadow-xl z-20">
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Estreando Agora</p>
          <p className="text-sm font-bold text-white max-w-[200px] truncate">{featuredVideo.title}</p>
        </div>
        <button 
          onClick={() => onPlay(featuredVideo)}
          className="bg-red-600 text-white p-2.5 rounded-full hover:bg-red-700 transition"
        >
          <Play className="w-4 h-4 fill-white" />
        </button>
      </div>
    </div>
  );
}
