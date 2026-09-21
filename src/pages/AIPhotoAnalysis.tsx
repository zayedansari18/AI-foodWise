import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  Edit3, 
  Save, 
  AlertCircle, 
  Cpu, 
  RefreshCw, 
  ShieldAlert, 
  Info,
  MapPin,
  User,
  ArrowRight
} from 'lucide-react';
import { WasteLevel, LocationType, AIAnalysisResponse } from '../types';
import { dataService } from '../services/dataService';

interface AIPhotoAnalysisProps {
  onNavigate: (page: string) => void;
}

// Sample preset images generated as SVG data URIs for rapid test demo without external internet requests
const PRESET_SAMPLE_IMAGES = [
  {
    name: 'Steamed Rice Leftover',
    category: 'Grain',
    hint: 'Steamed Rice',
    color: 'from-amber-100 to-amber-200',
    svgUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><circle cx="200" cy="150" r="110" fill="%23334155"/><ellipse cx="200" cy="150" rx="90" ry="70" fill="%23f8fafc"/><path d="M140 140 Q200 110 260 140 T160 170 Z" fill="%23e2e8f0"/><text x="200" y="270" fill="%2394a3b8" font-size="14" text-anchor="middle" font-family="sans-serif">Sample 1: Steamed Rice Plate</text></svg>'
  },
  {
    name: 'Yellow Dal Bowl',
    category: 'Legumes',
    hint: 'Yellow Dal Tadka',
    color: 'from-yellow-400 to-amber-500',
    svgUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><circle cx="200" cy="150" r="100" fill="%23b45309"/><circle cx="200" cy="150" r="85" fill="%23f59e0b"/><circle cx="210" cy="140" r="20" fill="%23d97706"/><text x="200" y="270" fill="%2394a3b8" font-size="14" text-anchor="middle" font-family="sans-serif">Sample 2: Yellow Dal Leftover</text></svg>'
  },
  {
    name: 'Paneer Butter Masala',
    category: 'Dairy',
    hint: 'Paneer Butter Masala',
    color: 'from-orange-500 to-red-600',
    svgUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><circle cx="200" cy="150" r="100" fill="%237c2d12"/><circle cx="200" cy="150" r="85" fill="%23ea580c"/><rect x="160" y="130" width="30" height="25" fill="%23fef3c7" rx="4"/><rect x="210" y="145" width="25" height="25" fill="%23fef3c7" rx="4"/><text x="200" y="270" fill="%2394a3b8" font-size="14" text-anchor="middle" font-family="sans-serif">Sample 3: Paneer Curry</text></svg>'
  },
  {
    name: 'Garden Salad Leftover',
    category: 'Vegetables',
    hint: 'Fresh Garden Salad',
    color: 'from-emerald-500 to-green-600',
    svgUri: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230f172a"/><ellipse cx="200" cy="150" rx="100" ry="80" fill="%231e293b"/><ellipse cx="180" cy="140" rx="35" ry="25" fill="%2316a34a"/><ellipse cx="220" cy="160" rx="40" ry="30" fill="%2315803d"/><circle cx="190" cy="160" r="12" fill="%23dc2626"/><text x="200" y="270" fill="%2394a3b8" font-size="14" text-anchor="middle" font-family="sans-serif">Sample 4: Wilted Salad</text></svg>'
  }
];

export const AIPhotoAnalysis: React.FC<AIPhotoAnalysisProps> = ({ onNavigate }) => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [hintText, setHintText] = useState<string>('');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResponse | null>(null);

  // Editable fields form state
  const [foodName, setFoodName] = useState<string>('');
  const [foodCategory, setFoodCategory] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0.90);
  const [wasteLevel, setWasteLevel] = useState<WasteLevel>('Medium');
  const [estimatedQuantity, setEstimatedQuantity] = useState<string>('100-150 g');
  const [reason, setReason] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string>('');
  const [locationType, setLocationType] = useState<LocationType>('Hostel');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImageUri(result);
        setHintText(file.name);
        runAIAnalysis(result, file.type || 'image/jpeg', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle preset image click
  const handlePresetSelect = (preset: typeof PRESET_SAMPLE_IMAGES[0]) => {
    setSelectedImageUri(preset.svgUri);
    setImageMimeType('image/svg+xml');
    setHintText(preset.hint);
    runAIAnalysis(preset.svgUri, 'image/svg+xml', preset.hint);
  };

  // Execute server API call
  const runAIAnalysis = async (base64OrUri: string, mime: string, hint: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64OrUri,
          mimeType: mime,
          hint: hint
        })
      });

      const resData: AIAnalysisResponse = await response.json();
      setAnalysisResult(resData);

      if (resData.success && resData.data) {
        setFoodName(resData.data.food_name);
        setFoodCategory(resData.data.food_category);
        setConfidence(resData.data.confidence);
        setWasteLevel(resData.data.waste_level);
        setEstimatedQuantity(resData.data.estimated_quantity_range);
        setReason(resData.data.reason);
        setRecommendation(resData.data.recommendation);
      }
    } catch (err) {
      console.error('API Call error:', err);
      // Fallback
      setAnalysisResult({
        success: true,
        isDemoMode: true,
        demoNotice: "Network connection issue. Displaying Demo Mode AI simulation.",
        data: {
          food_name: "Steamed Rice",
          food_category: "Grain",
          confidence: 0.91,
          waste_level: "High",
          estimated_quantity_range: "120-160 g",
          reason: "Large portion served during lunch rush unconsumed.",
          recommendation: "Offer half-portion defaults at counter."
        }
      });
      setFoodName("Steamed Rice");
      setFoodCategory("Grain");
      setConfidence(0.91);
      setWasteLevel("High");
      setEstimatedQuantity("120-160 g");
      setReason("Large portion served during lunch rush unconsumed.");
      setRecommendation("Offer half-portion defaults at counter.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save record to database
  const handleSaveRecord = async () => {
    try {
      await dataService.addWasteRecord({
        food_name: foodName || 'Leftover Food',
        food_category: foodCategory || 'Grain',
        user_name_or_anonymous_id: isAnonymous ? 'Anonymous Diner' : (userName.trim() || 'Student / Staff'),
        waste_level: wasteLevel,
        estimated_quantity: estimatedQuantity,
        image_url: selectedImageUri || undefined,
        ai_confidence: confidence,
        reason: reason,
        recommendation: recommendation,
        location_type: locationType
      });

      setIsSaved(true);
      setSaveMessage(`Record for "${foodName}" saved to Waste History!`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              AI Photo Waste Analysis
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950">
              Gemini Vision AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload or select a photo of leftover cafeteria food. Gemini AI recognizes the food item, estimates severity (Low/Medium/High), and recommends portion control actions.
          </p>
        </div>

        {analysisResult?.isDemoMode && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center gap-2 self-start md:self-auto">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Demo Mode: AI Simulated</span>
          </div>
        )}
      </div>

      {/* Main Grid: Left Upload/Preview, Right AI Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Upload & Sample Images (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upload Dropzone Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              1. Upload Plate Photo
            </h3>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/50 hover:bg-slate-950 group"
            >
              {selectedImageUri ? (
                <div className="space-y-3">
                  <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center relative">
                    <img
                      src={selectedImageUri}
                      alt="Plate Leftover Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
                    Click to Change Image
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Click or drag food image here</p>
                    <p className="text-[11px] text-slate-500 mt-1">Supports JPG, PNG, WEBP files</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Selector for zero-key testing */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300">Or Select Demo Preset Image:</h3>
              <span className="text-[10px] text-slate-500">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {PRESET_SAMPLE_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 text-left transition-all hover:scale-[1.02] flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                    <img src={preset.svgUri} alt={preset.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{preset.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: AI Analysis Output & Editing Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Loading Animation State */}
          {isAnalyzing && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center animate-spin">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Gemini AI Analyzing Leftover Photo...</h3>
                <p className="text-xs text-slate-400 mt-1">Estimating food category, waste level, and portion recommendations.</p>
              </div>
            </div>
          )}

          {/* Initial Blank Prompt State */}
          {!isAnalyzing && !analysisResult && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                <h3 className="text-sm font-bold text-white">No Photo Selected</h3>
                <p className="text-xs text-slate-400">
                  Upload an image or pick a demo preset on the left to trigger the AI Vision analysis engine.
                </p>
              </div>
            </div>
          )}

          {/* AI Result Card & Editable Form */}
          {!isAnalyzing && analysisResult && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl relative">
              
              {/* Top Banner: Status & Confidence */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Analysis Complete</h3>
                    <p className="text-[11px] text-slate-400">Review & edit details before saving to database</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-950 text-emerald-400 border border-slate-800">
                    {(confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>
              </div>

              {/* Demo Mode Alert Banner */}
              {analysisResult.isDemoMode && (
                <div className="p-3 bg-amber-950/70 border border-amber-800/80 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-[11px] leading-tight">
                    {analysisResult.demoNotice || "Running in Demo Mode. Results are pre-validated simulation outputs."}
                  </p>
                </div>
              )}

              {/* Editable Form */}
              <div className="space-y-4">
                
                {/* Row 1: Food Name & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Identified Food Name *</label>
                    <input
                      type="text"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Food Category *</label>
                    <input
                      type="text"
                      value={foodCategory}
                      onChange={(e) => setFoodCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Row 2: Waste Level Selector (Strictly Low/Med/High) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300">
                    Waste Level Severity * (Low / Medium / High Only)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Low', 'Medium', 'High'] as WasteLevel[]).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setWasteLevel(lvl)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          wasteLevel === lvl
                            ? lvl === 'High' ? 'bg-rose-950 border-rose-500 text-rose-300'
                              : lvl === 'Medium' ? 'bg-amber-950 border-amber-500 text-amber-300'
                              : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {lvl} Waste
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 3: Estimated Quantity Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Estimated Quantity Range *</label>
                    <input
                      type="text"
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(e.target.value)}
                      placeholder="e.g. 100-150 g"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500">*Photo estimation range; never exact gram claim</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      Dining Location Type
                    </label>
                    <select
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value as LocationType)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none"
                    >
                      <option value="Hostel">Hostel Dining Hall</option>
                      <option value="Cafeteria">Main Cafeteria</option>
                      <option value="School">School Mess</option>
                      <option value="College">College Canteen</option>
                      <option value="Restaurant">Staff Restaurant</option>
                      <option value="Other">Other Facility</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Reason & Recommendation */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">AI Identified Cause / Reason</label>
                    <textarea
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300">Actionable Kitchen Recommendation</label>
                    <textarea
                      rows={2}
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

              </div>

              {/* Save Notification */}
              {isSaved && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
                  <span>{saveMessage}</span>
                  <button
                    onClick={() => onNavigate('history')}
                    className="font-bold underline text-emerald-200"
                  >
                    View in History
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setSelectedImageUri(null);
                    setIsSaved(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
                >
                  Reset / Clear Scan
                </button>

                <button
                  onClick={handleSaveRecord}
                  disabled={isSaved}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                    isSaved
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaved ? 'Saved to History ✓' : 'Save Record to Database'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
