import React, { useState, useEffect, useRef } from "react";
import { X, Play, Check, Award, Heart, MessageSquare, Send, ThumbsUp, List, ChevronLeft, ChevronRight, ExternalLink, RefreshCw } from "lucide-react";
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
  const match = html.match(/var ytInitialData = (\{.+?\});<\/script>/) ||
                html.match(/window\["ytInitialData"\] = (\{.+?\});<\/script>/);
  
  if (match && match[1]) {
    try {
      const data = JSON.parse(match[1]);
      const seenIds = new Set<string>();

      const findVideosRecursive = (obj: any) => {
        if (!obj || typeof obj !== "object") return;

        // Modern lockupViewModel
        if (obj.lockupViewModel) {
          const vm = obj.lockupViewModel;
          const title = vm.metadata?.lockupMetadataViewModel?.title?.content ||
                        vm.rendererContext?.accessibilityContext?.label;
          const videoId = vm.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId ||
                          vm.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.animationActivationTargetId;
          const duration = vm.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text || "Vídeo";

          if (videoId && title && !seenIds.has(videoId)) {
            seenIds.add(videoId);
            videos.push({
              id: videoId,
              title: title.trim(),
              duration,
              youtubeId: videoId
            });
          }
        }

        // Classic playlistVideoRenderer
        if (obj.playlistVideoRenderer) {
          const renderer = obj.playlistVideoRenderer;
          const videoId = renderer.videoId;
          const title = renderer.title?.runs?.[0]?.text ||
                        renderer.title?.simpleText ||
                        renderer.title?.accessibility?.accessibilityData?.label;
          const duration = renderer.lengthText?.simpleText || "Vídeo";

          if (videoId && title && !seenIds.has(videoId)) {
            seenIds.add(videoId);
            videos.push({
              id: videoId,
              title: title.trim(),
              duration,
              youtubeId: videoId
            });
          }
        }

        if (Array.isArray(obj)) {
          for (const item of obj) findVideosRecursive(item);
        } else {
          for (const key of Object.keys(obj)) findVideosRecursive(obj[key]);
        }
      };

      findVideosRecursive(data);
    } catch (jsonErr) {
      console.error("Error parsing YouTube JSON on client:", jsonErr);
    }
  }

  // Backup regex-based extraction
  if (videos.length === 0) {
    const videoIdMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
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
  const [loadingPlaylist, setLoadingPlaylist] = useState<boolean>(false);
  const [useDirectEmbed, setUseDirectEmbed] = useState<boolean>(false);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

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

  // Sync subvideos and fetch updated titles whenever video/playlist changes
  useEffect(() => {
    if (!video) return;
    setPlayerError(null);
    setUseDirectEmbed(false);
    setDynamicSubVideos(video.subVideos || []);
    setActiveSubVideoIndex(0);

    if (video.playlistId) {
      setLoadingPlaylist(true);
      fetch(`/api/playlist?list=${video.playlistId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
            setDynamicSubVideos(prev => {
              return data.videos.map((vid: any, idx: number) => {
                const existing = prev.find((p: any) => p.youtubeId === vid.id) ||
                                 prev[idx] ||
                                 video.subVideos?.[idx];
                return {
                  id: existing?.id || vid.id,
                  title: vid.title && vid.title !== "Sem título" ? vid.title : (existing?.title || `Aula ${idx + 1} da Playlist`),
                  duration: vid.duration && vid.duration !== "Vídeo" ? vid.duration : (existing?.duration || "Vídeo"),
                  youtubeId: vid.youtubeId || vid.id
                };
              });
            });
          }
        })
        .catch(err => {
          console.warn("[YouTube Playlist] Error loading from /api/playlist:", err);
        })
        .finally(() => {
          setLoadingPlaylist(false);
        });
    }
  }, [video]);

  // Main effect to handle YT.Player instantiation and synchronization
  useEffect(() => {
    if (!video || useDirectEmbed) return;

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

      const currentId = dynamicSubVideos[activeSubVideoIndex]?.youtubeId ||
                        video.subVideos?.[activeSubVideoIndex]?.youtubeId ||
                        video.youtubeId;

      const playerVars: any = {
        autoplay: 1,
        rel: 0,
        enablejsapi: 1,
        modestbranding: 1,
        playsinline: 1
      };

      if (typeof window !== "undefined" && window.location?.origin && window.location.origin.startsWith("http")) {
        playerVars.origin = window.location.origin;
      }

      console.log("[YouTube Debug] Instantiating player for video ID:", currentId);

      try {
        const playerOptions: any = {
          height: "100%",
          width: "100%",
          host: "https://www.youtube-nocookie.com",
          videoId: currentId,
          playerVars: playerVars,
          events: {
            onReady: (event: any) => {
              if (!active) return;
              console.log("[YouTube Debug] onReady event triggered successfully for video:", currentId);
              setPlayerError(null);

              try {
                const iframe = event.target.getIframe?.();
                if (iframe) {
                  iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen");
                  iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
                  iframe.setAttribute("id", "youtube-player-iframe");
                }
              } catch (attrErr) {
                console.warn("[YouTube Debug] Could not write iframe attributes:", attrErr);
              }
            },
            onStateChange: (event: any) => {
              if (!active) return;
              console.log("[YouTube Debug] onStateChange state:", event.data);
              // When video ends (0 = YT.PlayerState.ENDED), advance to next lesson
              if (event.data === 0) {
                console.log("[YouTube Debug] Video ended, advancing to next lesson");
                setActiveSubVideoIndex(prev => Math.min(prev + 1, dynamicSubVideos.length - 1));
              }
            },
            onError: (event: any) => {
              if (!active) return;
              console.error("[YouTube Debug] Player error occurred:", event.data);
              if (event.data === 101 || event.data === 150) {
                console.log("[YouTube Debug] Error 150/101 detected (embed restriction). Switching to direct embed fallback...");
                setUseDirectEmbed(true);
                setPlayerError(null);
                return;
              }
              let friendlyError = "Ocorreu um erro ao reproduzir este vídeo.";
              if (event.data === 2) friendlyError = "Parâmetro inválido de ID do vídeo.";
              if (event.data === 5) friendlyError = "O conteúdo solicitado não pode ser reproduzido no player HTML5.";
              if (event.data === 100) friendlyError = "O vídeo solicitado não foi encontrado ou foi removido.";
              setPlayerError(friendlyError);
            }
          }
        };

        playerRef.current = new (window as any).YT.Player("youtube-player-element", playerOptions);
      } catch (err: any) {
        console.error("[YouTube Debug] Failed to create YT.Player instance:", err);
        setUseDirectEmbed(true);
      }
    };

    setupPlayer();

    return () => {
      active = false;
    };
  }, [video, reloadTrigger, useDirectEmbed]);

  // Smoothly switch video without rebuilding player when activeSubVideoIndex changes
  useEffect(() => {
    if (!video || !playerRef.current || useDirectEmbed) return;

    try {
      const currentId = dynamicSubVideos[activeSubVideoIndex]?.youtubeId ||
                        video.subVideos?.[activeSubVideoIndex]?.youtubeId ||
                        video.youtubeId;
      if (currentId && typeof playerRef.current.loadVideoById === "function") {
        console.log("[YouTube Debug] Smoothly playing video id:", currentId);
        playerRef.current.loadVideoById({
          videoId: currentId,
          suggestedQuality: "default"
        });
      }
    } catch (playbackErr) {
      console.warn("[YouTube Debug] Smooth video switch failed:", playbackErr);
    }
  }, [activeSubVideoIndex, dynamicSubVideos, video, useDirectEmbed]);

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
    setUseDirectEmbed(false);
    if (playerRef.current) {
      try {
        if (typeof playerRef.current.destroy === "function") {
          playerRef.current.destroy();
        }
      } catch (_) {}
      playerRef.current = null;
    }
    setReloadTrigger(prev => prev + 1);
  };

  const handleNextVideo = () => {
    setActiveSubVideoIndex(prev => Math.min(prev + 1, dynamicSubVideos.length - 1));
  };

  const handlePrevVideo = () => {
    setActiveSubVideoIndex(prev => Math.max(prev - 1, 0));
  };

  const hasSubVideos = dynamicSubVideos.length > 0;
  const currentSubVideo = hasSubVideos ? dynamicSubVideos[activeSubVideoIndex] : null;

  const currentTitle = currentSubVideo ? currentSubVideo.title : (video?.title || "");
  const currentDuration = currentSubVideo ? currentSubVideo.duration : (video?.duration || "");
  const currentYoutubeId = currentSubVideo?.youtubeId || video?.subVideos?.[activeSubVideoIndex]?.youtubeId || video?.youtubeId || "";

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
            {useDirectEmbed ? (
              <iframe
                key={`direct-${currentYoutubeId}`}
                src={`https://www.youtube-nocookie.com/embed/${currentYoutubeId}?autoplay=1&rel=0&playsinline=1`}
                title={currentTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
                <div id="youtube-player-element" className="w-full h-full" />
              </div>
            )}

            {/* Error Overlay */}
            {playerError && (
              <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center z-20 gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#e50914]">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <p className="text-xs font-black text-red-500 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded">
                  Restrição de Reprodução
                </p>
                <p className="text-xs text-gray-300 max-w-md mt-1 leading-relaxed">
                  {playerError}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${currentYoutubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#e50914] hover:bg-[#e50914]/90 text-white font-bold text-xs rounded transition flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/40"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Assistir no YouTube
                  </a>
                  {dynamicSubVideos.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNextVideo}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Próxima Aula</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRetryPlayer}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tentar Novamente</span>
                  </button>
                </div>
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

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onMarkCompleted(video.id, video.xpValue)}
                className={`px-4 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                  isCompleted
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isCompleted ? "Aula Concluída" : "Marcar como Concluída"}</span>
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${currentYoutubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded text-xs font-bold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#e50914]" />
                <span>Assistir no YouTube</span>
              </a>
            </div>


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
