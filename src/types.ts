export interface SubVideo {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "12 min"
  youtubeId: string; // Real or high-quality educational youtube video embed ID
  playlistId?: string; // Optional YouTube playlist ID
  subVideos?: SubVideo[]; // Sub-videos for playlist navigation
  category: "Matemática" | "Linguagens" | "Redação" | "Ciências Humanas" | "Ciências da Natureza";
  subject: string; // e.g. "Matemática Básica", "Estatística"
  difficulty: "Fácil" | "Médio" | "Difícil";
  thumbnail: string; // Movie cover thumbnail
  views: number;
  likes: number;
  xpValue: number;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number; // Daily study streak in days
  hoursStudied: number;
  completedVideos: string[]; // IDs of watched videos
  bookmarkedVideos: string[]; // IDs of favorited videos
  solvedQuestionsCount: number;
  correctAnswersCount: number;
  lastStudyDate: string; // ISO date string
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  unlockedAt?: string;
  xpReward: number;
  category: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  level: number;
  xp: number;
  isCurrentUser?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  subject: string;
  area?: "matematica" | "natureza" | "humanas" | "linguagens";
  triDifficulty?: "Fácil" | "Médio" | "Difícil";
  triWeight?: number;
  year?: string;
}

export interface SimulatedExam {
  id: string;
  title: string;
  questions: Question[];
  durationMinutes: number;
}

export interface LeadProfile {
  name: string;
  email: string;
  phone: string;
  targetCourse: string; // e.g. "Medicina", "Engenharia"
  targetScore: number; // Target ENEM score (e.g. 800)
  isLeadCaptured: boolean;
  uid?: string; // Firebase Auth UID if logged in
  isGuest?: boolean; // if browsing as guest
  createdAt?: string; // registration date
}

export interface SimulatedExamResult {
  id: string;
  examId: string;
  examTitle: string;
  date: string; // ISO date string
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface EssaySubmission {
  id: string;
  date: string;
  theme: string;
  content: string;
  score: number;
  correction: string;
  feedback: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  updatedAt: string;
}

export interface VideoProgress {
  videoId: string;
  status: "not_started" | "in_progress" | "completed";
  watchTime: number; // in minutes
  percentComplete: number; // 0 to 100
  lastPosition: number; // in seconds
  lastAccess: string; // ISO string
  completedAt?: string; // ISO string
}
