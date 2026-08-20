import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';
import client from '../api/client';
import { MarketResult } from '../types';

export const MandiMap: React.FC = () => {
  const [markets, setMarkets] = useState<MarketResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<MarketResult | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await client.post('/optimize-route', {
          farmer_lat: 28.6139,
          farmer_lon: 77.2090,
          batch_weight_quintals: 10.0,
          quality_score: 88.5,
          vehicle_type: 'mini-truck'
        });
        setMarkets(response.data);
        if (response.data.length > 0) {
          setSelectedMarket(response.data[0]);
        }
      } catch (err) {
        const mock: MarketResult[] = [
          {
            id: 'market_a',
            name: 'Azadpur Mandi',
            distance_km: 15.0,
            base_price_per_quintal: 2800.0,
            toll_fees: 120.0,
            loading_charge: 40.0,
            cess_percent: 0.02,
            r_net: 2320.0,
            realized_price: 2478.0,
            deductions: 158.0,
          },
          {
            id: 'market_b',
            name: 'Ghazipur Mandi',
            distance_km: 40.0,
            base_price_per_quintal: 3100.0,
            toll_fees: 300.0,
            loading_charge: 50.0,
            cess_percent: 0.015,
            r_net: 2310.0,
            realized_price: 2743.0,
            deductions: 433.0,
          },
          {
            id: 'market_c',
            name: 'Okhla Mandi',
            distance_km: 8.0,
            base_price_per_quintal: 2650.0,
            toll_fees: 0.0,
            loading_charge: 35.0,
            cess_percent: 0.01,
            r_net: 2280.0,
            realized_price: 2345.0,
            deductions: 65.0,
          }
        ];
        setMarkets(mock);
        setSelectedMarket(mock[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Mandi Route & Net Profit Optimizer <MapPin className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-sm text-gray-400">
          Rank nearby mandis by True Net Realization (R_net), factoring in round-trip transit, tolls, and cess deductions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Canvas Preview */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          {/* Simulated Dark Mode Map Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs">
              <span className="text-gray-400 block">Current Farmer Location</span>
              <strong className="text-white flex items-center gap-1 mt-0.5">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Sonipat Farm (28.61° N, 77.20° E)
              </strong>
            </div>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">
              3 Nearby APMC Mandis
            </span>
          </div>

          {/* Interactive Visual Pins */}
          <div className="relative z-10 flex justify-around my-12">
            {markets.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setSelectedMarket(m)}
                className={`p-4 rounded-2xl transition flex flex-col items-center space-y-2 ${
                  selectedMarket?.id === m.id
                    ? 'bg-emerald-500 text-black scale-110 shadow-2xl shadow-emerald-500/40 font-bold'
                    : 'bg-black/60 text-white border border-white/10 hover:border-white/30'
                }`}
              >
                <MapPin className="w-6 h-6" />
                <span className="text-xs whitespace-nowrap">{m.name}</span>
                <span className="text-[10px] opacity-80">{m.distance_km} km away</span>
              </button>
            ))}
          </div>

          {/* Bottom selected overview */}
          {selectedMarket && (
            <div className="relative z-10 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">Selected Destination</span>
                <span className="text-sm font-bold text-white">{selectedMarket.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-400 block">Estimated Net Profit</span>
                <span className="text-lg font-black text-emerald-400">₹{(selectedMarket.r_net * 10).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mandi Cards List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Ranked by Net Realization</h3>
          {markets.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => setSelectedMarket(m)}
              className={`p-5 rounded-3xl border cursor-pointer transition space-y-3 ${
                selectedMarket?.id === m.id
                  ? 'bg-[#1a1a2e] border-emerald-500 shadow-xl ring-1 ring-emerald-500/50'
                  : 'bg-[#12121a] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">{m.name}</span>
                <span className="text-xs font-semibold text-amber-400">{m.distance_km} km</span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 flex justify-between items-center">
                <span className="text-xs text-gray-400">Net Profit (R_net)</span>
                <span className="text-xl font-black text-emerald-400">₹{m.r_net.toFixed(2)} <span className="text-xs font-normal">/qtl</span></span>
              </div>

              <div className="flex justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                <span>Gross: ₹{m.realized_price.toFixed(2)}</span>
                <span>Deductions: -₹{m.deductions.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
