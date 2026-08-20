import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { ShieldCheck, MapPin, Calculator, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { ScoreRing } from '../components/ScoreRing';
import { QualityReport } from '../types';

export const QualityReportPage: React.FC = () => {
  const location = useLocation();
  const report: QualityReport = location.state?.report || {
    batch_id: 'BATCH#WH-2026-0820-0042',
    produce_type: 'wheat',
    quality_score: 88.5,
    grade: 'A',
    detected_defects: [
      { type: 'bruising', area_pixels: 450, severity: 'minor', percentage: 3.2 },
      { type: 'discoloration', area_pixels: 280, severity: 'minor', percentage: 2.0 },
    ],
    defect_percentage: 5.2,
    total_surface_area: 14200,
    size_analysis: { small_pct: 15, medium_pct: 60, large_pct: 25 },
    color_uniformity: 0.91,
    recommended_handling: 'Standard handling — suitable for direct premium mandi sale',
    confidence_score: 0.89,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {report.batch_id}
            </span>
            <span className="text-xs text-gray-400">Assayed on {new Date(report.timestamp).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white capitalize">
            Digital Quality Assay Certificate ({report.produce_type})
          </h1>
        </div>

        <button 
          onClick={() => window.print()} 
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4" /> Download Certificate (PDF)
        </button>
      </div>

      {/* Main Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Ring Display */}
        <div className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
          <ScoreRing score={report.quality_score} grade={report.grade} size={180} />
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Assayed Classification</span>
            <span className="text-base font-bold text-emerald-400">Premium Grade {report.grade} Produce</span>
          </div>
        </div>

        {/* Metrics Grid (2 cols) */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-6 flex flex-col justify-between">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Defect Ratio</span>
              <span className="text-xl font-black text-rose-400">{report.defect_percentage.toFixed(1)}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Color Uniformity</span>
              <span className="text-xl font-black text-emerald-400">{(report.color_uniformity * 100).toFixed(0)}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider block">AI Confidence</span>
              <span className="text-xl font-black text-cyan-400">{(report.confidence_score * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Size Distribution */}
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Size Classification</span>
            <div className="h-3 rounded-full bg-black/40 overflow-hidden flex">
              <div style={{ width: `${report.size_analysis.small_pct}%` }} className="bg-gray-500" title="Small"></div>
              <div style={{ width: `${report.size_analysis.medium_pct}%` }} className="bg-emerald-500" title="Medium"></div>
              <div style={{ width: `${report.size_analysis.large_pct}%` }} className="bg-cyan-500" title="Large"></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
              <span>Small: {report.size_analysis.small_pct}%</span>
              <span className="text-emerald-400 font-semibold">Medium (Standard): {report.size_analysis.medium_pct}%</span>
              <span>Large: {report.size_analysis.large_pct}%</span>
            </div>
          </div>

          {/* Handling Recommendation */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <strong className="block text-white font-semibold">Recommended Handling:</strong>
              {report.recommended_handling}
            </div>
          </div>
        </div>
      </div>

      {/* Defect Segmentation Breakdown */}
      <div className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 space-y-4">
        <h3 className="font-bold text-base text-white">Segmented Defect Breakdown</h3>
        <div className="space-y-2.5">
          {report.detected_defects.map((defect, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white capitalize">{defect.type}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {defect.severity}
                </span>
                <span className="text-xs font-mono font-bold text-gray-300 w-16 text-right">{defect.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-wrap gap-4 pt-4">
        <NavLink
          to="/price-estimator"
          className="flex-1 py-3.5 px-6 rounded-2xl bg-cyan-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-cyan-400 transition"
        >
          <Calculator className="w-4 h-4" /> Estimate Price for Grade {report.grade}
        </NavLink>
        <NavLink
          to="/mandi-map"
          className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-emerald-400 transition"
        >
          <MapPin className="w-4 h-4" /> Find Highest-Paying Mandis
        </NavLink>
      </div>
    </div>
  );
};
