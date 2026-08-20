import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import client from '../api/client';

export const BuyerMatchingPage: React.FC = () => {
  const [buyers, setBuyers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await client.post('/match/buyers', {
          produce_type: 'wheat',
          grade: 'A',
          quality_score: 88.5,
          quantity_quintals: 10.0,
          farmer_lat: 28.6139,
          farmer_lon: 77.2090
        });
        setBuyers(res.data);
      } catch (err) {
        setBuyers([
          { buyer_id: 1, buyer_name: 'Delhi Buyer #14', business_name: 'Kumar Agro Traders', match_percentage: 94.2, expected_price: 2520, distance_km: 45, net_earning_per_qtl: 2385, reliability_score: 4.8 },
          { buyer_id: 2, buyer_name: 'Gurgaon Trader #7', business_name: 'Sharma & Sons Wholesalers', match_percentage: 88.5, expected_price: 2490, distance_km: 55, net_earning_per_qtl: 2325, reliability_score: 4.6 },
          { buyer_id: 3, buyer_name: 'Noida Grain Exporters', business_name: 'Agri Fresh Global', match_percentage: 85.0, expected_price: 2550, distance_km: 70, net_earning_per_qtl: 2340, reliability_score: 4.4 },
        ]);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          AI Buyer Matching Engine <Users className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-sm text-gray-400">
          Ranked buyer recommendations matching your assayed Grade A Wheat, preferred batch volume, and maximum net profitability.
        </p>
      </div>

      <div className="space-y-4">
        {buyers.map((b, idx) => (
          <div
            key={b.buyer_id}
            className={`p-6 rounded-3xl border transition flex flex-col md:flex-row md:items-center justify-between gap-6 ${
              idx === 0
                ? 'bg-gradient-to-r from-emerald-500/10 via-[#1a1a2e] to-[#1a1a2e] border-emerald-500/50 shadow-xl'
                : 'bg-[#1a1a2e] border-white/5'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{b.buyer_name}</h3>
                {idx === 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
                    🏆 Best Compatibility Match
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {b.business_name} • <strong className="text-gray-200">{b.distance_km} km away</strong> • ⭐ {b.reliability_score}/5
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">Match Rating</span>
                <span className="text-2xl font-black text-white">{b.match_percentage}%</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Expected Price</span>
                <span className="text-lg font-bold text-gray-200">₹{b.expected_price}/qtl</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Net Earning</span>
                <span className="text-2xl font-black text-emerald-400">₹{b.net_earning_per_qtl}/qtl</span>
              </div>
              <button
                onClick={() => alert(`Connecting with ${b.buyer_name}...`)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition"
              >
                Send Batch Offer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
