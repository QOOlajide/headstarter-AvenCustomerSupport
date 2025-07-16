import { useState } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { sender: 'You', text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })

    const data = await res.json()
    const botMessage = { sender: 'Aven AI', text: data.answer || 'No response.' }
    setMessages((prev) => [...prev, botMessage])
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">💬 Aven AI Support Agent</h1>

      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
            <span className="font-semibold">{msg.sender}: </span>
            {msg.text}
          </div>
        ))}
        {loading && <div>Typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  )
}
