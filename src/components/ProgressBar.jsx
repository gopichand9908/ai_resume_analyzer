import React from 'react';
import { Clock, Cpu, Code2, Users, FolderGit2, Sparkles } from 'lucide-react';

export default function ProgressBar({
  questionNumber = 1,
  totalQuestions = 15,
  stage = 'Technical',
  difficulty = 'Adaptive',
  elapsedSeconds = 0,
}) {
  const percentage = Math.min(100, Math.round(((questionNumber - 1) / totalQuestions) * 100));

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const getStageIcon = () => {
    if (stage === 'Coding') return Code2;
    if (stage === 'HR') return Users;
    if (stage === 'Project Deep Dive') return FolderGit2;
    return Cpu;
  };

  const StageIcon = getStageIcon();

  return (
    <div className="glass-panel rounded-xl p-4 border border-slate-800 mb-6 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 bg-brand-500/15 border border-brand-500/30 px-2.5 py-1 rounded-lg">
            Question {questionNumber} of {totalQuestions}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            <StageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{stage}</span>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 hidden sm:inline-block">
            {difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-brand-600 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.max(5, percentage)}%` }}
        />
      </div>
    </div>
  );
}
