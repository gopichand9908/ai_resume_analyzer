import React, { useRef } from 'react';
import { Briefcase, FileUp, Sparkles, Code2, Database, Layout, Bot, AlertOctagon } from 'lucide-react';

const SAMPLE_JDS = [
  {
    title: 'AI / Autonomy & Robotics Engineer',
    role: 'AI / Autonomy',
    text: `Job Title: AI & Autonomous Systems Engineer
Company: Apex Robotics & Autonomy Labs
Location: Bangalore / Hybrid

About the Role:
We are seeking an Autonomous Systems & AI Engineer to develop next-generation perception, control, and robotic intelligence.

Required Qualifications (Must-Have):
- Strong programming skills in Python and C++.
- Hands-on experience with Deep Learning frameworks (PyTorch or TensorFlow).
- Practical knowledge of Computer Vision (OpenCV, object detection, segmentation).
- Understanding of Sensor Fusion (Kalman filtering, IMU, LiDAR integration) and State Estimation.
- B.Tech / M.Tech in Computer Science, Robotics, or Electrical Engineering.

Preferred Qualifications (Nice-to-Have):
- Experience with Reinforcement Learning algorithms (PPO, DQN).
- Exposure to Control Systems (PID, MPC) and ROS/ROS2 simulation.
- Edge AI deployment experience on constrained hardware (Jetson, TensorRT, ONNX).`,
  },
  {
    title: 'Backend Software Engineer (Python / APIs)',
    role: 'Backend',
    text: `Job Title: Backend Software Engineer
Company: CloudScale Technologies
Location: Remote / Hybrid

Responsibilities:
- Design, build, and maintain high-performance RESTful APIs using Python (FastAPI / Django).
- Architect scalable PostgreSQL data models, indexes, and caching strategies with Redis.
- Collaborate with frontend and ML engineers to integrate real-time inference endpoints.
- Write clean, well-tested code with automated CI/CD pipelines.

Requirements:
- Strong proficiency in Python and object-oriented programming.
- Hands-on experience with SQL databases (PostgreSQL) and REST API design.
- Familiarity with containerization (Docker) and cloud deployments (AWS/GCP).
- Good understanding of Data Structures & Algorithms and asynchronous concurrency.`,
  },
  {
    title: 'Full Stack Developer (React & Node/Python)',
    role: 'Full Stack',
    text: `Job Title: Full Stack Developer
Company: Nova Interactive
Location: Bangalore / Hybrid

Responsibilities:
- Build responsive, modern web applications using React, Tailwind CSS, and TypeScript.
- Implement robust backend services in Node.js or Python with REST & GraphQL endpoints.
- Manage database schemas in PostgreSQL and MongoDB.

Requirements:
- 1-3 years experience with modern JavaScript / TypeScript and React.
- Solid understanding of HTML5 semantic elements, CSS flexbox/grid, and DOM events.
- Experience with backend APIs, authentication (JWT/OAuth), and Git workflows.`,
  },
  {
    title: 'Vague JD (Test 0-Requirement Protection)',
    role: 'Vague JD',
    text: `We are an exciting high-growth startup looking for ambitious dreamers and rockstar visionaries.
Join our fun family culture! We have ping pong tables and unlimited snacks.
Come build the future with us today!`,
  },
];

export default function JobDescriptionInput({ jobDescription, setJobDescription }) {
  const fileRef = useRef(null);

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setJobDescription(text);
    } catch (err) {
      console.error('JD file read error:', err);
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Target Job Description (JD)</h3>
            <p className="text-xs text-slate-400">Paste JD text or select a role template</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            <FileUp className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>
      </div>

      {/* Preset JD Chips */}
      <div className="mb-3">
        <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span>Quick Preset Templates:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_JDS.map((jd, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setJobDescription(jd.text)}
              className={`p-2 rounded-lg text-left border text-xs transition-all ${
                jobDescription === jd.text
                  ? 'border-brand-500 bg-brand-500/15 text-white font-medium shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold truncate">{jd.role}</div>
              <div className="text-[10px] text-slate-400 truncate">{jd.title}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the Job Description here (responsibilities, required skills, preferred qualifications, tech stack)..."
          className="w-full flex-1 min-h-[170px] bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-sans focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all leading-relaxed placeholder:text-slate-500 resize-none"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{jobDescription.trim().split(/\s+/).filter(Boolean).length} words detected</span>
          {jobDescription.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setJobDescription('')}
              className="hover:text-rose-400 transition-colors"
            >
              Clear JD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
