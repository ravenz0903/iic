import React from 'react';
import { GitCommit, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const TraceabilityPage: React.FC = () => {
  const steps = [
    { step: 1, title: 'AI Quality Assayed & Certified', time: 'Aug 20, 2026 • 09:30 AM', location: 'Sonipat Farm Hub', desc: 'Analyzed Grade A Sharbati Wheat. Surface defect score: 88.5/100.', done: true },
    { step: 2, title: 'Listed on Direct Marketplace', time: 'Aug 20, 2026 • 11:15 AM', location: 'AI Produce Platform', desc: '10 Quintals listed with AI suggested base rate ₹2,520/qtl.', done: true },
    { step: 3, title: 'Offer Accepted & Contract Locked', time: 'Aug 20, 2026 • 02:40 PM', location: 'Kumar Agro Traders', desc: 'Buyer bid of ₹2,520 confirmed. Escrow guarantee locked.', done: true },
    { step: 4, title: 'In Transit to Azadpur Mandi', time: 'Aug 20, 2026 • 04:00 PM', location: 'Transit Route NH-44', desc: 'Mini Truck dispatched. ETA 1.2 Hours.', current: true },
    { step: 5, title: 'Mandi Delivery Confirmation', time: 'Pending Arrival', location: 'Azadpur APMC Bay 4', desc: 'Weight verification and final receipt issuance.' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="border-b border-white/5 pb-6">
        <span className="text-xs font-mono uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          BATCH#WH-2026-0820-0042
        </span>
        <h1 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
          Digital Supply Chain Traceability <GitCommit className="w-5 h-5 text-cyan-400" />
        </h1>
        <p className="text-sm text-gray-400">
          Cryptographically auditable farm-to-mandi chain of custody with verified quality assay metrics.
        </p>
      </div>

      {/* Stepper Timeline */}
      <div className="p-8 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-6">
        {steps.map((s, idx) => (
          <div key={idx} className="flex gap-4 relative">
            {/* Vertical Line */}
            {idx < steps.length - 1 && (
              <div className={`absolute left-3.5 top-8 w-0.5 h-16 ${s.done ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
            )}

            {/* Circle Badge */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
              s.done 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40' 
                : s.current
                ? 'bg-cyan-500 text-black animate-pulse ring-4 ring-cyan-500/20'
                : 'bg-white/10 text-gray-500'
            }`}>
              {s.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>

            {/* Content */}
            <div className="pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-white">{s.title}</h4>
                <span className="text-[11px] text-gray-400">• {s.time}</span>
              </div>
              <span className="text-xs text-cyan-400 font-semibold block mt-0.5">{s.location}</span>
              <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
