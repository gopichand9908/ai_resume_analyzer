import React from 'react';
import { Play, Sparkles, Layers, Cpu, Code2, Users, FolderGit2, Sliders, Volume2, Shield } from 'lucide-react';

const INTERVIEW_TYPES = [
  { id: 'Full Interview', label: 'Full Interview', desc: 'Comprehensive mix: Project deep dive, Technical, Coding, and HR', icon: Layers, badge: 'Recommended' },
  { id: 'Technical', label: 'Technical Round', desc: 'Core CS fundamentals, API design, architecture, and database concepts', icon: Cpu },
  { id: 'Coding', label: 'Coding Round', desc: 'Live problem solving, algorithms, data structures & complexity analysis', icon: Code2 },
  { id: 'HR', label: 'HR / Behavioral', desc: 'STAR behavioral questions, situational judgment, and company culture fit', icon: Users },
  { id: 'Project Deep Dive', label: 'Project Deep Dive', desc: 'Rigorous Level 1-7 technical grilling on your specific resume projects', icon: FolderGit2 },
];

const DIFFICULTIES = [
  { id: 'Adaptive', label: 'Adaptive', desc: 'Scales difficulty up or down dynamically based on your answers', badge: 'Smart' },
  { id: 'Easy', label: 'Easy / Intern', desc: 'Foundational concepts and standard definitions' },
  { id: 'Medium', label: 'Medium / Fresher', desc: 'Practical implementation, core trade-offs, and basic DSA' },
  { id: 'Hard', label: 'Hard / Senior', desc: 'Deep system architecture, high concurrency, and edge cases' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export default function InterviewSetup({
  interviewType,
  setInterviewType,
  difficulty,
  setDifficulty,
  totalQuestions,
  setTotalQuestions,
  feedbackMode,
  setFeedbackMode,
  voiceEnabled,
  setVoiceEnabled,
  onStart,
  isLoading,
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Configure Interview Simulation</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailor the AI interviewer to simulate real hiring loops
          </p>
        </div>
      </div>

      {/* 1. Interview Type */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          1. Select Interview Stage / Focus
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INTERVIEW_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = interviewType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setInterviewType(type.id)}
                className={`p-4 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/15 shadow-lg shadow-brand-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                }`}
              >
                {type.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {type.badge}
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-slate-400'}`} />
                    <span className="font-semibold text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Difficulty & Question Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Difficulty */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            2. Difficulty Level
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {DIFFICULTIES.map((diff) => {
              const isSelected = difficulty === diff.id;
              return (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 text-white'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{diff.label}</span>
                    {diff.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                        {diff.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">{diff.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            3. Total Questions
          </label>
          <div className="grid grid-cols-4 gap-2.5">
            {QUESTION_COUNTS.map((count) => {
              const isSelected = totalQuestions === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setTotalQuestions(count)}
                  className={`py-3 px-2 rounded-xl text-center border font-mono font-bold text-sm transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {count}
                  <span className="block text-[10px] font-normal text-slate-400 font-sans">Questions</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-brand-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">AI Speech Voice (TTS)</div>
                <div className="text-[10px] text-slate-400">Interviewer reads questions aloud</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                voiceEnabled ? 'bg-brand-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  voiceEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Feedback / Practice Mode Toggle */}
      <div className="mb-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300 block">Feedback Style</span>
          <p className="text-xs text-slate-400 mt-0.5">
            {feedbackMode === 'practice'
              ? 'Practice Mode: Shows instant score, strengths, and model answer after each question.'
              : 'Interview Mode: Realistic simulation with minimal feedback during session, detailed report at end.'}
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
          <button
            type="button"
            onClick={() => setFeedbackMode('practice')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              feedbackMode === 'practice'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Practice Mode
          </button>
          <button
            type="button"
            onClick={() => setFeedbackMode('interview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              feedbackMode === 'interview'
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interview Mode
          </button>
        </div>
      </div>

      {/* Start Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={onStart}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-brand-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
      >
        {isLoading ? (
          <span>Initializing AI Interview Engine...</span>
        ) : (
          <>
            <Play className="w-5 h-5 fill-current" />
            <span>Start Live Interview Session</span>
          </>
        )}
      </button>
    </div>
  );
}
