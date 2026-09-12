import React from 'react';
import { Users, HeartHandshake, Sparkles, MessageSquare } from 'lucide-react';
import InterviewChat from './InterviewChat';

export default function HRRound(props) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">HR & Cultural Alignment Stage</h4>
            <p className="text-xs text-slate-400">Behavioral, leadership, conflict resolution, and career motivation</p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-indigo-300 font-semibold">
          STAR Framework
        </span>
      </div>

      <InterviewChat {...props} />
    </div>
  );
}
