import React, { useState } from 'react';
import { ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescriptionInput from '../components/JobDescriptionInput';
import MatchAnalysis from '../components/MatchAnalysis';
import InterviewSetup from '../components/InterviewSetup';
import { analyzeResumeAndJD } from '../services/api';

export default function Setup({
  resumeText,
  setResumeText,
  fileName,
  setFileName,
  jobDescription,
  setJobDescription,
  matchAnalysis,
  setMatchAnalysis,
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
  onStartInterview,
  isStartingInterview,
}) {
  const [step, setStep] = useState(matchAnalysis ? 2 : 1); // 1: Inputs, 2: Analysis, 3: Configure
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  async function handleAnalyze() {
    if (!resumeText.trim()) {
      setAnalysisError('Please upload or paste your resume text first.');
      return;
    }
    if (!jobDescription.trim()) {
      setAnalysisError('Please enter or select a target Job Description.');
      return;
    }

    setAnalysisError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeResumeAndJD(resumeText, jobDescription);
      setMatchAnalysis(result);
      setStep(2);
    } catch (err) {
      console.error('Match analysis error:', err);
      setAnalysisError(err.message || 'Could not analyze match. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Step Indicator Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-xl mx-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            step === 1 ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <span>1. Resume & JD</span>
        </button>
        <span className="text-slate-600">→</span>
        <button
          type="button"
          disabled={!matchAnalysis}
          onClick={() => matchAnalysis && setStep(2)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 ${
            step === 2 ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <span>2. Match Analysis</span>
        </button>
        <span className="text-slate-600">→</span>
        <button
          type="button"
          disabled={!matchAnalysis}
          onClick={() => matchAnalysis && setStep(3)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all disabled:opacity-40 ${
            step === 3 ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <span>3. Configure</span>
        </button>
      </div>

      {/* Step 1: Upload & Input Grid */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white">Upload Resume & Target Job Description</h2>
            <p className="text-sm text-slate-400 mt-1">
              The AI will extract verified skills from your resume and compare them against the exact job requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResumeUpload
              resumeText={resumeText}
              setResumeText={setResumeText}
              fileName={fileName}
              setFileName={setFileName}
            />

            <JobDescriptionInput
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />
          </div>

          {analysisError && (
            <div className="max-w-md mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              type="button"
              disabled={isAnalyzing || !resumeText.trim() || !jobDescription.trim()}
              onClick={handleAnalyze}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-40 disabled:pointer-events-none"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Resume vs. JD Alignment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Resume-JD Match</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Match Analysis View */}
      {step === 2 && matchAnalysis && (
        <MatchAnalysis
          analysis={matchAnalysis}
          onProceedToSetup={() => setStep(3)}
          onReanalyze={() => setStep(1)}
        />
      )}

      {/* Step 3: Interview Setup View */}
      {step === 3 && (
        <div className="space-y-6">
          <InterviewSetup
            interviewType={interviewType}
            setInterviewType={setInterviewType}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            totalQuestions={totalQuestions}
            setTotalQuestions={setTotalQuestions}
            feedbackMode={feedbackMode}
            setFeedbackMode={setFeedbackMode}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            onStart={onStartInterview}
            isLoading={isStartingInterview}
          />
        </div>
      )}
    </div>
  );
}
