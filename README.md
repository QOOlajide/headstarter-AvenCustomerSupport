# 🧠 Aven AI Support Agent

An AI-powered support assistant that answers questions about Aven using scraped documentation, semantic search, and conversational UI.

> 💡 **Goal:** Create a full-stack RAG (Retrieval-Augmented Generation) system that pulls accurate answers from Aven’s official documentation and returns them to users via chat.

---

## ⚙️ Tech Stack

- 🧑‍💻 **Frontend:** Next.js, React, TypeScript  
- 🧠 **AI Backend:** Python, OpenAI (Chat + Embeddings)  
- 🧱 **Vector Database:** Pinecone  
- 🔍 **Web Scraping:** Exa.ai  
- 📦 **Other Tools:** dotenv, Playwright, Vercel/Render (deployment in progress)

---

## ✅ What’s Working

- ✅ Scraped articles from `aven.com` (support, reviews, contact, education, etc.)
- ✅ Chunked and embedded article text with `text-embedding-3-small`
- ✅ Uploaded vector embeddings to Pinecone with metadata
- ✅ CLI-based interaction allows meaningful back-and-forth with the AI
- ✅ Frontend chat interface is wired and functional (input works, send button works)

---

## 🧠 What I Learned

- Prompt engineering for grounded, context-aware responses
- Managing API authentication and environment variables
- Connecting OpenAI + Pinecone for question answering
- Chunking large text into searchable embeddings
- Debugging frontend/backend integration in real time
- Importance of not deleting key folders (`/app` 😅)

---

## ⚠️ Known Limitations

- ❌ Chat UI looks basic (needs styling improvements)
- ❌ Some answers default to “I'm not sure…” even when relevant info exists
- ❌ Frontend doesn’t fully reflect the backend's AI capabilities
- ❌ Large local files (like `venv`) caused GitHub push issues

---

## 🔮 Future Plans

- 🗣 Integrate **Vapi** for voice-based support agent
- 🎨 Redesign the UI for a more professional, user-friendly look
- 🧪 Add evaluation framework to test RAG quality
- 🛠 Refine prompt templates for better contextual understanding
- 🤖 Experiment with OpenAI function calling for multi-modal workflows

---

## 🪞 Reflection

This project taught me a **lot** — from working with real data and APIs to handling integration issues between services. While I didn’t fully complete the frontend → backend connection, I:

- Built a working RAG CLI using real documentation
- Learned how to chunk, embed, and store vectorized data
- Used Pinecone for search and OpenAI to reason over it
- Proved that I can troubleshoot across the full stack

> 🛠 This isn’t the end — just the beginning. Stay tuned for a voice-based upgrade!

---

## 🧾 Getting Started (Coming Soon)

---

