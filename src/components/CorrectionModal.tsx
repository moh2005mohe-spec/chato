import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Check, X, Sparkles, MessageSquareCode, Send } from 'lucide-react';

interface CorrectionModalProps {
  message: ChatMessage;
  onSendCorrection: (originalText: string, correctedText: string, explanation: string) => void;
  onClose: () => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  message,
  onSendCorrection,
  onClose,
}) => {
  const [correctedText, setCorrectedText] = useState(message.text);
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto suggest correction using backend API
  const handleAutoSuggest = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message.text,
          targetLanguage: message.isNative ? 'English' : 'French',
        }),
      });
      const data = await res.json();
      if (data.correctedText) {
        setCorrectedText(data.correctedText);
        setExplanation(data.explanation || 'Suggested phrasing adjustment.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctedText.trim()) return;
    onSendCorrection(message.text, correctedText.trim(), explanation.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Correct Partner's Message</h3>
              <p className="text-xs text-slate-500">Help {message.senderName} improve their grammar & phrasing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original Message Box */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Original Message
          </span>
          <p className="text-sm text-slate-800 line-through decoration-red-400 decoration-2">{message.text}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Corrected Version (النسخة المصححة)</label>
              <button
                type="button"
                onClick={handleAutoSuggest}
                disabled={isGenerating}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGenerating ? 'Analyzing...' : 'Auto-Suggest Fix'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-emerald-50/20 font-medium text-slate-900"
              placeholder="Type corrected version..."
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Explanation / Grammar Tip (optional)</label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              placeholder="e.g. Remember to use past tense 'went' instead of 'go'."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Correction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
