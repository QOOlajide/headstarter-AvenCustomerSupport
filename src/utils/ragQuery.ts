/**
 * ragQuery.ts — TypeScript RAG (Retrieval-Augmented Generation) pipeline
 *
 * Replaces the Python query_aven.py logic:
 *   1. Embed the user's question via OpenAI text-embedding-3-small
 *   2. Semantic search against Pinecone for top-k context chunks
 *   3. Prompt GPT-3.5-turbo with retrieved context to produce a grounded answer
 */

import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

/* ------------------------------------------------------------------ */
/*  Clients (lazy-initialised so env vars are read at call-time)       */
/* ------------------------------------------------------------------ */

let _openai: OpenAI | null = null;
let _pinecone: Pinecone | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _openai;
}

function getPineconeIndex() {
  if (!_pinecone) {
    _pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  }
  return _pinecone.index(process.env.PINECONE_INDEX_NAME!);
}

/* ------------------------------------------------------------------ */
/*  Core RAG function                                                  */
/* ------------------------------------------------------------------ */

export async function queryAvenRAG(question: string): Promise<string> {
  const openai = getOpenAI();
  const index = getPineconeIndex();

  // 1. Generate embedding for the user question
  const embeddingRes = await openai.embeddings.create({
    input: [question],
    model: "text-embedding-3-small",
  });
  const queryVector = embeddingRes.data[0].embedding;

  // 2. Semantic search in Pinecone (top 5 chunks)
  const searchResult = await index.query({
    vector: queryVector,
    topK: 5,
    includeMetadata: true,
  });

  // 3. Extract context snippets from metadata
  const contexts = (searchResult.matches ?? [])
    .map((m) => (m.metadata as Record<string, string>)?.text ?? "")
    .filter(Boolean);
  const context = contexts.join("\n\n");

  // 4. Build the grounded prompt
  const systemPrompt = [
    "You are Aven's official AI support assistant.",
    "Answer the user's question ONLY using the documentation context below.",
    "If the answer is not clearly found in the context, respond: \"I'm not sure based on the current information. Please contact Aven support for further help.\"",
    "Be clear, concise, and professional.",
  ].join(" ");

  // 5. Chat completion
  const chatRes = await openai.chat.completions.create({
    model: "gpt-5.2",
    temperature: 0.3,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  return chatRes.choices[0]?.message?.content?.trim() ?? "No response generated.";
}
