export interface DefectDetail {
  type: string;
  area_pixels: number;
  severity: 'minor' | 'moderate' | 'severe' | string;
  percentage: number;
}

export interface SizeAnalysis {
  small_pct: number;
  medium_pct: number;
  large_pct: number;
}

export interface QualityReport {
  batch_id: string;
  produce_type: string;
  quality_score: number;
  grade: 'A' | 'B' | 'C' | 'Rejected' | string;
  detected_defects: DefectDetail[];
  defect_percentage: number;
  total_surface_area: number;
  size_analysis: SizeAnalysis;
  color_uniformity: number;
  recommended_handling: string;
  confidence_score: number;
  timestamp: string;
  heatmap_url?: string;
}

export interface MarketResult {
  id: string;
  name: string;
  distance_km: number;
  base_price_per_quintal: number;
  toll_fees: number;
  loading_charge: number;
  cess_percent: number;
  r_net: number;
  realized_price: number;
  deductions: number;
  lat?: number;
  lon?: number;
}

export interface BatchInfo {
  id: string;
  farmer_id: string | number;
  produce_type: string;
  quantity_quintals: number;
  quality_score: number;
  grade: string;
  status: string;
  created_at: string;
}

export interface PriceEstimate {
  estimated_price_per_quintal: number;
  price_range: {
    min: number;
    max: number;
  };
  confidence: number;
  contributing_factors: Record<string, number>;
  produce_type: string;
  grade: string;
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
  volume?: number;
}

export interface TrendAnalysis {
  moving_avg_7d: number;
  trend_direction: 'rising' | 'falling' | 'stable' | string;
  volatility: number;
  price_change_7d_pct: number;
  price_change_30d_pct: number;
}

export interface MarketComparisonEntry {
  name: string;
  distance_km: number;
  current_price: number;
  transport_cost: number;
  net_earnings: number;
  demand_level: 'high' | 'medium' | 'low' | string;
  trend_direction: 'rising' | 'falling' | 'stable' | string;
}

// Phase 5 Additions
export interface CopilotMessage {
  role: 'user' | 'ai';
  content: string;
  data_cards?: any[];
  suggested_actions?: {
    label: string;
    action: string;
    query?: string;
    screen?: string;
  }[];
  timestamp: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'positive' | 'warning' | 'info' | string;
  title: string;
  message: string;
  timestamp: string;
  action?: {
    type: string;
    screen: string;
  };
  dismissed: boolean;
}

export interface AIRecommendation {
  action: string;
  best_market: any;
  expected_net: number;
  baseline_net: number;
  advantage_over_nearest: number;
  timing_advice: string;
  confidence: number;
  summary: string;
}

export interface PricePrediction {
  produce_type: string;
  current_price: number;
  predicted_price: number;
  days_ahead: number;
  direction: 'rising' | 'falling' | 'stable' | string;
  price_change_pct: number;
  confidence: number;
  advice: string;
}
