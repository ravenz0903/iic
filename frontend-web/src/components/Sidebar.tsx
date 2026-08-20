import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  TrendingUp, 
  MapPin, 
  Truck, 
  Calculator, 
  ShoppingBag, 
  Users, 
  MessageSquareQuote, 
  GitCommit, 
  Sparkles,
  Zap
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Scanner', path: '/scanner', icon: Camera },
  { name: 'Market Intelligence', path: '/markets', icon: TrendingUp },
  { name: 'Price Estimator', path: '/price-estimator', icon: Calculator },
  { name: 'Mandi Map', path: '/mandi-map', icon: MapPin },
  { name: 'Logistics Optimizer', path: '/logistics', icon: Truck },
  { name: 'Profit Calculator', path: '/profit-calc', icon: Calculator },
  { name: 'Buyer Marketplace', path: '/marketplace', icon: ShoppingBag },
  { name: 'AI Buyer Matching', path: '/buyer-matching', icon: Users },
  { name: 'Offer Negotiations', path: '/offers', icon: MessageSquareQuote },
  { name: 'Batch Traceability', path: '/traceability', icon: GitCommit },
  { name: 'Farmer Simple Mode', path: '/simple-mode', icon: Zap },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#12121a] border-r border-white/5 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-extrabold text-xl">
          🌾
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            AGRI<span className="text-emerald-400">VISION</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-wide">Produce Intelligence</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Core Operations
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Copilot Quick Banner */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#252540] border border-cyan-500/20">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" /> AI Copilot Active
        </div>
        <p className="text-xs text-gray-300 mb-2.5">
          Ask pricing, timing & market routing advice anytime.
        </p>
        <NavLink
          to="/copilot"
          className="w-full py-1.5 px-3 bg-cyan-500 text-black font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-cyan-400 transition"
        >
          Open Assistant
        </NavLink>
      </div>
    </aside>
  );
};
