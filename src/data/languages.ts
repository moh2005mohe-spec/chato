import { Language } from '../types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', popularIn: ['UK', 'USA', 'Global'] },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popularIn: ['France', 'Belgium', 'Canada', 'Algeria'] },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇩🇿', popularIn: ['Algeria', 'Middle East', 'North Africa'] },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popularIn: ['Spain', 'Latin America'] },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', popularIn: ['Germany', 'Austria', 'Switzerland'] },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', popularIn: ['Italy'] },
  { code: 'ber', name: 'Tamazight', nativeName: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', flag: '🇩🇿', popularIn: ['Algeria', 'Morocco'] },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', popularIn: ['Turkey'] },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', popularIn: ['Portugal', 'Brazil'] },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', popularIn: ['Eastern Europe'] },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', popularIn: ['Japan'] },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', popularIn: ['China', 'Global'] },
];

export function getLanguageByCode(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export function safeLanguage(lang: any): Language {
  if (!lang) return LANGUAGES[0];
  if (typeof lang === 'string') {
    return getLanguageByCode(lang);
  }
  return {
    code: lang.code || 'en',
    name: lang.name || 'English',
    nativeName: lang.nativeName || 'English',
    flag: lang.flag || '🌐',
    popularIn: lang.popularIn || [],
  };
}

