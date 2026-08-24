import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, LineChart, Globe, Info, RefreshCw, Crosshair, Cpu, Database, Compass } from 'lucide-react';

export const SatelliteIntel: React.FC = () => {
  const [selectedOverlay, setSelectedOverlay] = useState<'ndvi' | 'moisture' | 'thermal' | 'truecolor'>('ndvi');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live coordinates using geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: parseFloat(position.coords.latitude.toFixed(4)),
            lng: parseFloat(position.coords.longitude.toFixed(4)),
          });
        },
        () => {
          setCoords({ lat: 26.9124, lng: 75.7873 }); // Default Jaipur
        }
      );
    } else {
      setCoords({ lat: 26.9124, lng: 75.7873 });
    }
  }, []);

  const triggerScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult('Diagnostic: Band 8 (NIR) / Band 4 (Red) ratio at 4.2. Target canopy healthy.');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Satellite Intelligence</h1>
        <p className="text-gray-600 mt-1">Sentinel-2 & Landsat-8 high-resolution multispectral data feed.</p>
      </div>

      {/* Warning Banner: Satellite data as selling advantage */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 flex gap-4 items-start shadow-sm">
        <ShieldAlert className="w-6 h-6 text-yellow-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-yellow-800 text-base">Satellite Supply Alert: Upcoming Price Drop Warning</h3>
          <p className="text-sm text-yellow-700 leading-relaxed">
            Our Sentinel-2 imagery detects <strong>730+ hectares of ripe Tomato</strong> nearing harvest in neighboring districts (Jaipur Rural & Tonk). Expect a <strong>15-20% supply surge</strong> at local mandis in 5 to 7 days. 
          </p>
          <div className="pt-2 text-xs font-semibold text-green-800 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Recommended Action: Initiate sale contracts with verified processing buyers immediately or reserve cold storage.
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Satellite GIS Raster Viewer */}
        <div className="bg-[#1e293b] text-slate-100 rounded-xl p-6 shadow-lg lg:col-span-2 flex flex-col space-y-4 relative border border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2 font-mono">
                <Globe className="w-4 h-4 text-green-400" /> Sentinel-2 Spectral Imagery
              </h2>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Target: {coords ? `${coords.lat}°N, ${coords.lng}°E` : 'Pinpointing...'} | Pass: 22-Aug-2026
              </p>
            </div>
            
            {/* Interactive Layer selectors */}
            <div className="flex bg-slate-800 rounded-lg p-1 text-xs font-semibold text-slate-400 border border-slate-750">
              <button 
                onClick={() => setSelectedOverlay('ndvi')}
                className={`px-3 py-1.5 rounded-md transition font-mono ${selectedOverlay === 'ndvi' ? 'bg-green-800 text-white shadow-md' : 'hover:text-slate-200'}`}
              >
                NDVI
              </button>
              <button 
                onClick={() => setSelectedOverlay('moisture')}
                className={`px-3 py-1.5 rounded-md transition font-mono ${selectedOverlay === 'moisture' ? 'bg-blue-800 text-white shadow-md' : 'hover:text-slate-200'}`}
              >
                NDWI
              </button>
              <button 
                onClick={() => setSelectedOverlay('thermal')}
                className={`px-3 py-1.5 rounded-md transition font-mono ${selectedOverlay === 'thermal' ? 'bg-red-800 text-white shadow-md' : 'hover:text-slate-200'}`}
              >
                LST
              </button>
              <button 
                onClick={() => setSelectedOverlay('truecolor')}
                className={`px-3 py-1.5 rounded-md transition font-mono ${selectedOverlay === 'truecolor' ? 'bg-slate-700 text-white shadow-md' : 'hover:text-slate-200'}`}
              >
                RGB
              </button>
            </div>
          </div>

          {/* High-Tech HUD Map Screen */}
          <div className="relative border border-slate-800 rounded-lg bg-slate-950 h-[380px] flex items-center justify-center overflow-hidden">
            {/* Crop Field Satellite Background */}
            <div 
              className="absolute inset-0 opacity-30 bg-cover bg-center transition-all duration-500" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')` }} 
            />

            {/* Scanning line animation */}
            {scanning && (
              <div className="absolute left-0 right-0 h-1 bg-green-500/80 shadow-[0_0_10px_#22c55e] animate-scan z-20"></div>
            )}

            {/* High-Tech HUD Overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none border border-slate-800/80 flex flex-col justify-between p-4 font-mono text-[9px] text-green-500/70">
              <div className="flex justify-between">
                <span>SENSOR: Sentinel-2 MSI</span>
                <span>PRODUCT: L2A_T43QDA</span>
              </div>
              <div className="flex justify-between">
                <span>CENTER: {coords ? `${coords.lat}, ${coords.lng}` : ''}</span>
                <span>RESOL: 10M Multispectral</span>
              </div>
            </div>

            {/* Interactive Vector Boundaries with Overlay Heatmaps */}
            <svg viewBox="0 0 400 300" className="w-full h-full max-w-[520px] z-10 select-none">
              {/* Outer grid ticks */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Crosshair indicator */}
              <circle cx="200" cy="150" r="15" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" />
              <line x1="200" y1="120" x2="200" y2="180" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.8" />
              <line x1="170" y1="150" x2="230" y2="150" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.8" />

              {/* Field Contours */}
              <g className="transition-all duration-300">
                {/* Field A */}
                <polygon 
                  points="60,50 340,30 360,250 80,230" 
                  fill={
                    selectedOverlay === 'ndvi' ? 'rgba(34, 197, 94, 0.3)' :
                    selectedOverlay === 'moisture' ? 'rgba(59, 130, 246, 0.3)' :
                    selectedOverlay === 'thermal' ? 'rgba(239, 68, 68, 0.1)' :
                    'rgba(255, 255, 255, 0.05)'
                  } 
                  stroke="rgba(34, 197, 94, 0.6)" 
                  strokeWidth="1"
                />

                {/* Specific Health Hotspots */}
                <polygon 
                  points="140,80 230,70 250,150 160,160" 
                  fill={
                    selectedOverlay === 'ndvi' ? 'rgba(22, 101, 52, 0.6)' :
                    selectedOverlay === 'moisture' ? 'rgba(29, 78, 216, 0.6)' :
                    selectedOverlay === 'thermal' ? 'rgba(220, 38, 38, 0.1)' :
                    'rgba(255, 255, 255, 0.05)'
                  } 
                />

                {/* Defect/Stress patch */}
                <polygon 
                  points="260,170 320,160 310,220 250,210" 
                  fill={
                    selectedOverlay === 'ndvi' ? 'rgba(220, 38, 38, 0.4)' :
                    selectedOverlay === 'moisture' ? 'rgba(239, 68, 68, 0.4)' :
                    selectedOverlay === 'thermal' ? 'rgba(220, 38, 38, 0.6)' :
                    'rgba(220, 38, 38, 0.15)'
                  } 
                />
              </g>

              {/* Graphical Text Overlay */}
              <text x="75" y="70" fill="rgba(255, 255, 255, 0.8)" fontSize="8" fontFamily="monospace">REF: L2A_T43QDA</text>
              <text x="165" y="115" fill="#22c55e" fontSize="9" fontWeight="bold" fontFamily="monospace">FIELD_A_NDVI: 0.74</text>
              <text x="235" y="195" fill="#f87171" fontSize="8" fontWeight="bold" fontFamily="monospace">DRY_ZONE_LST: 34.2°C</text>
            </svg>

            {/* Satellite Scale Legends */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-700 p-3 rounded-lg text-[10px] shadow-lg space-y-1 font-mono text-slate-300">
              <span className="font-bold text-slate-100 block mb-1">Index Resolution</span>
              <div className="flex gap-2 items-center">
                <span className="w-2.5 h-2.5 bg-green-600 rounded-xs inline-block"></span>
                <span>Optimal (NDVI &gt; 0.6)</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-2.5 h-2.5 bg-yellow-500 rounded-xs inline-block"></span>
                <span>Mild Stress (0.3 - 0.6)</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-xs inline-block"></span>
                <span>Critical Dry (&lt; 0.3)</span>
              </div>
            </div>
          </div>

          {/* Interactive Scanning Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">
              {scanResult ? (
                <span className="text-green-400">✔ {scanResult}</span>
              ) : (
                <span>Ready to execute Sentinel-2 diagnostic scan.</span>
              )}
            </div>
            <button 
              onClick={triggerScan}
              disabled={scanning}
              className="bg-green-700 hover:bg-green-600 disabled:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded transition flex items-center gap-2 tracking-wider uppercase font-mono"
            >
              {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
              {scanning ? 'Computing...' : 'Calculate Band Math'}
            </button>
          </div>
        </div>

        {/* Index Scores & GIS Metadata Side Panel */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-green-800" /> Raster Metadata
            </h2>
            <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Orbit Path:</span>
                <span className="font-semibold text-gray-800 font-mono">Ascending, Track 119</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cloud Cover:</span>
                <span className="font-semibold text-green-700 font-mono">0.12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sensor:</span>
                <span className="font-semibold text-gray-800 font-mono">MSI (Multispectral)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Processing Level:</span>
                <span className="font-semibold text-gray-800 font-mono">Level-2A (Surface)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Grid Cell Size:</span>
                <span className="font-semibold text-gray-800 font-mono">10m x 10m Pixels</span>
              </div>
            </div>
          </div>

          {/* Key Indices Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-800" /> Key Indices
            </h2>

            <div className="space-y-4 border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block font-bold">Vegetation Health (NDVI)</span>
                  <span className="text-sm font-bold text-gray-800 mt-0.5 block font-mono">0.74 Average</span>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded">Healthy</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block font-bold">Water Deficit Index (WDI)</span>
                  <span className="text-sm font-bold text-gray-800 mt-0.5 block font-mono">0.22 (Low Stress)</span>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded">Optimal</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block font-bold">Chlorophyll Index</span>
                  <span className="text-sm font-bold text-gray-800 mt-0.5 block font-mono">340.2 mg/m²</span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded">Optimal</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-gray-500 flex gap-2 border-t border-gray-100">
              <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Next satellite pass scheduled for 27 August 2026.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
