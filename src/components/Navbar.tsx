import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Home, 
  PlusCircle, 
  Sparkles, 
  History, 
  BarChart3, 
  Database, 
  Lightbulb, 
  ShieldCheck, 
  Cpu,
  Menu,
  X,
  Info
} from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [aiStatus, setAiStatus] = useState<'active' | 'demo' | 'checking'>('checking');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    // Check server backend health for Gemini key status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.hasGeminiKey) {
          setAiStatus('active');
        } else {
          setAiStatus('demo');
        }
      })
      .catch(() => setAiStatus('demo'));
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai-photo', label: 'AI Photo Analysis', icon: Sparkles, badge: 'AI' },
    { id: 'record', label: 'Record Waste', icon: PlusCircle },
    { id: 'history', label: 'Waste History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'foods', label: 'Food Reference DB', icon: Database },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div 
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-white tracking-tight">AI-foodWISE</span>
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    MVP
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-none">Smart Food Waste Analytics</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Status Badges */}
            <div className="hidden sm:flex items-center gap-2">
              {/* DB Status Badge */}
              <button
                onClick={() => setShowStatusModal(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  isSupabaseConfigured
                    ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                    : 'bg-blue-950/70 border-blue-800 text-blue-300'
                }`}
                title="Click to view System Status"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isSupabaseConfigured ? 'Supabase Live' : 'Supabase-Ready (Local DB)'}</span>
              </button>

              {/* AI Status Badge */}
              <button
                onClick={() => setShowStatusModal(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  aiStatus === 'active'
                    ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                    : 'bg-amber-950/70 border-amber-800 text-amber-300'
                }`}
                title="Click to view AI & API status"
              >
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                <span>{aiStatus === 'active' ? 'Gemini AI Active' : 'Demo Mode (Simulated)'}</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>DB: {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage (Supabase-Ready)'}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>AI: {aiStatus === 'active' ? 'Gemini AI API Key Loaded' : 'Demo Mode Fallback Active'}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* System Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center">
                <Info className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">System Architecture & Status</h3>
                <p className="text-xs text-slate-400">Environment and API configuration diagnostics</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Gemini AI Engine:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    aiStatus === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {aiStatus === 'active' ? 'Live Gemini 1.5/2.0 API' : 'Demo Mode (Simulated)'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {aiStatus === 'active' 
                    ? 'GEMINI_API_KEY detected in server environment. Photo uploads are analyzed via Google Gemini API.'
                    : 'GEMINI_API_KEY is not configured in .env. The system automatically falls back to rich sample simulation responses. The application will never crash or fail.'
                  }
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-300">Database Engine:</span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    isSupabaseConfigured ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}>
                    {isSupabaseConfigured ? 'Supabase Postgres DB' : 'Stateful Local DB (Supabase-Ready)'}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {isSupabaseConfigured
                    ? 'Connected to live Supabase backend. Records are persisted to PostgreSQL tables.'
                    : 'Running on in-memory/localStorage seed store with 20 pre-seeded foods and 35 historical waste records. Complete DDL script provided in supabase/schema.sql.'
                  }
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
              >
                Close Status Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
