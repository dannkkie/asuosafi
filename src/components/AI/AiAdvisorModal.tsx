'use client';

import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { TRANSLATIONS } from '@/utils/translations';

interface AiAdvisorModalProps {
  onClose: () => void;
  currentLanguage: SupportedLanguage;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  onClose,
  currentLanguage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I am your **AsuoSafi Environmental & Civic Rights Advisor**. Ask me anything regarding water safety standards, the health hazards of *galamsey* mining heavy metals (mercury & cyanide), or your statutory legal rights under Ghana's **Water Resources Commission Act (Act 522)** and the **Minerals and Mining Amendment Act (Act 995)**.`,
      source: 'expert_environmental_knowledge_engine',
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const t = TRANSLATIONS[currentLanguage];

  const quickPrompts = [
    { label: "Does boiling remove galamsey chemicals?", text: "Can I boil water from a galamsey river to make it safe for cooking?" },
    { label: "What is the penalty for river mining under Act 995?", text: "What is the statutory penalty for mining in a river or forest reserve under Act 995 in Ghana?" },
    { label: "Symptoms of mercury poisoning?", text: "What are the health risks and symptoms of mercury and cyanide poisoning in drinking water?" },
    { label: "How do I report anonymously?", text: "How am I protected as an anonymous whistleblower under Ghanaian law?" },
  ];

  const handleSendQuestion = async (textToSend?: string) => {
    const query = textToSend || inputQuestion;
    if (!query.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          language: currentLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.answer,
            source: data.source,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an issue retrieving that information. Please check your network connection.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach advisory engine. You can still generate statutory petitions from the main ledger map.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks for cleaner audio
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingIndex(index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 font-sans">
                  AI Statutory & Environmental Counsel
                </h3>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
                  <Sparkles className="h-3 w-3" />
                  Statutory Law Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Grounded in Ghana Water Act (522), Mining Act (995) & WHO Guidelines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-white text-xs sm:text-sm">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white font-medium rounded-br-none shadow-sm'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.role === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      {msg.source === 'gemini-1.5-flash'
                        ? 'Google Gemini 1.5 Grounded Engine'
                        : 'Ghana Environmental Law Knowledge Base'}
                    </span>

                    <button
                      onClick={() => handleSpeak(msg.content, i)}
                      className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {speakingIndex === i ? (
                        <>
                          <VolumeX className="h-3 w-3 text-red-700" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg max-w-[220px]">
              <div className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Analyzing Ghanaian environmental statutes...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-50 border-t border-slate-200 p-2.5 overflow-x-auto flex items-center gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuestion(p.text)}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm transition-colors cursor-pointer shrink-0 font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask about water safety, galamsey penalties, or reporting rights..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />

            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white shadow-sm transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
