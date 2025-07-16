#🧠 Aven AI Support Agent#
This project is an AI-powered support agent that answers user questions about the company Aven using scraped web data, embeddings, and a conversational UI.

🔍 Goal: Build an end-to-end workflow where a user can type a question into a web interface and receive an intelligent answer grounded in Aven’s real documentation.

⚙️ Tech Stack
Frontend: React + Next.js + TypeScript

Backend API: Python + FastAPI

AI: OpenAI (Embeddings + Chat Completion)

RAG Pipeline: Pinecone (vector DB) + Exa.ai (scraper)

Other Tools: dotenv, Playwright, Vercel/Render (planned)

✅ What’s Working
Web scraping with Exa.ai from Aven's public pages (support, education, contact, reviews, etc.)

Chunking and embedding article content with OpenAI

Uploading and retrieving vectors using Pinecone

CLI-based interaction that returns relevant answers from the embedded docs

Full-stack skeleton with a working frontend UI

Functional Send button on the chat interface

🧠 What I Learned
Prompt engineering for retrieval-augmented generation (RAG)

Structuring and embedding scraped data for semantic search

Connecting vector databases with OpenAI for context-aware answers

Managing errors in real-time scraping and embedding pipelines

Full-stack troubleshooting across API routes and frontend components

Why meaningful UI design matters for end-user trust

⚠️ Known Limitations
❌ Frontend chat UI is functional but lacks refined design and fails to display accurate AI responses

❌ Some queries result in fallback responses like “I'm not sure based on the current information” even when relevant data exists

❌ One early mistake — deleting the /app directory — set back the UI implementation

🛠️ Future Plans
Integrate Vapi to support voice-based AI interaction

Refactor frontend for improved UX and styling

Improve context window and embedding quality

Add feedback loop or evaluation set to test RAG accuracy

Switch to OpenAI function calling for dynamic tool usage (e.g., scheduling callbacks)

🎯 Reflection
This was a challenging but rewarding project. Despite UI hurdles and integration bugs, I gained practical experience in:

Connecting large language models to structured data

Deploying embeddings to Pinecone and using them for similarity search

Building a pipeline from web scraping → embeddings → chat assistant

I’ve now laid the foundation for a smarter support assistant — and I'm excited to rebuild with improved design, voice capabilities, and tighter integration.

🧾 Getting Started (coming soon...)
