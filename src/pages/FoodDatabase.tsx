import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  DollarSign, 
  Scale, 
  Lightbulb, 
  Check, 
  X, 
  Info,
  UtensilsCrossed
} from 'lucide-react';
import { Food } from '../types';
import { dataService } from '../services/dataService';

export const FoodDatabase: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for adding new food
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('Grain');
  const [avgServingSize, setAvgServingSize] = useState<number>(180);
  const [costPerServing, setCostPerServing] = useState<number>(0.50);
  const [recommendedAction, setRecommendedAction] = useState<string>('Offer half-portion option');
  const [description, setDescription] = useState<string>('Standard serving item.');

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    const data = await dataService.getFoods();
    setFoods(data);
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await dataService.addFood({
      name,
      category,
      avg_serving_size: Number(avgServingSize),
      estimated_cost_per_serving: Number(costPerServing),
      recommended_action: recommendedAction,
      description
    });

    setShowAddModal(false);
    setName('');
    loadFoods();
  };

  const filteredFoods = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(foods.map(f => f.category))).sort();

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Database className="w-6 h-6 text-emerald-400" />
              Food Reference Database
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {foods.length} Pre-Seeded Catalog Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master database of cafeteria menu items with standard portion estimates, cost baselines, and kitchen action guidelines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reference Food</span>
        </button>
      </div>

      {/* Prototype Estimate Disclaimer */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-400 text-xs flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="text-amber-300 font-semibold">Prototype Notice:</strong> Serving sizes (g) and estimated costs per serving in this reference database are prototype demonstration estimates.
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search reference food name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map(food => (
          <div key={food.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl hover:border-emerald-500/40 transition-all group">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
                  {food.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {food.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
              {food.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <Scale className="w-3 h-3 text-teal-400" />
                  Avg Serving
                </span>
                <span className="font-bold text-slate-200">{food.avg_serving_size} g</span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-400" />
                  Est. Cost/Serving
                </span>
                <span className="font-bold text-slate-200">${food.estimated_cost_per_serving.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-emerald-400" />
                Recommended Reduction Action
              </span>
              <p className="text-slate-300 text-[11px]">
                {food.recommended_action || 'Offer adjustable portion servings'}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                Add New Reference Food Item
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFood} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Food Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Dosa, Brown Rice, Fruit Custard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Grain">Grain</option>
                    <option value="Legumes">Legumes</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Breakfast/Grain">Breakfast</option>
                    <option value="Soup">Soup</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Avg Serving Size (g)</label>
                  <input
                    type="number"
                    value={avgServingSize}
                    onChange={(e) => setAvgServingSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Estimated Cost per Serving ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={costPerServing}
                  onChange={(e) => setCostPerServing(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Recommended Kitchen Action</label>
                <input
                  type="text"
                  placeholder="e.g. Offer half portion defaults at counter"
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of meal item..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Food Item
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
