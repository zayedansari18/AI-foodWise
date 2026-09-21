import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Check, 
  User, 
  MapPin, 
  Utensils, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { Food, WasteLevel, LocationType } from '../types';
import { dataService } from '../services/dataService';

interface RecordWasteProps {
  onNavigate: (page: string) => void;
}

export const RecordWaste: React.FC<RecordWasteProps> = ({ onNavigate }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [customFoodName, setCustomFoodName] = useState<string>('');
  const [foodCategory, setFoodCategory] = useState<string>('Grain');
  const [locationType, setLocationType] = useState<LocationType>('Hostel');
  const [wasteLevel, setWasteLevel] = useState<WasteLevel>('Medium');
  const [estimatedQuantity, setEstimatedQuantity] = useState<string>('100-150 g');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const [reason, setReason] = useState<string>('Excess serving portion unconsumed');
  const [recommendation, setRecommendation] = useState<string>('Provide half-portion options at counter');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    dataService.getFoods().then(fetchedFoods => {
      setFoods(fetchedFoods);
      if (fetchedFoods.length > 0) {
        setSelectedFoodId(fetchedFoods[0].id);
        setFoodCategory(fetchedFoods[0].category);
      }
    });
  }, []);

  const handleFoodSelect = (foodId: string) => {
    setSelectedFoodId(foodId);
    if (foodId !== 'custom') {
      const found = foods.find(f => f.id === foodId);
      if (found) {
        setFoodCategory(found.category);
        if (found.recommended_action) {
          setRecommendation(found.recommended_action);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);

    let finalFoodName = customFoodName;
    if (selectedFoodId !== 'custom') {
      const found = foods.find(f => f.id === selectedFoodId);
      if (found) finalFoodName = found.name;
    }

    if (!finalFoodName.trim()) {
      finalFoodName = 'General Leftover Food';
    }

    const finalUserName = isAnonymous ? 'Anonymous Diner' : (userName.trim() || 'Student / Staff');

    try {
      await dataService.addWasteRecord({
        food_id: selectedFoodId !== 'custom' ? selectedFoodId : undefined,
        food_name: finalFoodName,
        food_category: foodCategory,
        user_name_or_anonymous_id: finalUserName,
        waste_level: wasteLevel,
        estimated_quantity: estimatedQuantity,
        location_type: locationType,
        reason: reason,
        recommendation: recommendation,
        ai_confidence: 1.0,
      });

      setSuccessMsg(`Successfully logged waste record for "${finalFoodName}"!`);
      
      // Reset form
      setCustomFoodName('');
      setIsSubmitting(false);

      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">Manual Waste Log Entry</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Form Entry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Record cafeteria food waste data directly without camera upload. All fields populate the analytics engine.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-photo')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold text-xs flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Prefer AI Photo Scan?</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="px-3 py-1 rounded bg-emerald-900 hover:bg-emerald-800 text-emerald-200 font-bold transition-colors"
          >
            View in History &rarr;
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        
        {/* Row 1: Food Item & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-400" />
              Select Food Item *
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => handleFoodSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {foods.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
              ))}
              <option value="custom">+ Add Custom Food Item...</option>
            </select>
          </div>

          {selectedFoodId === 'custom' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Custom Food Name *</label>
              <input
                type="text"
                placeholder="e.g. Masala Dosa, Pasta, Sandwich"
                value={customFoodName}
                onChange={(e) => setCustomFoodName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Food Category</label>
              <input
                type="text"
                value={foodCategory}
                onChange={(e) => setFoodCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium focus:outline-none"
              />
            </div>
          )}

        </div>

        {/* Row 2: Location & User Attribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400" />
              Dining Location Type *
            </label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Hostel">Hostel Dining Hall</option>
              <option value="Cafeteria">Main Cafeteria</option>
              <option value="School">School Mess</option>
              <option value="College">College Canteen</option>
              <option value="Restaurant">Staff Restaurant</option>
              <option value="Other">Other Dining Facility</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              User Attribution
            </label>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Submit Anonymously</span>
              </label>

              {!isAnonymous && (
                <input
                  type="text"
                  placeholder="Enter User/Staff ID or Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              )}
            </div>
          </div>

        </div>

        {/* Row 3: Waste Level Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Waste Level Severity * (Low / Medium / High)
          </label>
          <div className="grid grid-cols-3 gap-4">
            
            <button
              type="button"
              onClick={() => { setWasteLevel('Low'); setEstimatedQuantity('30-60 g'); }}
              className={`p-4 rounded-xl border text-center transition-all ${
                wasteLevel === 'Low'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold">Low Waste</div>
              <div className="text-[11px] opacity-80 mt-1">Minor crust / scrap (&lt; 60g)</div>
            </button>

            <button
              type="button"
              onClick={() => { setWasteLevel('Medium'); setEstimatedQuantity('80-130 g'); }}
              className={`p-4 rounded-xl border text-center transition-all ${
                wasteLevel === 'Medium'
                  ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold shadow-md ring-1 ring-amber-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold">Medium Waste</div>
              <div className="text-[11px] opacity-80 mt-1">Half portion left (80-130g)</div>
            </button>

            <button
              type="button"
              onClick={() => { setWasteLevel('High'); setEstimatedQuantity('140-200 g'); }}
              className={`p-4 rounded-xl border text-center transition-all ${
                wasteLevel === 'High'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold shadow-md ring-1 ring-rose-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold">High Waste</div>
              <div className="text-[11px] opacity-80 mt-1">Full / majority unconsumed (&gt; 140g)</div>
            </button>

          </div>
        </div>

        {/* Row 4: Quantity Range & Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Estimated Quantity Range (g) *</label>
            <input
              type="text"
              value={estimatedQuantity}
              onChange={(e) => setEstimatedQuantity(e.target.value)}
              placeholder="e.g. 100-150 g"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              <span>Labelled as prototype range estimates</span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              Primary Waste Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="Excess serving portion unconsumed">Excess serving portion unconsumed</option>
              <option value="Food temperature / cold dish">Food temperature / cold dish</option>
              <option value="Spice level preference mismatch">Spice level preference mismatch</option>
              <option value="Buffet tray expiration / over-cooking">Buffet tray expiration / over-cooking</option>
              <option value="Diner left early / personal appetite">Diner left early / personal appetite</option>
              <option value="Over-seasoned / texture issue">Over-seasoned / texture issue</option>
            </select>
          </div>

        </div>

        {/* Row 5: Action Recommendation */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Kitchen / Action Recommendation</label>
          <input
            type="text"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            placeholder="e.g. Provide half-portion options at counter"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Submit Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Saving Record...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Save Waste Record</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
