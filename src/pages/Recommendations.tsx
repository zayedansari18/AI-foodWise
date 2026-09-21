import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  ShieldCheck, 
  Megaphone, 
  Layers, 
  Utensils, 
  CheckCircle, 
  AlertTriangle, 
  Building2, 
  BookOpen,
  ArrowRight,
  Info
} from 'lucide-react';
import { WasteRecord, AwarenessAction } from '../types';
import { dataService } from '../services/dataService';

export const Recommendations: React.FC = () => {
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [awarenessActions, setAwarenessActions] = useState<AwarenessAction[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'awareness' | 'policy'>('insights');

  useEffect(() => {
    dataService.getWasteRecords().then(setRecords);
    dataService.getAwarenessActions().then(setAwarenessActions);
  }, []);

  // Dynamically generate pattern-based recommendations from actual waste logs
  const dynamicInsights = useMemo(() => {
    const insights: Array<{
      id: string;
      title: string;
      pattern: string;
      action: string;
      severity: 'high' | 'medium' | 'info';
      category: string;
    }> = [];

    // Pattern 1: Highest Wasted Food
    const foodCounts: Record<string, number> = {};
    records.forEach(r => {
      if (r.waste_level === 'High') {
        foodCounts[r.food_name] = (foodCounts[r.food_name] || 0) + 1;
      }
    });

    let topWastedFood = '';
    let maxHighs = 0;
    Object.entries(foodCounts).forEach(([food, count]) => {
      if (count > maxHighs) {
        maxHighs = count;
        topWastedFood = food;
      }
    });

    if (topWastedFood) {
      insights.push({
        id: 'ins-1',
        title: `High Waste Frequency Detected: ${topWastedFood}`,
        pattern: `Recorded as 'High Waste' in ${maxHighs} separate plate audit entries.`,
        action: `Consider introducing default half-portion servings at counters or training servers to ask diners for preferred portion size prior to plating.`,
        severity: 'high',
        category: 'Portion Control'
      });
    }

    // Pattern 2: Location with Highest Waste
    const locCounts: Record<string, number> = {};
    records.forEach(r => {
      locCounts[r.location_type] = (locCounts[r.location_type] || 0) + 1;
    });

    let topLoc = '';
    let maxLocCount = 0;
    Object.entries(locCounts).forEach(([loc, count]) => {
      if (count > maxLocCount) {
        maxLocCount = count;
        topLoc = loc;
      }
    });

    if (topLoc) {
      insights.push({
        id: 'ins-2',
        title: `Location Focus Area: ${topLoc}`,
        pattern: `${topLoc} dining facilities account for ${maxLocCount} logged waste entries (${Math.round((maxLocCount / records.length) * 100)}% of total).`,
        action: `Initiate a targeted awareness campaign and place portion selection signs at ${topLoc} serving stations.`,
        severity: 'medium',
        category: 'Location Nudge'
      });
    }

    // Pattern 3: Salad & Dressing Sogginess
    const saladRecord = records.find(r => r.food_category === 'Vegetables' && r.reason?.toLowerCase().includes('salad'));
    if (saladRecord) {
      insights.push({
        id: 'ins-3',
        title: 'Vegetable & Salad Prep Optimization',
        pattern: 'Pre-dressed green salads show elevated waste rates due to premature wilting.',
        action: 'Serve dressings and condiments in separate side dispensers rather than pre-mixing in large salad bowls.',
        severity: 'medium',
        category: 'Storage & Prep'
      });
    }

    // Pattern 4: Rice & Grain Portion Sizing
    insights.push({
      id: 'ins-4',
      title: 'Grain & Starch Portion Standardization',
      pattern: 'Cooked rice and grains frequently suffer from over-ladling during rush hours.',
      action: 'Equip servers with dual-size ladles (100g standard and 50g small) and display clear portion size icons.',
      severity: 'info',
      category: 'Kitchen Standard'
    });

    return insights;
  }, [records]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-emerald-400" />
              Pattern Insights & Recommendations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Data-Driven Reduction
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated consumption pattern detection derived from logged waste entries. Designed to guide institutional policy without automated penalties.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'insights' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pattern Insights ({dynamicInsights.length})
          </button>
          <button
            onClick={() => setActiveTab('awareness')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'awareness' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Awareness Actions ({awarenessActions.length})
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'policy' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Institution Policy Drafts
          </button>
        </div>
      </div>

      {/* Tab 1: Dynamic Pattern Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Insights are calculated dynamically from your <strong className="text-slate-200 font-semibold">{records.length} waste history entries</strong>.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dynamicInsights.map(item => (
              <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.severity === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : item.severity === 'medium' ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {item.severity.toUpperCase()} PRIORITY
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block">Observed Pattern:</span>
                  <p className="text-slate-300">{item.pattern}</p>
                </div>

                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Recommended Action:
                  </span>
                  <p className="text-slate-200 leading-relaxed text-[11px]">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Awareness Actions */}
      {activeTab === 'awareness' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awarenessActions.map(act => (
              <div key={act.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {act.category}
                  </span>
                  <Megaphone className="w-4 h-4 text-emerald-400" />
                </div>

                <h3 className="text-base font-bold text-white">{act.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Institution Policy Framework */}
      {activeTab === 'policy' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl max-w-4xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cafeteria Waste Reduction Policy Template</h3>
              <p className="text-xs text-slate-400">Framework for cafeteria managers & institutional administrative review.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400 text-sm">Policy Principle: Positive Nudges Over Penalties</h4>
              <p>
                In alignment with educational best practices, food waste reduction policies focus on voluntary portion selection, diner education, and kitchen forecasting improvements rather than automated fines or punitive measures against students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  1. Flexible Portion Sizing Guidelines
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Mandate half-portion options at all counter-served stations.</li>
                  <li>Allow diners to request custom rice and gravy ratios.</li>
                  <li>Train server staff on standard vs small ladle sizes.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  2. Kitchen Batch & Forecasting Rules
                </h5>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Review daily attendance logs 2 hours prior to prep.</li>
                  <li>Cook perishable foods (rotis, fries) on demand after peak rush.</li>
                  <li>Partner with certified food recovery organizations for untouched surplus.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
