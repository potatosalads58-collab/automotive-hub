'use client'
import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AskAI() {
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open && maximized) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, maximized])

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

  const closePanel = () => {
    setOpen(false)
    setMaximized(false)
  }

  return (
    <>
      <style>{`
        @keyframes hint-bar-pulse {
          0%, 82%, 100% { opacity: 0.3; box-shadow: none; transform: scaleY(1); }
          90% { opacity: 1; box-shadow: 0 0 14px 3px rgba(255,255,255,0.55); transform: scaleY(1.15); }
        }
        @keyframes hint-label-pulse {
          0%, 80%, 100% { opacity: 0; transform: translateX(4px); }
          88% { opacity: 1; transform: translateX(0px); }
          95% { opacity: 0; transform: translateX(4px); }
        }
        .hint-bar { animation: hint-bar-pulse 6.5s ease-in-out infinite; }
        .hint-label { animation: hint-label-pulse 6.5s ease-in-out infinite; }
      `}</style>

      {/* Quiet hint — a thin line that glows briefly every ~6.5s */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask AI"
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[80] flex items-center gap-2 py-6 pl-3 pr-1.5"
        >
          <span className="hint-label text-[9px] tracking-[0.2em] text-zinc-400 whitespace-nowrap">
            pull to ask ai
          </span>
          <span className="hint-bar block w-[3px] h-16 rounded-full bg-white" />
        </button>
      )}

      {/* Backdrop — only when fullscreen */}
      {open && maximized && (
        <div className="fixed inset-0 bg-black/60 z-[85]" onClick={closePanel} />
      )}

      {/* Chat panel — opens with a soft scale/fade, not a drag */}
      {open && (
        <div
          className={`fixed z-[90] bg-zinc-950 border border-zinc-800 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            maximized
              ? 'inset-0 rounded-none opacity-100 scale-100'
              : 'bottom-5 right-5 rounded-2xl shadow-2xl opacity-100 scale-100'
          }`}
          style={
            maximized
              ? undefined
              : { width: 'min(90vw, 340px)', height: 'min(70vh, 500px)' }
          }
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <p className="font-display text-lg font-light text-white">Automotive Hub Assistant</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMaximized(!maximized)}
                aria-label={maximized ? 'Minimize' : 'Maximize'}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                {maximized ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                )}
              </button>
              <button
                onClick={closePanel}
                aria-label="Close"
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>
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
      )}
    </>
  )
}