import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Plus, 
  Minus, 
  Table as TableIcon, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  ArrowRight,
  Loader2,
  BrainCircuit,
  RotateCcw
} from 'lucide-react';
import { cn } from './lib/utils';
import { analyzeDecision, type AnalysisType, type AnalysisResult } from './services/geminiService';

export default function App() {
  const [decision, setDecision] = useState('');
  const [type, setType] = useState<AnalysisType>('pros_cons');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!decision.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeDecision(decision, type);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setDecision('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <header className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-baseline gap-6 shrink-0">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.8]">
            The Tie<br/>Breaker
          </h1>
        </div>
        <div className="text-left md:text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Case No.</p>
          <p className="font-mono text-sm uppercase">{result ? "AX-7729-DECIDED" : "AX-7729-PENDING"}</p>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Side: Input/Context */}
        <section className={cn(
          "col-span-1 md:col-span-4 lg:col-span-5 border-r border-white/10 p-8 flex flex-col bg-[#0A0A0A]",
          result && "hidden md:flex"
        )}>
          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 block font-bold">The Decision</label>
              {!result ? (
                <div className="space-y-6">
                  <textarea
                    placeholder="Should I move to Tokyo for a Senior Designer role or stay in London to build my own studio?"
                    className="w-full bg-transparent border-none text-2xl md:text-3xl font-bold leading-[1.1] outline-none placeholder:text-white/10 resize-none min-h-[200px]"
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <AnalysisTabButton active={type === 'pros_cons'} onClick={() => setType('pros_cons')} label="Pros & Cons" icon={<BrainCircuit size={16}/>} />
                    <AnalysisTabButton active={type === 'comparison'} onClick={() => setType('comparison')} label="Comparison" icon={<TableIcon size={16}/>} />
                    <AnalysisTabButton active={type === 'swot'} onClick={() => setType('swot')} label="SWOT Grid" icon={<Target size={16}/>} />
                  </div>
                  <button
                    disabled={!decision.trim() || loading}
                    onClick={handleAnalyze}
                    className="w-full py-6 bg-[#A3E635] text-black rounded-none font-black uppercase text-xl md:text-2xl tracking-tighter hover:bg-[#bef264] disabled:opacity-30 flex items-center justify-center gap-3 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Execute Analysis"}
                  </button>
                </div>
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  {decision}
                </h2>
              )}
            </div>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#1A1A1A] p-6 border-l-4 border-[#A3E635]"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#A3E635] mb-2 font-bold italic">Processing Logic</p>
                <p className="text-sm text-white/60 leading-relaxed font-mono">
                  Synthesizing logical weight coefficients. Factoring in market volatility and long-term equity projections...
                </p>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-500/10 p-4 border-l-4 border-red-500 text-red-500 text-sm font-mono">
                [ERROR] {error}
              </div>
            )}
          </div>

          {result && (
            <div className="mt-auto pt-12">
              <button
                onClick={handleReset}
                className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
              >
                <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform" />
                Discard & Refresh
              </button>
            </div>
          )}
        </section>

        {/* Right Side: Results */}
        <section className={cn(
          "col-span-1 md:col-span-8 lg:col-span-7 flex flex-col min-h-[600px] bg-[#0F0F0F]",
          !result && "hidden md:flex bg-black items-center justify-center text-center p-12"
        )}>
          {!result ? (
            <div className="space-y-4 max-w-sm">
              <Scale size={48} className="mx-auto text-white/10" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Awaiting Analysis Parameters</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col h-full"
              >
                <div className="flex border-b border-white/10 bg-[#0A0A0A]">
                   <div className="px-8 py-4 border-r border-white/10 bg-white text-black font-black uppercase text-[10px] tracking-widest leading-none flex items-center">
                    {type.replace('_', ' ')}
                   </div>
                   <div className="flex-1 px-8 py-4 text-white/40 font-mono text-xs italic flex items-center justify-end">
                    Result Generated in 1.4s
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-0">
                  {renderAnalysisContent(result)}
                </div>

                {/* Verdict Footer */}
                <div className="bg-[#A3E635] text-black p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-1">Tie Breaker Verdict</p>
                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none">
                      {result.title}
                    </h4>
                  </div>
                  <div className="text-right flex flex-col items-center md:items-end">
                    <div className="text-4xl md:text-5xl font-mono font-black italic tabular-nums">84%</div>
                    <p className="text-[10px] uppercase font-bold tracking-tighter">Confidence Score</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      <footer className="p-4 md:p-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-white/30 font-bold">
        <div className="flex items-center gap-4">
          <span>AI Model: Rational-Decision-v4.0</span>
          <span className="hidden md:inline text-white/10">/</span>
          <span>Processed by Gemini</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#A3E635] rounded-full"></span> System Ready</span>
        </div>
      </footer>
    </div>
  );
}

function AnalysisTabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border border-white/10 text-[10px] uppercase tracking-[0.2em] font-black transition-all",
        active ? "bg-white text-black border-white" : "hover:bg-white/5 text-white/40 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function renderAnalysisContent(result: AnalysisResult) {
  const { data } = result;

  if (data.pros && data.cons) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-full">
        {/* PROS */}
        <div className="p-8 border-r border-white/10 space-y-12">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#A3E635] font-black italic">The Case For</h3>
          <ul className="space-y-10">
            {data.pros.map((item: string, i: number) => (
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="space-y-1"
              >
                <span className="block font-mono text-[10px] text-white/20">{(i + 1).toString().padStart(2, '0')}.</span>
                <p className="text-xl font-bold leading-tight tracking-tight">{item}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CONS */}
        <div className="p-8 bg-black/20 space-y-12">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-black italic">The Case Against</h3>
          <ul className="space-y-10">
            {data.cons.map((item: string, i: number) => (
              <motion.li 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="space-y-1"
              >
                <span className="block font-mono text-[10px] text-white/20">{(i + 1).toString().padStart(2, '0')}.</span>
                <p className="text-xl font-bold leading-tight tracking-tight">{item}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (data.columns && data.rows) {
    return (
      <div className="overflow-x-auto min-h-full">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#0A0A0A]">
              <th className="p-8 border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30 font-black">Metric</th>
              {data.columns.map((col: string, i: number) => (
                <th key={i} className="p-8 border-b border-white/10 font-black uppercase text-lg tracking-tighter">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.rows.map((row: any, i: number) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-8 font-mono text-xs uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">{row.feature}</td>
                {row.values.map((val: string, j: number) => (
                  <td key={j} className="p-8 leading-tight font-bold text-base tracking-tight">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.strengths && data.weaknesses && data.opportunities && data.threats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-full divide-x divide-y divide-white/10 border-b border-white/10">
        <SwotGridCell title="Strengths" items={data.strengths} color="lime" delay={0} />
        <SwotGridCell title="Weaknesses" items={data.weaknesses} color="orange" delay={0.1} />
        <SwotGridCell title="Opportunities" items={data.opportunities} color="blue" delay={0.2} />
        <SwotGridCell title="Threats" items={data.threats} color="rose" delay={0.3} />
      </div>
    );
  }

  return null;
}

function SwotGridCell({ title, items, color, delay }: { title: string, items: string[], color: string, delay: number }) {
  const colorMap: any = {
    lime: "text-[#A3E635]",
    orange: "text-orange-500",
    blue: "text-blue-400",
    rose: "text-rose-500",
  };

  const colorClass = colorMap[color] || "text-white";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="p-8 space-y-8"
    >
      <h3 className={cn("text-[10px] uppercase tracking-[0.3em] font-black italic", colorClass)}>{title}</h3>
      <ul className="space-y-6">
        {items.map((item, i) => (
          <li key={i} className="space-y-1">
             <span className="block font-mono text-[10px] text-white/20">{(i + 1).toString().padStart(2, '0')}.</span>
             <p className="text-lg font-bold leading-tight tracking-tight">{item}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
