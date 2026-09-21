import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AIPhotoAnalysis } from './pages/AIPhotoAnalysis';
import { RecordWaste } from './pages/RecordWaste';
import { WasteHistory } from './pages/WasteHistory';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { FoodDatabase } from './pages/FoodDatabase';
import { Recommendations } from './pages/Recommendations';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'ai-photo' && <AIPhotoAnalysis onNavigate={handleNavigate} />}
        {currentPage === 'record' && <RecordWaste onNavigate={handleNavigate} />}
        {currentPage === 'history' && <WasteHistory onNavigate={handleNavigate} />}
        {currentPage === 'analytics' && <AnalyticsDashboard />}
        {currentPage === 'foods' && <FoodDatabase />}
        {currentPage === 'recommendations' && <Recommendations />}
      </main>

      {/* Bottom Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default App;
