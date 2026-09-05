import { UserProfile } from '../types';
import { getLanguageByCode } from './languages';

export const MOCK_PARTNERS: UserProfile[] = [
  {
    id: 'partner_liam',
    name: 'Liam Henderson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nativeLanguage: getLanguageByCode('en'),
    targetLanguage: getLanguageByCode('fr'),
    location: 'London, United Kingdom 🇬🇧',
    flag: '🇬🇧',
    bio: 'Software developer in London. Love football, literature, and learning conversational French & North African culture!',
    isOnline: true,
    interests: ['Football', 'Tech', 'Travel', 'Cinema']
  },
  {
    id: 'partner_sarah',
    name: 'Sarah Benali',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    nativeLanguage: getLanguageByCode('ar'),
    targetLanguage: getLanguageByCode('en'),
    location: 'Algiers, Algeria 🇩🇿',
    flag: '🇩🇿',
    bio: 'University student studying translation in Algiers. Native in Arabic & French, looking to master spoken English!',
    isOnline: true,
    interests: ['Languages', 'Cooking', 'Literature', 'Photography']
  },
  {
    id: 'partner_camille',
    name: 'Camille Laurent',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    nativeLanguage: getLanguageByCode('fr'),
    targetLanguage: getLanguageByCode('en'),
    location: 'Lyon, France 🇫🇷',
    flag: '🇫🇷',
    bio: 'Architect based in Lyon. Passionate about urban design, coffee shops, and practicing English with friendly language partners.',
    isOnline: true,
    interests: ['Architecture', 'Gastronomy', 'Art', 'Hiking']
  },
  {
    id: 'partner_karim',
    name: 'Karim Mansouri',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    nativeLanguage: getLanguageByCode('fr'),
    targetLanguage: getLanguageByCode('en'),
    location: 'Oran, Algeria 🇩🇿',
    flag: '🇩🇿',
    bio: 'Graphic designer from Oran. Fluent in Algerian Arabic & French, eager to chat in English and exchange local traditions!',
    isOnline: true,
    interests: ['Graphic Design', 'Music', 'Coastal Travel', 'History']
  },
  {
    id: 'partner_elena',
    name: 'Elena Garcia',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    nativeLanguage: getLanguageByCode('es'),
    targetLanguage: getLanguageByCode('en'),
    location: 'Madrid, Spain 🇪🇸',
    flag: '🇪🇸',
    bio: 'High school teacher in Madrid. Learning English to travel and prepare for overseas exchange programs.',
    isOnline: true,
    interests: ['Education', 'Gardening', 'Yoga', 'Culture']
  },
  {
    id: 'partner_lukas',
    name: 'Lukas Weber',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    nativeLanguage: getLanguageByCode('de'),
    targetLanguage: getLanguageByCode('ar'),
    location: 'Berlin, Germany 🇩🇪',
    flag: '🇩🇪',
    bio: 'Journalist interested in Mediterranean politics and Arabic language studies. Happy to help you practice German!',
    isOnline: true,
    interests: ['Current Affairs', 'Podcasts', 'Biking', 'Philosophy']
  }
];

export const CULTURAL_TOPICS = [
  {
    category: 'Food & Cuisine',
    prompt: 'What is the most iconic traditional dish in your country? How is it usually prepared?'
  },
  {
    category: 'Daily Life',
    prompt: 'How do people in your city usually spend a relaxed Sunday morning?'
  },
  {
    category: 'Expressions & Slang',
    prompt: 'What is a popular everyday expression or idiom in your language that doesn’t translate literally?'
  },
  {
    category: 'Travel & Landmarks',
    prompt: 'If I were to visit your hometown for just 24 hours, where should I definitely go?'
  },
  {
    category: 'Music & Media',
    prompt: 'What music artists or movies are currently trending in your country right now?'
  }
];
