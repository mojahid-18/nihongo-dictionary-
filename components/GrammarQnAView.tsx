import React, { useState, useRef, useEffect } from 'react';
import { askGrammarQuestion } from '../geminiService';
import { GrammarQnAResult } from '../types';
import { SpeechButton } from './SpeechButton';

export const GrammarQnAView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GrammarQnAResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea to fit content and show multiple words per line
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(68, textareaRef.current.scrollHeight)}px`;
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const data = await askGrammarQuestion(question);
      setResult(data);
    } catch (err) {
      setError('দুঃখিত, উত্তরটি তৈরি করা সম্ভব হয়নি। আপনার ইন্টারনেট কানেকশন বা API Key চেক করুন।');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <section className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-amber-100 shadow-xl shadow-amber-500/5">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-amber-500 rounded-full"></span>
          গ্রামার গাইড (Grammar Guide)
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            {/* User Friendly Search Box (Textarea) */}
            <textarea
              ref={textareaRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="আপনার প্রশ্নটি এখানে লিখুন... (উদা: তে-ফর্ম এর ব্যবহার এবং উদাহরণ)"
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-amber-500 rounded-[1.5rem] px-6 py-4 text-lg shadow-inner outline-none transition-all resize-none min-h-[80px] leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            
            <div className="flex items-center justify-end gap-3">
              {/* Voice Search Button - Outside the box as requested */}
              <div className="flex items-center gap-2 mr-auto">
                <SpeechButton 
                  lang="bn-BD" 
                  onTranscript={(text) => setQuestion(prev => prev + (prev ? ' ' : '') + text)}
                  className="w-14 h-14 !bg-slate-100 hover:!bg-amber-100 !text-slate-600 hover:!text-amber-600 border border-slate-200"
                />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">ভয়েস সার্চ</span>
              </div>

              {/* Icon-only Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !question.trim()}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white w-14 h-14 rounded-full transition-all flex items-center justify-center shadow-lg shadow-amber-200 shrink-0 group"
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">Shift + Enter দিয়ে নতুন লাইন তৈরি করতে পারেন</p>
        </div>
      </section>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
             <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">গবেষণা করা হচ্ছে...</h3>
          <p className="text-sm text-slate-500">আপনার জন্য বিস্তারিত গ্রামার রিপোর্ট তৈরি করছি।</p>
        </div>
      )}

      {error && (
        <div className="p-6 bg-rose-50 text-rose-600 rounded-[2rem] border border-rose-100 font-bold text-center animate-in shake duration-500">
          {error}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          {/* Main Explanation */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
              <span className="text-9xl font-black japanese-text">説</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-6 japanese-text border-b-4 border-amber-400 inline-block pb-2">{result.topic}</h3>
            <p className="text-lg text-slate-700 leading-relaxed bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100">
              {result.explanation}
            </p>
            
            <div className="mt-10">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-l-4 border-amber-500 pl-3">গ্রামারের নিয়মাবলী (Rules)</h4>
              <div className="grid gap-3">
                {result.rules.map((rule, i) => (
                  <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
                    <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-black shrink-0">{i+1}</span>
                    <p className="text-slate-800 font-semibold text-sm md:text-base">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Conversation (Dialogue) */}
          <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
            <div className="absolute -bottom-10 -right-10 p-10 opacity-5 select-none pointer-events-none">
              <span className="text-[12rem] japanese-text font-black leading-none">話</span>
            </div>
            <h4 className="text-amber-400 font-black uppercase text-xs tracking-[0.3em] mb-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              বাস্তব কথোপকথন (Dialogue)
            </h4>
            <div className="space-y-6 max-w-2xl mx-auto">
              {result.conversation.map((line, i) => (
                <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'items-start' : 'items-end'}`}>
                  <span className="text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest px-2">{line.speaker}</span>
                  <div className={`p-5 md:p-6 rounded-[2rem] max-w-[95%] shadow-lg ${i % 2 === 0 ? 'bg-slate-800 rounded-tl-none border-l-4 border-amber-500' : 'bg-amber-600 rounded-tr-none text-white'}`}>
                    <p className="text-xl md:text-2xl japanese-text mb-2 font-medium">{line.text}</p>
                    <p className="text-xs opacity-40 font-mono italic mb-3">{line.romaji}</p>
                    <div className="h-px bg-white/10 w-full mb-3"></div>
                    <p className="text-sm md:text-base font-bold text-slate-200">{line.translation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Examples (15-20 Sentences) */}
          <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                 <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                 আরও উদাহরণ (Examples)
               </h3>
               <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-[0.2em] self-start md:self-auto">
                 {result.examples.length} Sentences Analysis
               </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.examples.map((ex, i) => (
                <div key={i} className="group p-6 rounded-[2rem] border border-slate-50 bg-slate-50/30 hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300">
                  <div className="mb-4">
                    <p className="text-xl md:text-2xl japanese-text text-slate-800 mb-1 group-hover:text-emerald-900 transition-colors">
                      {ex.japanese}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 italic mb-2 tracking-wider">
                      {ex.romaji}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100/50">
                    <p className="text-base md:text-lg text-slate-700 font-bold mb-1">
                      {ex.bengali}
                    </p>
                    <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed">
                      {ex.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
