'use client'
import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AskAI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? 'Sorry, something went wrong.' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes ask-ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
          50% { box-shadow: 0 0 18px 4px rgba(255,255,255,0.18); }
        }
        .ask-ai-tab {
          animation: ask-ai-pulse 4.5s ease-in-out infinite;
        }
        .ask-ai-panel-enter {
          transform: translateX(100%);
        }
        .ask-ai-panel-enter-active {
          transform: translateX(0%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* Side tab — hidden while panel is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask AI"
          className="ask-ai-tab fixed right-0 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-center gap-3 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 border-r-0 rounded-l-2xl py-5 px-2.5"
        >
          <span
            className="text-[10px] tracking-[0.25em] text-zinc-300 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            PULL TO ASK AI
          </span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[85]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Chat panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-zinc-950 border-l border-zinc-800 z-[90] flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <p className="font-display text-xl font-light text-white">Ask AI</p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-zinc-500 text-sm leading-relaxed">
              Ask me anything about our inventory, pricing, or Automotive Hub.
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'self-end bg-white text-black'
                  : 'self-start bg-zinc-800 text-zinc-100'
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="self-start bg-zinc-800 text-zinc-400 rounded-2xl px-4 py-3 text-sm">
              Typing...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-white text-black text-xs tracking-widest px-5 py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            SEND
          </button>
        </div>
      </div>
    </>
  )
}