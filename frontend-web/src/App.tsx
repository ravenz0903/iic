import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CopilotDrawer } from './components/CopilotDrawer';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { QualityReportPage } from './pages/QualityReport';
import { PriceEstimator } from './pages/PriceEstimator';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { MandiMap } from './pages/MandiMap';
import { LogisticsPage } from './pages/Logistics';
import { ProfitCalculatorPage } from './pages/ProfitCalculator';
import { MarketplacePage } from './pages/Marketplace';
import { BuyerMatchingPage } from './pages/BuyerMatching';
import { OffersPage } from './pages/Offers';
import { TraceabilityPage } from './pages/Traceability';
import { SimpleModePage } from './pages/SimpleMode';

// Farm Intelligence & Extra Pages
import { MyFarm } from './pages/MyFarm';
import { WeatherRisk } from './pages/WeatherRisk';
import { YieldPrediction } from './pages/YieldPrediction';
import { SatelliteIntel } from './pages/SatelliteIntel';
import { SellVsWait } from './pages/SellVsWait';
import { Login } from './pages/Login';

export const App: React.FC = () => {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#0a0a0f] text-white">
        {/* Main Left Sidebar */}
        <Sidebar />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onOpenCopilot={() => setCopilotOpen(true)} />

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/quality-report" element={<QualityReportPage />} />
              <Route path="/price-estimator" element={<PriceEstimator />} />
              <Route path="/markets" element={<MarketIntelligence />} />
              <Route path="/mandi-map" element={<MandiMap />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/profit-calc" element={<ProfitCalculatorPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/buyer-matching" element={<BuyerMatchingPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/traceability" element={<TraceabilityPage />} />
              <Route path="/simple-mode" element={<SimpleModePage />} />
              <Route path="/my-farm" element={<MyFarm />} />
              <Route path="/weather-risk" element={<WeatherRisk />} />
              <Route path="/yield-prediction" element={<YieldPrediction />} />
              <Route path="/satellite-intel" element={<SatelliteIntel />} />
              <Route path="/sell-vs-wait" element={<SellVsWait />} />
              <Route path="/login" element={<Login />} />
              <Route path="/copilot" element={<Dashboard />} />
            </Routes>
          </main>
        </div>

        {/* Global Slide-out AI Copilot */}
        <CopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
      </div>
    </BrowserRouter>
  );
};
