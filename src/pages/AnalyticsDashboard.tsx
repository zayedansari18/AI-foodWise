import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Scale, 
  Flame, 
  Filter, 
  ShieldAlert, 
  Building2, 
  Utensils, 
  Calendar,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { WasteRecord, LocationType } from '../types';
import { dataService } from '../services/dataService';

const SEVERITY_COLORS = {
  Low: '#10b981',    // Emerald
  Medium: '#f59e0b', // Amber
  High: '#f43f5e'    // Rose
};

const LOCATION_COLORS = ['#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#ec4899'];

export const AnalyticsDashboard: React.FC = () => {
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<string>('30');

  useEffect(() => {
    dataService.getWasteRecords().then(setRecords);
  }, []);

  // Filtered records based on controls
  const filteredRecords = useMemo(() => {
    let list = records;
    if (selectedLocationFilter !== 'All') {
      list = list.filter(r => r.location_type === selectedLocationFilter);
    }
    const days = parseInt(timeRange, 10);
    if (!isNaN(days) && days > 0) {
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      list = list.filter(r => new Date(r.created_at) >= cutoff);
    }
    return list;
  }, [records, selectedLocationFilter, timeRange]);

  // Metric 1: Total Count
  const totalCount = filteredRecords.length;

  // Metric 2: Estimated Gram Mass (midpoint parsing of "100-150 g")
  const totalEstimatedKg = useMemo(() => {
    let totalGrams = 0;
    filteredRecords.forEach(r => {
      const match = r.estimated_quantity.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        const mid = (parseInt(match[1], 10) + parseInt(match[2], 10)) / 2;
        totalGrams += mid;
      } else {
        totalGrams += r.waste_level === 'High' ? 160 : r.waste_level === 'Medium' ? 100 : 40;
      }
    });
    return (totalGrams / 1000).toFixed(1);
  }, [filteredRecords]);

  // Metric 3: Most Wasted Food Item
  const topWastedItem = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach(r => {
      counts[r.food_name] = (counts[r.food_name] || 0) + (r.waste_level === 'High' ? 3 : r.waste_level === 'Medium' ? 2 : 1);
    });
    let topName = 'N/A';
    let maxVal = 0;
    Object.entries(counts).forEach(([name, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topName = name;
      }
    });
    return topName;
  }, [filteredRecords]);

  // Metric 4: High Waste Ratio %
  const highWasteRatio = useMemo(() => {
    if (totalCount === 0) return '0%';
    const highCount = filteredRecords.filter(r => r.waste_level === 'High').length;
    return `${Math.round((highCount / totalCount) * 100)}%`;
  }, [filteredRecords, totalCount]);

  // Chart Data 1: Severity Pie Chart
  const severityPieData = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    filteredRecords.forEach(r => {
      if (counts[r.waste_level] !== undefined) {
        counts[r.waste_level]++;
      }
    });
    return [
      { name: 'Low Waste', value: counts.Low, color: SEVERITY_COLORS.Low },
      { name: 'Medium Waste', value: counts.Medium, color: SEVERITY_COLORS.Medium },
      { name: 'High Waste', value: counts.High, color: SEVERITY_COLORS.High }
    ];
  }, [filteredRecords]);

  // Chart Data 2: Waste by Food & Category (Bar Chart)
  const foodBarData = useMemo(() => {
    const map: Record<string, { name: string; category: string; count: number; highCount: number }> = {};
    filteredRecords.forEach(r => {
      if (!map[r.food_name]) {
        map[r.food_name] = { name: r.food_name, category: r.food_category, count: 0, highCount: 0 };
      }
      map[r.food_name].count += 1;
      if (r.waste_level === 'High') map[r.food_name].highCount += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [filteredRecords]);

  // Chart Data 3: Waste by Location Type
  const locationBarData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRecords.forEach(r => {
      map[r.location_type] = (map[r.location_type] || 0) + 1;
    });
    return Object.entries(map).map(([loc, count]) => ({
      location: loc,
      entries: count
    }));
  }, [filteredRecords]);

  // Chart Data 4: Trend Over Time (Line Chart by Date)
  const trendLineData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredRecords.forEach(r => {
      const dateKey = r.created_at.split('T')[0];
      map[dateKey] = (map[dateKey] || 0) + 1;
    });
    const sortedDates = Object.keys(map).sort();
    return sortedDates.map(d => ({
      date: d.slice(5), // MM-DD
      records: map[d]
    }));
  }, [filteredRecords]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              Analytics & Insights Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual pattern detection based on recorded plate audits. All metrics are scoped strictly to sample logs.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex items-center gap-3">
          <select
            value={selectedLocationFilter}
            onChange={(e) => setSelectedLocationFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Locations</option>
            <option value="Hostel">Hostel</option>
            <option value="Cafeteria">Cafeteria</option>
            <option value="School">School Mess</option>
            <option value="College">College</option>
            <option value="Restaurant">Restaurant</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="365">All Time</option>
          </select>
        </div>
      </div>

      {/* Scope Disclaimer Banner */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-teal-400 shrink-0" />
        <span>
          <strong className="text-slate-200 font-semibold">Scope Note:</strong> All analytics and metrics on this dashboard are based strictly on recorded sample logs in the database. They do not claim city or institution-wide hardware scale precision.
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Logged Entries</span>
            <Utensils className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalCount}</p>
          <p className="text-[10px] text-slate-500">Filtered cafeteria logs</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Est. Cumulative Mass</span>
            <Scale className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-teal-300">{totalEstimatedKg} <span className="text-sm font-normal">kg</span></p>
          <p className="text-[10px] text-slate-500">Derived from gram ranges</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Most Wasted Item</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-xl font-extrabold text-rose-300 truncate">{topWastedItem}</p>
          <p className="text-[10px] text-slate-500">Highest severity volume</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High-Waste Ratio</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-300">{highWasteRatio}</p>
          <p className="text-[10px] text-slate-500">Of total entries</p>
        </div>

      </div>

      {/* Chart Row 1: Pie Chart & Food Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              Waste Severity Distribution
            </h3>
            <span className="text-[10px] text-slate-400">Low vs Med vs High</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Wasted Foods Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-400" />
              Most Frequently Wasted Foods
            </h3>
            <span className="text-[10px] text-slate-400">Total Entries vs High Severity</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={foodBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Total Logs" fill="#0d9488" radius={[6, 6, 0, 0]} />
                <Bar dataKey="highCount" name="High Waste Count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart Row 2: Location Bar Chart & Temporal Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Waste by Location */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              Waste Breakdown by Location
            </h3>
            <span className="text-[10px] text-slate-400">Hostels vs Mess vs Canteen</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="location" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="entries" name="Logged Waste Count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Trend Line Chart */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Waste Log Volume Over Time
            </h3>
            <span className="text-[10px] text-slate-400">Daily Trend Line</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="records" name="Daily Logs" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
