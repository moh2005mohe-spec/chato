import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { LANGUAGES } from '../data/languages';

interface ProfileSetupModalProps {
  initialName: string;
  initialAvatar: string;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
];

const POPULAR_COUNTRIES = [
  'Algeria 🇩🇿',
  'United Kingdom 🇬🇧',
  'France 🇫🇷',
  'Spain 🇪🇸',
  'Germany 🇩🇪',
  'Italy 🇮🇹',
  'Canada 🇨🇦',
];

const AVAILABLE_INTERESTS = [
  'Football',
  'Tech & Coding',
  'Travel & Culture',
  'Cinema & Art',
  'Gastronomy',
  'Literature',
  'Music',
  'History',
  'Photography',
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  initialName,
  initialAvatar,
  onSaveProfile,
}) => {
  const [name, setName] = useState(initialName || '');
  const [avatar, setAvatar] = useState(initialAvatar || PRESET_AVATARS[0]);
  const [nativeLang, setNativeLang] = useState<Language>(LANGUAGES[1]); // French default
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[0]); // English default
  const [country, setCountry] = useState('Algeria 🇩🇿');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['United Kingdom 🇬🇧', 'France 🇫🇷']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Travel & Culture', 'Football']);
  const [bio, setBio] = useState('Passionate about language exchange, meeting new friends, and discovering diverse cultures!');

  const toggleCountry = (c: string) => {
    setSelectedCountries((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      name: name.trim(),
      avatar,
      nativeLanguage: nativeLang,
      targetLanguage: targetLang,
      location: country,
      interests: selectedInterests,
      bio: bio.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 my-8">
        <div className="border-b border-neutral-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Step 1 of Profile Setup
          </span>
          <h2 className="text-2xl font-black text-black">Complete Your Profile</h2>
          <p className="text-xs text-neutral-600 mt-1">
            Set up your preferences so our matching system can connect you with the ideal conversation partner.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-black block">Profile Picture & Name</label>
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-black shadow-xs"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black text-sm font-bold text-black"
                  required
                />
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(url)}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 shrink-0 cursor-pointer ${
                        avatar === url ? 'border-black scale-110' : 'border-neutral-200 opacity-70'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black">Native Language (اللغة الأم)</label>
              <select
                value={nativeLang.code}
                onChange={(e) => {
                  const found = LANGUAGES.find((l) => l.code === e.target.value);
                  if (found) setNativeLang(found);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-black bg-white focus:outline-none focus:border-black cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black">Target Practice Language (لغة الممارسة)</label>
              <select
                value={targetLang.code}
                onChange={(e) => {
                  const found = LANGUAGES.find((l) => l.code === e.target.value);
                  if (found) setTargetLang(found);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-black bg-white focus:outline-none focus:border-black cursor-pointer"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black">Your Country / Location</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-medium text-black bg-white focus:outline-none focus:border-black cursor-pointer"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-black">Cultures / Countries to Connect With</label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['United Kingdom 🇬🇧', 'France 🇫🇷', 'Algeria 🇩🇿', 'Spain 🇪🇸', 'Germany 🇩🇪'].map((c) => {
                  const active = selectedCountries.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCountry(c)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        active
                          ? 'bg-black text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-black">Your Interests & Topics</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVAILABLE_INTERESTS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      active
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-black">Bio / Introduction</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-black focus:outline-none focus:border-black font-medium"
              placeholder="Tell partners about yourself..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Save Profile & Enter Dashboard ⚡
          </button>
        </form>
      </div>
    </div>
  );
};
