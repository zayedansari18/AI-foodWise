import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Globe, 
  BarChart3, 
  ShieldCheck, 
  CheckCircle2, 
  PlusCircle, 
  Database, 
  Lightbulb, 
  TrendingDown, 
  Scale, 
  Clock, 
  Building2,
  Cpu
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>UN SDG 12.3 Target: Halve Food Waste by 2030</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
                AI + Analytics for <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Zero Food Waste Cafeterias
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Schools, hostels, and institutional dining halls lose millions of meals annually. <strong className="text-emerald-300 font-semibold">AI-foodWISE</strong> combines Gemini visual AI recognition, structured food catalog databases, and pattern analytics to spot high-waste items and guide portion adjustments.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('ai-photo')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" />
                  <span>Try AI Photo Waste Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('analytics')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-teal-400" />
                  <span>Explore Dashboard</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Gemini Vision AI Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Database Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero API Key Crash Fallback</span>
                </div>
              </div>
            </div>

            {/* Interactive Feature Demo Mockup Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-4 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">Live AI Audit Simulation</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Confidence: 94%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Identified Item</span>
                      <span className="text-sm font-bold text-white">Steamed Rice (Grain)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Waste Severity</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800">
                        High Waste
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block">Est. Range</span>
                      <span className="font-semibold text-emerald-300">120 - 160 g</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 block">Location</span>
                      <span className="font-semibold text-teal-300">Hostel Cafeteria</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-xs space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                      AI Action Recommendation
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      "Rice is consistently over-served during lunch rush. Switch to smaller counter scoops or offer half-portion options."
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('ai-photo')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Test with your own food photo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Global & Institutional Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className="text-2xl font-bold text-white">Why Food Waste Tracking Matters</h2>
            <p className="text-xs text-slate-400">Institutional dining halls face significant waste without visible metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 mx-auto flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-white">1.3B</p>
              <p className="text-xs text-slate-400">Tons of global food lost annually (UN FAO estimate)</p>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-teal-950 text-teal-400 mx-auto flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-white">25-35%</p>
              <p className="text-xs text-slate-400">Average prepared food wasted in institutional dining halls</p>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 mx-auto flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-white">SDG 12.3</p>
              <p className="text-xs text-slate-400">Target to halve food waste per capita by 2030</p>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-950 text-amber-400 mx-auto flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-white">&lt; 5 sec</p>
              <p className="text-xs text-slate-400">AI visual scan time to record waste level & recommendation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow & Core Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-white">Platform Capabilities</h2>
          <p className="text-slate-400 text-sm">7 integrated modules for complete food waste visibility and reduction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div 
            onClick={() => onNavigate('ai-photo')}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                AI Photo Analysis
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Snap or upload a photo of leftover plates. Gemini Vision AI identifies the food, estimates gram ranges, evaluates waste severity (Low/Med/High), and suggests portion actions.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <span>Try Photo Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('record')}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                Manual Record Entry
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Quickly log waste entries manually without a camera. Select food item, location type (Hostel, Cafeteria, School), waste severity level, and user attribution.
              </p>
            </div>
            <div className="text-xs font-semibold text-teal-400 flex items-center gap-1">
              <span>Log Manual Entry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('analytics')}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Analytics Dashboard
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Interactive Recharts dashboard showing waste level distributions, top wasted foods, location comparisons, and temporal trends.
              </p>
            </div>
            <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
              <span>View Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => onNavigate('history')}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Waste History Logs
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Search, filter, and inspect pre-seeded demo records alongside newly submitted entries by location, food category, and waste level.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('foods')}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                Food Reference Catalog
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Database of 20+ common meal items with average serving sizes (g), estimated cost per serving, and kitchen action guidelines.
              </p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('recommendations')}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02] space-y-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Actionable Recommendations
              </h3>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Dynamic pattern insights (portion control, menu adjustments, awareness campaigns) without automated penalties.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Security & Ethics Note Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Security & Privacy Guardrails</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                API keys are kept strictly server-side. Default submission modes use anonymous IDs. No facial recognition or biometrics are captured.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-photo')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shrink-0"
          >
            Get Started
          </button>
        </div>
      </section>

    </div>
  );
};
