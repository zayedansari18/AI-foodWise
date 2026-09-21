-- ==============================================================================
-- AI-foodWISE Supabase Database Schema & Prototype Seed Data
-- Target SDG 12.3: Responsible Consumption & Production
-- ==============================================================================

-- 1. Create 'foods' table (Reference Food Catalog)
CREATE TABLE IF NOT EXISTS public.foods (
    id UUID PRIMARY KEY DEFAULT gen_random_policy_id(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    avg_serving_size NUMERIC NOT NULL, -- in grams (prototype estimate)
    estimated_cost_per_serving NUMERIC NOT NULL, -- in USD/local currency (prototype estimate)
    recommended_action TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'waste_records' table (Logged Waste Entries)
CREATE TABLE IF NOT EXISTS public.waste_records (
    id UUID PRIMARY KEY DEFAULT gen_random_policy_id(),
    food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
    user_name_or_anonymous_id TEXT DEFAULT 'Anonymous User',
    waste_level TEXT CHECK (waste_level IN ('Low', 'Medium', 'High')) NOT NULL,
    estimated_quantity TEXT NOT NULL, -- e.g. "100-150 g"
    image_url TEXT,
    ai_confidence NUMERIC CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
    reason TEXT,
    recommendation TEXT,
    location_type TEXT CHECK (location_type IN ('School', 'College', 'Hostel', 'Restaurant', 'Cafeteria', 'Other')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'users' table (Institutional Accounts)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_policy_id(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('Student', 'Staff', 'Admin')) NOT NULL DEFAULT 'Student',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'awareness_actions' table (Campaigns & Recommendations)
CREATE TABLE IF NOT EXISTS public.awareness_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_policy_id(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Portion Control', 'Nudge Campaign', 'Menu Planning'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awareness_actions ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read on foods" ON public.foods FOR SELECT USING (true);
CREATE POLICY "Allow public insert on foods" ON public.foods FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on waste_records" ON public.waste_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert on waste_records" ON public.waste_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read on awareness_actions" ON public.awareness_actions FOR SELECT USING (true);

-- ==============================================================================
-- Seed Data: 20 Foods (Prototype Estimates)
-- ==============================================================================
INSERT INTO public.foods (name, category, avg_serving_size, estimated_cost_per_serving, recommended_action, description) VALUES
('Steamed Rice', 'Grain', 180, 0.40, 'Offer half-portion defaults at counter', 'Standard white long-grain cooked rice.'),
('Yellow Dal Tadka', 'Legumes', 200, 0.65, 'Provide adjustable ladle serving size', 'Lentil soup with cumin and spice tempering.'),
('Whole Wheat Roti', 'Grain', 60, 0.15, 'Bake fresh on demand rather than batch stacking', 'Unleavened flatbread served warm.'),
('Paneer Butter Masala', 'Dairy', 220, 1.80, 'Monitor self-serve bowl overflow', 'Cottage cheese cubes in rich tomato cashew gravy.'),
('Idli', 'Breakfast/Grain', 120, 0.35, 'Limit initial serving to 2 pieces per plate', 'Steamed fermented rice and black gram cakes.'),
('Coconut Chutney & Sambar', 'Condiment/Soup', 150, 0.40, 'Use small sauce ramekins', 'Accompaniment gravy and spiced dip.'),
('Fresh Garden Salad', 'Vegetables', 100, 0.70, 'Serve dressing on the side to prevent sogginess', 'Mixed cucumber, tomatoes, and lettuce.'),
('Vegetable Biryani', 'Grain', 250, 1.25, 'Provide smaller serving spoons', 'Fragrant rice layered with spiced vegetables.'),
('Curd / Yogurt', 'Dairy', 150, 0.50, 'Store in refrigerated single-serve cups', 'Plain whole milk cultured yogurt.'),
('Whole Wheat Bread', 'Grain', 70, 0.25, 'Provide toaster timers to avoid burning', 'Sliced bakery bread.'),
('Penne Pasta Marinara', 'Grain', 220, 1.10, 'Sauce to order to keep noodles firm', 'Italian penne pasta in herb tomato sauce.'),
('Chicken Curry', 'Poultry', 240, 2.10, 'Pre-apportion piece counts per order', 'Boneless chicken chunks in onion spice gravy.'),
('Mixed Vegetable Sabzi', 'Vegetables', 160, 0.60, 'Rotate seasonal produce for variety', 'Sautéed seasonal vegetables with mild spices.'),
('Tomato Soup', 'Soup', 180, 0.45, 'Serve in thermal soup dispensers with cups', 'Creamy soup with fried croutons.'),
('Fruit Salad Mix', 'Fruits', 140, 0.90, 'Cut fresh daily in small batches', 'Diced apples, bananas, and papaya.'),
('French Fries', 'Snack', 120, 0.75, 'Air fry in smaller batches during peak hours', 'Crispy potato fingers.'),
('Gulab Jamun', 'Dessert', 80, 0.60, 'Serve maximum 1-2 pieces per meal ticket', 'Fried milk solids in cardamom syrup.'),
('Poha (Flattened Rice)', 'Breakfast/Grain', 160, 0.40, 'Add peanuts on side for allergy and preference control', 'Tempered flattened rice with turmeric and mustard.'),
('Rajma Chawal', 'Legumes/Grain', 280, 1.00, 'Allow students to specify gravy to rice ratio', 'Red kidney bean curry served over rice.'),
('Noodles (Chow Mein)', 'Grain', 200, 0.85, 'Reduce oil content to prevent rapid spoilage', 'Stir-fried wheat noodles with vegetables.');

-- ==============================================================================
-- Seed Data: Sample Institutional Users
-- ==============================================================================
INSERT INTO public.users (name, email, role) VALUES
('Principal Dr. A. Sharma', 'principal@campus.edu', 'Admin'),
('Chef Rajesh Kumar', 'kitchen@campus.edu', 'Staff'),
('Ananya Sen', 'ananya.s@student.edu', 'Student'),
('Vikram Patel', 'hostel.warden@campus.edu', 'Staff');

-- ==============================================================================
-- Seed Data: Awareness Actions
-- ==============================================================================
INSERT INTO public.awareness_actions (title, description, category) VALUES
('Half-Portion Option Notice', 'Display clear signs at serving counters offering standard or half-size portions.', 'Portion Control'),
('Trayless Dining Day', 'Encourage students to carry only plates to avoid over-filling trays.', 'Nudge Campaign'),
('Live Waste Dashboard Screen', 'Display daily wasted weight total on a cafeteria digital screen to build awareness.', 'Transparency'),
('Pre-Order Lunch System', 'Allow hostel boarders to select meal preferences 3 hours prior to cooking.', 'Menu Planning'),
('Compost Bin Weight Tracker', 'Weigh post-meal plate scrapes before disposal and rank student dining halls.', 'Gamification');
