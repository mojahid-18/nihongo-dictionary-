import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeMode: 'dictionary' | 'practice' | 'grammar';
  onModeChange: (mode: 'dictionary' | 'practice' | 'grammar') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeMode, onModeChange }) => {
  return (
    <div className="min-h-screen bg-[#fdfcfb] text-slate-800 pb-20">
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-200">
              あ
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">নিহোঙ্গো-বাংলা অভিধান</h1>
              <p className="text-xs text-rose-500 font-medium uppercase tracking-tighter">Japanese-Bengali Tutor</p>
            </div>
          </div>
          
          <nav className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto">
            <button
              onClick={() => onModeChange('dictionary')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeMode === 'dictionary' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              অভিধান
            </button>
            <button
              onClick={() => onModeChange('practice')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeMode === 'practice' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              প্র্যাকটিস
            </button>
            <button
              onClick={() => onModeChange('grammar')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeMode === 'grammar' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              গ্রামার গাইড
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {children}
      </main>
    </div>
  );
};
