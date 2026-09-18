import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { askCrmAssistant, AiResponse } from '../../services/aiAssistantService';
import {
  Bot,
  Sparkles,
  X,
  Send,
  RefreshCw,
  FileText,
  Target,
  TrendingUp,
  Mail,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  contextUsed?: string;
  suggestedActions?: AiResponse['suggestedActions'];
  timestamp: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { contacts, leads, deals, activities, tasks } = useCRM();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your AI Healthcare Sales Copilot. I analyze your contacts, clinical pipeline, and tasks in real-time. Ask me anything or choose a quick prompt below.',
      contextUsed: 'HealthPulse CRM Local AI Hub',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (promptToSend?: string) => {
    const text = promptToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await askCrmAssistant(text, {
        contacts,
        leads,
        deals,
        activities,
        tasks,
      });

      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.answer,
        contextUsed: response.contextUsed,
        suggestedActions: response.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'I encountered an unexpected issue processing your inquiry. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'What leads need follow-up?', icon: Target, prompt: 'What leads need follow-up?' },
    { label: 'Show my high-value deals', icon: TrendingUp, prompt: 'Show my high-value deals' },
    { label: 'Summarize today’s activities', icon: Calendar, prompt: 'Summarize today’s activities' },
    { label: 'Draft a follow-up email', icon: Mail, prompt: 'Draft a follow-up email' },
    { label: 'Summarize contacts', icon: FileText, prompt: 'Summarize this contact' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">AI Sales Copilot</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Deterministic fallback ready • Zero API key barrier</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.prompt)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 rounded-lg whitespace-nowrap text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            >
              <qp.icon className="w-3.5 h-3.5 text-indigo-500" />
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100/90 text-slate-800 border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm max-w-none prose-slate">
                  {msg.text}
                </div>

                {msg.contextUsed && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.contextUsed}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium py-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing live CRM intelligence...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot: 'Show high-value deals', 'Draft email'..."
              className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[11px] text-slate-400 mt-2 text-center">
            Local CRM Copilot • 100% Client-Side Privacy
          </div>
        </div>
      </div>
    </div>
  );
};
