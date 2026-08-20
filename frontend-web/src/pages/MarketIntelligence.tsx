import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import client from '../api/client';

export const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prices' | 'trends' | 'compare'>('trends');
  const [produce, setProduce] = useState('wheat');
  const [history, setHistory] = useState<{ date: string; price: number; volume: number }[]>([]);
  const [trends, setTrends] = useState<any>({
    moving_avg_7d: 2480,
    trend_direction: 'rising',
    volatility: 0.042,
    price_change_7d_pct: 5.2,
    price_change_30d_pct: 3.8,
  });

  useEffect(() => {
    // Generate 30 days mock history
    const data = [];
    const base = produce === 'wheat' ? 2500 : produce === 'rice' ? 3200 : 3800;
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const price = base + Math.sin(i / 4) * 120 + (Math.random() * 40 - 20);
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(price),
        volume: Math.round(800 + Math.random() * 500)
      });
    }
    setHistory(data);
  }, [produce]);

  const maxPrice = history.length > 0 ? Math.max(...history.map(h => h.price)) : 2600;
  const minPrice = history.length > 0 ? Math.min(...history.map(h => h.price)) : 2400;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Market Intelligence Engine <TrendingUp className="w-5 h-5 text-emerald-400" />
          </h1>
          <p className="text-sm text-gray-400">
            Real-time APMC Mandi trends, 90-day moving averages, and cross-market price volatility.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-[#1a1a2e] rounded-2xl border border-white/5 self-start">
          {[
            { id: 'trends', label: '90-Day Trends', icon: TrendingUp },
            { id: 'prices', label: 'Live Mandi Prices', icon: BarChart3 },
            { id: 'compare', label: 'Cross-Market Compare', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Produce Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['wheat', 'rice', 'tomato', 'onion', 'potato'].map((p) => (
          <button
            key={p}
            onClick={() => setProduce(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition border ${
              produce === p
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                : 'bg-[#1a1a2e] text-gray-400 border-white/5 hover:border-white/10'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Trend Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#1a1a2e] border border-white/5">
              <span className="text-xs text-gray-400">7-Day Moving Avg</span>
              <span className="text-2xl font-black text-white block mt-1">₹{trends.moving_avg_7d}/qtl</span>
            </div>
            <div className="p-5 rounded-3xl bg-[#1a1a2e] border border-white/5">
              <span className="text-xs text-gray-400">7-Day Price Direction</span>
              <span className="text-2xl font-black text-emerald-400 block mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-6 h-6" /> +{trends.price_change_7d_pct}% (Rising)
              </span>
            </div>
            <div className="p-5 rounded-3xl bg-[#1a1a2e] border border-white/5">
              <span className="text-xs text-gray-400">Market Volatility Index</span>
              <span className="text-2xl font-black text-cyan-400 block mt-1">{(trends.volatility * 100).toFixed(1)}% (Low)</span>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-white">Historical Price Evolution (Last 30 Days)</h3>
              <span className="text-xs text-gray-400">Peak: ₹{maxPrice} | Low: ₹{minPrice}</span>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-64 flex items-end gap-1.5 pt-8 px-2 overflow-x-auto">
              {history.map((item, idx) => {
                const heightPct = ((item.price - minPrice) / (maxPrice - minPrice || 1)) * 80 + 15;
                return (
                  <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-black/90 border border-white/10 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap pointer-events-none transition z-20">
                      ₹{item.price} • {item.date}
                    </div>

                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        idx === history.length - 1
                          ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/30'
                          : 'bg-white/10 hover:bg-emerald-500/50'
                      }`}
                    ></div>
                    {idx % 5 === 0 && (
                      <span className="text-[9px] text-gray-500 whitespace-nowrap">{item.date}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-4">
          {[
            { name: 'Azadpur Mandi', distance: '15 km', price: 2520, transport: 120, net: 2400, demand: 'High', best: true },
            { name: 'Ghazipur Mandi', distance: '40 km', price: 2680, transport: 320, net: 2360, demand: 'Medium', best: false },
            { name: 'Okhla Mandi', distance: '8 km', price: 2450, transport: 70, net: 2380, demand: 'High', best: false },
          ].map((m, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                m.best
                  ? 'bg-gradient-to-r from-emerald-500/10 to-[#1a1a2e] border-emerald-500/40 shadow-lg'
                  : 'bg-[#1a1a2e] border-white/5'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">{m.name}</h4>
                  {m.best && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
                      Highest Net Realization 🏆
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Distance: <strong className="text-gray-200">{m.distance}</strong> • Local Demand: <strong className="text-cyan-400">{m.demand}</strong>
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Gross Mandi Price</span>
                  <span className="text-base font-bold text-gray-300">₹{m.price}/qtl</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Transport Deduct</span>
                  <span className="text-base font-bold text-rose-400">-₹{m.transport}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">True Net Realization</span>
                  <span className="text-2xl font-black text-emerald-400">₹{m.net}/qtl</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'prices' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { mandi: 'Azadpur APMC', state: 'Delhi', price: 2520, volume: '1,400 qtl' },
            { mandi: 'Karnal Grain Market', state: 'Haryana', price: 2490, volume: '2,800 qtl' },
            { mandi: 'Sonipat Mandi', state: 'Haryana', price: 2480, volume: '950 qtl' },
            { mandi: 'Ghazipur APMC', state: 'Delhi', price: 2540, volume: '1,100 qtl' },
            { mandi: 'Alwar APMC', state: 'Rajasthan', price: 2420, volume: '3,200 qtl' },
            { mandi: 'Ghaziabad Mandi', state: 'Uttar Pradesh', price: 2460, volume: '1,650 qtl' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white">{item.mandi}</h4>
                  <span className="text-[11px] text-gray-400">{item.state}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400 font-mono">
                  {item.volume}
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                ₹{item.price} <span className="text-xs font-normal text-gray-400">/ qtl</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
