import React from 'react';
import { 
  Trophy, CheckCircle2, AlertTriangle, XCircle, ArrowRight, RotateCcw, 
  Sparkles, BookOpen, Target, ShieldAlert, FileText, Download, Share2
} from 'lucide-react';

export default function FinalReport({ report, onRestart }) {
  if (!report) return null;

  const {
    overallScore = 80,
    categoryScores = {
      resumeJdMatch: 75,
      technical: 80,
      coding: 75,
      projects: 85,
      communication: 80,
      hr: 82,
    },
    hiringRecommendation = 'Hire',
    recommendationRationale = 'Demonstrated solid technical problem solving and clear architectural fundamentals.',
    strongestSkills = ['Python', 'SQL', 'Project Explanation'],
    weakestSkills = ['Distributed Caching', 'Edge Case Validation'],
    unverifiedClaims = [],
    failedQuestions = [],
    jdGaps = [],
    preparationPlan = {
      learn: [],
      practice: [],
      revise: [],
    },
  } = report;

  // Recommendation Badge Helper
  const getRecommendationStyle = (rec) => {
    switch (rec) {
      case 'Strong Hire':
        return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', badge: 'bg-emerald-500', icon: CheckCircle2 };
      case 'Hire':
        return { bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40', badge: 'bg-teal-500', icon: CheckCircle2 };
      case 'Borderline':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', badge: 'bg-amber-500', icon: AlertTriangle };
      case 'Weak Hire':
        return { bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40', badge: 'bg-orange-500', icon: AlertTriangle };
      default:
        return { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', badge: 'bg-rose-500', icon: XCircle };
    }
  };

  const recStyle = getRecommendationStyle(hiringRecommendation);
  const RecIcon = recStyle.icon;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl max-w-5xl mx-auto space-y-10 animate-fadeIn">
      {/* 1. Header & Big Scores Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 rounded-full">
                Evaluation Complete
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Final Interview Performance Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Verified evaluation based strictly on resume evidence and candidate interview responses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Session</span>
            </button>
          </div>
        </div>

        {/* Big Overall Score & Category Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 bg-gradient-to-br from-brand-950/60 to-indigo-950/40 p-5 rounded-2xl border border-brand-500/30 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Overall Score</span>
            <div className="my-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">{overallScore}</span>
              <span className="text-base text-slate-400 font-mono"> / 100</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono border flex items-center gap-1.5 ${recStyle.bg}`}>
                <RecIcon className="w-3.5 h-3.5" />
                <span>{hiringRecommendation}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Resume-JD Match</span>
            <div className="text-2xl font-bold text-white font-mono my-1">{categoryScores.resumeJdMatch}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${categoryScores.resumeJdMatch}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Technical Round</span>
            <div className="text-2xl font-bold text-white font-mono my-1">{categoryScores.technical}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${categoryScores.technical}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Coding & Logic</span>
            <div className="text-2xl font-bold text-white font-mono my-1">{categoryScores.coding}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-400 h-full rounded-full" style={{ width: `${categoryScores.coding}%` }} />
            </div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Communication & HR</span>
            <div className="text-2xl font-bold text-white font-mono my-1">{categoryScores.communication}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-teal-400 h-full rounded-full" style={{ width: `${categoryScores.communication}%` }} />
            </div>
          </div>
        </div>

        {/* Hiring Rationale Banner */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <strong className="text-white font-semibold">Hiring Committee Rationale: </strong>
          {recommendationRationale}
        </div>
      </div>

      {/* 2. Strongest vs Weakest Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strongest */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-900/30">
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">1. Strongest Skills Demonstrated</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
            {strongestSkills.map((skill, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weakest */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-900/30">
          <div className="flex items-center gap-2 mb-3 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">2. Skills Requiring Development</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
            {weakestSkills.map((skill, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Resume Claims That Need Verification */}
      {unverifiedClaims?.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-900/30">
          <div className="flex items-center gap-2 mb-3 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">3. Resume Claims That Need Verification</h3>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Technologies or project claims listed on your resume where you struggled to demonstrate technical depth during the interview:
          </p>
          <div className="space-y-2">
            {unverifiedClaims.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/30 text-xs">
                <div className="font-semibold text-rose-300">{item.claim}</div>
                <div className="text-slate-400 mt-0.5">{item.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Questions You Failed or Scored Low */}
      {failedQuestions?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Target className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-base">4. Questions Review & Ideal Concepts</h3>
          </div>

          <div className="space-y-3">
            {failedQuestions.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-sm text-slate-100">Q: {item.question}</h4>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300">
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">Your Answer:</span>
                  <p className="italic">"{item.candidateAnswer}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/30">
                    <span className="font-bold text-amber-400 uppercase text-[10px] block mb-1">What was missing:</span>
                    <p className="text-slate-300 leading-relaxed">{item.missingConcept}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                    <span className="font-bold text-emerald-400 uppercase text-[10px] block mb-1">Correct / Ideal Concept:</span>
                    <p className="text-slate-300 leading-relaxed">{item.correctConcept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. JD Gaps */}
      {jdGaps?.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-2">
            5. Target Job Description Gaps
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Skills explicitly required by the target job that were not sufficiently evidenced during the interview:
          </p>
          <div className="flex flex-wrap gap-2">
            {jdGaps.map((gap, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 text-xs font-mono font-medium">
                ⚠ {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. Step-by-Step Preparation Plan */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 border border-indigo-500/20 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-bold text-base uppercase tracking-wider">6. High-Impact Preparation Roadmap</h3>
        </div>
        <p className="text-xs text-slate-300">
          Prioritized checklist to complete before your real company interview:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Learn */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">1. Learn (Theory)</span>
            <ul className="space-y-2 text-xs text-slate-300">
              {(preparationPlan.learn || []).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-brand-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-2">2. Practice (Code & Problems)</span>
            <ul className="space-y-2 text-xs text-slate-300">
              {(preparationPlan.practice || []).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Revise */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">3. Revise (Resume & STAR Stories)</span>
            <ul className="space-y-2 text-xs text-slate-300">
              {(preparationPlan.revise || []).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
