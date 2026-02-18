/**
 * /api/vapi/webhook — Vapi server-side webhook handler
 *
 * Vapi calls this endpoint during a voice conversation when it needs to
 * execute a tool / function.  We handle the `function-call` event by
 * running the same RAG pipeline used for text chat, so voice and chat
 * answers stay consistent.
 *
 * Vapi webhook event types handled:
 *   • status-update  — log call lifecycle
 *   • transcript     — log real-time transcript
 *   • function-call  — execute queryAvenKnowledgeBase → RAG → return answer
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

  if (!message) {
    return res.status(400).json({ error: "Missing message payload" });
  }

  switch (message.type) {
    /* ---- Call lifecycle events (logged server-side) ---- */
    case "status-update": {
      const call = message.call ?? {};
      console.log(`[Vapi] Call ${call.id}: ${call.status}`);
      return res.status(200).json({ received: true });
    }

    /* ---- Real-time transcript (logged server-side) ---- */
    case "transcript": {
      console.log(`[Vapi transcript] ${message.role}: ${message.transcript}`);
      return res.status(200).json({ received: true });
    }

    /* ---- Function call → route to our RAG pipeline ---- */
    case "function-call": {
      const { functionCall } = message;
      if (!functionCall) {
        return res.status(400).json({ error: "Missing functionCall in message" });
      }

      if (functionCall.name === "queryAvenKnowledgeBase") {
        const question =
          functionCall.parameters?.question ?? functionCall.parameters?.query ?? "";

        if (!question) {
          return res.json({
            result: "I didn't catch that. Could you please repeat your question?",
          });
        }

        try {
          const answer = await queryAvenRAG(question);
          return res.json({ result: answer });
        } catch (err) {
          console.error("[Vapi webhook] RAG error:", err);
          return res.json({
            result:
              "I'm having trouble looking that up right now. Please try again in a moment.",
          });
        }
      }

      // Unknown function
      return res.status(400).json({ error: `Unknown function: ${functionCall.name}` });
    }

    default:
      return res.status(200).json({ received: true });
  }
}
