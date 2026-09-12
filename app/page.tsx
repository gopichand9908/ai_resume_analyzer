"use client";

import { useState } from "react";
import { ArrowUpRight, BrainCircuit, ChevronDown, FileText, LayoutDashboard, MessageSquare, Plus, Settings, Sparkles, Upload, UserRound } from "lucide-react";
import { createInterview, getNextQuestion, submitAnswer } from "../lib/api";

const modes = ["Mixed interview", "Technical interview", "AI / ML interview", "Behavioral interview"];

export default function Home() {
  const [activeMode, setActiveMode] = useState("Mixed interview");
  const [showModes, setShowModes] = useState(false);
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [evaluation, setEvaluation] = useState<{ strengths: string[]; weaknesses: string[] } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const demoQuestions = [
    "I noticed your Mental Health Detection project. Walk me through the problem, your approach, and the trade-off you are most proud of.",
    "You mentioned Random Forest. If your dataset doubled tomorrow, what would you change in the design and why?",
  ];

  async function startInterview() {
    setStarted(true);
    setLoading(true);
    try {
      const session = await createInterview(activeMode);
      setSessionId(session.id);
      const next = await getNextQuestion(session.id);
      setQuestion(next.question);
    } catch {
      setQuestion(demoQuestions[0]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      if (sessionId) {
        const result = await submitAnswer(sessionId, answer);
        setEvaluation({ strengths: result.strengths, weaknesses: result.weaknesses });
      } else {
        setEvaluation({ strengths: ["You answered with useful context."], weaknesses: ["Add a measurable outcome to make the example more credible."] });
      }
    } catch {
      setEvaluation({ strengths: ["You kept the response focused."], weaknesses: ["Make the trade-off explicit earlier."] });
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  }

  async function continueInterview() {
    setQuestionIndex((current) => Math.min(current + 1, demoQuestions.length - 1));
    setAnswer("");
    setSubmitted(false);
    setEvaluation(null);
    if (sessionId) {
      setLoading(true);
      try {
        const next = await getNextQuestion(sessionId);
        setQuestion(next.question);
      } catch {
        setQuestion(demoQuestions[Math.min(questionIndex + 1, demoQuestions.length - 1)]);
      } finally {
        setLoading(false);
      }
    } else {
      setQuestion(demoQuestions[Math.min(questionIndex + 1, demoQuestions.length - 1)]);
    }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>vanta</span></div>
        <div className="workspace-label">Workspace</div>
        <nav className="nav-list">
          <a className="nav-item active" href="#dashboard"><LayoutDashboard size={18} /> Overview</a>
          <a className="nav-item" href="#interview"><MessageSquare size={18} /> Interviews <span className="nav-count">3</span></a>
          <a className="nav-item" href="#resume"><FileText size={18} /> Resume profile</a>
          <a className="nav-item" href="#settings"><Settings size={18} /> Settings</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="pro-card"><div className="pro-icon"><BrainCircuit size={17} /></div><div><strong>Build your edge</strong><span>Unlock unlimited practice</span></div><ArrowUpRight size={15} /></div>
          <div className="profile"><div className="avatar">AK</div><div className="profile-copy"><strong>Arjun Kumar</strong><span>Candidate</span></div><ChevronDown size={15} /></div>
        </div>
      </aside>

      <section className="content" id="dashboard">
        <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>Overview</strong></div><div className="top-actions"><span className="status-dot"><i /> AI engine ready</span><button className="icon-button" aria-label="Profile"><UserRound size={18} /></button><div className="mini-avatar">AK</div></div></header>
        <div className="page-wrap">
          <div className="welcome-row"><div><p className="eyebrow">THURSDAY, JULY 23, 2026</p><h1>Good morning, Arjun<span>.</span></h1><p className="lede">Your next opportunity is built one thoughtful answer at a time.</p></div><button className="new-button" onClick={startInterview}><Plus size={18} /> New interview</button></div>

          <div className="stats-grid">
            <StatCard label="Placement readiness" value="78" suffix="%" trend="+12%" note="vs. last month" tone="violet" />
            <StatCard label="Interviews completed" value="06" trend="+2" note="this month" tone="coral" />
            <StatCard label="Average score" value="74" suffix="/100" trend="+8 pts" note="vs. last attempt" tone="mint" />
            <StatCard label="Practice streak" value="04" suffix=" days" trend="On track" note="best: 9 days" tone="yellow" />
          </div>

          <div className="main-grid">
            <section className="panel start-panel" id="interview"><div className="panel-heading"><div><p className="eyebrow">PRACTICE STUDIO</p><h2>{started ? "Your interviewer is listening." : "Ready when you are."}</h2></div><span className="live-pill"><i /> Personalised</span></div>{!started ? <><p className="panel-intro">Vanta has reviewed your resume and is ready to challenge your strongest projects.</p><div className="setup-row"><div className="select-wrap"><label>Interview mode</label><button className="select-button" onClick={() => setShowModes(!showModes)}>{activeMode}<ChevronDown size={17} /></button>{showModes && <div className="mode-menu">{modes.map((mode) => <button key={mode} onClick={() => { setActiveMode(mode); setShowModes(false); }}>{mode}</button>)}</div>}</div><div className="select-wrap"><label>Difficulty</label><button className="select-button">Adaptive <ChevronDown size={17} /></button></div></div><div className="resume-chip"><div className="file-icon"><FileText size={17} /></div><div><strong>Arjun_Kumar_Resume.pdf</strong><span>Parsed 2 days ago · 12 skills identified</span></div><span className="chip-check">✓</span></div><button className="start-button" onClick={startInterview}>Start interview<ArrowUpRight size={18} /></button></> : <div className="live-interview"><div className="question-count">QUESTION {questionIndex + 1} <span>/ 06</span></div><p className="question-text">{loading && !question ? "Preparing your personalised question..." : question}</p>{submitted ? <div className="feedback-box"><strong>{evaluation?.strengths[0] ?? "Good direction."}</strong><span>{evaluation?.weaknesses[0] ?? "Add a measurable outcome to make the example more credible."}</span><button onClick={continueInterview}>Continue to follow-up <ArrowUpRight size={15} /></button></div> : <><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Take a moment, then type your answer..." /><button className="start-button" disabled={!answer.trim() || loading} onClick={handleSubmit}>{loading ? "Evaluating..." : "Submit answer"}<ArrowUpRight size={18} /></button></>}</div>}</section>
            <section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">MOMENTUM</p><h2>Score trajectory</h2></div><button className="more-button">Last 6 <ChevronDown size={14} /></button></div><div className="chart"><div className="y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 500 180" preserveAspectRatio="none" className="line-chart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8275ed" stopOpacity=".22" /><stop offset="1" stopColor="#8275ed" stopOpacity="0" /></linearGradient></defs><path d="M0 145 C35 138, 50 150, 82 126 S125 105, 157 118 S200 92, 235 94 S280 110, 315 68 S360 77, 392 54 S438 42, 500 22 L500 180 L0 180 Z" fill="url(#area)" /><path d="M0 145 C35 138, 50 150, 82 126 S125 105, 157 118 S200 92, 235 94 S280 110, 315 68 S360 77, 392 54 S438 42, 500 22" fill="none" stroke="#7567e7" strokeWidth="3" strokeLinecap="round" /></svg><div className="x-axis"><span>May 18</span><span>May 25</span><span>Jun 01</span><span>Jun 08</span><span>Jun 15</span><span>Jun 22</span></div></div></div></section>
          </div>

          <div className="lower-grid"><section className="panel skills-panel"><div className="panel-heading"><div><p className="eyebrow">YOUR PROFILE</p><h2>Skill snapshot</h2></div><a className="text-link" href="#resume">View profile <ArrowUpRight size={15} /></a></div><div className="skill-list"><Skill name="Problem solving" value={86} color="purple" /><Skill name="Python & data structures" value={81} color="orange" /><Skill name="Project communication" value={72} color="green" /><Skill name="System design" value={63} color="pink" /></div></section><section className="panel history-panel"><div className="panel-heading"><div><p className="eyebrow">RECENT SESSIONS</p><h2>Keep the rhythm</h2></div><a className="text-link" href="#history">See all <ArrowUpRight size={15} /></a></div><div className="session-list"><Session title="Technical · Python" date="Yesterday, 11:42 AM" score="81" color="purple" /><Session title="Behavioral · Mixed" date="Jun 20, 4:18 PM" score="74" color="orange" /><Session title="AI / ML · Projects" date="Jun 18, 9:05 AM" score="68" color="green" /></div></section></div>
          <div className="footer-note"><span><Sparkles size={14} /> Your coach gets sharper with every session.</span><span>Local-first &nbsp;·&nbsp; Your data stays yours</span></div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, suffix, trend, note, tone }: { label: string; value: string; suffix?: string; trend: string; note: string; tone: string }) { return <div className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-spark">↗</span></div><div className="stat-value">{value}<small>{suffix}</small></div><div className="stat-foot"><strong>{trend}</strong><span>{note}</span></div></div>; }
function Skill({ name, value, color }: { name: string; value: number; color: string }) { return <div className="skill-row"><div className="skill-label"><span>{name}</span><strong>{value}%</strong></div><div className="bar"><i className={color} style={{ width: `${value}%` }} /></div></div>; }
function Session({ title, date, score, color }: { title: string; date: string; score: string; color: string }) { return <div className="session"><span className={`session-mark ${color}`}><MessageSquare size={15} /></span><div><strong>{title}</strong><span>{date}</span></div><b>{score}<small>/100</small></b><ArrowUpRight size={15} className="session-arrow" /></div>; }