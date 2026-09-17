import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  targetCourse?: string;
  targetScore?: number;
  type: "auth" | "guest" | "google";
  createdAt: string;
  lastLogin: string;
  lastLoginAt?: string;
  lastActiveAt?: string;
  expiresAt?: string;
  limitDays?: number;
  loginCount: number;
  status?: "active" | "disconnected" | "banned" | "expired";
  isBanned?: boolean;
  bannedAt?: string | null;
  banReason?: string | null;
  isDisconnected?: boolean;
  disconnectedAt?: string | null;
  userAgent?: string;
  // Progress & Study Stats:
  level?: number;
  xp?: number;
  xpToNextLevel?: number;
  streak?: number;
  hoursStudied?: number;
  completedVideos?: string[];
  bookmarkedVideos?: string[];
  solvedQuestionsCount?: number;
  correctAnswersCount?: number;
  lastStudyDate?: string;
  videoProgress?: any[];
  simulatedExams?: any[];
  essays?: any[];
  aiConversations?: any[];
}

export interface UserUsage {
  daysUsing: number;
  daysRemaining: number;
  isExpired: boolean;
  progressPercentage: number;
  timeUsingFormatted: string;
  expirationDate: string;
  limitDays: number;
}

// Load Firebase Config
function getFirebaseConfig() {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw);
  }
  return {
    projectId: "gen-lang-client-0086696695",
    apiKey: "AIzaSyA9X_4X_1vUTIj20JwOl8ghKbNLyBwZRv4",
    firestoreDatabaseId: "ai-studio-enemflix-6e81c336-1801-4be6-8546-b4474370f682"
  };
}

const firebaseConfig = getFirebaseConfig();
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents`;
const API_KEY = firebaseConfig.apiKey;
const LIMIT_DAYS = 365;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `pbkdf2$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored?: string): boolean {
  if (!stored) return false;
  if (!stored.startsWith("pbkdf2$")) {
    return stored === password;
  }
  const parts = stored.split("$");
  if (parts.length !== 3) return false;
  const salt = parts[1];
  const hash = parts[2];
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

export function calculateUsage(createdAtIso: string): UserUsage {
  const start = new Date(createdAtIso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - start);

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  let timeUsingFormatted = "";
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    const remDays = diffDays % 365;
    timeUsingFormatted = `${diffDays} dias (${years} ano${years > 1 ? "s" : ""}${remDays > 0 ? ` e ${remDays}d` : ""})`;
  } else if (diffDays > 0) {
    const remHours = diffHours % 24;
    timeUsingFormatted = `${diffDays} dia${diffDays > 1 ? "s" : ""}${remHours > 0 ? ` e ${remHours}h` : ""}`;
  } else if (diffHours > 0) {
    const remMins = diffMinutes % 60;
    timeUsingFormatted = `${diffHours} hora${diffHours > 1 ? "s" : ""}${remMins > 0 ? ` e ${remMins}m` : ""}`;
  } else if (diffMinutes > 0) {
    timeUsingFormatted = `${diffMinutes} minuto${diffMinutes > 1 ? "s" : ""}`;
  } else {
    timeUsingFormatted = "Menos de 1 minuto";
  }

  const daysUsing = diffDays;
  const daysRemaining = Math.max(0, LIMIT_DAYS - daysUsing);
  const isExpired = daysUsing >= LIMIT_DAYS;
  const progressPercentage = Math.min(100, Math.round((daysUsing / LIMIT_DAYS) * 100));
  const expirationDate = new Date(start + LIMIT_DAYS * 24 * 60 * 60 * 1000).toISOString();

  return {
    daysUsing,
    daysRemaining,
    isExpired,
    progressPercentage,
    timeUsingFormatted,
    expirationDate,
    limitDays: LIMIT_DAYS
  };
}

function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (val === null) {
      fields[key] = { nullValue: null };
    } else if (typeof val === "boolean") {
      fields[key] = { booleanValue: val };
    } else if (typeof val === "number") {
      if (Number.isInteger(val)) {
        fields[key] = { integerValue: String(val) };
      } else {
        fields[key] = { doubleValue: val };
      }
    } else if (typeof val === "string") {
      fields[key] = { stringValue: val };
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map(v => {
            if (v === null || v === undefined) return { nullValue: null };
            if (typeof v === "boolean") return { booleanValue: v };
            if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
            if (typeof v === "string") return { stringValue: v };
            if (typeof v === "object") return { mapValue: { fields: toFirestoreFields(v) } };
            return { stringValue: String(v) };
          })
        }
      };
    } else if (typeof val === "object") {
      fields[key] = { mapValue: { fields: toFirestoreFields(val) } };
    }
  }
  return fields;
}

function fromFirestoreFields(fields: Record<string, any> = {}): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(fields)) {
    if ("stringValue" in val) result[key] = val.stringValue;
    else if ("booleanValue" in val) result[key] = val.booleanValue;
    else if ("integerValue" in val) result[key] = parseInt(val.integerValue, 10);
    else if ("doubleValue" in val) result[key] = val.doubleValue;
    else if ("nullValue" in val) result[key] = null;
    else if ("arrayValue" in val) {
      result[key] = (val.arrayValue?.values || []).map((item: any) => {
        if ("stringValue" in item) return item.stringValue;
        if ("booleanValue" in item) return item.booleanValue;
        if ("integerValue" in item) return parseInt(item.integerValue, 10);
        if ("doubleValue" in item) return item.doubleValue;
        if ("nullValue" in item) return null;
        if ("mapValue" in item) return fromFirestoreFields(item.mapValue.fields);
        return item;
      });
    } else if ("mapValue" in val) {
      result[key] = fromFirestoreFields(val.mapValue.fields);
    }
  }
  return result;
}

// In-memory cache synced with Firestore for performance
let cachedUsers: FirestoreUser[] = [];
let lastCacheSync = 0;
const CACHE_TTL_MS = 2500; // 2.5 seconds cache TTL

export async function getAllUsersFromFirestore(forceRefresh = false): Promise<FirestoreUser[]> {
  const now = Date.now();
  if (!forceRefresh && cachedUsers.length > 0 && now - lastCacheSync < CACHE_TTL_MS) {
    return cachedUsers;
  }

  try {
    const res = await fetch(`${BASE_URL}:runQuery?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "users" }]
        }
      })
    });

    if (!res.ok) {
      console.warn("getAllUsersFromFirestore non-200 status:", res.status);
      return cachedUsers;
    }

    const data = await res.json();
    if (!Array.isArray(data)) return cachedUsers;

    const list: FirestoreUser[] = [];
    for (const item of data) {
      if (item.document && item.document.fields) {
        const u = fromFirestoreFields(item.document.fields) as FirestoreUser;
        if (u && u.email && u.uid) {
          // Normalize fields
          if (!u.lastLogin && u.lastLoginAt) u.lastLogin = u.lastLoginAt;
          if (!u.expiresAt) {
            u.expiresAt = new Date(new Date(u.createdAt || Date.now()).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
          }
          if (!u.status) {
            u.status = u.isBanned ? "banned" : u.isDisconnected ? "disconnected" : "active";
          }
          list.push(u);
        }
      }
    }

    cachedUsers = list;
    lastCacheSync = now;
    return list;
  } catch (err) {
    console.error("Erro ao carregar usuários do Firestore:", err);
    return cachedUsers;
  }
}

export async function getUserByEmailFromFirestore(email: string): Promise<FirestoreUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  // Check memory cache first
  const cachedMatches = cachedUsers.filter(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (cachedMatches.length > 0 && Date.now() - lastCacheSync < CACHE_TTL_MS) {
    cachedMatches.sort((a, b) => {
      if (a.password && !b.password) return -1;
      if (!a.password && b.password) return 1;
      const tA = new Date(a.lastLogin || a.createdAt || 0).getTime();
      const tB = new Date(b.lastLogin || b.createdAt || 0).getTime();
      return tB - tA;
    });
    return cachedMatches[0];
  }

  // Refresh from Firestore
  const all = await getAllUsersFromFirestore(true);
  const matches = all.filter(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (matches.length === 0) return null;

  matches.sort((a, b) => {
    if (a.password && !b.password) return -1;
    if (!a.password && b.password) return 1;
    const tA = new Date(a.lastLogin || a.createdAt || 0).getTime();
    const tB = new Date(b.lastLogin || b.createdAt || 0).getTime();
    return tB - tA;
  });

  return matches[0];
}

export async function getUserByUidFromFirestore(uid: string): Promise<FirestoreUser | null> {
  if (!uid) return null;
  const cached = cachedUsers.find(u => u.uid === uid);
  if (cached && Date.now() - lastCacheSync < CACHE_TTL_MS) {
    return cached;
  }

  try {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(uid)}?key=${API_KEY}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.fields) {
        const u = fromFirestoreFields(data.fields) as FirestoreUser;
        return u;
      }
    }
  } catch (err) {
    console.warn("Erro ao buscar usuário por UID no Firestore:", err);
  }

  const all = await getAllUsersFromFirestore(true);
  return all.find(u => u.uid === uid) || null;
}

export async function saveUserToFirestore(user: FirestoreUser): Promise<boolean> {
  try {
    const docUrl = `${BASE_URL}/users/${encodeURIComponent(user.uid)}?key=${API_KEY}`;
    const fields = toFirestoreFields(user);

    const res = await fetch(docUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });

    if (res.ok) {
      // Update memory cache immediately
      const idx = cachedUsers.findIndex(u => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase());
      if (idx >= 0) {
        cachedUsers[idx] = { ...cachedUsers[idx], ...user };
      } else {
        cachedUsers.unshift(user);
      }
      return true;
    } else {
      const errText = await res.text();
      console.error("Erro ao salvar no Firestore (status " + res.status + "):", errText);
      return false;
    }
  } catch (err) {
    console.error("Exceção ao salvar usuário no Firestore:", err);
    return false;
  }
}

export async function updateUserInFirestore(uid: string, updates: Partial<FirestoreUser>): Promise<boolean> {
  try {
    // Read current user to merge safely
    const current = await getUserByUidFromFirestore(uid);
    if (!current) {
      console.warn("updateUserInFirestore: usuário não encontrado para UID:", uid);
      return false;
    }

    const merged: FirestoreUser = {
      ...current,
      ...updates
    };

    return await saveUserToFirestore(merged);
  } catch (err) {
    console.error("Erro ao atualizar usuário no Firestore:", err);
    return false;
  }
}

export async function deleteUserFromFirestore(uid: string): Promise<boolean> {
  try {
    const docUrl = `${BASE_URL}/users/${encodeURIComponent(uid)}?key=${API_KEY}`;
    const res = await fetch(docUrl, { method: "DELETE" });

    cachedUsers = cachedUsers.filter(u => u.uid !== uid);
    return res.ok;
  } catch (err) {
    console.error("Erro ao excluir usuário no Firestore:", err);
    return false;
  }
}

export async function getUserProgressFromFirestore(uid: string) {
  const user = await getUserByUidFromFirestore(uid);
  if (!user) return null;
  return {
    level: user.level || 1,
    xp: user.xp || 0,
    xpToNextLevel: user.xpToNextLevel || 1000,
    streak: user.streak || 1,
    hoursStudied: user.hoursStudied || 0,
    completedVideos: user.completedVideos || [],
    bookmarkedVideos: user.bookmarkedVideos || [],
    solvedQuestionsCount: user.solvedQuestionsCount || 0,
    correctAnswersCount: user.correctAnswersCount || 0,
    lastStudyDate: user.lastStudyDate || new Date().toISOString(),
    videoProgress: user.videoProgress || [],
    simulatedExams: user.simulatedExams || [],
    essays: user.essays || [],
    aiConversations: user.aiConversations || []
  };
}

export async function saveUserProgressToFirestore(uid: string, progressData: any): Promise<boolean> {
  try {
    return await updateUserInFirestore(uid, {
      ...progressData,
      lastActiveAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("Erro ao salvar progresso no Firestore:", err);
    return false;
  }
}

