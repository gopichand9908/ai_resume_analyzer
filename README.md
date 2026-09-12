# AI Interview Coach

**AI Interview Coach** is a production-ready, local-first interview preparation web application built with **React + Vite + Tailwind CSS** and **Vercel Serverless Functions** (`/api/...`).

It allows candidates to upload their resume (PDF or text) and specify a target Job Description (JD). The AI engine performs deep multi-factor match analysis and conducts a realistic, adaptive interview tailored to the candidate's actual projects, technical skills, and target job requirements.

---

## 🚀 Key Features

1. **Resume-to-JD Match Analysis (`/api/analyze`)**
   - Multi-factor evaluation across required skills, projects, tools, frameworks, and domain relevance.
   - Categorizes skills into **Direct Match**, **Transferable / Partial Match**, and **Missing / Gaps**.
   - Provides clear "Why this score?" reasoning and actionable strategic advice.

2. **Adaptive AI Interview Engine (`/api/interview/start`, `/api/interview/answer`)**
   - Asks **exactly one question at a time**.
   - Dynamically scales difficulty up (architectural/scale trade-offs) for strong answers, or grounds down into fundamentals for weak answers.
   - Conducts **Project Deep Dives** (Levels 1–7: Problem → Tech Stack → Architecture → Contribution → Hard Challenges → Scalability).
   - Verifies technical claims strictly against resume evidence.

3. **Live Coding Round (`/api/interview/coding`)**
   - Split-screen problem view and code editor (Python & JavaScript).
   - Evaluates algorithmic correctness, edge cases, time complexity, and auxiliary space.

4. **HR & Behavioral Round**
   - Role-specific behavioral questions evaluated against the **STAR** (Situation, Task, Action, Result) framework.

5. **Speech Audio Suite (TTS & STT)**
   - **Text-to-Speech (TTS)**: Interviewer reads questions aloud.
   - **Speech-to-Text (STT)**: Microphone voice dictation directly into the answer area.

6. **Comprehensive Performance Report (`/api/interview/final`)**
   - Overall Score (0-100) & Hiring Recommendation (`Strong Hire`, `Hire`, `Borderline`, `Weak Hire`, `Reject`).
   - Category breakdowns: Technical, Coding, Projects, Communication, and HR.
   - Strongest & Weakest skills summary, unverified resume claims list, and failed questions review.
   - Step-by-step prioritized preparation roadmap (**Learn**, **Practice**, **Revise**).
   - One-click PDF export.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: Vercel Serverless Functions (`/api/analyze.js`, `/api/interview/*.js`).
- **AI**: OpenAI API (`gpt-4o-mini`) with high-intelligence heuristic fallback when running offline or without an API key.

---

## 📁 Project Structure

```text
ai-interview-coach/
│
├── api/
│   ├── _lib/
│   │   └── openai.js
│   ├── analyze.js
│   ├── interview/
│   │   ├── start.js
│   │   ├── answer.js
│   │   ├── coding.js
│   │   └── final.js
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── JobDescriptionInput.jsx
│   │   ├── MatchAnalysis.jsx
│   │   ├── InterviewSetup.jsx
│   │   ├── InterviewChat.jsx
│   │   ├── CodingRound.jsx
│   │   ├── HRRound.jsx
│   │   ├── ProgressBar.jsx
│   │   └── FinalReport.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Setup.jsx
│   │   ├── Interview.jsx
│   │   └── Results.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

---

## 💻 Local Setup & Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

*(Note: The app includes intelligent fallback evaluation heuristics so you can test the full flow even without an API key).*

### 3. Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## ☁️ Vercel Deployment Instructions

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: AI Interview Coach complete web app"
   git push origin main
   ```

2. **Import Repository into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository.
   - Framework Preset: **Vite** (Vercel automatically detects `vite`).

3. **Set Environment Variable**:
   - In the project configuration under **Environment Variables**, add:
     - Name: `OPENAI_API_KEY`
     - Value: `your_openai_api_key`

4. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend bundle and deploy `/api` serverless endpoints automatically.

5. **Verify**:
   - Test `/api/analyze` with a sample resume and JD.
   - Run a full adaptive interview cycle to verify questions, coding evaluation, and the final report.

---

## 🔒 Security & Privacy

- `OPENAI_API_KEY` is exclusively accessed server-side inside Vercel serverless functions.
- PDF text extraction runs directly inside the candidate's browser (client-side), with zero permanent server storage of resumes.
- Code submissions are evaluated conceptually without executing arbitrary untrusted code on the server.