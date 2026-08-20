import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Camera, 
  TrendingUp, 
  MapPin, 
  Truck, 
  Calculator, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ScoreRing } from '../components/ScoreRing';

export const Dashboard: React.FC = () => {
  const [activeBatch] = useState({
    batch_id: 'BATCH#WH-2026-0820-0042',
    produce_type: 'Wheat (HD-2967)',
    quality_score: 88.5,
    grade: 'A',
    quantity_quintals: 10,
    estimated_net: 23200,
    status: 'Ready for Mandi'
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Producer Intelligence Dashboard <span className="text-xl">🌾</span>
          </h1>
          <p className="text-sm text-gray-400">
            Real-time quality assaying, algorithmic price forecasting & route optimization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NavLink
            to="/scanner"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition"
          >
            <Camera className="w-4 h-4" /> Scan New Produce
          </NavLink>
        </div>
      </div>

      {/* Hero Active Batch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Batch Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#12121a] border border-emerald-500/20 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {activeBatch.batch_id}
              </span>
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> AI Assayed
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
              <ScoreRing score={activeBatch.quality_score} grade={activeBatch.grade} size={150} />
              
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white">{activeBatch.produce_type}</h3>
                <p className="text-xs text-gray-400">Batch Quantity: <strong className="text-white">{activeBatch.quantity_quintals} Quintals</strong></p>
                <div className="flex items-center gap-2 pt-2">
                  <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
                    <span className="text-gray-400">Recommended Market: </span>
                    <strong className="text-emerald-400">Azadpur (15 km)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Estimated Net Realization</span>
              <span className="text-2xl font-black text-emerald-400">₹{activeBatch.estimated_net.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <NavLink
                to="/quality-report"
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition"
              >
                Inspect Quality Report
              </NavLink>
              <NavLink
                to="/mandi-map"
                className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition"
              >
                View Route Optimization
              </NavLink>
            </div>
          </div>
        </div>

        {/* Live Market Pulse */}
        <div className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Market Pulse
            </h3>
            <NavLink to="/markets" className="text-[11px] text-cyan-400 hover:underline flex items-center">
              View Trends <ChevronRight className="w-3 h-3" />
            </NavLink>
          </div>

          <div className="space-y-3">
            {[
              { crop: 'Wheat 🌾', price: '₹2,520', trend: '+5.2%', up: true },
              { crop: 'Rice 🍚', price: '₹3,200', trend: '+1.8%', up: true },
              { crop: 'Tomato 🍅', price: '₹3,850', trend: '-3.4%', up: false },
              { crop: 'Onion 🧅', price: '₹2,350', trend: '+0.5%', up: true },
            ].map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs font-medium text-white">{m.crop}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-200">{m.price}/qtl</span>
                  <span className={`text-[11px] font-semibold flex items-center ${m.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {m.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
            <span className="font-bold">⚡ AI Market Tip:</span> Azadpur Mandi currently offering ₹120/qtl premium over Ghazipur for Grade A Wheat.
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Core Operational Modules</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { label: 'AI Scanner', icon: Camera, path: '/scanner', color: 'from-emerald-500 to-teal-500' },
            { label: 'Price Engine', icon: Calculator, path: '/price-estimator', color: 'from-cyan-500 to-blue-500' },
            { label: 'Mandi Map', icon: MapPin, path: '/mandi-map', color: 'from-amber-500 to-orange-500' },
            { label: 'Logistics', icon: Truck, path: '/logistics', color: 'from-purple-500 to-indigo-500' },
            { label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', color: 'from-pink-500 to-rose-500' },
            { label: 'AI Buyers', icon: Users, path: '/buyer-matching', color: 'from-emerald-400 to-cyan-500' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <NavLink
                key={i}
                to={action.path}
                className="p-4 rounded-2xl bg-[#1a1a2e] border border-white/5 hover:border-white/20 transition group flex flex-col items-center justify-center text-center space-y-2 hover:-translate-y-1 shadow-lg"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-black shadow-md group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">
                  {action.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
