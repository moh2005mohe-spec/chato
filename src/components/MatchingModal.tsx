import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MessageSquare, ArrowRight, ArrowLeft, X, Sparkles, Globe, Heart } from 'lucide-react';

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
  // Filter out current user from partners list
  const availablePartners = partners.filter((p) => p.id !== currentUser.id);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (availablePartners.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-neutral-200">
          <h3 className="text-lg font-bold text-black">No Partners Available</h3>
          <p className="text-xs text-neutral-600">Check back soon when more learners join the exchange pool.</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentPartner = availablePartners[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % availablePartners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + availablePartners.length) % availablePartners.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-black">نظام المطابقة الذكية (Smart Match)</h3>
            <p className="text-[11px] text-neutral-500">
              Partner {currentIndex + 1} of {availablePartners.length}
            </p>
          </div>
        </div>

        {/* Small Card / Popup Displaying Partner Info */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4 text-left">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={currentPartner.avatar}
                alt={currentPartner.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-black flex items-center gap-1.5">
                <span>{currentPartner.name}</span>
                <span className="text-base">{currentPartner.flag}</span>
              </h4>
              <p className="text-xs text-neutral-500">{currentPartner.location}</p>
            </div>
          </div>

          {/* Languages to practice & learn */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase">Native Language</span>
              <span className="font-bold text-black flex items-center gap-1 mt-0.5">
                {currentPartner.nativeLanguage.flag} {currentPartner.nativeLanguage.name}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase">Practicing / Learning</span>
              <span className="font-bold text-indigo-700 flex items-center gap-1 mt-0.5">
                {currentPartner.targetLanguage.flag} {currentPartner.targetLanguage.name}
              </span>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>Interests & Hobbies</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {currentPartner.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-white text-neutral-800 text-[11px] font-semibold border border-neutral-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {currentPartner.bio && (
            <p className="text-xs text-neutral-600 italic bg-white p-2.5 rounded-xl border border-neutral-200">
              "{currentPartner.bio}"
            </p>
          )}
        </div>

        {/* Navigation & Action Controls */}
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-3">
            {/* Previous / الرجوع اليه */}
            <button
              onClick={handlePrev}
              className="py-3 px-4 rounded-xl border border-neutral-300 hover:border-black bg-white text-neutral-800 hover:text-black font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>الرجوع إليه (Prev)</span>
            </button>

            {/* Skip / تخطي */}
            <button
              onClick={handleNext}
              className="py-3 px-4 rounded-xl border border-neutral-300 hover:border-black bg-white text-neutral-800 hover:text-black font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <span>تخطي (Skip)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Start Chat Button / زر للدردشه معه */}
          <button
            onClick={() => {
              onStartChat(currentPartner);
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>بدء الدردشة معه (Chat with {currentPartner.name})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
