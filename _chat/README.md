# Portfolio AI Chat Starter

A minimal starter kit to add an AI chat assistant to your UX portfolio.

This project is designed for UX / product designers who want:
- an AI chat that only talks about **their** work and process  
- a way for recruiters / hiring managers to ask questions without booking a call  
- something they can run on mostly-free tools: **Supabase + Groq + Vercel**

You do **not** need to be a full-stack engineer to use this.  
Think of it as a 4-piece puzzle:

1. Your content → a structured “portfolio knowledge base”
2. Supabase → stores that knowledge
3. This backend → talks to Supabase + Groq
4. The `<AIChat />` widget → you embed it into Framer, Webflow, Next.js, etc.

---

## Tech stack

- **Next.js 16 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres database)
- **Groq** (LLM API)
- **motion** + **lucide-react** for UI animations / icons

---

## 1. Clone the repo

```bash
git clone https://github.com/philllucero/portfolio-ai-chat-starter.git
cd portfolio-ai-chat-starter
npm install

Run locally:

npm run dev

The app should be at http://localhost:3000 with a floating chat button in the bottom-right corner.

⸻

2. Set up Supabase
	1.	Go to supabase.com → create a free project.
	2.	In the Table Editor, create a table named portfolio_knowledge with these columns:

column	type	required
id	bigserial (PK)	yes
project	text	yes
type	text	yes
title	text	no
content	text	yes
participant	text	no
tags	text	no
created_at	timestamptz (default now)	no

	3.	Import your CSV of portfolio content into this table.

(For a deeper guide on structuring your sheet, see Phill’s Notion walkthrough linked from his portfolio.)

⸻

3. Environment variables

Create a .env.local file in the project root:

touch .env.local

Add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key

GROQ_API_KEY=your_groq_api_key

# When deployed on Vercel, set this to the hosted /api/chat URL
# For local testing you can leave it as /api/chat
NEXT_PUBLIC_CHAT_API_URL=/api/chat

	•	NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
→ find these in Supabase → Settings → API.
	•	GROQ_API_KEY
→ from the Groq console.

Restart npm run dev after editing env vars.

⸻

4. What the /api/chat endpoint does

The backend route is in:

app/api/chat/route.ts

High level:
	1.	Receives { message, conversationHistory } from the chat widget.
	2.	Queries portfolio_knowledge in Supabase for relevant rows.
	3.	Sends the question + selected rows to Groq.
	4.	Returns a concise answer back to the widget.

The model is instructed to:
	•	only talk about this portfolio
	•	lean on research → design decisions → outcomes
	•	say “I don’t know” if the info isn’t in the knowledge base

⸻

5. Using the <AIChat /> widget

The chat UI lives in:

components/AIChat.tsx

You can import it and drop it into any page:

import { AIChat } from '../components/AIChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Your portfolio content here */}
      <AIChat endpoint={process.env.NEXT_PUBLIC_CHAT_API_URL ?? '/api/chat'} />
    </main>
  );
}

When you embed this in another project (Framer, Webflow via script, etc.),
point endpoint to your deployed backend:

https://YOUR-VERCEL-PROJECT.vercel.app/api/chat


⸻

6. Deploying to Vercel
	1.	Push this repo to GitHub (already done in Phill’s case).
	2.	Go to vercel.com → New Project → Import from GitHub.
	3.	Select this repo.
	4.	Add these environment variables in Vercel:

	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	GROQ_API_KEY
	•	NEXT_PUBLIC_CHAT_API_URL=https://YOUR-VERCEL-PROJECT.vercel.app/api/chat

	5.	Deploy.

You now have a hosted /api/chat endpoint you can plug into your portfolio.

⸻

7. Credits / support

Built by Phill Lucero
UX designer · creative technologist · AR nerd

https://phill.figma.site

If this starter helps you land interviews or a new role:
	•	⭐ consider starring this repo
	•	connect with me on LinkedIn
	•	or share how you customized it for your own portfolio

I built this because the market is rough, and we all deserve tools that make
our work easier to understand.

---

For the full UX-focused write-up on how this fits into a hiring journey, see:
https://www.linkedin.com/posts/phill-lucero_from-junior-ish-to-hirable-activity-7394586846741078016--Jwt?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAunkrkBZQNshlfXbomQEm1NeDc_mN-bSsE
