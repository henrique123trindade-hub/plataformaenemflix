import React, { useState, useEffect } from "react";
import { 
  LeadProfile, 
  UserStats, 
  Video, 
  VideoProgress, 
  SimulatedExamResult, 
  EssaySubmission, 
  AIConversation, 
  AIMessage 
} from "./types";
import { VIDEOS_DATA } from "./data/courses";

// Import modular components
import LeadCapture from "./components/LeadCapture";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import VideoRow from "./components/VideoRow";
import VideoModal from "./components/VideoModal";
import Dashboard from "./components/Dashboard";
import StudyCalendar from "./components/StudyCalendar";
import Simulator from "./components/Simulator";
import AIPanel from "./components/AIPanel";
import EssayTraining from "./components/EssayTraining";
import UserProfileTab from "./components/UserProfileTab";

import { Award, Compass, Search, Sparkles, Home, BookOpen, ClipboardList, Brain, PenTool, User } from "lucide-react";
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signOut,
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection, 
  getDocs, 
  deleteDoc, 
  addDoc 
} from "./lib/firebase";

export default function App() {
  // 1. Core Profile & Lead Capture States
  const [userProfile, setUserProfile] = useState<LeadProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // 2. Core Gamified Statistics States
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    streak: 1,
    hoursStudied: 0.8,
    completedVideos: [],
    bookmarkedVideos: [],
    solvedQuestionsCount: 0,
    correctAnswersCount: 0,
    lastStudyDate: new Date().toISOString()
  });

  // 3. Subcollection States (Sync with Firestore for Auth, or LocalStorage for Guest)
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [simulatedExams, setSimulatedExams] = useState<SimulatedExamResult[]>([]);
  const [essays, setEssays] = useState<EssaySubmission[]>([]);
  const [aiConversations, setAiConversations] = useState<AIConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // 4. Navigation and Interface States
  const [activeTab, setActiveTab] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initialize app state
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // 5. Firebase Auth Sync Listener
  useEffect(() => {
    if (isInitializing) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsSyncing(true);
      if (user) {
        // Logged-in Firebase user!
        const userDocRef = doc(db, "users", user.uid);
        
        let profile: LeadProfile;
        let stats: UserStats;

        // Check if there is local profile info saved during registration
        const savedLocally = localStorage.getItem("enemflix_user_profile");
        let localParsed: Partial<LeadProfile> = {};
        if (savedLocally) {
          try {
            localParsed = JSON.parse(savedLocally);
          } catch (e) {
            console.error(e);
          }
        }

        try {
          const userDocSnap = await Promise.race([
            getDoc(userDocRef),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000))
          ]);

          if (userDocSnap && userDocSnap.exists()) {
            const data = userDocSnap.data();
            profile = {
              name: data.name || localParsed.name || user.displayName || user.email?.split("@")[0] || "Estudante Focado",
              email: data.email || user.email || localParsed.email || "",
              phone: data.phone || localParsed.phone || "",
              targetCourse: data.targetCourse || localParsed.targetCourse || "Medicina",
              targetScore: data.targetScore || localParsed.targetScore || 750,
              isLeadCaptured: true,
              uid: user.uid,
              createdAt: data.createdAt || new Date().toISOString()
            };

            stats = {
              level: data.level || 1,
              xp: data.xp || 0,
              xpToNextLevel: data.xpToNextLevel || 1000,
              streak: data.streak || 1,
              hoursStudied: data.hoursStudied || 0,
              completedVideos: data.completedVideos || [],
              bookmarkedVideos: data.bookmarkedVideos || [],
              solvedQuestionsCount: data.solvedQuestionsCount || 0,
              correctAnswersCount: data.correctAnswersCount || 0,
              lastStudyDate: data.lastStudyDate || new Date().toISOString()
            };
          } else {
            // New user document setup
            profile = {
              name: localParsed.name || user.displayName || user.email?.split("@")[0] || "Estudante Focado",
              email: user.email || localParsed.email || "",
              phone: localParsed.phone || "",
              targetCourse: localParsed.targetCourse || "Medicina",
              targetScore: localParsed.targetScore || 750,
              isLeadCaptured: true,
              uid: user.uid,
              createdAt: new Date().toISOString()
            };

            stats = {
              level: 1,
              xp: 0,
              xpToNextLevel: 1000,
              streak: 1,
              hoursStudied: 0,
              completedVideos: [],
              bookmarkedVideos: [],
              solvedQuestionsCount: 0,
              correctAnswersCount: 0,
              lastStudyDate: new Date().toISOString()
            };

            // Non-blocking background doc creation
            setDoc(userDocRef, { ...profile, ...stats }).catch(e => console.warn("Doc creation error:", e));
          }
        } catch (fsErr) {
          console.warn("[Firestore user doc error]", fsErr);
          profile = {
            name: localParsed.name || user.displayName || user.email?.split("@")[0] || "Estudante Focado",
            email: user.email || localParsed.email || "",
            phone: localParsed.phone || "",
            targetCourse: localParsed.targetCourse || "Medicina",
            targetScore: localParsed.targetScore || 750,
            isLeadCaptured: true,
            uid: user.uid,
            createdAt: new Date().toISOString()
          };
          stats = {
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            streak: 1,
            hoursStudied: 0,
            completedVideos: [],
            bookmarkedVideos: [],
            solvedQuestionsCount: 0,
            correctAnswersCount: 0,
            lastStudyDate: new Date().toISOString()
          };
        }

        setUserProfile(profile);
        setUserStats(stats);

        // Fetch subcollection lists
        try {
          const progressSnap = await getDocs(collection(db, "users", user.uid, "videoProgress"));
          const progressData = progressSnap.docs.map(d => d.data() as VideoProgress);
          setVideoProgress(progressData);

          const examsSnap = await getDocs(collection(db, "users", user.uid, "simulatedExams"));
          const examsData = examsSnap.docs.map(d => d.data() as SimulatedExamResult);
          setSimulatedExams(examsData);

          const essaysSnap = await getDocs(collection(db, "users", user.uid, "essays"));
          const essaysData = essaysSnap.docs.map(d => d.data() as EssaySubmission);
          setEssays(essaysData);

          const aiSnap = await getDocs(collection(db, "users", user.uid, "aiConversations"));
          const aiData = aiSnap.docs.map(d => d.data() as AIConversation);
          setAiConversations(aiData);
        } catch (e) {
          console.error("[Firestore subcollections error]", e);
        }

      } else {
        // Check if there is a saved user profile in localStorage (local session)
        const savedProfile = localStorage.getItem("enemflix_user_profile");
        const savedStats = localStorage.getItem("enemflix_user_stats");

        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile);
            setUserProfile(parsed);
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }

        if (savedStats) {
          try {
            setUserStats(JSON.parse(savedStats));
          } catch (e) {
            // default
          }
        } else {
          setUserStats({
            level: 1,
            xp: 0,
            xpToNextLevel: 1000,
            streak: 1,
            hoursStudied: 0,
            completedVideos: [],
            bookmarkedVideos: [],
            solvedQuestionsCount: 0,
            correctAnswersCount: 0,
            lastStudyDate: new Date().toISOString()
          });
        }
      }
      setIsSyncing(false);
    });

    return unsubscribe;
  }, []);

  // Save/sync stats state
  const saveStats = async (newStats: UserStats, currentProfile = userProfile) => {
    setUserStats(newStats);

    if (currentProfile && currentProfile.uid) {
      // Sync to Firebase
      try {
        await setDoc(doc(db, "users", currentProfile.uid), {
          ...currentProfile,
          ...newStats
        });
      } catch (err) {
        console.error("Error saving stats to Firestore:", err);
      }
    } else {
      // Sync locally (Guest)
      localStorage.setItem("enemflix_user_stats", JSON.stringify(newStats));
    }
  };

  const handleCaptureLead = (profile: LeadProfile) => {
    setUserProfile(profile);
    localStorage.setItem("enemflix_user_profile", JSON.stringify(profile));

    const initialStats: UserStats = {
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      streak: 1,
      hoursStudied: 0.0,
      completedVideos: [],
      bookmarkedVideos: [],
      solvedQuestionsCount: 0,
      correctAnswersCount: 0,
      lastStudyDate: new Date().toISOString()
    };
    saveStats(initialStats, profile);
  };

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair? Seu progresso atual ficará seguro.")) {
      await signOut(auth);
      setUserProfile(null);
      localStorage.removeItem("enemflix_user_profile");
      localStorage.removeItem("enemflix_user_stats");
      localStorage.removeItem("enemflix_video_progress");
      localStorage.removeItem("enemflix_simulated_exams");
      localStorage.removeItem("enemflix_essays");
      localStorage.removeItem("enemflix_ai_conversations");
      setVideoProgress([]);
      setSimulatedExams([]);
      setEssays([]);
      setAiConversations([]);
    }
  };

  // 6. Streak Activity / On Fire Tracker Logic
  const handleStreakActivity = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastStudyDateStr = userStats.lastStudyDate ? userStats.lastStudyDate.split("T")[0] : "";

    if (lastStudyDateStr === todayStr) {
      // Already studied today
      return;
    }

    let newStreak = userStats.streak;
    if (lastStudyDateStr) {
      const lastDate = new Date(lastStudyDateStr);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updatedStats = {
      ...userStats,
      streak: newStreak,
      lastStudyDate: new Date().toISOString()
    };

    saveStats(updatedStats);
  };

  // 7. Level Up and XP Award Formula
  const awardXP = (xpGained: number, currentStats: UserStats): UserStats => {
    let newXp = currentStats.xp + xpGained;
    let newLevel = currentStats.level;
    let newXpToNextLevel = currentStats.xpToNextLevel;

    while (newXp >= newXpToNextLevel) {
      newXp -= newXpToNextLevel;
      newLevel += 1;
      newXpToNextLevel = Math.round(newXpToNextLevel * 1.2);
      
      setTimeout(() => {
        alert(`🎉 PARABÉNS! Você subiu de nível! Agora você é Nível ${newLevel} no EnemFlix. Rumo aos 800+ no ENEM!`);
      }, 300);
    }

    return {
      ...currentStats,
      level: newLevel,
      xp: newXp,
      xpToNextLevel: newXpToNextLevel
    };
  };

  // 8. Video Progress and Mark Completed Action
  const handleToggleBookmark = (videoId: string) => {
    const isBookmarked = userStats.bookmarkedVideos.includes(videoId);
    let updatedBookmarks: string[];

    if (isBookmarked) {
      updatedBookmarks = userStats.bookmarkedVideos.filter(id => id !== videoId);
    } else {
      updatedBookmarks = [...userStats.bookmarkedVideos, videoId];
    }

    saveStats({
      ...userStats,
      bookmarkedVideos: updatedBookmarks
    });
  };

  const handleMarkCompleted = async (videoId: string, xpValue: number) => {
    handleStreakActivity(); // Active streak on video completed!

    if (userStats.completedVideos.includes(videoId)) return;

    const updatedCompleted = [...userStats.completedVideos, videoId];
    const baseStats: UserStats = {
      ...userStats,
      completedVideos: updatedCompleted,
      hoursStudied: userStats.hoursStudied + 0.3
    };

    const statsWithXp = awardXP(xpValue, baseStats);
    await saveStats(statsWithXp);

    // Write progress log
    const progressLog: VideoProgress = {
      videoId,
      status: "completed",
      watchTime: 1800,
      percentComplete: 100,
      lastPosition: 1800,
      lastAccess: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    const updatedProgressList = [...videoProgress.filter(p => p.videoId !== videoId), progressLog];
    setVideoProgress(updatedProgressList);

    if (userProfile && userProfile.uid) {
      await setDoc(doc(db, "users", userProfile.uid, "videoProgress", videoId), progressLog);
    } else {
      localStorage.setItem("enemflix_video_progress", JSON.stringify(updatedProgressList));
    }
  };

  const handleTimerComplete = (hours: number, xpValue: number) => {
    handleStreakActivity(); // Active streak on essay work!

    const baseStats: UserStats = {
      ...userStats,
      hoursStudied: userStats.hoursStudied + hours
    };

    const statsWithXp = awardXP(xpValue, baseStats);
    saveStats(statsWithXp);
  };

  const handleScoreComplete = async (solved: number, correct: number, xpValue: number, examTitle: string) => {
    handleStreakActivity(); // Active streak on exam completed!

    const baseStats: UserStats = {
      ...userStats,
      solvedQuestionsCount: userStats.solvedQuestionsCount + solved,
      correctAnswersCount: userStats.correctAnswersCount + correct
    };

    const statsWithXp = awardXP(xpValue, baseStats);
    await saveStats(statsWithXp);

    // Save Simulated Exam Result document
    const examIdStr = `exam-${Date.now()}`;
    const newExamResult: SimulatedExamResult = {
      id: examIdStr,
      examId: examIdStr,
      examTitle,
      score: Math.round((correct / solved) * 1000), // TRI scaled mockup
      correctAnswers: correct,
      totalQuestions: solved,
      date: new Date().toISOString()
    };

    const updatedExamsList = [newExamResult, ...simulatedExams];
    setSimulatedExams(updatedExamsList);

    if (userProfile && userProfile.uid) {
      await setDoc(doc(db, "users", userProfile.uid, "simulatedExams", newExamResult.examId), newExamResult);
    } else {
      localStorage.setItem("enemflix_simulated_exams", JSON.stringify(updatedExamsList));
    }
  };

  const handleSaveEssay = async (theme: string, text: string, score: number, breakdown: any, fullAnalysis: string) => {
    const newEssay: EssaySubmission = {
      id: `essay-${Date.now()}`,
      theme,
      content: text,
      score,
      correction: breakdown,
      feedback: fullAnalysis,
      date: new Date().toISOString()
    };

    const updatedEssaysList = [newEssay, ...essays];
    setEssays(updatedEssaysList);

    if (userProfile && userProfile.uid) {
      await setDoc(doc(db, "users", userProfile.uid, "essays", newEssay.id), newEssay);
    } else {
      localStorage.setItem("enemflix_essays", JSON.stringify(updatedEssaysList));
    }
  };

  const handleSaveConversation = async (chatId: string, title: string, messagesList: AIMessage[]) => {
    const updatedConversation: AIConversation = {
      id: chatId,
      title,
      messages: messagesList,
      updatedAt: new Date().toISOString()
    };

    const updatedChatsList = [
      updatedConversation,
      ...aiConversations.filter(c => c.id !== chatId)
    ];
    setAiConversations(updatedChatsList);

    if (userProfile && userProfile.uid) {
      await setDoc(doc(db, "users", userProfile.uid, "aiConversations", chatId), updatedConversation);
    } else {
      localStorage.setItem("enemflix_ai_conversations", JSON.stringify(updatedChatsList));
    }
  };

  const handleDeleteConversation = async (chatId: string) => {
    const updatedChatsList = aiConversations.filter(c => c.id !== chatId);
    setAiConversations(updatedChatsList);

    if (activeConversationId === chatId) {
      setActiveConversationId(null);
    }

    if (userProfile && userProfile.uid) {
      try {
        await deleteDoc(doc(db, "users", userProfile.uid, "aiConversations", chatId));
      } catch (err) {
        console.error("Error deleting chat document:", err);
      }
    } else {
      localStorage.setItem("enemflix_ai_conversations", JSON.stringify(updatedChatsList));
    }
  };

  // 9. Video search and categorization lists
  const featuredVideo = VIDEOS_DATA.find(v => v.id === "red-playlist-1") || VIDEOS_DATA[0];

  const searchResults = VIDEOS_DATA.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowMath = VIDEOS_DATA.filter(v => v.category === "Matemática");
  const rowLang = VIDEOS_DATA.filter(v => v.category === "Linguagens");
  const rowRed = VIDEOS_DATA.filter(v => v.category === "Redação");
  const rowHuman = VIDEOS_DATA.filter(v => v.category === "Ciências Humanas");
  const rowNature = VIDEOS_DATA.filter(v => v.category === "Ciências da Natureza");

  const bookmarkList = VIDEOS_DATA.filter(v => userStats.bookmarkedVideos.includes(v.id));

  // Render Gate: Initializing loader
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans" id="enemflix-initializing-screen">
        <h1 className="text-[#e50914] text-5xl font-black tracking-tighter mb-4 animate-pulse">ENEMFLIX</h1>
        <div className="w-10 h-10 border-4 border-t-[#e50914] border-zinc-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render Gate: Capture Leads first
  if (!userProfile || !userProfile.isLeadCaptured) {
    return <LeadCapture onCapture={handleCaptureLead} />;
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans flex flex-col justify-between overflow-x-hidden selection:bg-[#e50914] selection:text-white" id="enemflix-app-root">
      
      {/* 1. Universal Top Navigation */}
      <Navbar 
        userProfile={userProfile}
        userStats={userStats}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Container */}
      <main className="flex-grow pb-24 md:pb-0">
        {searchQuery ? (
          /* Search Overlay Grid View */
          <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8" id="search-results-section">
            <div className="border-b border-white/5 pb-4 text-left">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
                <Search className="w-6 h-6 text-[#e50914]" />
                <span>Resultados para: <span className="text-[#e50914]">"{searchQuery}"</span></span>
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                Encontramos {searchResults.length} episódios correspondentes à sua busca de matérias.
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
                {searchResults.map((video) => {
                  const isFav = userStats.bookmarkedVideos.includes(video.id);
                  const isCompleted = userStats.completedVideos.includes(video.id);

                  return (
                    <div 
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className="bg-[#141414] border border-white/5 ring-1 ring-white/10 rounded-sm overflow-hidden hover:border-[#e50914]/40 hover:ring-2 hover:ring-[#e50914]/30 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-40">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#0a0a0a]/90 border border-white/5 text-[#e50914] px-2 py-0.5 rounded-sm text-[10px] font-black uppercase">
                          {video.subject}
                        </span>
                        {isCompleted && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-bold text-green-400 gap-1.5">
                            <span className="bg-green-600 text-white p-1 rounded-full text-[10px]">✓</span>
                            <span>Completo</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-white line-clamp-2">{video.title}</h3>
                        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
                          <span>{video.duration}</span>
                          <span className="text-[#e50914] font-bold">+{video.xpValue} XP</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 space-y-2">
                <p className="text-zinc-400 font-bold">Nenhum resultado encontrado.</p>
                <p className="text-zinc-500 text-xs">Tente buscar por termos alternativos como "Matemática", "Redação", "História" ou "Ecologia".</p>
              </div>
            )}
          </div>
        ) : (
          /* Standard Navigation Views */
          <>
            {activeTab === "home" && (
              <div className="space-y-4" id="home-view-content">
                {/* Featured Hero Banner */}
                <HeroBanner 
                  featuredVideo={featuredVideo}
                  onPlay={setSelectedVideo}
                  isBookmarked={userStats.bookmarkedVideos.includes(featuredVideo.id)}
                  onToggleBookmark={handleToggleBookmark}
                />

                {/* Video Rails/Rows inside Home */}
                <div className="space-y-6 -mt-16 sm:-mt-24 relative z-20">
                  <VideoRow 
                    title="Minha Lista de Maratonas" 
                    videos={bookmarkList} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Matemática do Zero (TRI Prática)" 
                    videos={rowMath} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Redação Nota 1000" 
                    videos={rowRed} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Ciências da Natureza" 
                    videos={rowNature} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Ciências Humanas e Sociais" 
                    videos={rowHuman} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Linguagens, Códigos e suas Tecnologias (Inglês, Espanhol e Português)" 
                    videos={rowLang} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </div>
              </div>
            )}

            {activeTab === "disciplinas" && (
              <div className="pt-24 space-y-6" id="subject-gallery-view">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900 pb-4 text-left">
                  <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-2">
                    <Compass className="w-8 h-8 text-red-500" />
                    <span>Grade Geral por <span className="text-red-500">Área do Conhecimento</span></span>
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Explore as trilhas temáticas obrigatórias do ENEM.</p>
                </div>

                <div className="space-y-2">
                  <VideoRow 
                    title="Redação ENEM" 
                    videos={rowRed} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Matemática e suas Tecnologias" 
                    videos={rowMath} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Ciências da Natureza e suas Tecnologias" 
                    videos={rowNature} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Ciências Humanas e suas Tecnologias" 
                    videos={rowHuman} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />

                  <VideoRow 
                    title="Linguagens, Códigos e suas Tecnologias" 
                    videos={rowLang} 
                    onPlay={setSelectedVideo} 
                    bookmarkedIds={userStats.bookmarkedVideos}
                    completedIds={userStats.completedVideos}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </div>
              </div>
            )}

            {activeTab === "redacao-treino" && (
              <EssayTraining 
                userStats={userStats}
                userProfile={userProfile}
                onTimerComplete={handleTimerComplete}
                onSaveEssay={handleSaveEssay}
              />
            )}

            {activeTab === "simulados" && (
              <Simulator 
                onScoreComplete={handleScoreComplete}
              />
            )}

            {activeTab === "ai" && (
              <AIPanel 
                userStats={userStats}
                userProfile={userProfile}
                conversations={aiConversations}
                activeConversationId={activeConversationId}
                onSaveConversation={handleSaveConversation}
                onDeleteConversation={handleDeleteConversation}
                onSelectConversation={setActiveConversationId}
                onTriggerStreakActivity={handleStreakActivity}
              />
            )}

            {activeTab === "profile" && (
              <UserProfileTab 
                userProfile={userProfile}
                userStats={userStats}
                videoProgress={videoProgress}
                simulatedExams={simulatedExams}
                essays={essays}
                aiConversations={aiConversations}
                onPlayVideo={setSelectedVideo}
                onSelectConversation={(chatId) => {
                  setActiveConversationId(chatId);
                  setActiveTab("ai");
                }}
                onDeleteConversation={handleDeleteConversation}
              />
            )}
          </>
        )}
      </main>

      {/* 3. Global Dynamic Overlay Video Player Modal */}
      <VideoModal 
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        isBookmarked={selectedVideo ? userStats.bookmarkedVideos.includes(selectedVideo.id) : false}
        isCompleted={selectedVideo ? userStats.completedVideos.includes(selectedVideo.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onMarkCompleted={handleMarkCompleted}
      />

      {/* 4. Mobile Bottom Sticky Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 backdrop-blur-md py-2.5 px-4 z-40 flex items-center justify-around shadow-2xl pb-safe">
        <button
          type="button"
          onClick={() => {
            setActiveTab("home");
            setSearchQuery("");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === "home" ? "text-[#e50914] scale-105" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Início</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("disciplinas");
            setSearchQuery("");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === "disciplinas" ? "text-[#e50914] scale-105" : "text-zinc-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-bold">Matérias</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("redacao-treino");
            setSearchQuery("");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === "redacao-treino" ? "text-[#e50914] scale-105" : "text-zinc-400 hover:text-white"
          }`}
        >
          <PenTool className="w-5 h-5" />
          <span className="text-[10px] font-bold">Redação</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("simulados");
            setSearchQuery("");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === "simulados" ? "text-[#e50914] scale-105" : "text-zinc-400 hover:text-white"
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-bold">Simulados</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ai");
            setSearchQuery("");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === "ai" ? "text-[#e50914] scale-105" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Brain className="w-5 h-5" />
          <span className="text-[10px] font-bold">EnemFlix AI</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("profile");
            setSearchQuery("");
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeTab === "profile" ? "text-[#e50914] scale-105" : "text-zinc-400 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold">Perfil</span>
        </button>
      </div>

      {/* 5. Elegant footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a]/90 py-10 mt-16 text-zinc-500 text-xs relative z-30 pb-28 md:pb-10" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 select-none">
              <h1 className="text-[#e50914] text-xl font-black tracking-tighter">ENEMFLIX</h1>
            </div>
            <p className="text-zinc-500">© 2026 EnemFlix. Todos os direitos reservados. Feito para vestibulandos de alta performance.</p>
          </div>
          <div className="border-t border-white/5 pt-4 text-center text-[10px] text-zinc-600">
            A plataforma EnemFlix utiliza videoaulas públicas e abertas de canais educacionais parceiros do YouTube, agrupando-as pedagogicamente sem fins lucrativos ou autorais proprietários, atuando como um facilitador de roteiros curriculares do ENEM.
          </div>
        </div>
      </footer>

    </div>
  );
}
