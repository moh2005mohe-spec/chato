import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, LanguageCorrection } from '../types';
import { CorrectionModal } from './CorrectionModal';
import { CULTURAL_TOPICS } from '../data/mockPartners';
import { safeLanguage } from '../data/languages';
import {
  Send,
  Volume2,
  Globe,
  Edit2,
  Sparkles,
  Clock,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Mic,
  Square,
  Play,
  Pause
} from 'lucide-react';

interface ChatRoomProps {
  partner: UserProfile;
  currentUser: UserProfile;
  onEndChat: () => void;
  onNextMatch: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  partner: rawPartner,
  currentUser: rawUser,
  onEndChat,
  onNextMatch,
}) => {
  const partner: UserProfile = {
    ...rawPartner,
    nativeLanguage: safeLanguage(rawPartner.nativeLanguage),
    targetLanguage: safeLanguage(rawPartner.targetLanguage),
  };

  const currentUser: UserProfile = {
    ...rawUser,
    nativeLanguage: safeLanguage(rawUser.nativeLanguage),
    targetLanguage: safeLanguage(rawUser.targetLanguage),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [correctingMessage, setCorrectingMessage] = useState<ChatMessage | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes timer
  const [exchangePhase, setExchangePhase] = useState<'target' | 'native'>('target');

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize intro messages
  useEffect(() => {
    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg_1',
        senderId: partner.id,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: `Hello! 👋 Great to match with you. I'm a native ${partner.nativeLanguage.name} speaker and excited to practice ${partner.targetLanguage.name} with you!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNative: true,
      },
      {
        id: 'msg_2',
        senderId: partner.id,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: `Feel free to correct any of my mistakes in ${partner.targetLanguage.name}, and I will help correct yours in ${partner.nativeLanguage.name}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNative: true,
      },
    ];
    setMessages(initialMsgs);
  }, [partner]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setExchangePhase((curr) => (curr === 'target' ? 'native' : 'target'));
          return 300;
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

  // Start Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  // Send Voice Note
  const handleSendVoiceNote = () => {
    if (!audioBlobUrl) return;

    const voiceMsg: ChatMessage = {
      id: `voice_msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: '🎤 [Voice Note / رسالة صوتية]',
      audioUrl: audioBlobUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNative: false,
    };

    setMessages((prev) => [...prev, voiceMsg]);
    setAudioBlobUrl(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNative: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

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
          text: data.replyText || 'That is fascinating! Tell me more about your thoughts on this.',
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

  const handleTranslateMessage = async (msgId: string, text: string) => {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: currentUser.nativeLanguage.name,
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

  const handleSpeakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'fr' ? 'fr-FR' : langCode === 'ar' ? 'ar-SA' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendCorrection = (originalText: string, correctedText: string, explanation: string) => {
    if (!correctingMessage) return;

    const correctionData: LanguageCorrection = {
      id: `corr_${Date.now()}`,
      messageId: correctingMessage.id,
      originalText,
      correctedText,
      explanation,
      correctedBy: currentUser.name,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) =>
      prev.map((m) => (m.id === correctingMessage.id ? { ...m, correction: correctionData } : m))
    );

    setTimeout(() => {
      const thankMsg: ChatMessage = {
        id: `thank_${Date.now()}`,
        senderId: partner.id,
        senderName: partner.name,
        senderAvatar: partner.avatar,
        text: `Thank you for the correction! 🙏 That is extremely helpful.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNative: true,
      };
      setMessages((prev) => [...prev, thankMsg]);
    }, 1200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col bg-slate-50 border-x border-slate-200 shadow-xl rounded-t-3xl overflow-hidden my-auto">
      {/* Top Navbar Header */}
      <div className="bg-white border-b border-red-100 px-6 py-4 flex items-center justify-between shrink-0 z-10 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onEndChat}
            className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={partner.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">{partner.name}</h2>
              <span className="text-base">{partner.flag || '🌍'}</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
              <span>Native: {partner.nativeLanguage.flag} {partner.nativeLanguage.name}</span>
              <span>•</span>
              <span className="text-red-600 font-bold">Practicing: {partner.targetLanguage.flag} {partner.targetLanguage.name}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNextMatch}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Next Partner</span>
          </button>
          <button
            onClick={onEndChat}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold cursor-pointer transition-all"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Reciprocal Time Balance Bar */}
      <div className="bg-red-600 text-white px-6 py-2.5 flex items-center justify-between text-xs shrink-0 shadow-inner">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-red-200" />
          <span>
            Exchange Focus:{' '}
            <strong className="text-white">
              {exchangePhase === 'target'
                ? `Practicing ${currentUser.targetLanguage.name} (${partner.nativeLanguage.name})`
                : `Helping Partner with ${currentUser.nativeLanguage.name}`}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-red-700 px-3 py-1 rounded-lg text-white font-mono font-black text-sm shadow-2xs border border-red-500">
          <span>{formatTime(timerSeconds)}</span>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-slate-100/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div key={msg.id} className={`flex gap-3.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <img
                src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={msg.senderName}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 mt-1"
              />

              <div className={`max-w-[80%] sm:max-w-[68%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 text-xs text-slate-500 font-medium ${isMe ? 'justify-end' : ''}`}>
                  <span>{msg.senderName}</span>
                  <span className="text-slate-300">•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${
                    isMe
                      ? 'bg-red-600 text-white rounded-tr-xs shadow-md shadow-red-600/15'
                      : 'bg-white border border-slate-200/80 text-slate-900 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Audio / Voice Note Player */}
                  {msg.audioUrl && (
                    <div className="mt-3 pt-2">
                      <audio controls src={msg.audioUrl} className="w-full h-10 rounded-xl" />
                    </div>
                  )}

                  {/* Correction Badge */}
                  {msg.correction && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 bg-emerald-50/90 text-emerald-950 p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Language Correction</span>
                      </div>
                      <p className="line-through text-slate-500">{msg.correction.originalText}</p>
                      <p className="font-extrabold text-emerald-900 text-sm">👉 {msg.correction.correctedText}</p>
                      {msg.correction.explanation && (
                        <p className="text-xs text-emerald-700 italic">"{msg.correction.explanation}"</p>
                      )}
                    </div>
                  )}

                  {/* Inline Translation */}
                  {msg.translatedText && (
                    <div className="mt-3 pt-3 border-t border-red-200/55 text-xs text-red-950 bg-red-50/80 p-3 rounded-xl space-y-0.5">
                      <span className="font-bold text-red-700 block uppercase text-[10px]">Translation</span>
                      <p className="font-medium">{msg.translatedText}</p>
                    </div>
                  )}

                  {/* Toolbar */}
                  <div
                    className={`mt-3 flex items-center gap-4 text-xs pt-2 border-t ${
                      isMe ? 'border-red-500 text-red-100' : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <button
                      onClick={() => handleSpeakText(msg.text, isMe ? currentUser.targetLanguage.code : partner.nativeLanguage.code)}
                      className="hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
                      title="Listen"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>

                    <button
                      onClick={() => handleTranslateMessage(msg.id, msg.text)}
                      className="hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
                      title="Translate"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Translate</span>
                    </button>

                    {!isMe && (
                      <button
                        onClick={() => setCorrectingMessage(msg)}
                        className="hover:text-emerald-500 flex items-center gap-1.5 font-bold text-emerald-600 cursor-pointer"
                        title="Correct"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3.5">
            <img
              src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={partner.name}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
            />
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span className="ml-1 font-semibold text-slate-700">{partner.name} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Cultural Conversation Topics Drawer */}
      {showTopics && (
        <div className="bg-red-50 border-t border-red-200/80 p-5 space-y-3 animate-in slide-in-from-bottom duration-200 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Culture & Conversation Starters (مواضيع المحادثة)</span>
            </h4>
            <button
              onClick={() => setShowTopics(false)}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {CULTURAL_TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => {
                  handleSendMessage(topic.prompt);
                  setShowTopics(false);
                }}
                className="text-left p-3 rounded-2xl bg-white border border-red-100 hover:border-red-300 text-xs text-slate-900 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-1"
              >
                <span className="font-extrabold text-red-700 block">{topic.category}</span>
                <span className="text-slate-600 leading-relaxed block">{topic.prompt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Footer with Voice Recording */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => setShowTopics(!showTopics)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold cursor-pointer transition-all shadow-2xs border border-red-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Culture Topics & Icebreakers</span>
          </button>

          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{partner.name} is online</span>
          </span>
        </div>

        {/* Audio Recording Preview Bar */}
        {audioBlobUrl && (
          <div className="flex items-center justify-between bg-red-50 p-3 rounded-2xl border border-red-200">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-bold text-red-900">Voice Note Recorded (رسالة صوتية جاهزة للإرسال)</span>
            </div>
            <div className="flex items-center gap-2">
              <audio controls src={audioBlobUrl} className="h-8 max-w-xs" />
              <button
                onClick={handleSendVoiceNote}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Send Voice
              </button>
              <button
                onClick={() => setAudioBlobUrl(null)}
                className="text-xs font-bold text-slate-500 hover:text-red-600 cursor-pointer px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-3"
        >
          {/* Voice Record Button */}
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer transition-all shadow-2xs"
              title="Record Voice Note"
            >
              <Mic className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="p-3 rounded-2xl bg-red-600 text-white animate-pulse cursor-pointer transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
              title="Stop Recording"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop</span>
            </button>
          )}

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? 'Recording voice note...' : `Message ${partner.name} in ${currentUser.targetLanguage.name}...`}
            disabled={isRecording}
            className="flex-1 bg-slate-100/80 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 text-slate-900 rounded-2xl px-5 py-3 text-sm shadow-inner font-medium transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isRecording}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-md shadow-red-600/25 flex items-center gap-2 text-xs"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Correction Modal */}
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
