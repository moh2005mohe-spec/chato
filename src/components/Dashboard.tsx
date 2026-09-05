import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MOCK_PARTNERS } from '../data/mockPartners';
import { safeLanguage } from '../data/languages';
import { Users, MessageSquare, Search, Sparkles } from 'lucide-react';
import { MatchingModal } from './MatchingModal';

interface DashboardProps {
  currentUser: UserProfile;
  onStartChat: (partner: UserProfile) => void;
  onEditProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser: rawUser,
  onStartChat,
  onEditProfile,
}) => {
  const currentUser: UserProfile = {
    ...rawUser,
    nativeLanguage: safeLanguage(rawUser.nativeLanguage),
    targetLanguage: safeLanguage(rawUser.targetLanguage),
  };

  const [filterLang, setFilterLang] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMatchingModal, setShowMatchingModal] = useState<boolean>(false);

  const filteredPartners = MOCK_PARTNERS.map((p) => ({
    ...p,
    nativeLanguage: safeLanguage(p.nativeLanguage),
    targetLanguage: safeLanguage(p.targetLanguage),
  })).filter((partner) => {
    if (partner.id === currentUser.id) return false;
    const matchesLang =
      filterLang === 'all' ||
      partner.nativeLanguage.code === filterLang ||
      partner.targetLanguage.code === filterLang;

    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLang && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-600/20">
        <div className="flex items-center gap-5 text-left w-full md:w-auto">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-white/40 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{currentUser.name}</h1>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">Online 🟢</span>
            </div>
            <p className="text-xs text-red-100">
              Native: <strong className="text-white">{currentUser.nativeLanguage.flag} {currentUser.nativeLanguage.name}</strong> • Practicing: <strong className="text-white">{currentUser.targetLanguage.flag} {currentUser.targetLanguage.name}</strong>
            </p>
            <p className="text-xs text-red-200">{currentUser.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={() => setShowMatchingModal(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>نظام المطابقة السريعة (Smart Match)</span>
          </button>
          <button
            onClick={onEditProfile}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/20"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, interests..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-red-600 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Lang:</span>
          {['all', 'en', 'fr', 'ar', 'es', 'de'].map((code) => (
            <button
              key={code}
              onClick={() => setFilterLang(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer shrink-0 ${
                filterLang === code
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {code === 'all' ? 'All' : code}
            </button>
          ))}
        </div>
      </div>

      {/* Matching Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Matching Language Partners ({filteredPartners.length})</span>
          </h2>
          <button
            onClick={() => setShowMatchingModal(true)}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>فتح نافذة المطابقة (Open Match Popup)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={partner.avatar}
                        alt={partner.name}
                        className="w-14 h-14 rounded-full object-cover border border-slate-200"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{partner.name}</span>
                        <span>{partner.flag}</span>
                      </h3>
                      <p className="text-xs text-slate-500">{partner.location}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Native</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      {partner.nativeLanguage.flag} {partner.nativeLanguage.name}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Practicing</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      {partner.targetLanguage.flag} {partner.targetLanguage.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                  "{partner.bio}"
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {partner.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartChat(partner)}
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start Chat & Exchange</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Matching Modal Popup */}
      {showMatchingModal && (
        <MatchingModal
          currentUser={currentUser}
          partners={MOCK_PARTNERS}
          onStartChat={onStartChat}
          onClose={() => setShowMatchingModal(false)}
        />
      )}
    </div>
  );
};
