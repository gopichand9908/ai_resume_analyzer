import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  Code2,
  Bug,
  RefreshCw,
  FileSearch,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function MatchAnalysis({ analysis, onProceedToSetup, onReanalyze }) {
  const [showDebug, setShowDebug] = useState(false);

  if (!analysis) return null;

  // 1. CRITICAL ERROR / FAILURE STATE
  if (
    analysis.status === 'analysis_failed' ||
    analysis.matchPercentage === null ||
    !analysis.requirements ||
    analysis.requirements.length === 0
  ) {
    return (
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl max-w-3xl mx-auto space-y-6 animate-fadeIn">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
              Analysis Failed · 0 Requirements Extracted
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Unable to analyze this job description
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {analysis.message ||
                "We couldn't identify meaningful requirements or technical qualifications from this job description."}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2">
          <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
            Possible Reasons:
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>The Job Description text is too short or lacks specific technical skills and qualifications.</li>
            <li>The document content contains corrupted characters or unsupported formatting.</li>
            <li>The input only contains general company branding without role requirements.</li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 font-mono">
            Status: <span className="text-rose-400 font-bold">Analysis Blocked</span> (No score calculated)
          </div>

          <button
            type="button"
            onClick={onReanalyze}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Edit JD & Retry Analysis</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. SUCCESSFUL ANALYSIS DISPLAY
  const {
    matchPercentage = 0,
    categoryScores = { mustHave: null, standard: null, niceToHave: null },
    confidence = 'High',
    counts = {},
    matchReason = '',
    directMatches = [],
    transferableMatches = [],
    missingSkills = [],
    requirements = [],
    strengths = [],
    gaps = [],
    recommendations = [],
    debug = {},
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score >= 60) return { text: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/30' };
    if (score >= 45) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const getConfidenceBadge = (conf) => {
    if (conf === 'High') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (conf === 'Medium') return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
  };

  const getImportanceBadge = (imp) => {
    if (imp === 'must_have') return { label: 'Must-Have', style: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
    if (imp === 'nice_to_have') return { label: 'Nice-to-Have', style: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
    return { label: 'Standard', style: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  const getMatchBadge = (status) => {
    switch (status) {
      case 'DIRECT_MATCH':
        return { label: 'Direct Match', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 };
      case 'TRANSFERABLE':
        return { label: 'Transferable', style: 'text-brand-300 bg-brand-500/10 border-brand-500/20', icon: Zap };
      case 'PARTIAL':
        return { label: 'Partial', style: 'text-amber-300 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle };
      default:
        return { label: 'Missing', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: XCircle };
    }
  };

  const scoreTheme = getScoreColor(matchPercentage);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8 animate-fadeIn">
      {/* 1. Header & Score Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-5">
          {/* Big Score Box */}
          <div className={`w-24 h-24 rounded-2xl ${scoreTheme.bg} border-2 ${scoreTheme.border} flex flex-col items-center justify-center p-2 text-center shadow-lg`}>
            <span className={`text-3xl font-extrabold ${scoreTheme.text} font-mono tracking-tight`}>
              {matchPercentage}%
            </span>
            <span className="text-[10px] text-slate-300 uppercase font-semibold tracking-wider mt-0.5">
              Match
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Resume-JD Match Analysis</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono font-semibold ${getConfidenceBadge(confidence)}`}>
                Confidence: {confidence}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Deterministic evaluation across {requirements.length} extracted job requirements based strictly on resume evidence.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReanalyze}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 text-xs font-semibold text-slate-200 transition-colors"
          >
            Edit Inputs
          </button>
          <button
            type="button"
            onClick={onProceedToSetup}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Configure & Start Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Must-Have */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300">Must-Have Skills</span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">60% Weight</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {categoryScores.mustHave !== null ? `${categoryScores.mustHave}%` : 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {counts.mustHaveCount || 0} core requirements defined in JD
          </p>
        </div>

        {/* Standard */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Standard Skills</span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">25% Weight</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {categoryScores.standard !== null ? `${categoryScores.standard}%` : 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {counts.standardCount || 0} expected competencies
          </p>
        </div>

        {/* Nice-to-Have */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Nice-to-Have</span>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">15% Weight</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {categoryScores.niceToHave !== null ? `${categoryScores.niceToHave}%` : 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {counts.niceToHaveCount || 0} preferred qualifications
          </p>
        </div>
      </div>

      {/* 3. Why This Score Banner */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300">Why this score?</h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
            {matchReason}
          </p>
        </div>
      </div>

      {/* 4. Match Summary Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Strong Matches */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-emerald-900/30 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h4 className="font-semibold text-sm text-emerald-400">Strong Matches ({directMatches.length})</h4>
          </div>
          <p className="text-xs text-slate-400 mb-3">Directly evidenced in resume projects or skills.</p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {directMatches.length > 0 ? (
              directMatches.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  ✓ {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No direct matches identified</span>
            )}
          </div>
        </div>

        {/* Transferable Matches */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-brand-900/30 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <h4 className="font-semibold text-sm text-brand-300">Partial / Transferable ({transferableMatches.length})</h4>
          </div>
          <p className="text-xs text-slate-400 mb-3">Adjacent technologies & conceptual experience.</p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {transferableMatches.length > 0 ? (
              transferableMatches.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 font-medium">
                  ◐ {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No transferable skills mapped</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-rose-900/30 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-rose-400" />
            <h4 className="font-semibold text-sm text-rose-400">Missing Gaps ({missingSkills.length})</h4>
          </div>
          <p className="text-xs text-slate-400 mb-3">Required by JD without verified resume evidence.</p>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                  ✗ {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-400 font-medium">No critical gaps!</span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Requirements Evidence Table */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-400" />
          <span>Detailed Requirements Evidence Matrix ({requirements.length} Extracted)</span>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">Importance</th>
                <th className="px-4 py-3">Match Status</th>
                <th className="px-4 py-3">Resume Evidence</th>
                <th className="px-4 py-3">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {requirements.map((req, idx) => {
                const imp = getImportanceBadge(req.importance);
                const match = getMatchBadge(req.matchStatus);
                const MatchIcon = match.icon;

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-100">{req.skill}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">{req.text}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${imp.style}`}>
                        {imp.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${match.style}`}>
                        <MatchIcon className="w-3.5 h-3.5" />
                        {match.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-[11px] max-w-xs">
                      {req.evidence || <span className="text-slate-500 italic">None found in resume</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-xs">
                      {req.explanation || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Explicit Missing Gaps Section */}
      {missingSkills.length > 0 && (
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
            <XCircle className="w-4 h-4" />
            <span>High-Priority Missing Gaps to Address</span>
          </div>
          <p className="text-xs text-slate-300">
            These skills were extracted directly from the Job Description but are not currently evidenced on your resume:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-200">
            {missingSkills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-rose-900/40 font-mono">
                <span className="text-rose-400 font-bold">{i + 1}.</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Strategic Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Key Profile Strengths</h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
          <h5 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">AI Interviewer Focus</h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 8. Developer Debug Mode (Expandable) */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowDebug(!showDebug)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-mono"
        >
          <Bug className="w-3.5 h-3.5 text-brand-400" />
          <span>Developer Debug Pipeline Trace</span>
          {showDebug ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDebug && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
            <div>
              <span className="text-brand-400 font-bold block mb-1">Pipeline Trace & Weights:</span>
              <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto text-[11px] text-emerald-300">
                {JSON.stringify(
                  {
                    status: analysis.status,
                    confidence: analysis.confidence,
                    matchPercentage: analysis.matchPercentage,
                    categoryScores: analysis.categoryScores,
                    counts: analysis.counts,
                    scoringWeights: { mustHave: 0.60, standard: 0.25, niceToHave: 0.15 },
                    evidenceWeights: { DIRECT_MATCH: 1.0, TRANSFERABLE: 0.65, PARTIAL: 0.35, MISSING: 0.0 },
                    debug: analysis.debug,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
