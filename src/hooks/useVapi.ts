/**
 * useVapi — React hook wrapping the @vapi-ai/web SDK
 *
 * Provides:
 *   • start / stop helpers
 *   • live connection & speaking state
 *   • real-time transcript array
 *   • volume level (for visualisations)
 *
 * The assistant is configured as a *transient* assistant so everything
 * lives in code — no Vapi dashboard setup required.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";

export interface TranscriptEntry {
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface UseVapiOptions {
  publicKey: string;
  assistantId?: string;
}

export function useVapi({ publicKey, assistantId }: UseVapiOptions) {
  const vapiRef = useRef<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);

  /* ---- Initialise Vapi instance once ---- */
  useEffect(() => {
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      console.log("[Vapi] Call started");
      setIsConnected(true);
    });

    vapi.on("call-end", () => {
      console.log("[Vapi] Call ended");
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    vapi.on("volume-level", (level: number) => setVolumeLevel(level));

    vapi.on("message", (msg: Record<string, unknown>) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: msg.role as "user" | "assistant",
            text: msg.transcript as string,
            timestamp: Date.now(),
          },
        ]);
      }
    });

    vapi.on("error", (err: unknown) => {
      console.error("[Vapi] Error:", err);
    });

    return () => {
      vapi.stop();
      vapiRef.current = null;
    };
  }, [publicKey]);

  /* ---- Start call ---- */
  const start = useCallback(() => {
    if (!vapiRef.current) return;

    setTranscript([]);

    if (assistantId) {
      // Use a pre-built assistant from the Vapi dashboard
      vapiRef.current.start(assistantId);
    } else {
      // Transient assistant — fully defined in code
      vapiRef.current.start({
        name: "Aven Support Agent",
        firstMessage:
          "Hi! I'm Aven's AI support assistant. How can I help you today?",
        model: {
          provider: "openai",
          model: "gpt-5.2",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: [
                "You are Aven's official AI support assistant.",
                "You help users with questions about Aven's products and services.",
                "When you need to look up information, use the queryAvenKnowledgeBase function.",
                "Be concise — keep answers under 3 sentences when possible.",
                "If you are unsure, say so honestly and suggest contacting Aven support.",
              ].join(" "),
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "queryAvenKnowledgeBase",
                description:
                  "Search the Aven knowledge base to answer a customer question. Use this whenever the user asks about Aven products, services, policies, or account information.",
                parameters: {
                  type: "object",
                  properties: {
                    question: {
                      type: "string",
                      description: "The user's question to search for in the knowledge base",
                    },
                  },
                  required: ["question"],
                },
              },
            } as never,
          ],
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM", // "Rachel" — natural-sounding default
        },
        serverUrl:
          typeof window !== "undefined"
            ? `${window.location.origin}/api/vapi/webhook`
            : "/api/vapi/webhook",
      } as never);
    }
  }, [assistantId]);

  /* ---- Stop call ---- */
  const stop = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  return {
    start,
    stop,
    isConnected,
    isSpeaking,
    transcript,
    volumeLevel,
  };
}
