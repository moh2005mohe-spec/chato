import React, { useState } from 'react';
import { MessageSquare, Users, Globe2, BookOpen, Info } from 'lucide-react';
import { AuthHeaderControls } from './ClerkAuthWrapper';

interface NavbarProps {
  userName: string;
  userAvatar: string;
  onUserSet: (name: string, avatar: string) => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, userAvatar, onUserSet, onOpenRules }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 flex items-center justify-center text-white shadow-xs">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Chato</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Language Exchange
            </span>
          </div>
        </div>

        {/* Live Online Counter */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>1,482 members online</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-700 font-normal">Algiers 🇩🇿, London 🇬🇧, Paris 🇫🇷</span>
        </div>

        {/* Actions & Auth */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Language Exchange Rules"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exchange Rules</span>
          </button>

          <AuthHeaderControls userName={userName} userAvatar={userAvatar} onUserSet={onUserSet} />
        </div>
      </div>
    </header>
  );
};
