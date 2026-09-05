import React from 'react';
import { useClerk } from '@clerk/clerk-react';
import { MessageSquare, BookOpen, MessageCircle, LogOut } from 'lucide-react';
import { AuthHeaderControls } from './ClerkAuthWrapper';

interface NavbarProps {
  userName: string;
  userAvatar: string;
  onUserSet: (name: string, avatar: string) => void;
  onOpenRules: () => void;
  activeTab: 'dashboard' | 'messages';
  onTabChange: (tab: 'dashboard' | 'messages') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  userAvatar,
  onUserSet,
  onOpenRules,
  activeTab,
  onTabChange,
}) => {
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-red-100 px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/20">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900">Chato</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              Language Exchange
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Dashboard vs Messages) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المطابقة والشركاء (Partners)
          </button>
          <button
            onClick={() => onTabChange('messages')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>الرسائل والدردشات (Messages)</span>
          </button>
        </div>

        {/* Actions & Auth & Logout Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-slate-200"
            title="Language Exchange Rules"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          <AuthHeaderControls userName={userName} userAvatar={userAvatar} onUserSet={onUserSet} />

          {/* Logout Button (زر خروج) */}
          <button
            onClick={() => signOut(() => window.location.reload())}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer border border-red-200 shadow-2xs"
            title="تسجيل الخروج (Logout)"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج (Logout)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
