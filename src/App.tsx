import React, { useState } from 'react';
import { ClerkAppWrapper } from './components/ClerkAuthWrapper';
import { Navbar } from './components/Navbar';
import { StepLanguageSelector } from './components/StepLanguageSelector';
import { MatchingModal } from './components/MatchingModal';
import { ChatRoom } from './components/ChatRoom';
import { RulesModal } from './components/RulesModal';
import { LANGUAGES, getLanguageByCode } from './data/languages';
import { Language, UserProfile } from './types';
import { Globe, Users, ArrowRight, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'selection' | 'matching' | 'chat'>('selection');
  
  // Default languages based on user request: Native = French or Arabic, Target = English
  const [nativeLang, setNativeLang] = useState<Language>(getLanguageByCode('fr'));
  const [targetLang, setTargetLang] = useState<Language>(getLanguageByCode('en'));
  
  const [userName, setUserName] = useState<string>('Guest Learner');
  const [userAvatar, setUserAvatar] = useState<string>(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  );
  
  const [activePartner, setActivePartner] = useState<UserProfile | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  const handleUserSet = (name: string, avatar: string) => {
    setUserName(name);
    setUserAvatar(avatar);
  };

  const handleStartMatch = () => {
    setView('matching');
  };

  const handleMatchFound = (partner: UserProfile) => {
    setActivePartner(partner);
    setView('chat');
  };

  const handleEndChat = () => {
    setActivePartner(null);
    setView('selection');
  };

  const handleNextMatch = () => {
    setActivePartner(null);
    setView('matching');
  };

  return (
    <ClerkAppWrapper>
      <div className="min-h-screen bg-slate-100/60 font-sans text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar
          userName={userName}
          userAvatar={userAvatar}
          onUserSet={handleUserSet}
          onOpenRules={() => setShowRulesModal(true)}
        />

        <main className="flex-1 flex flex-col items-center justify-start">
          {view === 'selection' && (
            <StepLanguageSelector
              nativeLang={nativeLang}
              targetLang={targetLang}
              onSelectNative={setNativeLang}
              onSelectTarget={setTargetLang}
              onStartMatch={handleStartMatch}
            />
          )}

          {view === 'matching' && (
            <MatchingModal
              nativeLang={nativeLang}
              targetLang={targetLang}
              userName={userName}
              onMatchFound={handleMatchFound}
              onCancel={() => setView('selection')}
            />
          )}

          {view === 'chat' && activePartner && (
            <ChatRoom
              partner={activePartner}
              userNativeLang={nativeLang}
              userTargetLang={targetLang}
              userName={userName}
              userAvatar={userAvatar}
              onEndChat={handleEndChat}
              onNextMatch={handleNextMatch}
            />
          )}
        </main>

        {/* Global Footer (Visible on selection screen) */}
        {view === 'selection' && (
          <footer className="border-t border-slate-200/80 bg-white py-6 px-4 mt-12 text-xs text-slate-500 text-center space-y-2">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Chato</span>
                <span>• Global Language Exchange Community</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <span>🇩🇿 Algerian & European Exchange Hub</span>
                <span>🇬🇧 🇫🇷 🇪🇸 🇩🇪 🇮🇹</span>
              </div>
            </div>
          </footer>
        )}

        {/* Rules Modal */}
        {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}
      </div>
    </ClerkAppWrapper>
  );
}
