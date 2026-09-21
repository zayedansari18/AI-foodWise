# 🌿 AI-foodWISE — Smart Food Waste Tracker & Reduction Platform

> An AI-powered, database-backed food waste tracking MVP designed for schools, hostels, and cafeteria dining halls to measure plate waste, spot consumption patterns, and achieve UN Sustainable Development Goal (SDG) 12.3.

---

## 📌 Executive Overview & SDG Alignment

Institutional cafeterias lose **25% to 35%** of prepared meals daily due to standardized portion sizing, lack of visibility into food preferences, and absence of plate audit logging.

### 🌐 UN SDG 12.3 Target: Responsible Consumption & Production
- **Goal**: By 2030, halve per capita global food waste at retail and consumer levels and reduce food losses along supply chains.
- **AI-foodWISE Solution**: Combines **Gemini Multimodal AI**, a **structured food database**, and **Recharts analytics** to give cafeteria administrators quantitative insights into plate waste, leading to targeted portion adjustments and batch cooking optimization.

---

## 🚀 Key Features & Pages

1. **Home Page**: Executive overview, UN SDG 12.3 alignment highlights, live AI audit simulation mockup, platform capabilities grid, and security guardrails.
2. **AI Photo Analysis**: Drag-and-drop food waste photo analysis powered by Gemini 1.5/2.0 Vision API via server-side API proxy. Includes 4 one-click test presets, automated severity classification (**Low / Medium / High**), gram estimation ranges (`100-150 g`), actionable recommendations, and full pre-save editing controls.
3. **Record Waste (Manual Form)**: High-speed form entry for plate waste logging without camera upload. Select reference foods, dining location type (Hostel, Cafeteria, School Mess, etc.), waste severity level, primary waste cause, and anonymous/user attribution.
4. **Waste History Logs**: Searchable and filterable data table of all recorded plate waste entries. Pre-seeded with **35 historical demo entries** clearly tagged with `Demo / Prototype Data` badges. Includes filter controls by Location, Category, Waste Level, and Date.
5. **Analytics Dashboard**: Interactive **Recharts** visualizations displaying total logs count, cumulative estimated mass (kg), most-wasted food item, high-severity ratios, waste distribution by severity level (Pie Chart), location breakdown (Bar Chart), food item frequency (Bar Chart), and temporal trend lines (Line Chart).
6. **Food Reference Database**: Master reference table of **20 pre-seeded common food items** (Steamed Rice, Yellow Dal, Roti, Paneer Butter Masala, Idli, Salad, etc.) with average serving sizes (g), estimated cost per serving, and kitchen action guidelines. Includes modal to add new reference foods.
7. **Pattern Insights & Recommendations**: Dynamic pattern detection engine that evaluates logged waste entries and outputs non-punitive, actionable recommendations (Portion Control, Menu Planning, Storage & Prep) alongside pre-seeded campaign action items (`awareness_actions`) and an administrative Cafeteria Policy Draft framework.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Visual Analytics**: Recharts
- **Database Layer**: Dual-mode stateful architecture:
  - Default: Hydrated LocalStorage/In-Memory database pre-seeded with 20 foods, 35 waste records, sample users, and awareness actions.
  - Production: Fully compatible `@supabase/supabase-js` PostgreSQL setup with complete DDL script in `supabase/schema.sql`.
- **Backend API & AI**: Express server on port 3001 proxied by Vite (`/api/analyze-waste`), using Google Gemini API (`@google/genai`).

---

## 🔒 Security & Privacy Guardrails

- **Zero Client-Side Secrets**: `GEMINI_API_KEY` is kept strictly on the Express server side in `.env`. Frontend JavaScript code never exposes API keys or secrets.
- **Anonymous Submissions**: All plate audits default to `Anonymous Diner` IDs.
- **No Facial Recognition**: No camera biometrics, face recognition, or video streams are captured or stored.
- **Zero-Crash Demo Fallback**: If `GEMINI_API_KEY` is omitted or invalid, the backend automatically triggers **Demo Mode** with pre-validated simulation outputs. The app never crashes or displays raw error stack traces.

---

## 🗄️ Database Schema (4 Tables)

See `supabase/schema.sql` for full PostgreSQL DDL and seed data.

### 1. `foods`
| Column | Type | Description |
|---|---|---|
| `id` | UUID / string | Primary Key |
| `name` | TEXT | Food item name (e.g., Steamed Rice) |
| `category` | TEXT | Category (Grain, Legumes, Dairy, etc.) |
| `avg_serving_size` | NUMERIC | Average serving size in grams (Prototype estimate) |
| `estimated_cost_per_serving` | NUMERIC | Estimated cost in USD/local currency (Prototype estimate) |
| `recommended_action` | TEXT | Default portion control guidance |
| `description` | TEXT | Item description |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### 2. `waste_records`
| Column | Type | Description |
|---|---|---|
| `id` | UUID / string | Primary Key |
| `food_id` | UUID / string | Optional Foreign Key referencing `foods.id` |
| `user_name_or_anonymous_id` | TEXT | Diner attribution or "Anonymous Diner" |
| `waste_level` | TEXT | Strictly `'Low'`, `'Medium'`, or `'High'` |
| `estimated_quantity` | TEXT | Quantity estimate range (e.g., `"100-150 g"`) |
| `image_url` | TEXT | Base64 or URL preview of plate photo |
| `ai_confidence` | NUMERIC | AI detection confidence score (0.0 to 1.0) |
| `reason` | TEXT | Identified cause of waste |
| `recommendation` | TEXT | Kitchen portion recommendation |
| `location_type` | TEXT | `'School'`, `'College'`, `'Hostel'`, `'Restaurant'`, `'Cafeteria'`, `'Other'` |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### 3. `users`
| Column | Type | Description |
|---|---|---|
| `id` | UUID / string | Primary Key |
| `name` | TEXT | Account holder name |
| `email` | TEXT | Institutional email |
| `role` | TEXT | `'Student'`, `'Staff'`, `'Admin'` |
| `created_at` | TIMESTAMPTZ | Account creation date |

### 4. `awareness_actions`
| Column | Type | Description |
|---|---|---|
| `id` | UUID / string | Primary Key |
| `title` | TEXT | Initiative title (e.g., Half-Portion Option Notice) |
| `description` | TEXT | Initiative action details |
| `category` | TEXT | Campaign category (Portion Control, Nudge, Transparency) |
| `created_at` | TIMESTAMPTZ | Creation date |

---

## ⚙️ Environment Variables (`.env.example`)

Create a `.env` file in the project root:

```env
# Gemini Vision AI (Google AI Studio) - Optional for live API, triggers Demo Mode if blank
GEMINI_API_KEY=

# Supabase Postgres Configuration - Optional, defaults to Local DB if blank
SUPABASE_URL=
SUPABASE_ANON_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Express API Server Port
PORT=3001
```

---

## 💻 Installation & Running Locally

### Prerequisites
- Node.js >= 18.0
- npm >= 9.0

### Step-by-Step Launch Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Concurrent Development Environment (Backend API + Frontend)**:
   ```bash
   npm run dev
   ```
   - **Frontend App**: [http://localhost:5173](http://localhost:5173)
   - **Express API Server**: [http://localhost:3001](http://localhost:3001)

3. **Static Build & Verification**:
   ```bash
   npm run build
   ```

---

## 💡 Demo Mode Mechanics

- **Automatic Trigger**: If `GEMINI_API_KEY` is not present in `.env` or if an external network error occurs, the server responds with `{ isDemoMode: true, data: ... }`.
- **UI Labeling**: Demo Mode is clearly displayed in the Navbar status badge, health diagnostic modal, and AI Analysis result banner.
- **Sample Presets**: 4 built-in preset plate images (Steamed Rice, Yellow Dal, Paneer Butter Masala, Fresh Salad) are available for 1-click testing.

---

## 🔮 Scope, Limitations & Future Roadmap

- **Prototype Estimates**: Gram range estimates and numeric cost figures are prototype approximations designed for demonstration and proof-of-concept testing.
- **Scope Note**: Analytics metrics reflect logged sample data and do not claim hardware scale accuracy across an entire institution.
- **Future Enhancements**:
  - Integration with hardware smart scale scales at tray drop-off stations.
  - Integration with cafeteria meal ticketing / pre-ordering software.
  - Automated weekly email digest reports for cafeteria head chefs.
