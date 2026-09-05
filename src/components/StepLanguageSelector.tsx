import React, { useState } from 'react';
import { LANGUAGES } from '../data/languages';
import { Language } from '../types';
import { ArrowRight, CheckCircle2, Sparkles, Users, RefreshCw, Zap, Globe } from 'lucide-react';

interface StepLanguageSelectorProps {
  nativeLang: Language;
  targetLang: Language;
  onSelectNative: (lang: Language) => void;
  onSelectTarget: (lang: Language) => void;
  onStartMatch: () => void;
}

export const StepLanguageSelector: React.FC<StepLanguageSelectorProps> = ({
  nativeLang,
  targetLang,
  onSelectNative,
  onSelectTarget,
  onStartMatch,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Swap languages quick toggle
  const handleSwap = () => {
    if (nativeLang.code !== targetLang.code) {
      const temp = nativeLang;
      onSelectNative(targetLang);
      onSelectTarget(temp);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-6 px-4">
      {/* Intro Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-time Text Exchange Platform</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Practice languages naturally with native speakers
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Select your native language and the language you want to learn. We'll pair you with a partner for a 1-on-1 text chat where you correct each other and exchange cultures.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 Card */}
        <div
          onClick={() => setActiveStep(1)}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            activeStep === 1
              ? 'bg-white border-slate-900 shadow-md'
              : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-900 text-white">
              Step 1
            </span>
            {nativeLang && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900">Your Native Language (اللغة الأم)</h2>
          <p className="text-xs text-slate-500 mt-1">
            The language you speak fluently and can help others correct.
          </p>

          <div className="mt-4 flex items-center gap-3 p-3 bg-slate-100/80 rounded-xl border border-slate-200">
            <span className="text-2xl">{nativeLang.flag}</span>
            <div>
              <p className="text-sm font-bold text-slate-900">{nativeLang.name}</p>
              <p className="text-xs text-slate-500">{nativeLang.nativeName}</p>
            </div>
          </div>
        </div>

        {/* Step 2 Card */}
        <div
          onClick={() => setActiveStep(2)}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            activeStep === 2
              ? 'bg-white border-slate-900 shadow-md'
              : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-600 text-white">
              Step 2
            </span>
            {targetLang && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Selected
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900">Language to Practice (لغة الممارسة)</h2>
          <p className="text-xs text-slate-500 mt-1">
            The language you want to improve through friendly text conversation.
          </p>

          <div className="mt-4 flex items-center gap-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
            <span className="text-2xl">{targetLang.flag}</span>
            <div>
              <p className="text-sm font-bold text-slate-900">{targetLang.name}</p>
              <p className="text-xs text-indigo-600 font-medium">{targetLang.nativeName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2">
        <button
          onClick={handleSwap}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Swap Selection</span>
        </button>
      </div>

      {/* Language Selection Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Choose {activeStep === 1 ? 'Step 1: Native Language' : 'Step 2: Practice Language'}</span>
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveStep(1)}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                activeStep === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Native
            </button>
            <button
              onClick={() => setActiveStep(2)}
              className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                activeStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Practice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = activeStep === 1 ? nativeLang.code === lang.code : targetLang.code === lang.code;
            const isOtherSelected = activeStep === 1 ? targetLang.code === lang.code : nativeLang.code === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => {
                  if (activeStep === 1) {
                    onSelectNative(lang);
                    setActiveStep(2); // auto proceed to step 2
                  } else {
                    onSelectTarget(lang);
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? activeStep === 1
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl leading-none">{lang.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">{lang.name}</p>
                  <p className={`text-[11px] truncate ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                    {lang.nativeName}
                  </p>
                </div>
                {isOtherSelected && !isSelected && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                    {activeStep === 1 ? 'Target' : 'Native'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expected Exchange Summary */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-indigo-300 font-semibold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Reciprocal Language Match Guaranteed</span>
          </div>
          <div className="text-base sm:text-lg font-bold flex flex-wrap items-center justify-center md:justify-start gap-2 text-white">
            <span>You speak</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
              {nativeLang.flag} {nativeLang.name}
            </span>
            <span>& want to practice</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700">
              {targetLang.flag} {targetLang.name}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            We will pair you with a native <strong className="text-slate-200">{targetLang.name}</strong> speaker who wants to learn <strong className="text-slate-200">{nativeLang.name}</strong>.
          </p>
        </div>

        <button
          onClick={onStartMatch}
          className="w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Find Exchange Partner</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
