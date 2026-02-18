/**
 * Chat — Real-time text chat with Aven's AI support agent
 *
 * Sends messages to /api/ask (TS RAG pipeline → OpenAI + Pinecone)
 * and renders a modern bubble-style conversation.
 */

import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "assistant";
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      const botMsg: Message = {
        sender: "assistant",
        text: data.answer || "I'm not sure how to answer that. Please try rephrasing.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ---- Message area ---- */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 p-4 min-h-[320px] max-h-[480px]"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12a8.25 8.25 0 1 1 16.5 0 8.25 8.25 0 0 1-16.5 0Z" />
            </svg>
            <p className="text-sm">Ask Aven AI anything about their products & services</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
              <span className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ---- Input bar ---- */}
      <div className="border-t border-gray-200 bg-white p-3 flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     placeholder:text-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question…"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
