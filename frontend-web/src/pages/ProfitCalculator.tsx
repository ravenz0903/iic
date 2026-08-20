import React, { useState } from 'react';
import { Calculator, ArrowDown, CheckCircle2 } from 'lucide-react';

export const ProfitCalculatorPage: React.FC = () => {
  const [price, setPrice] = useState(2520);
  const [quantity, setQuantity] = useState(10);
  const [distance, setDistance] = useState(15);
  const [vehicle, setVehicle] = useState<'mini' | 'large' | 'shared'>('mini');

  const grossRevenue = price * quantity;
  const transportCost = 500 + (vehicle === 'mini' ? 15 : vehicle === 'large' ? 25 : 10) * 2 * distance;
  const marketplaceFee = grossRevenue * 0.02;
  const loadingCharges = 50 * quantity;
  const cess = grossRevenue * 0.01;

  const totalDeductions = transportCost + marketplaceFee + loadingCharges + cess;
  const netIncome = grossRevenue - totalDeductions;
  const profitMargin = (netIncome / grossRevenue) * 100;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Profit Waterfall Calculator <Calculator className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-sm text-gray-400">
          Visual gross-to-net P&L waterfall chart preventing deceptive headline pricing.
        </p>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#1a1a2e] border border-white/5">
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5">Mandi Price (₹/qtl)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5">Quantity (qtl)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5">Distance (KM)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1.5">Vehicle</label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value as any)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="mini">Mini Truck</option>
            <option value="large">Large Truck</option>
            <option value="shared">Shared Transit</option>
          </select>
        </div>
      </div>

      {/* Waterfall P&L Card */}
      <div className="p-8 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-6">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider">Gross-to-Net Revenue Waterfall</h3>

        <div className="space-y-3">
          {/* Gross */}
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex justify-between items-center">
            <span className="font-bold text-sm text-emerald-400">1. Gross Selling Revenue</span>
            <span className="text-lg font-black text-white">+₹{grossRevenue.toLocaleString()}</span>
          </div>

          {/* Deductions */}
          <div className="pl-6 space-y-2 border-l-2 border-rose-500/40 my-2">
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-300">- Round-Trip Transport ({distance * 2} km)</span>
              <span className="font-bold text-rose-400">-₹{transportCost.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-300">- Marketplace Fee (2%)</span>
              <span className="font-bold text-rose-400">-₹{marketplaceFee.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-300">- Loading / Unloading Charges</span>
              <span className="font-bold text-rose-400">-₹{loadingCharges.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
              <span className="text-gray-300">- APMC Mandi Cess (1%)</span>
              <span className="font-bold text-rose-400">-₹{cess.toLocaleString()}</span>
            </div>
          </div>

          {/* Net */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black flex justify-between items-center shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block opacity-90">Total Net Realization (Take-Home)</span>
              <span className="text-xs opacity-90">Net Realized Price: <strong>₹{(netIncome / quantity).toFixed(2)}/qtl</strong></span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black">₹{netIncome.toLocaleString()}</span>
              <span className="text-xs font-bold block opacity-90">{profitMargin.toFixed(1)}% Realization Margin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
