import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Bell, Zap, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenCopilot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot }) => {
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <header className="h-16 bg-[#12121a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 flex items-center justify-between px-8">
      {/* Left info status */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          FastAPI Backend Connected (0.0.0.0:8000)
        </span>
        <span className="text-xs text-gray-400 hidden md:inline">
          Farmer: <strong className="text-white">Rajesh Kumar (Sonipat Hub)</strong>
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Simple Mode Toggle */}
        <NavLink
          to="/simple-mode"
          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition"
        >
          <Zap className="w-3.5 h-3.5" /> Easy Farmer Mode
        </NavLink>

        {/* AI Copilot Floating Trigger Button */}
        <button
          onClick={onOpenCopilot}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
        >
          <Sparkles className="w-4 h-4" /> Ask AI Copilot
        </button>

        {/* Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#12121a]"></span>
          </button>

          {showAlerts && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="font-bold text-xs uppercase tracking-wider text-white">Live Alerts (3)</span>
                <span className="text-[10px] text-emerald-400 font-semibold">Updated just now</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-gray-200">
                  <p className="font-semibold text-emerald-400">🟢 Wheat prices up 5.2%</p>
                  <p className="text-gray-400 text-[11px]">Azadpur Mandi offering ₹2,520/qtl today.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-gray-200">
                  <p className="font-semibold text-cyan-400">🔵 New Buyer Matched</p>
                  <p className="text-gray-400 text-[11px]">Delhi Buyer #14 requesting 10 quintals Grade A.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-gray-200">
                  <p className="font-semibold text-amber-400">🟡 Favorable Selling Window</p>
                  <p className="text-gray-400 text-[11px]">High demand trend over the next 48 hours.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
