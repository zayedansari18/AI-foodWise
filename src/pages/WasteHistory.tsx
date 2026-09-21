import React, { useState, useEffect, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Tag, 
  ShieldAlert, 
  Download, 
  RotateCcw,
  UserCheck,
  Plus
} from 'lucide-react';
import { WasteRecord, WasteLevel, LocationType } from '../types';
import { dataService } from '../services/dataService';

interface WasteHistoryProps {
  onNavigate: (page: string) => void;
}

export const WasteHistory: React.FC<WasteHistoryProps> = ({ onNavigate }) => {
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    const data = await dataService.getWasteRecords();
    setRecords(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      await dataService.deleteWasteRecord(id);
      loadRecords();
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all waste history to default prototype demo records?')) {
      dataService.resetDemoData();
    }
  };

  // Get unique categories from records
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.food_category) set.add(r.food_category);
    });
    return Array.from(set).sort();
  }, [records]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user_name_or_anonymous_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.reason && r.reason.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = selectedLocation === 'All' || r.location_type === selectedLocation;
      const matchesCategory = selectedCategory === 'All' || r.food_category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || r.waste_level === selectedLevel;

      return matchesSearch && matchesLocation && matchesCategory && matchesLevel;
    });
  }, [records, searchQuery, selectedLocation, selectedCategory, selectedLevel]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <History className="w-6 h-6 text-emerald-400" />
              Waste History Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {filteredRecords.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit record of logged cafeteria plate waste. Pre-seeded demo records are tagged for prototype reference.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onNavigate('record')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
          
          <button
            onClick={handleResetData}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs flex items-center gap-1.5 transition-colors"
            title="Reset to default prototype seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Filter Bar Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 md:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search food, user, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Locations (Hostel, Mess, etc.)</option>
              <option value="Hostel">Hostel Dining</option>
              <option value="Cafeteria">Cafeteria</option>
              <option value="School">School Mess</option>
              <option value="College">College Canteen</option>
              <option value="Restaurant">Restaurant</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Categories (Grain, Dairy, etc.)</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Waste Severity Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="All">All Severity Levels</option>
              <option value="Low">Low Waste Only</option>
              <option value="Medium">Medium Waste Only</option>
              <option value="High">High Waste Only</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4">Food Item</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Waste Severity</th>
                <th className="py-3.5 px-4">Est. Range</th>
                <th className="py-3.5 px-4">User / Source</th>
                <th className="py-3.5 px-4">Action Recommendation</th>
                <th className="py-3.5 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    Loading waste records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No waste records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const dateStr = new Date(r.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{dateStr}</span>
                        </div>
                      </td>

                      {/* Food Name & Category */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div>
                          <span>{r.food_name}</span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            {r.food_category}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                          {r.location_type}
                        </span>
                      </td>

                      {/* Waste Level */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          r.waste_level === 'High'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : r.waste_level === 'Medium'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}>
                          {r.waste_level}
                        </span>
                      </td>

                      {/* Est Quantity */}
                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        {r.estimated_quantity}
                      </td>

                      {/* User Attribution & Demo Badge */}
                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-slate-500" />
                            <span>{r.user_name_or_anonymous_id}</span>
                          </div>
                          {r.is_demo && (
                            <span className="inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-400 border border-amber-800 font-semibold">
                              Demo / Prototype Data
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Recommendation */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] max-w-xs truncate" title={r.recommendation}>
                        {r.recommendation || r.reason || 'Standard portion check'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
