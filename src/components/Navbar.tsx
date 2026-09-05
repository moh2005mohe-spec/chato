import React from 'react';
import { MessageSquare, BookOpen } from 'lucide-react';
import { AuthHeaderControls } from './ClerkAuthWrapper';

interface NavbarProps {
  userName: string;
  userAvatar: string;
  onUserSet: (name: string, avatar: string) => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar, onUserSet, onOpenRules }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-red-100 px-4 lg:px-8 py-3">
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

        {/* Actions & Auth */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-slate-200"
            title="Language Exchange Rules"
          >
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Exchange Rules</span>
          </button>

          <AuthHeaderControls userName={userName} userAvatar={userAvatar} onUserSet={onUserSet} />
        </div>
      </div>
    </header>
  );
};
