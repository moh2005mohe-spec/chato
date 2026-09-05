import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, Language, LanguageCorrection } from '../types';
import { CorrectionModal } from './CorrectionModal';
import { CULTURAL_TOPICS } from '../data/mockPartners';
import {
  Send,
  Volume2,
  Globe,
  Edit2,
  Sparkles,
  Clock,
  ArrowLeft,
  Smile,
  Mic,
  MicOff,
  MoreVertical,
  CheckCheck,
  RotateCcw,
  BookOpen,
  Info,
  ShieldCheck
} from 'lucide-react';

interface ChatRoomProps {
  partner: UserProfile;
  userNativeLang: Language;
  userTargetLang: Language;
  userName: string;
  userAvatar: string;
  onEndChat: () => void;
  onNextMatch: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  partner,
  userNativeLang,
  userTargetLang,
  userName,
  userAvatar,
  onEndChat,
  onNextMatch,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [correctingMessage, setCorrectingMessage] = useState<ChatMessage | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [exchangePhase, setExchangePhase] = useState<'native' | 'target'>('target');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes timer for equal exchange
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize introductory greeting messages
  useEffect(() => {
    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg_1',
        senderId: partner.id,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: `Hello! 👋 Great to match with you. I'm a native ${partner.nativeLanguage.name} speaker and eager to practice ${partner.targetLanguage.name} with you!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNative: true,
      },
      {
        id: 'msg_2',
        senderId: partner.id,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: `Feel free to correct any of my mistakes in ${partner.targetLanguage.name}, and I will help correct yours in ${partner.nativeLanguage.name}! Where are you joining from today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNative: true,
      },
    ];
    setMessages(initialMsgs);
  }, [partner]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Exchange Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setExchangePhase((curr) => (curr === 'target' ? 'native' : 'target'));
          return 300; // Reset to 5 mins
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_msg_${Date.now()}`,
      senderId: 'current_user',
      senderName: userName || 'You',
      senderAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNative: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Get partner reply from backend API
    try {
      const response = await fetch('/api/bot-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerName: partner.name,
          partnerNativeLang: partner.nativeLanguage.name,
          partnerTargetLang: partner.targetLanguage.name,
          partnerLocation: partner.location,
          partnerBio: partner.bio,
          userMessage: text,
        }),
      });

      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        const partnerMsg: ChatMessage = {
          id: `partner_msg_${Date.now()}`,
          senderId: partner.id,
          senderName: partner.name,
          senderAvatar: partner.avatar,
          text: data.replyText || 'That sounds wonderful! Tell me more about your experience.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNative: true,
        };
        setMessages((prev) => [...prev, partnerMsg]);
      }, 1400);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  // Inline Translate message
  const handleTranslateMessage = async (msgId: string, text: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: userNativeLang.name,
        }),
      });
      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, translatedText: data.translatedText } : m))
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Text-To-Speech Speech Synthesis
  const handleSpeakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'fr' ? 'fr-FR' : langCode === 'ar' ? 'ar-SA' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Apply Correction to Message
  const handleSendCorrection = (originalText: string, correctedText: string, explanation: string) => {
    if (!correctingMessage) return;

    const correctionData: LanguageCorrection = {
      id: `corr_${Date.now()}`,
      messageId: correctingMessage.id,
      originalText,
      correctedText,
      explanation,
      correctedBy: userName || 'Exchange Partner',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) =>
      prev.map((m) => (m.id === correctingMessage.id ? { ...m, correction: correctionData } : m))
    );

    // Send thank-you note from partner automatically
    setTimeout(() => {
      const thankMsg: ChatMessage = {
        id: `thank_${Date.now()}`,
        senderId: partner.id,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: `Thank you for the correction! 🙏 That makes complete sense. I will remember that.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNative: true,
      };
      setMessages((prev) => [...prev, thankMsg]);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col bg-slate-50 border-x border-slate-200 shadow-sm">
      {/* Top Partner Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onEndChat}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Leave Room"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">{partner.name}</h2>
              <span className="text-sm">{partner.flag}</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>Native: {partner.nativeLanguage.flag} {partner.nativeLanguage.name}</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">Practicing: {partner.targetLanguage.flag} {partner.targetLanguage.name}</span>
            </p>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNextMatch}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Next Match</span>
          </button>
          <button
            onClick={onEndChat}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Reciprocal Time Balance Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>
            Current Focus:{' '}
            <strong className="text-white">
              {exchangePhase === 'target'
                ? `Practicing ${userTargetLang.name} (${partner.nativeLanguage.name})`
                : `Helping Partner with ${userNativeLang.name}`}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-0.5 rounded-md text-amber-300 font-mono font-bold">
          <span>{formatTime(timerSeconds)}</span>
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'current_user';

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-1"
              />

              <div className={`max-w-[82%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 text-[11px] text-slate-500 ${isMe ? 'justify-end' : ''}`}>
                  <span className="font-semibold text-slate-700">{msg.senderName}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs relative group ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Correction Badge Overlay if corrected */}
                  {msg.correction && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-500/20 bg-emerald-50/90 text-emerald-950 p-2.5 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Language Correction</span>
                      </div>
                      <p className="line-through text-slate-500">{msg.correction.originalText}</p>
                      <p className="font-bold text-emerald-900">👉 {msg.correction.correctedText}</p>
                      {msg.correction.explanation && (
                        <p className="text-[11px] text-emerald-700 italic">"{msg.correction.explanation}"</p>
                      )}
                    </div>
                  )}

                  {/* Inline Translation if requested */}
                  {msg.translatedText && (
                    <div className="mt-2 pt-2 border-t border-indigo-200/40 text-xs text-indigo-900 bg-indigo-50/80 p-2 rounded-lg">
                      <span className="font-bold text-indigo-700 block">Translation:</span>
                      <span>{msg.translatedText}</span>
                    </div>
                  )}

                  {/* Message Action Toolbar */}
                  <div
                    className={`mt-2 flex items-center gap-3 text-xs pt-1 border-t ${
                      isMe ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <button
                      onClick={() => handleSpeakText(msg.text, isMe ? userTargetLang.code : partner.nativeLanguage.code)}
                      className="hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                      title="Listen to native pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Listen</span>
                    </button>

                    <button
                      onClick={() => handleTranslateMessage(msg.id, msg.text)}
                      className="hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                      title="Translate to native language"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Translate</span>
                    </button>

                    {!isMe && (
                      <button
                        onClick={() => setCorrectingMessage(msg)}
                        className="hover:text-emerald-500 flex items-center gap-1 font-semibold text-emerald-600 cursor-pointer"
                        title="Suggest language correction"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Correct</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3">
            <img
              src={partner.avatar}
              alt={partner.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span className="ml-1 italic font-medium">{partner.name} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Topics Drawer / Icebreakers Overlay */}
      {showTopics && (
        <div className="bg-indigo-50 border-t border-indigo-200 p-4 space-y-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Culture & Conversation Starters</span>
            </h4>
            <button
              onClick={() => setShowTopics(false)}
              className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CULTURAL_TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => {
                  handleSendMessage(topic.prompt);
                  setShowTopics(false);
                }}
                className="text-left p-2.5 rounded-xl bg-white border border-indigo-100 hover:border-indigo-300 text-xs text-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <span className="font-bold text-indigo-700 block mb-0.5">{topic.category}</span>
                <span>{topic.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTopics(!showTopics)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Topic Prompts</span>
            </button>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-500">
              Type in <strong>{userTargetLang.name}</strong> or <strong>{userNativeLang.name}</strong>
            </span>
          </div>

          <span className="text-[11px] text-emerald-600 font-medium">
            🟢 {partner.name} is listening
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${partner.name} in ${userTargetLang.name}...`}
            className="flex-1 bg-slate-100 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 rounded-xl px-4 py-2.5 text-sm"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Modal Overlay for Correction */}
      {correctingMessage && (
        <CorrectionModal
          message={correctingMessage}
          onSendCorrection={handleSendCorrection}
          onClose={() => setCorrectingMessage(null)}
        />
      )}
    </div>
  );
};
