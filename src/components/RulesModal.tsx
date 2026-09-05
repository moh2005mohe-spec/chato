import React from 'react';
import { BookOpen, X, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Exchange Guidelines</h3>
              <p className="text-xs text-slate-500">Principles for effective language partnership</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3 p-3 bg-red-50/60 rounded-xl border border-red-100">
            <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-950 text-sm">1. Equal 50/50 Time Rule</h4>
              <p className="text-red-900 mt-0.5">
                Spend roughly half your conversation in your target language and half in your native language so both partners get equal practice value.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">2. Gentle & Helpful Corrections</h4>
              <p className="text-emerald-900 mt-0.5">
                Use the inline "Correct" tool liberally! Politely fix grammar and suggest natural local phrasing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">3. Cultural Curiosity</h4>
              <p className="text-amber-900 mt-0.5">
                Ask about local customs, regional dishes, proverbs, and lifestyle in Algiers, London, Paris, Madrid, and beyond.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 cursor-pointer transition-all"
        >
          Got it (فهمت)
        </button>
      </div>
    </div>
  );
};
