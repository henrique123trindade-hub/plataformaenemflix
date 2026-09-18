import React from "react";
import { Play, Plus, Check, Award, Eye, Heart } from "lucide-react";
import { Video } from "../types";

interface VideoRowProps {
  title: string;
  videos: Video[];
  onPlay: (video: Video) => void;
  bookmarkedIds: string[];
  completedIds: string[];
  onToggleBookmark: (videoId: string) => void;
}

export default function VideoRow({
  title,
  videos,
  onPlay,
  bookmarkedIds,
  completedIds,
  onToggleBookmark
}: VideoRowProps) {
  if (videos.length === 0) return null;

  return (
    <div className="mb-10 px-4 sm:px-6 lg:px-8" id={`row-${title.toLowerCase().replace(/\s/g, "-")}`}>
      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-[#e50914] rounded"></span>
        <span>{title}</span>
      </h2>

      {/* Horizontal Scroll Area */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scrollbar-none">
          {videos.map((video) => {
            const isFav = bookmarkedIds.includes(video.id);
            const isCompleted = completedIds.includes(video.id);

            return (
              <div
                key={video.id}
                className="flex-none w-64 sm:w-72 bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded-sm overflow-hidden relative group transition-all duration-300 hover:scale-105 hover:border-[#e50914]/40 hover:ring-2 hover:ring-[#e50914]/30 hover:shadow-[0_12px_24px_rgba(0,0,0,0.8)] cursor-pointer"
              >
                {/* Thumbnail and Tags */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden" onClick={() => onPlay(video)}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (video.youtubeId) {
                        e.currentTarget.src = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;
                      } else {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  
                  {/* Difficulty Badge */}
                  <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                    video.difficulty === "Fácil" 
                      ? "bg-green-600/80 text-white" 
                      : video.difficulty === "Médio"
                      ? "bg-amber-600/80 text-white"
                      : "bg-[#e50914]/80 text-white"
                  }`}>
                    {video.difficulty}
                  </span>

                  {/* XP Badge */}
                  <span className="absolute top-2.5 right-2.5 bg-[#e50914] text-white px-2 py-0.5 rounded-sm text-[10px] font-black flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>+{video.xpValue} XP</span>
                  </span>

                  {/* Played Progress / Watch State */}
                  {isCompleted && (
                    <div className="absolute inset-x-0 bottom-0 bg-green-600/90 text-white py-1 text-center text-xs font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Concluído</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="p-4" onClick={() => onPlay(video)}>
                  <div className="text-[10px] text-[#e50914] font-black uppercase tracking-wider mb-1">
                    {video.subject}
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 min-h-[40px]">
                    {video.title}
                  </h3>

                  {/* Metadata Footer */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mt-3 pt-3 border-t border-white/5">
                    <span>{video.duration}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>{video.views >= 1000 ? `${(video.views/1000).toFixed(0)}k` : video.views}</span>
                    </span>
                  </div>
                </div>

                {/* Hover Quick Action Panel */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 p-1 rounded-sm backdrop-blur-sm z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(video);
                    }}
                    className="p-1.5 bg-white text-black rounded-sm hover:bg-gray-200 transition cursor-pointer"
                    title="Assistir agora"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(video.id);
                    }}
                    className={`p-1.5 rounded-sm transition cursor-pointer ${isFav ? "bg-[#e50914] text-white hover:bg-[#ff1a26]" : "bg-white/10 text-white hover:bg-white/20"}`}
                    title={isFav ? "Remover da minha lista" : "Adicionar à minha lista"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-white" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
