import { Food, WasteRecord, User, AwarenessAction, WasteLevel, LocationType } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  FOODS: 'foodwise_foods_v1',
  RECORDS: 'foodwise_records_v1',
  USERS: 'foodwise_users_v1',
  AWARENESS: 'foodwise_awareness_v1',
};

// Initial Seed Foods (20 common foods with prototype estimates)
const INITIAL_FOODS: Food[] = [
  { id: 'f1', name: 'Steamed Rice', category: 'Grain', avg_serving_size: 180, estimated_cost_per_serving: 0.40, recommended_action: 'Offer half-portion defaults at counter', description: 'Standard white long-grain cooked rice.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f2', name: 'Yellow Dal Tadka', category: 'Legumes', avg_serving_size: 200, estimated_cost_per_serving: 0.65, recommended_action: 'Provide adjustable ladle serving size', description: 'Lentil soup with cumin tempering.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f3', name: 'Whole Wheat Roti', category: 'Grain', avg_serving_size: 60, estimated_cost_per_serving: 0.15, recommended_action: 'Bake fresh on demand rather than batch stacking', description: 'Unleavened flatbread served warm.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f4', name: 'Paneer Butter Masala', category: 'Dairy', avg_serving_size: 220, estimated_cost_per_serving: 1.80, recommended_action: 'Monitor self-serve bowl overflow', description: 'Cottage cheese cubes in tomato cashew gravy.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f5', name: 'Idli', category: 'Breakfast/Grain', avg_serving_size: 120, estimated_cost_per_serving: 0.35, recommended_action: 'Limit initial serving to 2 pieces per plate', description: 'Steamed fermented rice and black gram cakes.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f6', name: 'Coconut Chutney & Sambar', category: 'Condiment/Soup', avg_serving_size: 150, estimated_cost_per_serving: 0.40, recommended_action: 'Use small sauce ramekins', description: 'Accompaniment gravy and spiced dip.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f7', name: 'Fresh Garden Salad', category: 'Vegetables', avg_serving_size: 100, estimated_cost_per_serving: 0.70, recommended_action: 'Serve dressing on the side to prevent sogginess', description: 'Mixed cucumber, tomatoes, and lettuce.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f8', name: 'Vegetable Biryani', category: 'Grain', avg_serving_size: 250, estimated_cost_per_serving: 1.25, recommended_action: 'Provide smaller serving spoons', description: 'Fragrant rice layered with spiced vegetables.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f9', name: 'Curd / Yogurt', category: 'Dairy', avg_serving_size: 150, estimated_cost_per_serving: 0.50, recommended_action: 'Store in refrigerated single-serve cups', description: 'Plain whole milk cultured yogurt.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f10', name: 'Whole Wheat Bread', category: 'Grain', avg_serving_size: 70, estimated_cost_per_serving: 0.25, recommended_action: 'Provide toaster timers to avoid burning', description: 'Sliced bakery bread.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f11', name: 'Penne Pasta Marinara', category: 'Grain', avg_serving_size: 220, estimated_cost_per_serving: 1.10, recommended_action: 'Sauce to order to keep noodles firm', description: 'Italian penne pasta in herb tomato sauce.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f12', name: 'Chicken Curry', category: 'Poultry', avg_serving_size: 240, estimated_cost_per_serving: 2.10, recommended_action: 'Pre-apportion piece counts per order', description: 'Boneless chicken chunks in onion spice gravy.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f13', name: 'Mixed Vegetable Sabzi', category: 'Vegetables', avg_serving_size: 160, estimated_cost_per_serving: 0.60, recommended_action: 'Rotate seasonal produce for variety', description: 'Sautéed seasonal vegetables with mild spices.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f14', name: 'Tomato Soup', category: 'Soup', avg_serving_size: 180, estimated_cost_per_serving: 0.45, recommended_action: 'Serve in thermal soup dispensers with cups', description: 'Creamy soup with fried croutons.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f15', name: 'Fruit Salad Mix', category: 'Fruits', avg_serving_size: 140, estimated_cost_per_serving: 0.90, recommended_action: 'Cut fresh daily in small batches', description: 'Diced apples, bananas, and papaya.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f16', name: 'French Fries', category: 'Snack', avg_serving_size: 120, estimated_cost_per_serving: 0.75, recommended_action: 'Air fry in smaller batches during peak hours', description: 'Crispy potato fingers.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f17', name: 'Gulab Jamun', category: 'Dessert', avg_serving_size: 80, estimated_cost_per_serving: 0.60, recommended_action: 'Serve maximum 1-2 pieces per meal ticket', description: 'Fried milk solids in cardamom syrup.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f18', name: 'Poha (Flattened Rice)', category: 'Breakfast/Grain', avg_serving_size: 160, estimated_cost_per_serving: 0.40, recommended_action: 'Add peanuts on side for allergy and preference control', description: 'Tempered flattened rice with turmeric and mustard.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f19', name: 'Rajma Chawal', category: 'Legumes/Grain', avg_serving_size: 280, estimated_cost_per_serving: 1.00, recommended_action: 'Allow students to specify gravy to rice ratio', description: 'Red kidney bean curry served over rice.', created_at: '2026-08-01T10:00:00Z' },
  { id: 'f20', name: 'Noodles (Chow Mein)', category: 'Grain', avg_serving_size: 200, estimated_cost_per_serving: 0.85, recommended_action: 'Reduce oil content to prevent rapid spoilage', description: 'Stir-fried wheat noodles with vegetables.', created_at: '2026-08-01T10:00:00Z' }
];

// Generate 35 realistic waste records spanning the last 30 days across locations
function generateInitialWasteRecords(): WasteRecord[] {
  const records: WasteRecord[] = [];
  const locations: LocationType[] = ['Hostel', 'Cafeteria', 'School', 'College', 'Restaurant'];
  const levels: WasteLevel[] = ['Low', 'Medium', 'High'];
  
  const sampleScenarios = [
    { food: INITIAL_FOODS[0], level: 'High' as WasteLevel, qty: '140-180 g', reason: 'Large lunch scoop serving; diner left half unconsumed.', rec: 'Implement default half-portion scoop at counter.' },
    { food: INITIAL_FOODS[1], level: 'Medium' as WasteLevel, qty: '80-120 g', reason: 'Too much dal poured over rice dish.', rec: 'Use smaller ladles at self-serve station.' },
    { food: INITIAL_FOODS[2], level: 'Low' as WasteLevel, qty: '20-40 g', reason: 'Hard crust piece leftover.', rec: 'Bake rotis in smaller batch sizes.' },
    { food: INITIAL_FOODS[3], level: 'High' as WasteLevel, qty: '120-160 g', reason: 'Gravy spice too high for younger hostel boarders.', rec: 'Offer mild spice level option.' },
    { food: INITIAL_FOODS[6], level: 'High' as WasteLevel, qty: '90-130 g', reason: 'Salad was pre-dressed and wilted.', rec: 'Keep dressings on side ramekins.' },
    { food: INITIAL_FOODS[7], level: 'Medium' as WasteLevel, qty: '100-140 g', reason: 'Unused biryani at end of dinner service.', rec: 'Adjust cooking forecasting based on attendance.' },
    { food: INITIAL_FOODS[15], level: 'High' as WasteLevel, qty: '80-110 g', reason: 'Cold fries left over after rush hour.', rec: 'Prepare smaller batches on demand.' },
    { food: INITIAL_FOODS[18], level: 'High' as WasteLevel, qty: '150-200 g', reason: 'Heavy default Rajma combo portion.', rec: 'Allow diner to specify custom rice amount.' },
    { food: INITIAL_FOODS[10], level: 'Medium' as WasteLevel, qty: '90-120 g', reason: 'Pasta went cold on buffet tray.', rec: 'Use heat lamps or smaller warmers.' },
    { food: INITIAL_FOODS[11], level: 'Low' as WasteLevel, qty: '40-60 g', reason: 'Bone residue and small chicken piece.', rec: 'Audit portion sizing per chicken piece count.' }
  ];

  const now = new Date();

  for (let i = 0; i < 35; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const recDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 10 * 3600 * 1000);
    const scenario = sampleScenarios[i % sampleScenarios.length];
    const loc = locations[i % locations.length];
    
    records.push({
      id: `wr-demo-${i + 101}`,
      food_id: scenario.food.id,
      food_name: scenario.food.name,
      food_category: scenario.food.category,
      user_name_or_anonymous_id: i % 3 === 0 ? `Student_${100 + i}` : 'Anonymous Diner',
      waste_level: scenario.level,
      estimated_quantity: scenario.qty,
      image_url: undefined,
      ai_confidence: Number((0.85 + (i % 12) * 0.01).toFixed(2)),
      reason: scenario.reason,
      recommendation: scenario.rec,
      location_type: loc,
      created_at: recDate.toISOString(),
      is_demo: true
    });
  }

  // Sort newest first
  return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Dr. A. Sharma', email: 'principal@campus.edu', role: 'Admin', created_at: '2026-08-01T10:00:00Z' },
  { id: 'u2', name: 'Chef Rajesh Kumar', email: 'kitchen@campus.edu', role: 'Staff', created_at: '2026-08-01T10:00:00Z' },
  { id: 'u3', name: 'Ananya Sen', email: 'ananya.s@student.edu', role: 'Student', created_at: '2026-08-01T10:00:00Z' },
  { id: 'u4', name: 'Vikram Patel', email: 'hostel.warden@campus.edu', role: 'Staff', created_at: '2026-08-01T10:00:00Z' }
];

const INITIAL_AWARENESS: AwarenessAction[] = [
  { id: 'a1', title: 'Half-Portion Option Notice', description: 'Display clear signs at serving counters offering standard or half-size portions.', category: 'Portion Control', created_at: '2026-08-10T10:00:00Z' },
  { id: 'a2', title: 'Trayless Dining Day', description: 'Encourage students to carry only plates to avoid over-filling trays.', category: 'Nudge Campaign', created_at: '2026-08-12T10:00:00Z' },
  { id: 'a3', title: 'Live Waste Dashboard Screen', description: 'Display daily wasted weight total on cafeteria digital screens to build awareness.', category: 'Transparency', created_at: '2026-08-15T10:00:00Z' },
  { id: 'a4', title: 'Pre-Order Lunch System', description: 'Allow hostel boarders to select meal preferences 3 hours prior to cooking.', category: 'Menu Planning', created_at: '2026-08-18T10:00:00Z' },
  { id: 'a5', title: 'Compost Bin Weight Tracker', description: 'Weigh post-meal plate scrapes before disposal and rank student dining halls.', category: 'Gamification', created_at: '2026-08-20T10:00:00Z' }
];

// Helper to initialize local storage if empty
function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.FOODS)) {
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(INITIAL_FOODS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(generateInitialWasteRecords()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AWARENESS)) {
    localStorage.setItem(STORAGE_KEYS.AWARENESS, JSON.stringify(INITIAL_AWARENESS));
  }
}

// Ensure localStorage is initialized
initializeLocalStorage();

export const dataService = {
  // Foods API
  async getFoods(): Promise<Food[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('foods').select('*').order('name');
        if (!error && data && data.length > 0) return data as Food[];
      } catch (e) {
        console.warn('Supabase fetch foods failed, using local store', e);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.FOODS);
    return raw ? JSON.parse(raw) : INITIAL_FOODS;
  },

  async addFood(foodData: Omit<Food, 'id' | 'created_at'>): Promise<Food> {
    const newFood: Food = {
      ...foodData,
      id: `f-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('foods').insert([newFood]);
      } catch (e) {
        console.warn('Supabase insert food failed', e);
      }
    }
    const current = await this.getFoods();
    const updated = [newFood, ...current];
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(updated));
    return newFood;
  },

  // Waste Records API
  async getWasteRecords(): Promise<WasteRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('waste_records').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as WasteRecord[];
      } catch (e) {
        console.warn('Supabase fetch waste records failed, using local store', e);
      }
    }
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return raw ? JSON.parse(raw) : generateInitialWasteRecords();
  },

  async addWasteRecord(recordData: Omit<WasteRecord, 'id' | 'created_at'>): Promise<WasteRecord> {
    const newRecord: WasteRecord = {
      ...recordData,
      id: `wr-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_demo: false
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('waste_records').insert([{
          food_id: newRecord.food_id,
          user_name_or_anonymous_id: newRecord.user_name_or_anonymous_id,
          waste_level: newRecord.waste_level,
          estimated_quantity: newRecord.estimated_quantity,
          image_url: newRecord.image_url,
          ai_confidence: newRecord.ai_confidence,
          reason: newRecord.reason,
          recommendation: newRecord.recommendation,
          location_type: newRecord.location_type
        }]);
      } catch (e) {
        console.warn('Supabase insert waste record failed', e);
      }
    }

    const current = await this.getWasteRecords();
    const updated = [newRecord, ...current];
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
    return newRecord;
  },

  async deleteWasteRecord(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('waste_records').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete record failed', e);
      }
    }
    const current = await this.getWasteRecords();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
    return true;
  },

  // Users API
  async getUsers(): Promise<User[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  },

  // Awareness Actions API
  async getAwarenessActions(): Promise<AwarenessAction[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.AWARENESS);
    return raw ? JSON.parse(raw) : INITIAL_AWARENESS;
  },

  // Reset demo data helper
  resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(INITIAL_FOODS));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(generateInitialWasteRecords()));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.AWARENESS, JSON.stringify(INITIAL_AWARENESS));
    window.location.reload();
  }
};
