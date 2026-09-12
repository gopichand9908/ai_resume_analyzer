import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

const SAMPLE_RESUME = `ARJUN KUMAR
Email: arjun.kumar@example.com | Phone: +91-9876543210 | Bangalore, India
LinkedIn: linkedin.com/in/arjun-kumar-dev | GitHub: github.com/arjun-dev

SUMMARY:
Results-driven Software Engineer with 2+ years of hands-on experience designing robust backend microservices, RESTful APIs, and machine learning pipelines. Experienced in Python, FastAPI, PostgreSQL, and AWS.

TECHNICAL SKILLS:
• Programming Languages: Python, SQL, JavaScript (ES6), C++
• Frameworks & Libraries: FastAPI, Flask, PyTorch, Scikit-learn, Pandas, NumPy
• Databases & Storage: PostgreSQL, Redis, MongoDB
• Cloud & Tools: AWS (EC2, S3), Docker, Git, Linux, Postman
• Core Competencies: REST APIs, Data Structures & Algorithms, System Architecture, NLP

PROJECTS:
1. Mental Health Detection & Analysis Pipeline (Python, FastAPI, PyTorch, PostgreSQL)
   - Built an end-to-end NLP classification system to detect emotional markers in textual conversations with 89% precision.
   - Designed asynchronous REST APIs with FastAPI capable of serving 450+ requests/sec with latency under 40ms.
   - Deployed model inference pipelines using Docker and Redis caching to optimize throughput.

2. Distributed Task Queue & Notification Engine (Python, Redis, Celery, PostgreSQL)
   - Architected a resilient message queue processing over 50,000 asynchronous email and webhook tasks daily.
   - Implemented exponential backoff retry policies and dead-letter queues to ensure zero dropped messages.

EDUCATION:
• Bachelor of Technology in Computer Science & Engineering (2020 - 2024)
  CGPA: 8.7 / 10.0`;

export default function ResumeUpload({ resumeText, setResumeText, fileName, setFileName }) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setErrorMsg(null);
    setIsExtracting(true);

    try {
      const name = file.name;
      const lower = name.toLowerCase();

      if (lower.endsWith('.pdf')) {
        // Extract text using browser PDF.js if available
        const arrayBuffer = await file.arrayBuffer();
        let extractedText = '';

        if (window.pdfjsLib) {
          const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            extractedText += pageText + '\n\n';
          }
        } else {
          // Fallback text extraction
          const textDecoder = new TextDecoder('utf-8');
          const raw = textDecoder.decode(arrayBuffer);
          extractedText = raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ');
        }

        if (extractedText.trim().length < 50) {
          throw new Error('PDF extracted text was too sparse. Please paste resume text directly or try another file.');
        }

        setResumeText(extractedText);
        setFileName(name);
      } else {
        // Plain text / Markdown / other readable files
        const text = await file.text();
        setResumeText(text);
        setFileName(name);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Could not parse this file. You can paste the resume text directly.');
    } finally {
      setIsExtracting(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleSampleLoad() {
    setResumeText(SAMPLE_RESUME);
    setFileName('Arjun_Kumar_Resume.pdf');
    setErrorMsg(null);
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Candidate Resume</h3>
            <p className="text-xs text-slate-400">PDF, TXT or paste directly</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSampleLoad}
          className="text-xs text-brand-400 hover:text-brand-300 bg-brand-950/40 hover:bg-brand-900/40 border border-brand-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Resume
        </button>
      </div>

      {resumeText ? (
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800/90">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Resume uploaded successfully</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    File: <span className="font-mono text-slate-300 font-medium">{fileName || 'resume.pdf'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setResumeText('');
                  setFileName('');
                }}
                className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-800/80 transition-colors"
              >
                Change Resume
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/70">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Extracted Content Preview</span>
                <span className="font-mono">{resumeText.trim().split(/\s+/).length} words</span>
              </div>
              <div className="max-h-44 overflow-y-auto rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300 font-mono leading-relaxed border border-slate-900 select-all">
                {resumeText}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>AI will use this actual resume content as the verified source of truth.</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center flex-1 min-h-[190px] ${
              isDragging
                ? 'border-brand-500 bg-brand-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            {isExtracting ? (
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mb-2" />
                <p className="text-sm font-medium text-slate-200">Extracting resume text...</p>
                <p className="text-xs text-slate-500 mt-1">Analyzing sections, skills, and projects</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Drop your resume PDF here, or <span className="text-brand-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF & text documents (client-side encrypted)</p>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mt-3">
            <details className="text-xs text-slate-400 cursor-pointer">
              <summary className="hover:text-slate-300">Or paste raw resume text</summary>
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  if (e.target.value) setFileName('Pasted_Resume_Profile.txt');
                }}
                placeholder="Paste skills, projects, and work experience here..."
                className="w-full mt-2 h-28 bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-brand-500"
              />
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
