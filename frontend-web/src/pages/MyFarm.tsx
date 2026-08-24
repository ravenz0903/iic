import React, { useState, useEffect } from 'react';
import { MapPin, Compass, Droplet, Sprout, TrendingUp, RefreshCw } from 'lucide-react';

export const MyFarm: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [soilHealth, setSoilHealth] = useState({
    pH: 6.8,
    nitrogen: 'Medium (140 kg/ha)',
    phosphorus: 'High (32 kg/ha)',
    potassium: 'Medium (180 kg/ha)',
    moisture: 42,
  });

  const getCoordinates = () => {
    setLoadingGeo(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: parseFloat(position.coords.latitude.toFixed(4)),
            lng: parseFloat(position.coords.longitude.toFixed(4)),
          });
          setLoadingGeo(false);
        },
        (error) => {
          console.warn('Geolocation error, using default Rajasthan farm coordinates.', error);
          // Default Rajasthan coords
          setCoords({ lat: 26.9124, lng: 75.7873 });
          setLoadingGeo(false);
        }
      );
    } else {
      setCoords({ lat: 26.9124, lng: 75.7873 });
      setLoadingGeo(false);
    }
  };

  useEffect(() => {
    getCoordinates();
  }, []);

  const triggerSoilTest = () => {
    // Simulating random change upon request
    setSoilHealth({
      pH: parseFloat((6.2 + Math.random() * 1.2).toFixed(1)),
      nitrogen: Math.random() > 0.5 ? 'High (160 kg/ha)' : 'Medium (130 kg/ha)',
      phosphorus: Math.random() > 0.5 ? 'Medium (24 kg/ha)' : 'High (35 kg/ha)',
      potassium: 'Medium (195 kg/ha)',
      moisture: Math.floor(30 + Math.random() * 30),
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Farm</h1>
          <p className="text-gray-600 mt-1">Manage field details, soil composition, and crop history.</p>
        </div>
        <button 
          onClick={getCoordinates}
          className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <RefreshCw className={`w-4 h-4 ${loadingGeo ? 'animate-spin' : ''}`} />
          Refresh Location
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Farm Metadata Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg text-green-800">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ramesh Kumar's Farm</h2>
              <p className="text-sm text-gray-500">Established 2012</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Acreage:</span>
              <span className="font-semibold text-gray-900">4.2 Acres</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Primary Soil Type:</span>
              <span className="font-semibold text-gray-900">Alluvial Loam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Crop:</span>
              <span className="font-semibold text-green-800">Tomato (Grade A target)</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Farm Coordinates</h3>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-green-800 shrink-0" />
              <span>
                <strong>Lat:</strong> {coords ? coords.lat : 'Detecting...'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Compass className="w-4 h-4 text-green-800 shrink-0" />
              <span>
                <strong>Lng:</strong> {coords ? coords.lng : 'Detecting...'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Coordinates are fetched dynamically using Google/browser location APIs to pinpoint regional weather & crop market signals.</p>
          </div>
        </div>

        {/* Soil Health Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Soil Health Analysis</h2>
            <button 
              onClick={triggerSoilTest}
              className="bg-green-800 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded transition"
            >
              Run Instant Soil Analysis
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-gray-100 rounded-lg p-4 text-center">
              <span className="text-xs text-gray-500 uppercase block font-bold">Soil pH</span>
              <span className="text-2xl font-black text-green-800 block mt-1">{soilHealth.pH}</span>
              <span className="text-[10px] text-green-600 block font-medium mt-1">Optimal Range</span>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 text-center">
              <span className="text-xs text-gray-500 uppercase block font-bold">Nitrogen (N)</span>
              <span className="text-sm font-black text-gray-800 block mt-2">{soilHealth.nitrogen.split(' ')[0]}</span>
              <span className="text-[10px] text-gray-500 block mt-1">{soilHealth.nitrogen.split(' ')[1] || ''}</span>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 text-center">
              <span className="text-xs text-gray-500 uppercase block font-bold">Phosphorus (P)</span>
              <span className="text-sm font-black text-gray-800 block mt-2">{soilHealth.phosphorus.split(' ')[0]}</span>
              <span className="text-[10px] text-gray-500 block mt-1">{soilHealth.phosphorus.split(' ')[1] || ''}</span>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 text-center">
              <span className="text-sm font-black text-gray-800 block mt-2">{soilHealth.potassium.split(' ')[0]}</span>
              <span className="text-[10px] text-gray-500 block mt-1">{soilHealth.potassium.split(' ')[1] || ''}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
            <Droplet className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-900">Soil Moisture Content: {soilHealth.moisture}%</h4>
              <p className="text-xs text-blue-700 mt-0.5">Water levels are ideal. No irrigation needed for the next 24 hours.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Historical Crop Performance */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-800" /> Historical Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-medium">
                <th className="pb-3">Season</th>
                <th className="pb-3">Crop Type</th>
                <th className="pb-3">Total Yield</th>
                <th className="pb-3">Grade Rating</th>
                <th className="pb-3">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="py-3">Rabi 2025</td>
                <td className="py-3 font-semibold">Wheat</td>
                <td className="py-3">6.1 Tonnes</td>
                <td className="py-3"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">Grade A</span></td>
                <td className="py-3 font-bold text-green-800">₹1,12,000</td>
              </tr>
              <tr>
                <td className="py-3">Kharif 2025</td>
                <td className="py-3 font-semibold">Maize</td>
                <td className="py-3">3.8 Tonnes</td>
                <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">Grade B</span></td>
                <td className="py-3 font-bold text-green-800">₹72,400</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
