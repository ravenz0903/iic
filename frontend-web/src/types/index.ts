export interface DefectDetail {
  type: string;
  area_pixels: number;
  severity: 'minor' | 'moderate' | 'severe' | string;
  percentage: number;
}

export interface QualityReport {
  batch_id: string;
  produce_type: string;
  quality_score: number;
  grade: 'A' | 'B' | 'C' | 'Rejected' | string;
  detected_defects: DefectDetail[];
  defect_percentage: number;
  total_surface_area: number;
  size_analysis: {
    small_pct: number;
    medium_pct: number;
    large_pct: number;
  };
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

export interface PriceEstimate {
  estimated_price_per_quintal: number;
  price_range: { min: number; max: number };
  confidence: number;
  contributing_factors: {
    base_price: number;
    quality_multiplier: number;
    seasonal_multiplier: number;
    demand_multiplier: number;
  };
  produce_type: string;
  grade: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  data_cards?: any[];
  suggested_actions?: { label: string; action: string; query?: string; screen?: string }[];
  timestamp: string;
}
