# 🧠 Aven AI Support Agent

An AI-powered customer support system for Aven featuring **real-time chat** and **voice Q&A**, built on a RAG (Retrieval-Augmented Generation) pipeline that pulls accurate answers from Aven's official documentation.

> 💡 Projected to **reduce human ticket volume by 25%+** by automatically resolving common inquiries via chat and voice.

---

## ⚙️ Tech Stack

- 🧑‍💻 **Frontend:** Next.js, React, TypeScript  
- 🧠 **AI Backend:** OpenAI GPT-5.2 (Chat Completions + Embeddings)  
- 🧱 **Vector Database:** Pinecone (`@pinecone-database/pinecone`)  
- 🔍 **Web Scraping:** Exa.ai  
- 🗣 **Voice AI:** Vapi (`@vapi-ai/web` SDK + server-side webhook)  
- 📦 **Other Tools:** Tailwind CSS, Zod, Radix UI

---

## ✅ What's Working

- ✅ Scraped articles from `aven.com` (support, reviews, contact, education, etc.)
- ✅ Chunked and embedded article text with `text-embedding-3-small`
- ✅ Uploaded vector embeddings to Pinecone with metadata
- ✅ **Full TypeScript RAG pipeline** — no Python subprocess, all native JS SDKs
- ✅ **Chat UI** — modern bubble-style conversation with typing indicators
- ✅ **Voice Q&A** — Vapi-powered real-time voice agent with live transcript
- ✅ Tabbed interface switching between Chat and Voice modes
- ✅ Vapi webhook (`/api/vapi/webhook`) routes voice function calls through the same RAG backend
- ✅ Metrics dashboard showing response time, auto-resolution rate, and channel count

---

## 🏗 Architecture

```
User (Chat)  ──→  /api/ask  ──→  ragQuery.ts  ──→  Pinecone (semantic search)
                                       │                    ↓
                                       └──→  OpenAI GPT-5.2 (grounded answer)

User (Voice) ──→  Vapi SDK  ──→  Vapi Cloud (STT + TTS)
                                       │
                                       └──→  /api/vapi/webhook
                                                    │
                                                    └──→  ragQuery.ts  ──→  same RAG pipeline
```

---

## 🧠 What I Learned

- Building a full-stack RAG system with OpenAI embeddings + Pinecone vector search
- Integrating Vapi's Web SDK for browser-based voice conversations
- Handling Vapi server-side webhooks and function-call events in Next.js API routes
- Prompt engineering for grounded, context-aware responses
- Converting a Python backend to a unified TypeScript stack
- Managing API authentication and environment variables across multiple services
- Designing a tabbed UI that shares a single RAG backend across chat and voice

---

## 🧾 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/QOOlajide/headstarter-AvenCustomerSupport.git
   cd headstarter-AvenCustomerSupport
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Copy `env.example` to `.env.local` and fill in your keys:
   ```
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=aven-support
   EXA_API_KEY=...
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=...
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000) — chat works immediately, voice requires a Vapi key from [dashboard.vapi.ai](https://dashboard.vapi.ai).

---

## 📁 Key Files

| File | Purpose |
|---|---|
| `src/utils/ragQuery.ts` | TypeScript RAG pipeline (embed → search → GPT-5.2) |
| `src/pages/api/ask.ts` | Chat API endpoint |
| `src/pages/api/vapi/webhook.ts` | Vapi webhook — handles voice function calls |
| `src/hooks/useVapi.ts` | React hook wrapping the Vapi Web SDK |
| `src/components/Chat.tsx` | Chat UI component |
| `src/components/VoiceAgent.tsx` | Voice agent UI with animated mic + live transcript |
| `src/pages/index.tsx` | Main page — tabbed Chat/Voice layout + metrics |
| `exa_scraper/scrape_aven.py` | Exa-based web scraper for Aven docs |
| `exa_scraper/embed_to_pinecone.py` | Chunking + embedding + Pinecone upsert script |

---

## Future Plans

- 🧪 Add evaluation framework to test RAG quality
- 🛠 Refine prompt templates for better contextual understanding
- 🚀 Deploy to Vercel with production Vapi webhook URL
- 📊 Add real-time analytics tracking for ticket resolution rates
