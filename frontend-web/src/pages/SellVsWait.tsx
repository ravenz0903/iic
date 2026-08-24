import React, { useState } from 'react';
import { Calendar, HelpCircle, LineChart, ShoppingCart, Calculator, AlertCircle } from 'lucide-react';

export const SellVsWait: React.FC = () => {
  const [cropAmount, setCropAmount] = useState<number>(4.7); // in Tonnes
  const [currentPrice, setCurrentPrice] = useState<number>(20.5); // per kg
  const [storageCost, setStorageCost] = useState<number>(0.15); // per kg per day
  const [daysToWait, setDaysToWait] = useState<number>(3);
  const [expectedDailyTrend, setExpectedDailyTrend] = useState<number>(1.2); // expected daily increase in ₹ per kg

  // Calculations
  const tonnesToKg = cropAmount * 1000;
  
  // 1. Immediate Sell
  const immediateGross = tonnesToKg * currentPrice;
  const immediateTransport = tonnesToKg * 1.2; // ₹1.2/kg fixed transport
  const immediateNet = immediateGross - immediateTransport;

  // 2. Wait and Sell
  const futurePrice = currentPrice + (expectedDailyTrend * daysToWait);
  const futureGross = tonnesToKg * futurePrice;
  
  // Storage Cost = rate * kg * days
  const totalStorageCost = storageCost * tonnesToKg * daysToWait;
  
  // Spoilage risk (simulated: rises 0.5% every day stored)
  const spoilageRate = 0.005 * daysToWait; 
  const spoilageLoss = futureGross * spoilageRate;
  
  const futureTransport = immediateTransport; // remains fixed
  const futureNet = futureGross - (futureTransport + totalStorageCost + spoilageLoss);

  const profitDifference = futureNet - immediateNet;
  const isWaitBetter = profitDifference > 0;

  // 7-day forecast table generator
  const dailyProjections = Array.from({ length: 8 }, (_, day) => {
    const projectedPrice = currentPrice + (expectedDailyTrend * day);
    const dayGross = tonnesToKg * projectedPrice;
    const dayStorage = storageCost * tonnesToKg * day;
    const daySpoilage = dayGross * (0.005 * day);
    const dayNet = dayGross - (immediateTransport + dayStorage + daySpoilage);
    return {
      day,
      projectedPrice,
      dayStorage,
      daySpoilage,
      dayNet,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Sell vs Wait Simulator</h1>
        <p className="text-gray-600 mt-1">Determine if holding your crop in storage yields a higher Net Realization after accounting for storage costs and wastage.</p>
      </div>

      {/* Simulator Inputs & Key Output Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Panel */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-800" /> Simulator Inputs
          </h2>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harvest Quantity (Tonnes)</label>
              <input 
                type="number" 
                value={cropAmount} 
                onChange={(e) => setCropAmount(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-800" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Mandi Price (₹/kg)</label>
              <input 
                type="number" 
                value={currentPrice} 
                onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-800" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expected Daily Price Change (₹/kg)</label>
              <input 
                type="number" 
                value={expectedDailyTrend} 
                onChange={(e) => setExpectedDailyTrend(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-800" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Storage Cost (₹/kg/day)</label>
              <input 
                type="number" 
                value={storageCost} 
                onChange={(e) => setStorageCost(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-800" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Simulate Waiting Days</label>
              <select 
                value={daysToWait} 
                onChange={(e) => setDaysToWait(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-800 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                  <option key={d} value={d}>{d} Day{d > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Output Evaluation */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-gray-900">Decision Outcome</h2>
              <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${isWaitBetter ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {isWaitBetter ? 'RECOMMENDED: WAIT & STORE' : 'RECOMMENDED: SELL IMMEDIATELY'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <span className="text-xs text-gray-500 uppercase font-bold block">Sell Today Net Realization</span>
                <span className="text-2xl font-black text-gray-800 block mt-1">₹{immediateNet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                <span className="text-[10px] text-gray-400 block mt-1">Gross: ₹{immediateGross.toLocaleString('en-IN')} | Transport: -₹{immediateTransport.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-green-50/50 border border-green-100 rounded-lg p-4">
                <span className="text-xs text-green-800 uppercase font-bold block">Wait {daysToWait} Days Net Realization</span>
                <span className="text-2xl font-black text-green-800 block mt-1">₹{futureNet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                <span className="text-[10px] text-gray-500 block mt-1">Storage: -₹{totalStorageCost.toLocaleString('en-IN')} | Spoilage Risk: -₹{spoilageLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-800" />
              <span className="text-gray-700">
                Expected Additional Gain: <strong className="text-green-800">₹{Math.abs(profitDifference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
              </span>
            </div>
            <button className="bg-green-800 hover:bg-green-700 text-white font-bold px-5 py-2 rounded transition">
              Lock Storage Rate
            </button>
          </div>
        </div>

      </div>

      {/* 7-Day Net Realization Curve projection */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-green-800" /> Daily Net Realization Trend
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-medium">
                <th className="pb-3">Days Hold</th>
                <th className="pb-3">Projected Price</th>
                <th className="pb-3">Accumulated Storage</th>
                <th className="pb-3">Spoilage Risk Cost</th>
                <th className="pb-3 text-right">Expected Net Realization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {dailyProjections.map((p, idx) => {
                const isOptimal = p.dayNet === Math.max(...dailyProjections.map(d => d.dayNet));
                return (
                  <tr key={idx} className={`hover:bg-gray-50 transition ${isOptimal ? 'bg-green-50/30 font-semibold text-green-800' : ''}`}>
                    <td className="py-3 flex items-center gap-2">
                      {p.day === 0 ? 'Today (Sell)' : `Day ${p.day}`}
                      {isOptimal && <span className="bg-green-800 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Optimal Peak</span>}
                    </td>
                    <td className="py-3">₹{p.projectedPrice.toFixed(2)}/kg</td>
                    <td className="py-3">₹{p.dayStorage.toLocaleString('en-IN')}</td>
                    <td className="py-3">₹{p.daySpoilage.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 text-right text-gray-900 font-black">₹{p.dayNet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
