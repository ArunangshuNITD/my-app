'use client';

import { useState, useEffect } from 'react';
// 1. Updated Import Path Here:
import { getSpacedRepetitionQueue } from '@/app/actions/spaceRepititionActions';
import { BrainCircuit, Timer, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function NeedsReviewQueue({ userId }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      // 2. Updated Function Call Here:
      getSpacedRepetitionQueue(userId).then((res) => {
        if (res.success) setQueue(res.queue);
        setLoading(false);
      });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm h-full flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <RefreshCw className="w-8 h-8 text-slate-300 animate-spin mb-4" />
        <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 p-8 shadow-sm h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <BrainCircuit className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Memory is Sharp!</h3>
        <p className="text-sm text-slate-500 max-w-xs">
          You have no mastered topics suffering from memory decay. Keep clearing new nodes!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden h-full flex flex-col relative">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="p-6 border-b border-slate-100 bg-[#fafafa] relative z-10 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-500" />
            Spaced Repetition
          </h3>
          <p className="text-xs text-slate-500 mt-1">Mastered topics you haven't seen in 14+ days.</p>
        </div>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <AlertCircle size={14} /> {queue.length} Due
        </span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-3">
          {queue.map((item, index) => (
            <div 
              key={index} 
              className="group p-4 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 bg-white flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{item.formattedName}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Timer size={13} /> {item.daysSince} days ago
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    Last Score: <strong className={item.lastScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}>{item.lastScore}%</strong>
                  </span>
                </div>
              </div>

              {/* REMINDER: Update this href to point to your actual quiz route! */}
              <Link 
                href={`/practice/${item.nodeId}`} 
                className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0"
                title="Review Concept"
              >
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}