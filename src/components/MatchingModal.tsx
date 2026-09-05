import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MessageSquare, ArrowRight, ArrowLeft, X, Sparkles, Heart, Globe, Award, Shield } from 'lucide-react';
import { safeLanguage } from '../data/languages';

interface MatchingModalProps {
  currentUser: UserProfile;
  partners: UserProfile[];
  onStartChat: (partner: UserProfile) => void;
  onClose: () => void;
}

export const MatchingModal: React.FC<MatchingModalProps> = ({
  currentUser,
  partners,
  onStartChat,
  onClose,
}) => {
  const availablePartners = partners.filter((p) => p.id !== currentUser.id);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (availablePartners.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center space-y-4 shadow-2xl border border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">No Partners Available</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Check back soon when more language partners join the exchange pool.</p>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const rawPartner = availablePartners[currentIndex];
  const partner: UserProfile = {
    ...rawPartner,
    nativeLanguage: safeLanguage(rawPartner.nativeLanguage),
    targetLanguage: safeLanguage(rawPartner.targetLanguage),
    interests: rawPartner.interests || ['Languages', 'Culture'],
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % availablePartners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + availablePartners.length) % availablePartners.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6 overflow-hidden">
        {/* Top Decorative Gradient Banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 opacity-10 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-xs z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">نظام المطابقة الذكية</h3>
            <p className="text-xs font-semibold text-indigo-600">
              Partner {currentIndex + 1} of {availablePartners.length} • Verified Exchange
            </p>
          </div>
        </div>

        {/* Partner Card Body */}
        <div className="space-y-5 relative z-10">
          {/* Photo & Basic Info */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative shrink-0">
              <img
                src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={partner.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-extrabold text-slate-900">{partner.name}</h4>
                <span className="text-lg">{partner.flag || '🌍'}</span>
              </div>
              <p className="text-xs font-medium text-slate-500">{partner.location || 'Global'}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>Active Language Partner</span>
              </div>
            </div>
          </div>

          {/* Languages Exchange Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">اللغة الأم (Native)</span>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="text-base">{partner.nativeLanguage.flag}</span>
                <span>{partner.nativeLanguage.name}</span>
              </div>
            </div>

            <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-1">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">يريد ممارسة (Target)</span>
              <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm">
                <span className="text-base">{partner.targetLanguage.flag}</span>
                <span>{partner.targetLanguage.name}</span>
              </div>
            </div>
          </div>

          {/* Interests & Hobbies */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>الاهتمامات والهوايات (Interests)</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {partner.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Bio / About */}
          {partner.bio && (
            <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/60 text-xs text-slate-700 italic leading-relaxed">
              "{partner.bio}"
            </div>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Previous / الرجوع إليه */}
            <button
              onClick={handlePrev}
              className="py-3.5 px-4 rounded-2xl border border-slate-200 hover:border-slate-900 bg-white text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>الرجوع إليه (Prev)</span>
            </button>

            {/* Skip / تخطي */}
            <button
              onClick={handleNext}
              className="py-3.5 px-4 rounded-2xl border border-slate-200 hover:border-slate-900 bg-white text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>تخطي (Skip)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Start Chat Button / زر للدردشة معه */}
          <button
            onClick={() => {
              onStartChat(partner);
              onClose();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>بدء الدردشة الفورية مع {partner.name} (Start Chat)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
