import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, ArrowRight, CheckCircle2, AlertCircle, HelpCircle, Bot, User } from 'lucide-react';

export default function InterviewChat({
  currentQuestion,
  questionNumber,
  totalQuestions,
  category,
  guidance,
  targetSkill,
  onSubmitAnswer,
  isEvaluating,
  evaluation,
  feedbackMode,
  onNextQuestion,
  voiceEnabled,
}) {
  const [answer, setAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSTARHint, setShowSTARHint] = useState(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize Web Speech Synthesis (TTS)
  useEffect(() => {
    if (voiceEnabled && currentQuestion && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion, voiceEnabled]);

  // Initialize Web Speech Recognition (STT)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  function toggleSpeechRecognition() {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  }

  function handleSpeakQuestion() {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(currentQuestion);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  function handleSubmit(e) {
    e?.preventDefault();
    if (!answer.trim() || isEvaluating) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    onSubmitAnswer(answer);
  }

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* AI Question Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-brand-500/20 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-400">
                  AI Interviewer
                </span>
                {category && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {category}
                  </span>
                )}
                {targetSkill && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Focus: {targetSkill}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Adaptive Question {questionNumber} of {totalQuestions}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSpeakQuestion}
            className={`p-2 rounded-lg border transition-colors ${
              isSpeaking
                ? 'bg-brand-600 border-brand-500 text-white animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Read question aloud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-base sm:text-xl font-bold text-white leading-relaxed tracking-tight my-4">
          {currentQuestion}
        </h3>

        {guidance && (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
            <span><strong className="text-slate-300">Interviewer Expectation:</strong> {guidance}</span>
          </div>
        )}
      </div>

      {/* Answer & Evaluation Section */}
      {!evaluation ? (
        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-white">Your Answer</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSTARHint(!showSTARHint)}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>STAR Method Tip</span>
            </button>
          </div>

          {showSTARHint && (
            <div className="mb-4 p-3 rounded-xl bg-brand-950/40 border border-brand-800/40 text-xs text-brand-200 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div><strong className="text-white">S</strong>ituation (Context)</div>
              <div><strong className="text-white">T</strong>ask (Goal / Obstacle)</div>
              <div><strong className="text-white">A</strong>ction (Your exact code/tech)</div>
              <div><strong className="text-white">R</strong>esult (Metrics / Impact)</div>
            </div>
          )}

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isEvaluating}
              placeholder="Type your answer in detail. Structure your thoughts, mention technical reasoning, trade-offs, and metrics..."
              rows={6}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 font-sans focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/40 transition-all placeholder:text-slate-500 resize-y leading-relaxed disabled:opacity-50"
            />

            {isListening && (
              <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Listening...</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-brand-400" />}
                <span>{isListening ? 'Stop Mic' : 'Voice Dictate'}</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                {wordCount} words
              </span>
            </div>

            <button
              type="submit"
              disabled={!answer.trim() || isEvaluating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {isEvaluating ? (
                <span>Evaluating Answer...</span>
              ) : (
                <>
                  <span>Submit Answer</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Evaluation Feedback Card */
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-base font-mono">
                {evaluation.score}/10
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Answer Evaluation</h4>
                <p className="text-xs text-slate-400">Adaptive response scored across 7 core dimensions</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setAnswer('');
                onNextQuestion();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>{questionNumber >= totalQuestions ? 'View Final Report' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>What was strong</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {evaluation.good}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Areas to Elevate</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {evaluation.improve}
              </p>
            </div>
          </div>

          {evaluation.missingConcepts?.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                Keywords & Concepts to Mention:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.missingConcepts.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {evaluation.modelAnswer && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px] mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Model High-Caliber Response (STAR Framework)</span>
              </div>
              <p className="font-sans italic leading-relaxed text-slate-200">
                "{evaluation.modelAnswer}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
