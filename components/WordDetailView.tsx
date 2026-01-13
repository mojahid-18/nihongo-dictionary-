
import React from 'react';
import { WordAnalysis } from '../types';

interface WordDetailViewProps {
  data: WordAnalysis;
}

export const WordDetailView: React.FC<WordDetailViewProps> = ({ data }) => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      {/* 1. Header & Overview */}
      <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-rose-100 shadow-2xl shadow-rose-500/10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-[0.04] select-none pointer-events-none">
          <span className="text-[18rem] font-bold japanese-text leading-none">{data.word}</span>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-baseline gap-6 mb-10">
            <h2 className="text-8xl md:text-9xl font-bold text-slate-900 japanese-text tracking-tighter">{data.word}</h2>
            <div className="flex flex-col">
              <span className="text-3xl text-rose-500 font-bold bg-rose-50 px-6 py-2 rounded-2xl mb-2">{data.reading}</span>
              <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{data.wordType}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
              <h3 className="text-xs uppercase tracking-widest font-black mb-4 text-rose-400">শব্দার্থ (Meanings)</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {data.meanings.map((m, i) => (
                  <span key={i} className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 rounded-2xl text-xl font-bold">
                    {m.meaning}
                  </span>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed italic border-t border-white/10 pt-4">
                {data.meanings[0].explanation}
              </p>
            </div>
            <div className="bg-rose-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-rose-200">
               <h3 className="text-xs uppercase tracking-widest font-black mb-4 opacity-80">ব্যবহারের ক্ষেত্র</h3>
               <p className="text-lg font-bold leading-snug">{data.meanings[0].context}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Conjugation Table (Only if applicable) */}
      {data.conjugationTable && data.conjugationTable.length > 0 && (
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
              কনজুগেশন টেবিল (Conjugation Table)
            </h3>
            <span className="text-xs font-black text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Full Analysis</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-wider">Form Name</th>
                  <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-wider">Japanese</th>
                  <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-wider">Romaji</th>
                  <th className="px-8 py-5 text-sm font-black text-slate-400 uppercase tracking-wider">Meaning (Bengali)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.conjugationTable.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-indigo-600 font-bold">{row.formName}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-2xl japanese-text font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{row.japanese}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-mono text-slate-400 italic">{row.romaji}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-slate-600 font-medium">{row.meaningInBengali}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 3. Detailed Grammar Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 px-2">
            <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
            গ্রামার বিশ্লেষণ (Grammar Breakdown)
          </h3>
          <div className="grid gap-4">
            {data.grammarBreakdown.map((g, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xs">
                     {i+1}
                   </div>
                   <h4 className="text-xl font-black text-blue-600">{g.form}</h4>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">{g.explanation}</p>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                  <p className="text-sm font-black text-blue-400 uppercase tracking-widest mb-2">Example Use:</p>
                  <p className="text-lg japanese-text font-bold text-slate-800">{g.exampleVariation}</p>
                </div>
                {g.usageRule && (
                  <p className="mt-4 text-xs font-bold text-slate-400 italic">Rule: {g.usageRule}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Homonyms & Additional Notes */}
        <div className="space-y-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 px-2 mb-6">
              <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
              সমজাতীয় শব্দ (Homonyms)
            </h3>
            {data.homonyms.length > 0 ? (
              <div className="space-y-4">
                {data.homonyms.map((h, i) => (
                  <div key={i} className="bg-emerald-50/30 p-6 rounded-[2rem] border border-emerald-100/50">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-3xl font-black text-emerald-700 japanese-text">{h.kanji}</span>
                      <span className="text-slate-400">|</span>
                      <span className="text-lg font-bold text-slate-700">{h.meaning}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{h.differenceExplanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center text-slate-400 italic">
                কোনো সমজাতীয় শব্দ পাওয়া যায়নি।
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-rose-500 rounded-full"></span>
              গুরুত্বপূর্ণ টিপস (Special Notes)
            </h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="text-2xl">🤝</div>
                <div>
                  <h4 className="font-black text-rose-400 uppercase text-xs tracking-widest mb-1">Politeness (নম্রতা)</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{data.additionalNotes.politeness}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🚫</div>
                <div>
                  <h4 className="font-black text-rose-400 uppercase text-xs tracking-widest mb-1">Common Mistakes (সাধারণ ভুল)</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{data.additionalNotes.mistakes}</p>
                </div>
              </div>
              {data.additionalNotes.spokenShortcuts && (
                <div className="flex gap-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h4 className="font-black text-rose-400 uppercase text-xs tracking-widest mb-1">Spoken Shortcuts (কথ্য রূপ)</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.additionalNotes.spokenShortcuts}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Examples Section */}
      <section className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-12">
           <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-4">
             <span className="w-2 h-10 bg-amber-500 rounded-full"></span>
             ব্যবহারের উদাহরণ (Contextual Examples)
           </h3>
           <span className="bg-amber-50 text-amber-600 px-5 py-2 rounded-2xl font-black text-sm uppercase tracking-widest">
             {data.examples.length} Sentences
           </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {data.examples.map((ex, i) => (
            <div key={i} className="group relative pl-8 border-l-2 border-slate-100 hover:border-amber-300 transition-all duration-500">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-amber-500 group-hover:scale-125 transition-all"></div>
              <div className="mb-4">
                <p className="text-3xl japanese-text text-slate-800 mb-2 leading-relaxed group-hover:text-slate-950 transition-colors">
                  {ex.japanese}
                </p>
                <p className="text-sm font-mono text-slate-400 italic mb-4 uppercase tracking-[0.2em]">
                  {ex.romaji}
                </p>
              </div>
              <div className="bg-amber-50/50 p-6 rounded-[1.5rem] border border-amber-100/50 group-hover:bg-amber-50 transition-colors">
                <p className="text-lg text-amber-900 font-bold mb-2">
                  {ex.bengali}
                </p>
                <p className="text-xs text-amber-700/60 leading-relaxed font-medium">
                  {ex.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
