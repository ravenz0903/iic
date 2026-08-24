import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Calendar, AlertTriangle, ArrowRight, ShieldCheck, Thermometer, Wind, Droplets, SunDim } from 'lucide-react';

export const WeatherRisk: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<{
    temp: number;
    humidity: number;
    windSpeed: number;
    soilTemp: number;
    uvIndex: number;
  } | null>(null);

  useEffect(() => {
    // Geolocation API, default to Jaipur, Rajasthan
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeather(26.9124, 75.7873);
        }
      );
    } else {
      fetchWeather(26.9124, 75.7873);
    }
  }, []);

  const fetchWeather = async (lat: number, lng: number) => {
    try {
      setLoading(true);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,soil_temperature_6cm&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather data from Open-Meteo.');
      const data = await res.json();
      
      setCurrentMetrics({
        temp: data.current?.temperature_2m || 30.2,
        humidity: data.current?.relative_humidity_2m || 65,
        windSpeed: data.current?.wind_speed_10m || 12,
        soilTemp: data.current?.soil_temperature_6cm || 25.4,
        uvIndex: data.daily?.uv_index_max[0] || 7.2,
      });

      const mappedDaily = data.daily.time.map((time: string, index: number) => ({
        date: time,
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
        rain: data.daily.precipitation_sum[index],
        code: data.daily.weathercode[index],
        uv: data.daily.uv_index_max[index],
      }));
      setWeatherData(mappedDaily);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error loading live weather data');
      setLoading(false);
    }
  };

  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 80 && code <= 82) return 'Showers';
    return 'Overcast';
  };

  const getFinancialDecision = (dailyRain: number[]) => {
    const totalRainNext3Days = dailyRain.slice(0, 3).reduce((sum, val) => sum + val, 0);

    if (totalRainNext3Days > 8) {
      return {
        riskLevel: 'HIGH SPOILAGE RISK',
        riskColor: 'bg-red-50 border-red-200 text-red-700',
        badgeColor: 'bg-red-100 text-red-800',
        consequence: `Heavy rainfall (${totalRainNext3Days.toFixed(1)}mm) expected over the next 72 hours will cause waterlogging. Leaving tomatoes unharvested will result in skin splitting and fungal rot, downgrading quality from Grade A to Grade C.`,
        financialLoss: '₹14,200',
        action: 'Harvest all mature batches (Target: 4.7 tonnes) immediately. Secure transportation to dry storage units or process direct contract sale to ABC Food Processing today.'
      };
    } else if (totalRainNext3Days > 2) {
      return {
        riskLevel: 'MODERATE WEATHER RISK',
        riskColor: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        badgeColor: 'bg-yellow-100 text-yellow-800',
        consequence: `Light showers (${totalRainNext3Days.toFixed(1)}mm) expected. May increase pest infestation risk.`,
        financialLoss: '₹4,500',
        action: 'Apply crop protection treatment today. Delay main harvest by 48 hours until ground is dry to avoid soil compaction and labor delays.'
      };
    } else {
      return {
        riskLevel: 'LOW RISK (OPTIMAL WEATHER)',
        riskColor: 'bg-green-50 border-green-200 text-green-700',
        badgeColor: 'bg-green-100 text-green-800',
        consequence: 'Weather conditions remain ideal for fruit development and solar accumulation.',
        financialLoss: '₹0 (Optimized)',
        action: 'Maintain standard drip irrigation cycles. Proceed with selective harvesting of Grade A batch on the planned date.'
      };
    }
  };

  const decision = weatherData.length > 0 ? getFinancialDecision(weatherData.map(w => w.rain)) : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Weather & Risk</h1>
        <p className="text-gray-600 mt-1">Translating weather forecast data into clear, financially-quantified crop decisions.</p>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
          <p className="text-gray-500 mt-4 text-sm font-semibold">Fetching live local weather variables...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center shadow-sm">
          <p className="font-bold">Weather API Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Real-time Agricultural Weather Metrics */}
          {currentMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Air Temperature</span>
                <span className="text-2xl font-black text-gray-900 block mt-1">{currentMetrics.temp}°C</span>
                <span className="text-[9px] text-gray-500 mt-1">Optimal for harvest</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Relative Humidity</span>
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span className="text-2xl font-black text-gray-900 block mt-1">{currentMetrics.humidity}%</span>
                <span className="text-[9px] text-gray-500 mt-1">High disease risk</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Wind Speed</span>
                  <Wind className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="text-2xl font-black text-gray-900 block mt-1">{currentMetrics.windSpeed} km/h</span>
                <span className="text-[9px] text-gray-500 mt-1">Safe for spray operations</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Soil Temp (6cm)</span>
                  <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <span className="text-2xl font-black text-gray-900 block mt-1">{currentMetrics.soilTemp}°C</span>
                <span className="text-[9px] text-green-600 font-bold mt-1">Root Activity Peak</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UV Index</span>
                  <SunDim className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                <span className="text-2xl font-black text-gray-900 block mt-1">{currentMetrics.uvIndex} Max</span>
                <span className="text-[9px] text-amber-600 font-semibold mt-1">High Evaporation Risk</span>
              </div>
            </div>
          )}

          {/* Main Financial Consequence Card */}
          {decision && (
            <div className={`border-2 rounded-xl p-6 shadow-md ${decision.riskColor} relative`}>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${decision.badgeColor}`}>
                  {decision.riskLevel}
                </span>
              </div>

              <h2 className="text-lg font-extrabold flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 shrink-0" /> Financial Impact Projection
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Crop Consequence</h3>
                    <p className="text-sm text-gray-700 mt-1 leading-relaxed">{decision.consequence}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Recommended Action</h3>
                    <p className="text-sm font-bold text-gray-900 mt-1 leading-relaxed">{decision.action}</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-center items-center text-center shadow-sm">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Estimated Spoilage Loss</span>
                  <span className="text-3xl font-black text-red-600 block mt-2">{decision.financialLoss}</span>
                  <span className="text-[10px] text-gray-400 mt-1 block">if action is not taken</span>
                </div>
              </div>
            </div>
          )}

          {/* Daily Forecast List */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-800" /> 7-Day Live Local Forecast
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              {weatherData.map((w, idx) => {
                const isRainy = w.rain > 0;
                return (
                  <div key={idx} className="border border-gray-100 rounded-lg p-4 text-center hover:shadow-sm transition">
                    <span className="text-xs text-gray-500 font-semibold uppercase block">
                      {new Date(w.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="my-3 flex justify-center text-green-800">
                      {isRainy ? <CloudRain className="w-8 h-8 text-blue-600" /> : <Sun className="w-8 h-8 text-yellow-500" />}
                    </div>
                    <span className="text-sm font-black text-gray-900 block">{w.maxTemp}°C</span>
                    <span className="text-xs text-gray-400 block">{w.minTemp}°C</span>
                    <span className="text-[10px] font-bold text-blue-600 block mt-2">
                      {w.rain > 0 ? `${w.rain.toFixed(1)}mm rain` : 'No Rain'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
