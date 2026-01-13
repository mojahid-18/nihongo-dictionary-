
import React, { useState } from 'react';
import { evaluateSentence } from '../geminiService';
import { EvaluationResult } from '../types';
import { SpeechButton } from './SpeechButton';

export const PracticeView: React.FC = () => {
  const [bengali, setBengali] = useState('');
  const [japanese, setJapanese] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bengali.trim() || !japanese.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await evaluateSentence(bengali, japanese);
      setResult(data);
    } catch (err) {
      setError('মূল্যায়ন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-indigo-100 shadow-xl shadow-indigo-500/5">
        <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <span className="w-2 h-10 bg-indigo-500 rounded-full"></span>
          বাক্য গঠন প্র্যাকটিস (Practice Mode)
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 relative">
            <div className="flex items-center justify-between ml-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">আপনার বাংলা বাক্য</label>
              <SpeechButton 
                lang="bn-BD" 
                onTranscript={(text) => setBengali(prev => prev + text)}
                className="scale-90"
              />
            </div>
            <textarea
              value={bengali}
              onChange={(e) => setBengali(e.target.value)}
              placeholder="উদা: আমি ভাত খেতে চাই।"
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-3xl px-6 py-4 outline-none transition-all h-24 resize-none text-lg"
            />
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center justify-between ml-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">আপনার জাপানি অনুবাদ (Your Translation)</label>
              <SpeechButton 
                lang="ja-JP" 
                onTranscript={(text) => setJapanese(prev => prev + text)}
                className="scale-90"
              />
            </div>
            <textarea
              value={japanese}
              onChange={(e) => setJapanese(e.target.value)}
              placeholder="উদা: 私はご飯を食べたいです。"
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-3xl px-6 py-4 outline-none transition-all h-24 resize-none text-lg japanese-text"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !bengali.trim() || !japanese.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black py-5 rounded-[2rem] shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 text-xl"
          >
            {loading ? (
              <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'যাচাই করুন (Evaluate)'}
          </button>
        </form>
      </section>

      {error && (
        <div className="p-6 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 font-bold text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
          <div className={`p-8 rounded-[2.5rem] border flex items-center gap-6 shadow-xl ${result.isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 shadow-inner ${result.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {result.isCorrect ? '✅' : '❌'}
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1">{result.statusMessage}</h3>
              <p className="opacity-70 font-medium">{result.isCorrect ? 'দুর্দান্ত! আপনার গঠনটি একদম ঠিক আছে।' : 'চিন্তা করবেন না, ভুল থেকেই শেখা যায়।'}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">শিক্ষকের মতামত (Tutor Feedback)</h4>
            <div className="prose prose-slate max-w-none">
              <p className="text-xl text-slate-800 leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">{result.detailedExplanation}</p>
            </div>
            
            {!result.isCorrect && (
              <div className="mt-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                     <span className="text-xs font-black text-blue-400 uppercase mb-2 block">ক্যাজুয়াল রূপ (Casual)</span>
                     <p className="text-2xl japanese-text text-blue-900 font-bold">{result.corrections.casual}</p>
                   </div>
                   <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                     <span className="text-xs font-black text-indigo-400 uppercase mb-2 block">পোলাইট রূপ (Polite)</span>
                     <p className="text-2xl japanese-text text-indigo-900 font-bold">{result.corrections.polite}</p>
                   </div>
                </div>
                <div className="p-6 bg-slate-900 rounded-3xl text-white">
                  <h5 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                    <span>💡</span> সঠিক কেন হবে?
                  </h5>
                  <p className="text-slate-300 text-sm">{result.corrections.explanation}</p>
                </div>
              </div>
            )}
          </div>

          <section className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-10 opacity-10 select-none pointer-events-none">
              <span className="text-8xl japanese-text font-black">正解</span>
            </div>
            <div className="relative z-10">
              <h4 className="text-rose-500 font-black uppercase text-sm tracking-[0.3em] mb-6">Final Natural Answer</h4>
              
              <div className="space-y-8">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-black mb-2 tracking-widest">Correct Japanese Sentence:</p>
                  <p className="text-5xl md:text-6xl font-bold japanese-text leading-tight text-white">{result.naturalJapanese}</p>
                </div>
                
                <div className="flex flex-wrap gap-10">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-black mb-1 tracking-widest">Romaji:</p>
                    <p className="text-xl font-mono italic text-rose-300">{result.romaji}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-black mb-1 tracking-widest">Meaning in Bengali:</p>
                    <p className="text-2xl font-bold text-slate-100">{result.bengaliMeaning}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
