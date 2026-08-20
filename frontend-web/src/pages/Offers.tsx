import React, { useState } from 'react';
import { MessageSquareQuote, Check, X, ArrowRight } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState([
    { id: 1, buyer: 'Delhi Buyer #14', crop: 'Grade A Wheat (10 qtl)', offered: 2480, asking: 2520, status: 'pending', note: 'Can pick up tomorrow morning directly at farm.' },
    { id: 2, buyer: 'Gurgaon Trader #7', crop: 'Grade A Wheat (10 qtl)', offered: 2550, asking: 2520, status: 'pending', note: 'Urgent requirement, willing to pay above asking!' },
    { id: 3, buyer: 'Noida Wholesaler #3', crop: 'Grade B Rice (25 qtl)', offered: 2950, asking: 3100, status: 'accepted', note: 'Closed and confirmed.' }
  ]);

  const handleAction = (id: number, status: string) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          Offer Negotiations <MessageSquareQuote className="w-5 h-5 text-cyan-400" />
        </h1>
        <p className="text-sm text-gray-400">
          Review incoming buyer bids, accept contracts, or propose automated counter-offers.
        </p>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white">{offer.buyer}</h3>
                <span className="text-xs text-gray-400">{offer.crop}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start ${
                offer.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {offer.status}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Buyer's Bid</span>
                <span className="text-2xl font-black text-cyan-400">₹{offer.offered} <span className="text-xs font-normal">/ qtl</span></span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Your Asking Price</span>
                <span className="text-base font-bold text-gray-300">₹{offer.asking} / qtl</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Variance</span>
                <span className={`text-sm font-bold ${offer.offered >= offer.asking ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {offer.offered >= offer.asking ? `+₹${offer.offered - offer.asking} (Above Asking!)` : `-₹${offer.asking - offer.offered}`}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 italic bg-white/5 p-3 rounded-xl">
              "{offer.note}"
            </p>

            {offer.status === 'pending' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleAction(offer.id, 'accepted')}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition"
                >
                  <Check className="w-4 h-4" /> Accept Offer
                </button>
                <button
                  onClick={() => handleAction(offer.id, 'rejected')}
                  className="py-2.5 px-4 rounded-xl bg-white/5 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
