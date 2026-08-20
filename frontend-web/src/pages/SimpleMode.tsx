import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Calculator, MapPin, ShoppingBag } from 'lucide-react';

export const SimpleModePage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in flex flex-col justify-center min-h-[80vh]">
      <div className="text-center space-y-2">
        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
          🌾 KISAN EASY MODE (किसान सरल मोड)
        </span>
        <h1 className="text-3xl font-black text-white">Tap Any Button to Start</h1>
      </div>

      {/* 2x2 Giant Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NavLink
          to="/scanner"
          className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-[#1a1a2e] border-2 border-emerald-500/40 hover:border-emerald-400 transition flex flex-col items-center justify-center text-center space-y-3 shadow-2xl group"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition">
            <Camera className="w-10 h-10" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">1. SCAN PRODUCE</span>
            <span className="text-xs text-gray-400 font-semibold">(फसल की जांच करें)</span>
          </div>
        </NavLink>

        <NavLink
          to="/price-estimator"
          className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-[#1a1a2e] border-2 border-cyan-500/40 hover:border-cyan-400 transition flex flex-col items-center justify-center text-center space-y-3 shadow-2xl group"
        >
          <div className="w-20 h-20 rounded-3xl bg-cyan-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition">
            <Calculator className="w-10 h-10" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">2. CHECK PRICE</span>
            <span className="text-xs text-gray-400 font-semibold">(सही भाव जानें)</span>
          </div>
        </NavLink>

        <NavLink
          to="/mandi-map"
          className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/20 to-[#1a1a2e] border-2 border-amber-500/40 hover:border-amber-400 transition flex flex-col items-center justify-center text-center space-y-3 shadow-2xl group"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
            <MapPin className="w-10 h-10" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">3. BEST MANDI</span>
            <span className="text-xs text-gray-400 font-semibold">(सबसे अच्छी मंडी)</span>
          </div>
        </NavLink>

        <NavLink
          to="/marketplace"
          className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/20 to-[#1a1a2e] border-2 border-pink-500/40 hover:border-pink-400 transition flex flex-col items-center justify-center text-center space-y-3 shadow-2xl group"
        >
          <div className="w-20 h-20 rounded-3xl bg-pink-500 flex items-center justify-center text-black shadow-lg shadow-pink-500/30 group-hover:scale-110 transition">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <span className="text-2xl font-black text-white block">4. SELL TO BUYERS</span>
            <span className="text-xs text-gray-400 font-semibold">(सीधे खरीदार को बेचें)</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};
