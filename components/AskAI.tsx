'use client'
import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const PANEL_MAX_WIDTH = 380
const PANEL_MAX_HEIGHT = 560
const OPEN_THRESHOLD_RATIO = 0.3 // drag past 30% of panel width to snap open

export default function AskAI() {
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // --- drag-to-reveal state ---
  const [panelWidth, setPanelWidth] = useState(320)
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState(0) // 0 = hidden, panelWidth = fully revealed
  const startXRef = useRef(0)
  const hasDraggedRef = useRef(false)

  useEffect(() => {
    const updateWidth = () => setPanelWidth(Math.min(window.innerWidth * 0.92, PANEL_MAX_WIDTH))
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (open) return // already open, tab is hidden anyway
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    startXRef.current = e.clientX
    hasDraggedRef.current = false
    setDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const delta = startXRef.current - e.clientX // dragging left = positive
    if (Math.abs(delta) > 4) hasDraggedRef.current = true
    setDragX(Math.min(Math.max(delta, 0), panelWidth))
  }

  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)
    const shouldOpen = dragX > panelWidth * OPEN_THRESHOLD_RATIO
    setOpen(shouldOpen)
    setDragX(0)
  }

  // Keyboard accessibility fallback — ignores the synthetic click
  // that fires after a real drag, only reacts to genuine keyboard activation
  const handleTabClick = () => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false
      return
    }
    setOpen(true)
  }

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

  const isPanelVisible = open || dragging

  return (
    <>
      <style>{`
        @keyframes ask-ai-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
          50% { box-shadow: 0 0 18px 4px rgba(255,255,255,0.18); }
        }
        .ask-ai-tab {
          animation: ask-ai-pulse 4.5s ease-in-out infinite;
          touch-action: none;
        }
      `}</style>

      {/* Side tab — swipe/drag it left to reveal the panel */}
      {!open && (
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleTabClick}
          aria-label="Ask AI — swipe to open"
          className="ask-ai-tab fixed right-0 top-1/2 -translate-y-1/2 z-[80] flex flex-col items-center gap-3 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/50 border-r-0 rounded-l-2xl py-5 px-2.5 cursor-grab active:cursor-grabbing"
        >
          <span
            className="text-[10px] tracking-[0.25em] text-zinc-300 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            PULL TO ASK AI
          </span>
        </button>
      )}

      {/* Backdrop — only when fullscreen */}
      {open && maximized && (
        <div className="fixed inset-0 bg-black/60 z-[85]" onClick={closePanel} />
      )}

      {/* Chat panel */}
      {isPanelVisible && (
        <div
          className={`fixed z-[90] bg-zinc-950 border border-zinc-800 flex flex-col ${
            maximized ? 'inset-0 rounded-none' : 'bottom-5 right-5 rounded-2xl shadow-2xl'
          }`}
          style={
            maximized
              ? { transition: dragging ? 'none' : 'all 300ms cubic-bezier(0.34, 1.2, 0.64, 1)' }
              : {
                  width: panelWidth,
                  height: Math.min(window.innerHeight * 0.75, PANEL_MAX_HEIGHT),
                  transform: dragging
                    ? `translateX(${panelWidth - dragX}px)`
                    : open
                    ? 'translateX(0px)'
                    : `translateX(${panelWidth + 24}px)`,
                  transition: dragging
                    ? 'none'
                    : 'transform 380ms cubic-bezier(0.34, 1.35, 0.64, 1)',
                }
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