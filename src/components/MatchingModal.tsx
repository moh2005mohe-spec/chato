import React, { useEffect, useState } from 'react';
import { Language, UserProfile } from '../types';
import { MOCK_PARTNERS } from '../data/mockPartners';
import { Loader2, Users, Globe, ShieldCheck, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface MatchingModalProps {
  nativeLang: Language;
  targetLang: Language;
  userName: string;
  onMatchFound: (partner: UserProfile) => void;
  onCancel: () => void;
}

export const MatchingModal: React.FC<MatchingModalProps> = ({
  nativeLang,
  targetLang,
  userName,
  onMatchFound,
  onCancel,
}) => {
  const [matchStatus, setMatchStatus] = useState<'searching' | 'found'>('searching');
  const [foundPartner, setFoundPartner] = useState<UserProfile | null>(null);
  const [searchTimer, setSearchTimer] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSearchTimer((prev) => prev + 1);
    }, 1000);

    // Simulate lobby query or find exact matching partner
    const matchTimeout = setTimeout(() => {
      // Find partner whose native language matches targetLang, and target language matches nativeLang
      let partner = MOCK_PARTNERS.find(
        (p) => p.nativeLanguage.code === targetLang.code || p.targetLanguage.code === nativeLang.code
      );

      if (!partner) {
        // Fallback to first partner with flag
        partner = {
          ...MOCK_PARTNERS[0],
          nativeLanguage: targetLang,
          targetLanguage: nativeLang,
        };
      }

      setFoundPartner(partner);
      setMatchStatus('found');
    }, 2800);

    return () => {
      clearInterval(timer);
      clearTimeout(matchTimeout);
    };
  }, [nativeLang, targetLang]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-6">
        {matchStatus === 'searching' ? (
          <div className="space-y-6 py-4">
            {/* Animated Radar Pulse */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></div>
              <div className="absolute inset-2 rounded-full bg-indigo-500/30 animate-pulse"></div>
              <div className="relative w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <Globe className="w-10 h-10 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Matching with Exchange Partner...</h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                Looking for a native <span className="font-bold text-slate-900">{targetLang.flag} {targetLang.name}</span> speaker who wants to learn <span className="font-bold text-slate-900">{nativeLang.flag} {nativeLang.name}</span>.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Checking active community members ({searchTimer}s)</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel Search
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Match Found!
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 pt-2">Meet Your Partner</h3>
            </div>

            {foundPartner && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={foundPartner.avatar}
                    alt={foundPartner.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{foundPartner.name}</span>
                      <span className="text-lg">{foundPartner.flag}</span>
                    </h4>
                    <p className="text-xs text-slate-500">{foundPartner.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Native Speaker</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      {foundPartner.nativeLanguage.flag} {foundPartner.nativeLanguage.name}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">Practicing</span>
                    <span className="font-bold text-indigo-700 flex items-center gap-1.5 mt-0.5">
                      {foundPartner.targetLanguage.flag} {foundPartner.targetLanguage.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">"{foundPartner.bio}"</p>
              </div>
            )}

            <button
              onClick={() => foundPartner && onMatchFound(foundPartner)}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Chat Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
