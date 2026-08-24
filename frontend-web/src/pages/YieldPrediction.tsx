import React, { useState } from 'react';
import { Sprout, BarChart, Percent, CheckCircle, Info, ChevronRight } from 'lucide-react';

export const YieldPrediction: React.FC = () => {
  // Input parameters
  const [irrigation, setIrrigation] = useState<number>(2.2); // litres/day per plant (opt: 2.5)
  const [fertilizer, setFertilizer] = useState<number>(160); // kg/ha (opt: 180)
  const [avgTemp, setAvgTemp] = useState<number>(31); // °C (opt: 28)

  // Dynamic Yield simulation logic
  const baseYield = 4.2; // tonnes
  const irrigationDeviation = Math.abs(irrigation - 2.5) / 5;
  const fertilizerDeviation = Math.abs(fertilizer - 180) / 400;
  const tempDeviation = Math.abs(avgTemp - 28) / 30;

  // Final yield factor (capped to avoid extreme values)
  const yieldFactor = Math.max(0.6, Math.min(1.3, 1.25 - (irrigationDeviation + fertilizerDeviation + tempDeviation)));
  const predictedYield = baseYield * yieldFactor;

  // Confidence Rating
  const confidenceScore = Math.floor(88 + (1 - tempDeviation) * 7);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Yield Prediction</h1>
        <p className="text-gray-600 mt-1">Estimate total crop tonnage and simulate harvest outcomes based on agronomic inputs.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Expected Yield Output Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">Estimated Total Yield</span>
              <span className="text-3xl font-black text-green-800 block mt-2">
                {predictedYield.toFixed(2)} <span className="text-lg font-normal">Tonnes</span>
              </span>
            </div>
            <div className="p-3 bg-green-50 text-green-800 rounded-lg">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Historical baseline: 4.2 Tonnes</span>
            <span className="font-semibold text-green-700">
              {predictedYield >= baseYield ? `+${((predictedYield/baseYield - 1)*100).toFixed(0)}%` : `${((predictedYield/baseYield - 1)*100).toFixed(0)}%`}
            </span>
          </div>
        </div>

        {/* Confidence rating */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">Prediction Confidence</span>
              <span className="text-3xl font-black text-blue-900 block mt-2">
                {confidenceScore}%
              </span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-900 rounded-lg">
              <Percent className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Confidence score increases as localized soil testing and real-time weather alignment matches historical models.
          </p>
        </div>

        {/* National Benchmark Comparison */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">Regional Benchmark</span>
              <span className="text-3xl font-black text-gray-800 block mt-2">Top 12%</span>
            </div>
            <div className="p-3 bg-gray-50 text-gray-800 rounded-lg">
              <BarChart className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Your projected output per acre is 1.1x higher than the district average for loamy soil in Jaipur Rural.
          </p>
        </div>

      </div>

      {/* Yield Simulator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-green-800" /> Agronomic Yield Simulator
        </h2>
        <p className="text-xs text-gray-500 mb-6">Adjust input levels below to see how crop management decisions directly affect harvest tonnage.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Irrigation slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Irrigation (L/day per plant)</span>
              <span className="font-bold text-green-800">{irrigation} L</span>
            </div>
            <input 
              type="range" 
              min="1.0" 
              max="4.0" 
              step="0.1"
              value={irrigation}
              onChange={(e) => setIrrigation(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-800"
            />
            <span className="text-[10px] text-gray-400 block text-center">Optimal Level: 2.5 Litres</span>
          </div>

          {/* Fertilizer slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Nitrogen/Potash Input</span>
              <span className="font-bold text-green-800">{fertilizer} kg/ha</span>
            </div>
            <input 
              type="range" 
              min="80" 
              max="250" 
              step="5"
              value={fertilizer}
              onChange={(e) => setFertilizer(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-800"
            />
            <span className="text-[10px] text-gray-400 block text-center">Optimal Level: 180 kg/ha</span>
          </div>

          {/* Temp slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">Average Temp Trend</span>
              <span className="font-bold text-green-800">{avgTemp}°C</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="40" 
              step="1"
              value={avgTemp}
              onChange={(e) => setAvgTemp(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-800"
            />
            <span className="text-[10px] text-gray-400 block text-center">Optimal Level: 28°C</span>
          </div>
        </div>
      </div>

      {/* Harvest Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Crop Growth & Harvest Timeline</h2>
        <div className="relative border-l border-gray-200 pl-6 ml-4 space-y-6 text-sm">
          {/* Phase 1 */}
          <div className="relative">
            <div className="absolute -left-10 top-0.5 bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Phase 1: Seedling & Vegetative Development</h3>
              <p className="text-xs text-gray-500 mt-1">Verified via satellite: July 2026. Uniform crop canopy established.</p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="relative">
            <div className="absolute -left-10 top-0.5 bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Phase 2: Flowering & Pollination</h3>
              <p className="text-xs text-gray-500 mt-1">Verified: Early August 2026. High density flower set observed.</p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="relative">
            <div className="absolute -left-10 top-0.5 bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Phase 3: Fruit Set & Sizing</h3>
              <p className="text-xs text-gray-500 mt-1">Completed: Mid August 2026. Optimal fruit sizing confirmed via camera scan.</p>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="relative">
            <div className="absolute -left-10 top-0.5 bg-blue-100 text-blue-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Phase 4: Mature Harvest Window (ACTIVE)</h3>
              <p className="text-xs text-blue-700 mt-1 font-medium">Optimal Window: Next 3 to 5 days. Secure logistics booking before rain starts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
