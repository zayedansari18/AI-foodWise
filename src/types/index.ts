export type WasteLevel = 'Low' | 'Medium' | 'High';
export type LocationType = 'School' | 'College' | 'Hostel' | 'Restaurant' | 'Cafeteria' | 'Other';
export type UserRole = 'Student' | 'Staff' | 'Admin';

export interface Food {
  id: string;
  name: string;
  category: string;
  avg_serving_size: number; // grams
  estimated_cost_per_serving: number; // cost unit
  recommended_action: string;
  description: string;
  created_at: string;
}

export interface WasteRecord {
  id: string;
  food_id?: string;
  food_name: string;
  food_category: string;
  user_name_or_anonymous_id: string;
  waste_level: WasteLevel;
  estimated_quantity: string; // e.g. "100-150 g"
  image_url?: string;
  ai_confidence?: number;
  reason?: string;
  recommendation?: string;
  location_type: LocationType;
  created_at: string;
  is_demo?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AwarenessAction {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

export interface AIAnalysisResult {
  food_name: string;
  food_category: string;
  confidence: number;
  waste_level: WasteLevel;
  estimated_quantity_range: string;
  reason: string;
  recommendation: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  isDemoMode: boolean;
  demoNotice?: string;
  data: AIAnalysisResult;
  error?: string;
}
