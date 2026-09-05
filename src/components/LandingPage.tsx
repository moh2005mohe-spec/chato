import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { Globe, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col selection:bg-black selection:text-white">
      {/* Top Header */}
      <header className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold tracking-tight text-base">
            C
          </div>
          <span className="text-lg font-black tracking-tighter">Chato</span>
        </div>

        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
              Sign In / Register
            </button>
          </SignInButton>
        </div>
      </header>

      {/* Hero Section with Editorial Photography */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Language & Cultural Exchange</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-black">
            Master languages through authentic human connection.
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl">
            Connect directly with native speakers from Algiers 🇩🇿, London 🇬🇧, Paris 🇫🇷, and beyond. Practice real conversational text chat, correct each other's grammar, and share cultural traditions in real time.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <SignInButton mode="modal">
              <button className="bg-black hover:bg-neutral-800 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer">
                <span>Start Language Exchange</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignInButton>
          </div>

          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-neutral-200">
            <div>
              <p className="text-2xl font-black text-black">100%</p>
              <p className="text-xs text-neutral-500 mt-0.5">Real Native Partners</p>
            </div>
            <div>
              <p className="text-2xl font-black text-black">50/50</p>
              <p className="text-xs text-neutral-500 mt-0.5">Reciprocal Exchange</p>
            </div>
            <div>
              <p className="text-2xl font-black text-black">24/7</p>
              <p className="text-xs text-neutral-500 mt-0.5">Active Global Community</p>
            </div>
          </div>
        </div>

        {/* Editorial Portrait Imagery */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-200 shadow-xl aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Language Partner"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">London, UK 🇬🇧</span>
                <p className="text-sm font-bold mt-0.5">Liam & Sarah</p>
                <p className="text-[11px] text-neutral-300">French ⇄ English Exchange</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Smart 2-Step Matching</span>
              </div>
              <p className="text-xs text-neutral-600">
                Instantly pair with partners who match your exact target language and cultural interests.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="p-5 rounded-2xl bg-black text-white space-y-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Live Correction</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                "Correct each other's sentences naturally like lifelong friends exchanging cultural stories."
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-neutral-200 shadow-xl aspect-[3/4]">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80"
                alt="Cultural Exchange"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Algiers, Algeria 🇩🇿</span>
                <p className="text-sm font-bold mt-0.5">Yasmine & Thomas</p>
                <p className="text-[11px] text-neutral-300">Arabic ⇄ French ⇄ English</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 px-6 mt-auto text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Chato Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <SignInButton mode="modal">
              <button className="hover:text-black transition-colors cursor-pointer">Sign In</button>
            </SignInButton>
          </div>
        </div>
      </footer>
    </div>
  );
};
