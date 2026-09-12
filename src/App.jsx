import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Interview from './pages/Interview';
import Results from './pages/Results';
import { startInterviewSession } from './services/api';

const STORAGE_KEY = 'ai_interview_coach_session_v1';

export default function App() {
  const [currentView, setView] = useState('home'); // 'home' | 'setup' | 'interview' | 'results'

  // Persistent session states
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [interviewType, setInterviewType] = useState('Full Interview');
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [totalQuestions, setTotalQuestions] = useState(15);
  const [feedbackMode, setFeedbackMode] = useState('practice');
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const [sessionData, setSessionData] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.resumeText) setResumeText(data.resumeText);
        if (data.fileName) setFileName(data.fileName);
        if (data.jobDescription) setJobDescription(data.jobDescription);
        if (data.matchAnalysis) setMatchAnalysis(data.matchAnalysis);
        if (data.interviewType) setInterviewType(data.interviewType);
        if (data.difficulty) setDifficulty(data.difficulty);
        if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
        if (data.feedbackMode) setFeedbackMode(data.feedbackMode);
        if (data.voiceEnabled !== undefined) setVoiceEnabled(data.voiceEnabled);
        if (data.sessionData) setSessionData(data.sessionData);
        if (data.finalReport) setFinalReport(data.finalReport);
        if (data.currentView) setView(data.currentView);
      }
    } catch (e) {
      console.warn('Could not restore session from storage', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      const payload = {
        resumeText,
        fileName,
        jobDescription,
        matchAnalysis,
        interviewType,
        difficulty,
        totalQuestions,
        feedbackMode,
        voiceEnabled,
        sessionData,
        finalReport,
        currentView,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save session to storage', e);
    }
  }, [
    resumeText,
    fileName,
    jobDescription,
    matchAnalysis,
    interviewType,
    difficulty,
    totalQuestions,
    feedbackMode,
    voiceEnabled,
    sessionData,
    finalReport,
    currentView,
  ]);

  async function handleStartInterview() {
    setIsStartingInterview(true);
    try {
      const data = await startInterviewSession({
        resumeText,
        jobDescription,
        interviewType,
        difficulty,
        totalQuestions,
      });
      setSessionData(data);
      setView('interview');
    } catch (err) {
      console.error('Failed to start interview:', err);
      // Fallback start
      setSessionData({
        sessionId: `sess_${Date.now()}`,
        questionNumber: 1,
        totalQuestions,
        interviewType,
        difficulty,
        question: "Walk me through the most technically challenging project on your resume. What was the core problem and the key architectural trade-offs you made?",
        stage: 'Project Deep Dive',
        category: 'Architecture & Decisions',
        targetSkill: 'Problem Solving & Architecture',
        guidance: 'Be structured: explain context, task, technical action, and results.',
      });
      setView('interview');
    } finally {
      setIsStartingInterview(false);
    }
  }

  function handleFinishInterview(report) {
    setFinalReport(report);
    setView('results');
  }

  function handleResetSession() {
    localStorage.removeItem(STORAGE_KEY);
    setResumeText('');
    setFileName('');
    setJobDescription('');
    setMatchAnalysis(null);
    setSessionData(null);
    setFinalReport(null);
    setInterviewType('Full Interview');
    setDifficulty('Adaptive');
    setTotalQuestions(15);
    setView('setup');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar
        currentView={currentView}
        setView={setView}
        hasActiveSession={Boolean(sessionData)}
        onResetSession={handleResetSession}
      />

      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <Home onStart={() => setView('setup')} />
        )}

        {currentView === 'setup' && (
          <Setup
            resumeText={resumeText}
            setResumeText={setResumeText}
            fileName={fileName}
            setFileName={setFileName}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            matchAnalysis={matchAnalysis}
            setMatchAnalysis={setMatchAnalysis}
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
            onStartInterview={handleStartInterview}
            isStartingInterview={isStartingInterview}
          />
        )}

        {currentView === 'interview' && (
          <Interview
            sessionData={sessionData}
            resumeText={resumeText}
            jobDescription={jobDescription}
            matchAnalysis={matchAnalysis}
            interviewType={interviewType}
            difficulty={difficulty}
            feedbackMode={feedbackMode}
            voiceEnabled={voiceEnabled}
            onFinishInterview={handleFinishInterview}
          />
        )}

        {currentView === 'results' && (
          <Results
            report={finalReport}
            onRestart={handleResetSession}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span><strong>AI Interview Coach</strong> &nbsp;·&nbsp; Adaptive Simulation & Verification Engine</span>
          <span>Zero Server Storage &nbsp;·&nbsp; Local-First Session Architecture</span>
        </div>
      </footer>
    </div>
  );
}
