import React, { useState } from 'react';
import { ShoppingBag, Star, MapPin, Search, Filter } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [filterCrop, setFilterCrop] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');

  const listings = [
    { id: 1, batch_id: 'BATCH#WH-2026-0820-0042', crop: 'wheat', name: 'Premium Sharbati Wheat', grade: 'A', quantity: 10, price: 2520, seller: 'Rajesh Kumar', location: 'Sonipat, Haryana', distance: 45, stars: 4.8 },
    { id: 2, batch_id: 'BATCH#RI-2026-0819-0018', crop: 'rice', name: 'Basmati Rice 1121', grade: 'A', quantity: 50, price: 3400, seller: 'Suresh Yadav', location: 'Karnal, Haryana', distance: 80, stars: 4.9, bulk: true },
    { id: 3, batch_id: 'BATCH#TM-2026-0820-0009', crop: 'tomato', name: 'Hybrid Red Tomatoes', grade: 'B', quantity: 15, price: 3600, seller: 'Amit Sharma', location: 'Ghaziabad, UP', distance: 30, stars: 4.2 },
    { id: 4, batch_id: 'BATCH#ON-2026-0819-0022', crop: 'onion', name: 'Nasik Red Onions', grade: 'A', quantity: 100, price: 2400, seller: 'Vikram Jat', location: 'Alwar, Rajasthan', distance: 120, stars: 4.6, bulk: true },
  ];

  const filtered = listings.filter(l => {
    if (filterCrop !== 'all' && l.crop !== filterCrop) return false;
    if (filterGrade !== 'all' && l.grade !== filterGrade) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Smart Buyer Marketplace <ShoppingBag className="w-5 h-5 text-pink-400" />
          </h1>
          <p className="text-sm text-gray-400">
            Verified produce listings with transparent AI quality assay ratings and direct buyer bidding.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-[#1a1a2e] border border-white/5 items-center">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-pink-400" /> Filters:
        </span>
        <select
          value={filterCrop}
          onChange={(e) => setFilterCrop(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white capitalize focus:outline-none"
        >
          <option value="all">All Crops</option>
          <option value="wheat">🌾 Wheat</option>
          <option value="rice">🍚 Rice</option>
          <option value="tomato">🍅 Tomato</option>
          <option value="onion">🧅 Onion</option>
        </select>
        <select
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
        >
          <option value="all">All Grades</option>
          <option value="A">Grade A Only</option>
          <option value="B">Grade B Only</option>
        </select>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 hover:border-pink-500/30 transition space-y-4 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase">
                    Grade {item.grade} Assayed
                  </span>
                  {item.bulk && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold uppercase">
                      Bulk Available
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.stars}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Seller: <strong className="text-gray-200">{item.seller}</strong> ({item.location} • {item.distance} km)
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Asking Price</span>
                <span className="text-2xl font-black text-pink-400">₹{item.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400"> / quintal ({item.quantity} qtl total)</span>
              </div>
              <button 
                onClick={() => alert(`Offer submitted to ${item.seller} for ${item.name}!`)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-black font-extrabold text-xs hover:opacity-90 transition"
              >
                Make Direct Offer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
