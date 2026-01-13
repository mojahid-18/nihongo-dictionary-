
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { WordDetailView } from './components/WordDetailView';
import { PracticeView } from './components/PracticeView';
import { GrammarQnAView } from './components/GrammarQnAView';
import { analyzeWord } from './geminiService';
import { WordAnalysis, SearchHistory } from './types';
import { SpeechButton } from './components/SpeechButton';

const App: React.FC = () => {
  const [mode, setMode] = useState<'dictionary' | 'practice' | 'grammar'>('dictionary');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WordAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((word: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.word.toLowerCase() !== word.toLowerCase());
      const newHistory = [{ word, timestamp: Date.now() }, ...filtered].slice(0, 10);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const handleSearch = async (e?: React.FormEvent, searchWord?: string) => {
    if (e) e.preventDefault();
    const term = searchWord || query;
    if (!term.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeWord(term);
      setResult(data);
      saveToHistory(term);
      setQuery('');
    } catch (err) {
      setError('শব্দটি বিশ্লেষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('search_history');
  };

  return (
    <Layout activeMode={mode} onModeChange={setMode}>
      {mode === 'dictionary' && (
        <>
          <div className="mb-12">
            <form onSubmit={handleSearch} className="relative group flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="জাপানি শব্দ লিখুন (উদা: 食べる, 心, 桜)..."
                  className="w-full bg-white border-2 border-slate-100 group-hover:border-rose-200 focus:border-rose-500 rounded-3xl px-8 py-5 text-xl shadow-xl shadow-slate-200/50 outline-none transition-all pr-14"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <SpeechButton 
                    lang="ja-JP" 
                    onTranscript={(text) => setQuery(text)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-black px-8 h-[68px] rounded-3xl transition-colors flex items-center gap-2 shadow-lg shadow-rose-200"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'খুঁজুন'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {error}
              </div>
            )}

            {history.length > 0 && !result && !loading && (
              <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">সাম্প্রতিক খোঁজ</h4>
                  <button onClick={clearHistory} className="text-xs text-rose-400 hover:text-rose-600 font-black">মুছে ফেলুন</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(undefined, h.word)}
                      className="bg-white border border-slate-100 hover:border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-xl text-slate-600 hover:text-rose-600 transition-all shadow-sm font-medium japanese-text"
                    >
                      {h.word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative w-24 h-24 mb-6">
                 <div className="absolute inset-0 border-4 border-rose-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-rose-500 font-bold text-lg">あ</div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">শব্দটি বিশ্লেষণ করা হচ্ছে...</h3>
            </div>
          ) : result ? (
            <WordDetailView data={result} />
          ) : (
            <div className="py-12 text-center max-w-lg mx-auto">
              <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">জাপানি ভাষা শিখুন সহজেই</h2>
              <p className="text-slate-500 leading-relaxed">যেকোনো জাপানি শব্দ লিখুন এবং বাংলা ভাষায় তার বিস্তারিত ব্যাখ্যা, ব্যাকরণগত ব্যবহার এবং উদাহরণ পান।</p>
            </div>
          )}
        </>
      )}
      
      {mode === 'practice' && <PracticeView />}
      
      {mode === 'grammar' && <GrammarQnAView />}
    </Layout>
  );
};

export default App;
