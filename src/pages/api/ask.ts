/**
 * /api/ask — Chat endpoint for the Aven AI Support Agent
 *
 * Accepts { message: string } and returns { answer: string }
 * Uses the TypeScript RAG pipeline (OpenAI + Pinecone) directly —
 * no Python subprocess needed.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { queryAvenRAG } from "@/utils/ragQuery";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'message' in request body" });
  }

  try {
    const answer = await queryAvenRAG(message);
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("[/api/ask] RAG query failed:", err);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
}
