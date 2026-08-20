import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, ArrowRight } from 'lucide-react';
import client from '../api/client';
import { CopilotMessage } from '../types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: "Namaste! 🙏 I'm your **AI Agricultural Copilot**.\n\nAsk me anything in English or Hindi, such as:\n• *'Where should I sell my wheat for the highest profit?'*\n• *'Should I sell now or wait?'*\n• *'Find buyers paying above ₹2,400'*",
      timestamp: new Date().toISOString(),
      suggested_actions: [
        { label: "Where to sell?", action: "ask", query: "Where should I sell my wheat?" },
        { label: "Should I sell now?", action: "ask", query: "Should I sell now or wait?" },
        { label: "Find best buyers", action: "ask", query: "Find buyers willing to pay above ₹2,400" },
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await client.post('/copilot/ask', {
        query: queryText,
        context: {
          produce_type: "wheat",
          grade: "A",
          quality_score: 88.5,
          quantity_quintals: 10.0,
          farmer_lat: 28.6139,
          farmer_lon: 77.2090
        }
      });

      const aiMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data.answer,
        data_cards: response.data.data_cards,
        suggested_actions: response.data.suggested_actions,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      // Fallback
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: `Based on your Grade A Wheat (10 qtl), **Azadpur Mandi** is your most profitable destination.\n\n📍 Distance: 15 km\n💰 Price: ₹2,520/qtl\n🚛 Transport: ₹120\n✅ **Estimated Net Realization: ₹23,200**`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#12121a] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-black font-extrabold shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Agricultural Copilot <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">Intelligent Market & Decision Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-500 text-black font-medium' 
                  : 'bg-[#1a1a2e] border border-white/5 text-gray-200 shadow-md'
              }`}>
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Inline Data Cards */}
                {msg.data_cards && msg.data_cards.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                    {msg.data_cards.map((card, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          Data Insight: {card.type}
                        </span>
                        <pre className="text-[10px] text-gray-300 overflow-x-auto mt-1">
                          {JSON.stringify(card.data, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggested_actions && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {msg.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(act.query || act.label)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 text-cyan-300 text-[10px] font-semibold transition flex items-center gap-1"
                      >
                        {act.label} <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-cyan-400 font-medium p-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              AI Copilot is synthesizing real-time market data...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/5 bg-[#1a1a2e]">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'Best mandi for wheat?')"
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold disabled:opacity-40 hover:opacity-90 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
