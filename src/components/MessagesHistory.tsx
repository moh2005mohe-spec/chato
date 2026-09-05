import React from 'react';
import { UserProfile } from '../types';
import { MessageSquare, Clock, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_PARTNERS } from '../data/mockPartners';
import { safeLanguage } from '../data/languages';

interface MessagesHistoryProps {
  currentUser: UserProfile;
  onStartChat: (partner: UserProfile) => void;
}

export const MessagesHistory: React.FC<MessagesHistoryProps> = ({ currentUser, onStartChat }) => {
  const partners = MOCK_PARTNERS.filter((p) => p.id !== currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-200">
      <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-lg shadow-red-600/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>سجل المحادثات والرسائل (Messages Tab)</span>
          </div>
          <h1 className="text-2xl font-black">الدردشات السابقة مع الشركاء</h1>
          <p className="text-xs text-red-100 max-w-lg">
            تابع محادثاتك السابقة مع شركاء تبادل اللغات واستأنف التدرب الفوري في أي وقت.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {partners.map((rawPartner, idx) => {
          const partner = {
            ...rawPartner,
            nativeLanguage: safeLanguage(rawPartner.nativeLanguage),
            targetLanguage: safeLanguage(rawPartner.targetLanguage),
          };

          return (
            <div
              key={partner.id}
              onClick={() => onStartChat(partner)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-red-600 transition-colors">
                      {partner.name}
                    </h3>
                    <span className="text-base">{partner.flag}</span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                    <span>Native: {partner.nativeLanguage.flag} {partner.nativeLanguage.name}</span>
                    <span>•</span>
                    <span className="text-red-600 font-bold">Practicing: {partner.targetLanguage.flag} {partner.targetLanguage.name}</span>
                  </p>

                  <p className="text-xs text-slate-600 italic line-clamp-1">
                    آخر محادثة نشطة تبادل لغوي وثقافي... انقر للاستئناف
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Room</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> Ready
                  </span>
                </div>

                <button className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all">
                  <span>متابعة المحادثة</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
