export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popularIn?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  nativeLanguage: Language;
  targetLanguage: Language;
  location: string;
  flag: string;
  bio: string;
  isOnline: boolean;
  interests: string[];
}

export interface LanguageCorrection {
  id: string;
  messageId: string;
  originalText: string;
  correctedText: string;
  explanation: string;
  correctedBy: string; // name
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isNative: boolean; // whether sent in native language or target language
  translatedText?: string;
  correction?: LanguageCorrection;
  audioUrl?: string;
}

export interface MatchSession {
  id: string;
  partner: UserProfile;
  nativeLang: Language;
  targetLang: Language;
  startedAt: string;
  timerMinutes: number;
  activePhase: 'native' | 'target' | 'balanced';
}
