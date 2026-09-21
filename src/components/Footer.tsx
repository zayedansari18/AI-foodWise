import React from 'react';
import { Leaf, Globe, ShieldAlert, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Platform Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span>AI-foodWISE</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Empowering educational institutions, hostels, and cafeterias to track food waste, recognize visual consumption patterns via Gemini AI, and take data-driven action to halve waste by 2030.
            </p>
          </div>

          {/* Col 2: SDG 12.3 Alignment */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              UN SDG 12.3 Alignment
            </h4>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1">
              <p className="text-emerald-400 font-bold text-[11px]">Target 12.3: Responsible Consumption</p>
              <p className="text-slate-400 text-[10px] leading-normal">
                "By 2030, halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains."
              </p>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs">Quick Links</h4>
            <ul className="space-y-1 text-[11px]">
              <li><button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">Home & Overview</button></li>
              <li><button onClick={() => onNavigate('ai-photo')} className="hover:text-emerald-400 transition-colors">AI Photo Waste Analysis</button></li>
              <li><button onClick={() => onNavigate('record')} className="hover:text-emerald-400 transition-colors">Manual Waste Entry</button></li>
              <li><button onClick={() => onNavigate('history')} className="hover:text-emerald-400 transition-colors">Waste History Logs</button></li>
              <li><button onClick={() => onNavigate('analytics')} className="hover:text-emerald-400 transition-colors">Analytics Dashboard</button></li>
              <li><button onClick={() => onNavigate('foods')} className="hover:text-emerald-400 transition-colors">Food Reference Database</button></li>
              <li><button onClick={() => onNavigate('recommendations')} className="hover:text-emerald-400 transition-colors">Recommendations & Insights</button></li>
            </ul>
          </div>

          {/* Col 4: Disclaimer & Privacy */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Prototype Disclaimer
            </h4>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Numeric values, estimated gram ranges, and sample logs in this application are prototype estimates designed for demonstration and proof-of-concept purposes. All user records default to anonymous IDs. No facial recognition or personal camera streams are stored.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} AI-foodWISE Initiative. Built with React, TypeScript, Tailwind, Gemini AI & Supabase.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for Sustainability & Zero Food Waste</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
