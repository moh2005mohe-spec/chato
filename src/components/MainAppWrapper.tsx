import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { LandingPage } from './LandingPage';
import { ProfileSetupModal } from './ProfileSetupModal';
import { Dashboard } from './Dashboard';
import { ChatRoom } from './ChatRoom';
import { MessagesHistory } from './MessagesHistory';
import { Navbar } from './Navbar';
import { RulesModal } from './RulesModal';
import { UserProfile } from '../types';
import { getLanguageByCode } from '../data/languages';
import { MOCK_PARTNERS } from '../data/mockPartners';

export const MainAppWrapper: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [activeChatPartner, setActiveChatPartner] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages'>('dashboard');

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const defaultProfile: UserProfile = {
        id: user.id,
        name: user.fullName || user.firstName || 'Learner',
        avatar: user.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        nativeLanguage: getLanguageByCode('fr'),
        targetLanguage: getLanguageByCode('en'),
        location: 'Algeria 🇩🇿',
        flag: '🇩🇿',
        bio: 'Exploring languages and cultures through daily conversation.',
        isOnline: true,
        interests: ['Travel & Culture', 'Football'],
      };
      setCurrentUserProfile(defaultProfile);
      const hasCompleted = localStorage.getItem(`chato_profile_${user.id}`);
      if (!hasCompleted) {
        setShowProfileSetup(true);
      }
    } else if (isLoaded && !isSignedIn) {
      setCurrentUserProfile(null);
    }
  }, [isLoaded, isSignedIn, user]);

  const handleSaveProfile = (partial: Partial<UserProfile>) => {
    if (currentUserProfile) {
      const updated = { ...currentUserProfile, ...partial };
      setCurrentUserProfile(updated);
      if (user) {
        localStorage.setItem(`chato_profile_${user.id}`, 'true');
      }
    }
    setShowProfileSetup(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col selection:bg-red-600 selection:text-white">
      <Navbar
        userName={currentUserProfile?.name || ''}
        userAvatar={currentUserProfile?.avatar || ''}
        onUserSet={(name, avatar) => {
          if (currentUserProfile) {
            setCurrentUserProfile({ ...currentUserProfile, name, avatar });
          }
        }}
        onOpenRules={() => setShowRulesModal(true)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveChatPartner(null);
        }}
      />

      <main className="flex-1 flex flex-col">
        {!isSignedIn ? (
          <LandingPage />
        ) : activeChatPartner && currentUserProfile ? (
          <ChatRoom
            partner={activeChatPartner}
            currentUser={currentUserProfile}
            onEndChat={() => setActiveChatPartner(null)}
            onNextMatch={() => {
              const next = MOCK_PARTNERS.find((p) => p.id !== activeChatPartner.id) || MOCK_PARTNERS[0];
              setActiveChatPartner(next);
            }}
          />
        ) : activeTab === 'messages' && currentUserProfile ? (
          <MessagesHistory
            currentUser={currentUserProfile}
            onStartChat={(partner) => setActiveChatPartner(partner)}
          />
        ) : currentUserProfile ? (
          <Dashboard
            currentUser={currentUserProfile}
            onStartChat={(partner) => setActiveChatPartner(partner)}
            onEditProfile={() => setShowProfileSetup(true)}
          />
        ) : null}
      </main>

      {showProfileSetup && currentUserProfile && (
        <ProfileSetupModal
          initialName={currentUserProfile.name}
          initialAvatar={currentUserProfile.avatar}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}
    </div>
  );
};
