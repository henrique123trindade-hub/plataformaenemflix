import React, { useState, useEffect, useRef } from "react";
import { X, Play, Check, Award, Heart, MessageSquare, Send, ThumbsUp, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "../types";

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  isBookmarked: boolean;
  isCompleted: boolean;
  onToggleBookmark: (videoId: string) => void;
  onMarkCompleted: (videoId: string, xpValue: number) => void;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  likes: number;
  time: string;
}

// Helper to parse YouTube playlist HTML in the client when backend API is unavailable
function parsePlaylistHTML(html: string): any[] {
  let videos: any[] = [];
  const startStr = "ytInitialData = ";
  const startIndex = html.indexOf(startStr);
  
  if (startIndex !== -1) {
    const dataStart = startIndex + startStr.length;
    const scriptEndIndex = html.indexOf("</script>", dataStart);
    if (scriptEndIndex !== -1) {
      let jsonStr = html.substring(dataStart, scriptEndIndex).trim();
      if (jsonStr.endsWith(";")) {
        jsonStr = jsonStr.slice(0, -1);
      }
      try {
        const data = JSON.parse(jsonStr);
        
        const findPlaylistVideosInObject = (obj: any): any[] | null => {
          if (!obj || typeof obj !== "object") return null;
          
          if (Array.isArray(obj)) {
            const hasVideoRenderers = obj.some(item => item && (item.playlistVideoRenderer || item.videoRenderer || item.childVideoRenderer));
            if (hasVideoRenderers) {
              return obj;
            }
            for (const item of obj) {
              const res = findPlaylistVideosInObject(item);
              if (res) return res;
            }
          } else {
            for (const key of Object.keys(obj)) {
              const res = findPlaylistVideosInObject(obj[key]);
              if (res) return res;
            }
          }
          return null;
        };

        const list = findPlaylistVideosInObject(data);
        
        if (list && Array.isArray(list)) {
          videos = list
            .map((item: any) => {
              const renderer = item.playlistVideoRenderer || item.videoRenderer || item.childVideoRenderer;
              if (!renderer) return null;
              
              const videoId = renderer.videoId;
              if (!videoId) return null;

              const title = renderer.title?.runs?.[0]?.text || renderer.title?.simpleText || renderer.title?.accessibility?.accessibilityData?.label || "Sem título";
              const duration = renderer.lengthText?.simpleText || "Vídeo";
              
              return {
                id: videoId,
                title,
                duration,
                youtubeId: videoId
              };
            })
            .filter(Boolean);
        }
      } catch (jsonErr) {
        console.error("Error parsing YouTube JSON on client:", jsonErr);
      }
    }
  }

  // Backup regex-based extraction
  if (videos.length === 0) {
    const videoIdMatches = [...html.matchAll(/"videoId":"([^"]+)"/g)].map(m => m[1]);
    const uniqueVideoIds = Array.from(new Set(videoIdMatches)).slice(0, 100);
    
    if (uniqueVideoIds.length > 0) {
      videos = uniqueVideoIds.map((id, index) => ({
        id,
        title: `Aula ${index + 1} da Playlist`,
        duration: "Vídeo",
        youtubeId: id
      }));
    }
  }

  return videos;
}

export default function VideoModal({
  video,
  onClose,
  isBookmarked,
  isCompleted,
  onToggleBookmark,
  onMarkCompleted
}: VideoModalProps) {
  const [activeSubVideoIndex, setActiveSubVideoIndex] = useState<number>(0);
  const [dynamicSubVideos, setDynamicSubVideos] = useState<any[]>(video?.subVideos || []);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const loadingPlaylist = false;

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to load the official YouTube Player IFrame API
  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) {
        resolve();
        return;
      }

      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        resolve();
      };

      if (!document.getElementById("youtube-iframe-api-script")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      } else {
        const interval = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  };

  useEffect(() => {
    if (!video) return;
    setPlayerError(null);
    setDynamicSubVideos(video.subVideos || []);
    setActiveSubVideoIndex(0);
  }, [video]);

  // Main effect to handle YT.Player instantiation and synchronization
  useEffect(() => {
    if (!video) return;

    let active = true;

    const setupPlayer = async () => {
      console.log("[YouTube Debug] Initializing YouTube API...");
      await loadYouTubeAPI();
      if (!active) return;

      // Recreate target div to prevent mounting errors or stale iframes
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        const playerDiv = document.createElement("div");
        playerDiv.id = "youtube-player-element";
        playerDiv.className = "w-full h-full";
        containerRef.current.appendChild(playerDiv);
        console.log("[YouTube Debug] Target div prepared in DOM");
      }

      const origin = window.location.origin;
      const playerVars: any = {
        autoplay: 1,
        rel: 0,
        enablejsapi: 1,
        origin: origin,
        host: "https://www.youtube.com",
        widget_referrer: origin,
        modestbranding: 1,
        playsinline: 1
      };

      if (video.playlistId) {
        playerVars.listType = "playlist";
        playerVars.list = video.playlistId;
        playerVars.index = activeSubVideoIndex;
      }

      console.log("[YouTube Debug] Instantiating player with options:", {
        playlistId: video.playlistId,
        videoId: video.playlistId ? undefined : (video.subVideos?.[activeSubVideoIndex]?.youtubeId || video.youtubeId),
        playerVars
      });

      try {
        const playerOptions: any = {
          height: "100%",
          width: "100%",
          playerVars: playerVars,
          events: {
            onReady: (event: any) => {
              if (!active) return;
              console.log("[YouTube Debug] onReady event triggered successfully");
              setPlayerError(null);

              try {
                // Ensure permissions and security constraints are fully configured on the generated iframe
                const iframe = event.target.getIframe();
                if (iframe) {
                  iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
                  iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
                  iframe.setAttribute("id", "youtube-player-iframe");
                  console.log("[YouTube Debug] Security and permission attributes successfully set on iframe");
                }
              } catch (attrErr) {
                console.warn("[YouTube Debug] Could not write iframe attributes:", attrErr);
              }

              // Update sub-videos if getPlaylist is available
              if (video.playlistId) {
                try {
                  const playlistIds = event.target.getPlaylist();
                  if (playlistIds && playlistIds.length > 0) {
                    console.log("[YouTube Debug] Loaded official playlist item count:", playlistIds.length);
                    setDynamicSubVideos(() => {
                      return playlistIds.map((id: string, idx: number) => {
                        const existingMock = video.subVideos?.[idx];
                        if (existingMock) {
                          return {
                            ...existingMock,
                            youtubeId: id
                          };
                        }
                        return {
                          id: `dynamic-${id}-${idx}`,
                          title: `Aula ${idx + 1} da Playlist`,
                          duration: "Vídeo",
                          youtubeId: id
                        };
                      });
                    });
                  }
                } catch (playlistErr) {
                  console.warn("[YouTube Debug] Error accessing playlist IDs onReady:", playlistErr);
                }
              }
            },
            onStateChange: (event: any) => {
              if (!active) return;
              console.log("[YouTube Debug] onStateChange state:", event.data);
              
              if (video.playlistId) {
                try {
                  const currentIndex = event.target.getPlaylistIndex();
                  if (currentIndex !== -1 && currentIndex !== undefined && currentIndex !== activeSubVideoIndex) {
                    console.log("[YouTube Debug] State-change index sync:", currentIndex);
                    setActiveSubVideoIndex(currentIndex);
                  }

                  const playlistIds = event.target.getPlaylist();
                  if (playlistIds && playlistIds.length > 0) {
                    setDynamicSubVideos((prev) => {
                      if (prev.length < playlistIds.length) {
                        return playlistIds.map((id: string, idx: number) => {
                          const existingMock = video.subVideos?.[idx];
                          if (existingMock) {
                            return {
                              ...existingMock,
                              youtubeId: id
                            };
                          }
                          return {
                            id: `dynamic-${id}-${idx}`,
                            title: `Aula ${idx + 1} da Playlist`,
                            duration: "Vídeo",
                            youtubeId: id
                          };
                        });
                      }
                      return prev;
                    });
                  }
                } catch (syncErr) {
                  console.warn("[YouTube Debug] Sync error:", syncErr);
                }
              }
            },
            onError: (event: any) => {
              if (!active) return;
              console.error("[YouTube Debug] Player error occurred:", event.data);
              let friendlyError = "Ocorreu um erro ao reproduzir este vídeo.";
              if (event.data === 2) friendlyError = "Parâmetro inválido de ID do vídeo.";
              if (event.data === 5) friendlyError = "O conteúdo solicitado não pode ser reproduzido no player HTML5.";
              if (event.data === 100) friendlyError = "O vídeo solicitado não foi encontrado ou foi removido.";
              if (event.data === 101 || event.data === 150) {
                friendlyError = "O proprietário do vídeo não permite a reprodução em players incorporados fora do YouTube.";
              }
              setPlayerError(friendlyError);
            }
          }
        };

        const calculatedVideoId = video.playlistId ? undefined : (video.subVideos?.[activeSubVideoIndex]?.youtubeId || video.youtubeId);
        if (calculatedVideoId) {
          playerOptions.videoId = calculatedVideoId;
        }

        playerRef.current = new (window as any).YT.Player("youtube-player-element", playerOptions);
      } catch (err: any) {
        console.error("[YouTube Debug] Failed to create YT.Player instance:", err);
        setPlayerError("Não foi possível carregar o player do YouTube.");
      }
    };

    setupPlayer();

    return () => {
      active = false;
    };
  }, [video]); // Re-initialize only if the main video/course changes

  // Control playback indexing dynamically (smoothly switching without full player rebuild)
  useEffect(() => {
    if (!video || !playerRef.current) return;

    try {
      if (video.playlistId) {
        if (typeof playerRef.current.getPlaylistIndex === "function") {
          const currentPlayerIndex = playerRef.current.getPlaylistIndex();
          if (currentPlayerIndex !== activeSubVideoIndex && currentPlayerIndex !== -1 && currentPlayerIndex !== undefined) {
            console.log("[YouTube Debug] Smoothly playing video at index:", activeSubVideoIndex);
            playerRef.current.playVideoAt(activeSubVideoIndex);
          }
        }
      } else {
        if (typeof playerRef.current.loadVideoById === "function") {
          const currentId = video.subVideos?.[activeSubVideoIndex]?.youtubeId || video.youtubeId;
          console.log("[YouTube Debug] Smoothly playing single video id:", currentId);
          playerRef.current.loadVideoById({
            videoId: currentId,
            suggestedQuality: "default"
          });
        }
      }
    } catch (playbackErr) {
      console.warn("[YouTube Debug] Smooth index switch failed, recreating player:", playbackErr);
    }
  }, [activeSubVideoIndex, video]);

  // Clean up player on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        console.log("[YouTube Debug] Cleaning up and destroying player on modal close");
        try {
          if (typeof playerRef.current.destroy === "function") {
            playerRef.current.destroy();
          }
        } catch (err) {
          console.warn("[YouTube Debug] Cleanup destroy warning:", err);
        }
        playerRef.current = null;
      }
    };
  }, []);

  const handleRetryPlayer = () => {
    console.log("[YouTube Debug] Retrying player initialization...");
    setPlayerError(null);
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === "function") {
          playerRef.current.destroy();
        }
      } catch (_) {}
      playerRef.current = null;
    }
    setActiveSubVideoIndex(activeSubVideoIndex);
  };

  const handleNextVideo = () => {
    if (playerRef.current && typeof playerRef.current.nextVideo === "function" && video?.playlistId) {
      console.log("[YouTube Debug] User clicked Next: calling player.nextVideo()");
      try {
        playerRef.current.nextVideo();
        setTimeout(() => {
          if (playerRef.current && typeof playerRef.current.getPlaylistIndex === "function") {
            const idx = playerRef.current.getPlaylistIndex();
            if (idx !== -1 && idx !== undefined) {
              setActiveSubVideoIndex(idx);
            }
          }
        }, 200);
      } catch (err) {
        console.warn("[YouTube Debug] Failed to call player.nextVideo(), syncing manually", err);
        setActiveSubVideoIndex(prev => Math.min(prev + 1, dynamicSubVideos.length - 1));
      }
    } else {
      setActiveSubVideoIndex(prev => Math.min(prev + 1, dynamicSubVideos.length - 1));
    }
  };

  const handlePrevVideo = () => {
    if (playerRef.current && typeof playerRef.current.previousVideo === "function" && video?.playlistId) {
      console.log("[YouTube Debug] User clicked Previous: calling player.previousVideo()");
      try {
        playerRef.current.previousVideo();
        setTimeout(() => {
          if (playerRef.current && typeof playerRef.current.getPlaylistIndex === "function") {
            const idx = playerRef.current.getPlaylistIndex();
            if (idx !== -1 && idx !== undefined) {
              setActiveSubVideoIndex(idx);
            }
          }
        }, 200);
      } catch (err) {
        console.warn("[YouTube Debug] Failed to call player.previousVideo(), syncing manually", err);
        setActiveSubVideoIndex(prev => Math.max(prev - 1, 0));
      }
    } else {
      setActiveSubVideoIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const hasSubVideos = dynamicSubVideos.length > 0;
  const currentSubVideo = hasSubVideos ? dynamicSubVideos[activeSubVideoIndex] : null;

  const currentTitle = currentSubVideo ? currentSubVideo.title : (video?.title || "");
  const currentDuration = currentSubVideo ? currentSubVideo.duration : (video?.duration || "");

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    { id: "c1", user: "Beatriz M. (Direito)", text: "Essa explicação de grandezas inversamente proporcionais salvou minha vida! Sempre errava a montagem da regra de três composta.", likes: 14, time: "Há 2 horas" },
    { id: "c2", user: "Marcos_ENEM", text: "Excelente didática. O professor vai direto ao ponto sem enrolação, perfeito para revisar antes do simulado.", likes: 8, time: "Há 5 horas" },
    { id: "c3", user: "Laura F.", text: "Alguém mais anotando os esquemas mentais? Se desenhar fica muito mais fácil de memorizar os volumes dos prismas.", likes: 4, time: "Há 1 dia" }
  ]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `my-${Date.now()}`,
      user: "Você",
      text: commentText,
      likes: 0,
      time: "Agora mesmo"
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleLikeComment = (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  if (!video) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/95 backdrop-blur-md overflow-y-auto"
      id="video-player-modal"
    >
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/5 ring-1 ring-white/10 rounded shadow-2xl overflow-hidden my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 bg-black/80 hover:text-white hover:bg-zinc-900 rounded-full transition cursor-pointer border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player and Playlist Grid */}
        <div className={`grid grid-cols-1 ${hasSubVideos ? "lg:grid-cols-3" : ""} bg-black border-b border-white/5`}>
          {/* Main Video Iframe */}
          <div className={`${hasSubVideos ? "lg:col-span-2" : "w-full"} relative aspect-video bg-black`}>
            <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
              <div id="youtube-player-element" className="w-full h-full" />
            </div>

            {/* Error Overlay */}
            {playerError && (
              <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center z-10 gap-3">
                <p className="text-xs font-black text-red-500 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded">
                  Erro de Reprodução
                </p>
                <p className="text-xs text-gray-400 max-w-sm mt-1">
                  {playerError}
                </p>
                <button
                  type="button"
                  onClick={handleRetryPlayer}
                  className="mt-2 px-4 py-2 bg-[#e50914] hover:bg-[#e50914]/95 text-white font-black text-[10px] uppercase tracking-wider rounded transition cursor-pointer"
                >
                  Recarregar Player
                </button>
              </div>
            )}
          </div>

          {/* Playlist Panel */}
          {hasSubVideos && (
            <div className="lg:col-span-1 flex flex-col h-full bg-[#0d0d0d] border-t lg:border-t-0 lg:border-l border-white/5 max-h-[220px] sm:max-h-[280px] lg:max-h-none lg:h-auto overflow-hidden">
              <div className="p-4 bg-[#141414]/90 border-b border-white/5 flex items-center justify-between shrink-0">
                <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <List className="w-4 h-4 text-[#e50914]" />
                  Aulas da Playlist ({dynamicSubVideos.length})
                </span>
                <span className="text-[10px] text-zinc-500 font-bold">
                  {loadingPlaylist ? "Carregando..." : `${activeSubVideoIndex + 1}/${dynamicSubVideos.length}`}
                </span>
              </div>

              {/* Navigation Controls */}
              <div className="flex border-b border-white/5 p-2 bg-black/40 justify-between items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={activeSubVideoIndex === 0 || loadingPlaylist}
                  onClick={handlePrevVideo}
                  className="px-3 py-1.5 rounded bg-[#141414] hover:bg-zinc-800 text-gray-300 disabled:opacity-30 disabled:hover:bg-[#141414] transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Anterior
                </button>
                <button
                  type="button"
                  disabled={activeSubVideoIndex === dynamicSubVideos.length - 1 || loadingPlaylist}
                  onClick={handleNextVideo}
                  className="px-3 py-1.5 rounded bg-[#141414] hover:bg-zinc-800 text-gray-300 disabled:opacity-30 disabled:hover:bg-[#141414] transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Próxima
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sub-videos Scroll Area */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 no-scrollbar max-h-[160px] lg:max-h-[300px]">
                {loadingPlaylist && dynamicSubVideos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-500">
                    <span className="w-6 h-6 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Buscando aulas...</span>
                  </div>
                ) : (
                  dynamicSubVideos.map((sub, index) => {
                    const isActive = index === activeSubVideoIndex;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setActiveSubVideoIndex(index)}
                        className={`w-full text-left p-3 flex items-start gap-3 transition cursor-pointer ${
                          isActive 
                            ? "bg-[#e50914]/15 border-l-2 border-[#e50914]" 
                            : "hover:bg-[#141414]/50"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isActive 
                              ? "bg-[#e50914] text-white" 
                              : "bg-[#222] text-zinc-400"
                          }`}>
                            {isActive ? (
                              <Play className="w-2.5 h-2.5 fill-white text-white" />
                            ) : (
                              index + 1
                            )}
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className={`text-xs font-bold leading-snug truncate ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}>
                            {sub.title}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                            {sub.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Details Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Lesson Metadata, Controls, Description */}
          <div className="md:col-span-2 space-y-6">
            <div className="text-left">
              <span className="text-xs font-bold text-[#e50914] uppercase tracking-widest bg-[#e50914]/15 border border-[#e50914]/25 px-2 py-1 rounded">
                {video.subject}
              </span>
              <h2 className="text-2xl font-black text-white mt-3 tracking-tight">
                {currentTitle}
              </h2>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold mt-2.5">
                <span className="text-green-500">{video.difficulty}</span>
                <span>•</span>
                <span>Duração: {currentDuration}</span>
                <span>•</span>
                <span className="text-[#e50914] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Garante {video.xpValue} XP
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed text-left">
              {video.description}
            </p>


          </div>

          {/* Right Column: Bookmark & Interactive Student Forum / Discussion */}
          <div className="space-y-6">
            <div className="flex gap-2">
              <button
                onClick={() => onToggleBookmark(video.id)}
                className={`flex-1 py-2.5 rounded text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer transition ${
                  isBookmarked
                    ? "bg-[#e50914]/15 border-[#e50914]/30 text-[#e50914]"
                    : "bg-[#141414] border-white/10 text-gray-300 hover:bg-[#141414]/80"
                }`}
              >
                <Heart className={`w-4 h-4 ${isBookmarked ? "fill-[#e50914] text-[#e50914]" : ""}`} />
                <span>{isBookmarked ? "Salvo em Favoritos" : "Favoritar Aula"}</span>
              </button>
            </div>

            {/* Student Discussion Forum */}
            <div className="border border-white/5 ring-1 ring-white/10 rounded overflow-hidden bg-[#141414]/20">
              <div className="bg-[#141414]/80 px-4 py-3 border-b border-white/10 flex items-center gap-2 text-gray-300 font-bold text-xs">
                <MessageSquare className="w-4 h-4 text-[#e50914]" />
                <span>Fórum de Dúvidas ({comments.length})</span>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSendComment} className="p-3 border-b border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva sua dúvida ou dica..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-grow bg-black border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e50914]"
                />
                <button
                  type="submit"
                  className="bg-[#e50914] text-white p-2 rounded hover:bg-[#e50914]/90 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Comments List */}
              <div className="max-h-[220px] overflow-y-auto divide-y divide-white/5 text-left">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-200">{comment.user}</span>
                      <span className="text-[10px] text-zinc-500">{comment.time}</span>
                    </div>
                    <p className="text-gray-400 leading-normal">{comment.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500">
                      <button 
                        type="button"
                        onClick={() => handleLikeComment(comment.id)} 
                        className="flex items-center gap-1 hover:text-gray-300 transition"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
