# PrepMate 

> Practice with AI-generated questions, record voice answers, and get instant expert feedback.

---

## Overview

PrepMate is a full-stack AI-powered mock interview platform built with **Next.js 15**. Users create mock interviews by specifying their job role, tech stack, and years of experience. The AI generates tailored questions, the user answers by voice, and AI evaluates each answer with a score and detailed feedback.

The proctored version adds a real-time browser-based AI monitoring layer using TensorFlow.js — detecting phones, multiple faces, and attention loss during the session, with a full integrity report on the feedback page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| AI — Questions and Feedback | Groq API |
| Speech-to-Text | Web Speech API via `react-hook-speech-to-text` |
| Webcam | `react-webcam` |
| Animations | Framer Motion |
| UI Components | Radix UI (Dialog, Collapsible) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Notifications | Sonner |
| Fonts | Bricolage Grotesque, DM Sans (Google Fonts) |

---

## Project Structure

```
prepmate/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.jsx              # Clerk sign-in with 60% image panel
│   │   └──
 sign-up/[[...sign-up]]/
│   │       └── page.jsx              # Clerk sign-up with 60% image panel
│   ├── dashboard/
│   │   ├── _components/
│   │   │   ├── Header.jsx            # Sticky nav bar
│   │   │   ├── AddNewInterview.jsx   # Create interview dialog
│   │   │   ├── InterviewList.jsx     # Past interviews grid
│   │   │   └── InterviewItemCard.jsx # Single interview card
│   │   ├── interview/
│   │   │   └── [interviewId]/
│   │   │       ├── page.jsx          # Pre-interview: details + camera
│   │   │       ├── start/
│   │   │       │   ├── page.jsx      # Live interview session
│   │   │       │   └── _components/
│   │   │       │       ├── QuestionsSection.jsx
│   │   │       │       └── RecordAnswerSection.jsx
│   │   │       │
│   │   │       └── feedback/
│   │   │           └── page.jsx      # Results
│   │   ├── layout.jsx                # Dashboard shell with header
│   │   └── page.jsx                  # Dashboard home
│   ├── globals.css                   # Design tokens + utility classes
│   ├── layout.js                     # Root layout with Clerk + Toaster
│   └── page.js                       # Public landing page
├── components/
│   └── ui/
│       ├── button.jsx
│       ├── dialog.jsx
│       ├── collapsible.jsx
│       └── drawer.jsx
├── utils/
│   ├── db.js                         # Drizzle + Neon connection
│   ├── schema.js                     # Database table definitions
│   └── GroqAIModel.js                # Groq chat wrapper function
│
├── drizzle/                          # SQL migration files
├── middleware.js                     # Clerk route protection
├── drizzle.config.js
├── next.config.mjs
└── package.json
```

---

## Database Schema

### `mockInterview`

| Column | Type | Description |
|---|---|---|
| `id` | serial PK | Auto-increment primary key |
| `mockId` | varchar | UUID used in page URLs |
| `jobPosition` | varchar | Job role entered by the user |
| `jobDesc` | varchar | Tech stack or job description |
| `jobExperience` | varchar | Years of experience |
| `jsonMockResp` | text | JSON array of `{question, answer}` pairs from AI |
| `createdBy` | varchar | User email address |
| `createdAt` | varchar | Creation timestamp string |

### `userAnswer`

| Column | Type | Description |
|---|---|---|
| `id` | serial PK | Auto-increment primary key |
| `mockIdRef` | varchar | References `mockInterview.mockId` |
| `question` | varchar | The question text |
| `correctAns` | text | AI-generated ideal answer |
| `userAns` | text | Transcribed user answer |
| `feedback` | text | AI feedback text |
| `rating` | varchar | Numeric rating 1–10 |
| `userEmail` | varchar | User email address |
| `createdAt` | varchar | Answer submission timestamp |

> **Note:** Proctoring data is stored in `sessionStorage` under the key `proctor_{interviewId}` and read on the feedback page. It is not persisted to the database and is cleared when the browser tab closes.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Clerk account
- A Neon database
- A Groq API key

### 1. Clone and install

```bash
git clone <your-repo-url>
cd prepmate
npm install
```


### 2. Set up environment variables

Copy the example below into a new `.env.local` file in the project root and fill in your keys.

### 3. Push the database schema

```bash
npm run db:push
```

This creates the `mockInterview` and `userAnswer` tables in your Neon database.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create `.env.local` in the project root:

```env
# ── Clerk Authentication ──────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ── Neon PostgreSQL ───────────────────────────────────
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://user:password@host/dbname

# ── Groq AI ───────────────────────────────────────────
NEXT_PUBLIC_GROQ_API_KEY=gsk_...

# ── App Settings ─────────────────────────────────────
NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=5
NEXT_PUBLIC_INFORMATION=Enable your camera and microphone before starting.
NEXT_PUBLIC_QUESTION_NOTE=Answer each question naturally and clearly.
```

### Where to get each key

| Key | Source |
|---|---|
| `CLERK_*` | [clerk.com](https://clerk.com) → Create application → API Keys |
| `DRIZZLE_DB_URL` | [neon.tech](https://neon.tech) → Project → Connection string (pooled) |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys |
---

## Pages and Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing page | No |
| `/sign-in` | Clerk sign-in with image panel | No |
| `/sign-up` | Clerk sign-up with image panel | No |
| `/dashboard` | Home — new interview card + past interviews grid | Yes |
| `/dashboard/interview/[id]` | Pre-interview — details, tips, camera enable | Yes |
| `/dashboard/interview/[id]/start` | Live interview — questions, voice recording | Yes |
| `/dashboard/interview/[id]/feedback` | Results — score rings, proctoring report, Q&A feedback | Yes |

All `/dashboard/*` routes are protected by Clerk middleware in `middleware.js`.

---

## Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start the production server
npm start

# Push schema changes to the Neon database
npm run db:push

# Open Drizzle Studio — visual database browser
npm run db:studio

# Lint the codebase
npm run lint
```

---

