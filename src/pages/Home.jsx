import React from 'react';
import { ArrowRight, FileText, Briefcase, BrainCircuit, Sparkles, CheckCircle2, ShieldCheck, Target } from 'lucide-react';

export default function Home({ onStart }) {
  return (
    <div className="space-y-16 py-8 sm:py-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Local-First & Serverless AI Interview Preparation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          AI Interview Coach
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Practice interviews tailored to your resume and the job you actually want.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Start Interview</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-colors flex items-center justify-center"
          >
            How It Works
          </a>
        </div>
      </section>

      {/* 3 Core Value Cards */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-brand-400 font-bold">Three-Step Methodology</h2>
          <p className="text-2xl font-bold text-white mt-1">Realistic Adaptive Interview Practice</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel rounded-2xl p-7 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Upload Resume</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI understands your skills, projects and experience.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-brand-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verifies project depth & technical claims</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-2xl p-7 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Add Job Description</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI identifies the skills and requirements the company is looking for.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Maps direct, transferable & missing skills</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-2xl p-7 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Practice</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Get an adaptive interview with technical, coding and HR questions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-time feedback & hiring report</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Guarantees */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 text-xs sm:text-sm text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Strict Source of Truth:</strong> The AI will never fabricate skills or invent experience not present in your resume.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Target className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Dynamic Difficulty:</strong> Questions adapt dynamically based on the depth and accuracy of your previous answers.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
