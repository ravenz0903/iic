import React, { useState } from 'react';
import { Truck, Navigation, CheckCircle, ArrowRight } from 'lucide-react';

export const LogisticsPage: React.FC = () => {
  const [distance, setDistance] = useState(15);
  const [quantity, setQuantity] = useState(10);

  const vehicleOptions = [
    { type: 'Mini Truck (Tata Ace)', cost: 500 + 15 * 2 * distance, capacity: 20, eta: '1.2 Hours', tag: 'Best for 10-20 Qtl' },
    { type: 'Large Truck (10 Tonner)', cost: 500 + 25 * 2 * distance, capacity: 80, eta: '1.0 Hours', tag: 'Best for Bulk (>50 Qtl)' },
    { type: 'Shared Transit Pool', cost: 300 + 10 * 2 * distance, capacity: 10, eta: '3.5 Hours', tag: 'Lowest Cost per Quintal' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Logistics Optimizer <Truck className="w-5 h-5 text-purple-400" />
        </h1>
        <p className="text-sm text-gray-400">
          Optimize transit configurations, calculate round-trip freight costs, and compare vehicle options.
        </p>
      </div>

      {/* Transit Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-3xl bg-[#1a1a2e] border border-white/5">
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5">Delivery Distance (KM)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5">Batch Load (Quintals)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicleOptions.map((v, i) => (
          <div key={i} className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 hover:border-purple-500/30 transition space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold uppercase">
                {v.tag}
              </span>
              <h3 className="text-base font-bold text-white">{v.type}</h3>
              <p className="text-xs text-gray-400">Capacity: <strong className="text-gray-200">{v.capacity} Quintals</strong></p>
              <p className="text-xs text-gray-400">Estimated Transit Time: <strong className="text-cyan-400">{v.eta}</strong></p>
            </div>

            <div className="pt-4 border-t border-white/5">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Round-Trip Freight Cost</span>
              <span className="text-2xl font-black text-purple-400">₹{v.cost.toLocaleString()}</span>
              <span className="text-xs text-gray-400 block mt-1">₹{(v.cost / quantity).toFixed(2)} per quintal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
