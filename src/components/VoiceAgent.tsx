/**
 * VoiceAgent — Real-time voice Q&A powered by Vapi + Aven RAG
 *
 * Features:
 *   • One-tap mic button to start/stop a voice call
 *   • Animated pulse ring while the assistant is speaking
 *   • Live transcript feed during the conversation
 *   • Volume-reactive indicator
 */

import { useVapi, TranscriptEntry } from "@/hooks/useVapi";
import { useEffect, useRef } from "react";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";

export default function VoiceAgent() {
  const { start, stop, isConnected, isSpeaking, transcript, volumeLevel } =
    useVapi({ publicKey: VAPI_PUBLIC_KEY });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* ---- Mic button with pulse animation ---- */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings (visible when connected) */}
        {isConnected && (
          <>
            <span
              className="absolute rounded-full bg-indigo-400 opacity-20 animate-ping"
              style={{
                width: `${100 + volumeLevel * 60}px`,
                height: `${100 + volumeLevel * 60}px`,
              }}
            />
            <span
              className="absolute rounded-full bg-indigo-400 opacity-10 animate-pulse"
              style={{
                width: `${120 + volumeLevel * 80}px`,
                height: `${120 + volumeLevel * 80}px`,
              }}
            />
          </>
        )}

        <button
          onClick={isConnected ? stop : start}
          disabled={!VAPI_PUBLIC_KEY}
          className={`
            relative z-10 w-20 h-20 rounded-full flex items-center justify-center
            text-white text-3xl shadow-lg transition-all duration-300
            ${
              !VAPI_PUBLIC_KEY
                ? "bg-gray-400 cursor-not-allowed"
                : isConnected
                ? "bg-red-500 hover:bg-red-600 scale-110"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
            }
          `}
          title={
            !VAPI_PUBLIC_KEY
              ? "Set NEXT_PUBLIC_VAPI_PUBLIC_KEY to enable voice"
              : isConnected
              ? "End voice call"
              : "Start voice call"
          }
        >
          {isConnected ? (
            /* Stop icon */
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            /* Mic icon */
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" />
              <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V21h-2a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.07A7 7 0 0 0 19 11Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Status label */}
      <p className="text-sm font-medium text-gray-500">
        {!VAPI_PUBLIC_KEY
          ? "⚠️ Voice disabled — VAPI key not set"
          : isConnected
          ? isSpeaking
            ? "🔊 Assistant speaking…"
            : "🎙️ Listening…"
          : "Tap the mic to start a voice conversation"}
      </p>

      {/* ---- Live transcript ---- */}
      {transcript.length > 0 && (
        <div
          ref={scrollRef}
          className="w-full max-h-72 overflow-y-auto rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3"
        >
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
            Live Transcript
          </h3>
          {transcript.map((entry: TranscriptEntry, i: number) => (
            <div
              key={i}
              className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                  ${
                    entry.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                  }
                `}
              >
                {entry.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
