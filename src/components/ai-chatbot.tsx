"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@/hooks/use-chat";
import { SplineCharacter } from "./spline-character";
import { INPUT_PLACEHOLDER, SUGGESTED_PROMPTS } from "@/data/chatbot-context";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // set while/just-after a drag so the release tap doesn't open the chat
  const wasDragging = useRef(false);

  // Pikachu plays its reaction animation while the bot is typing or on hover
  const charState = isLoading || hovering ? "talking" : "idle";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50"
      style={{ pointerEvents: "auto" }}
      drag={!isOpen}
      dragMomentum={false}
      dragElastic={0}
      whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      onDragStart={() => {
        wasDragging.current = true;
      }}
      onDragEnd={() => {
        // keep the flag set briefly so the release tap is swallowed
        setTimeout(() => {
          wasDragging.current = false;
        }, 120);
      }}
      onTap={() => {
        // a drag just happened → don't open; only a clean tap opens
        if (wasDragging.current) return;
        if (!isOpen) setIsOpen(true);
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 left-0 w-80 sm:w-96 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            style={{ backgroundColor: "var(--background)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ backgroundColor: "var(--background)" }}>
              <div className="flex items-center gap-2">
                <SplineCharacter state={isLoading ? "talking" : "idle"} size={52} compact />
                <div>
                  <div className="text-sm font-semibold text-foreground">Ask Pikachu about Tanmay</div>
                  <div className="text-[10px] text-text-secondary">
                    {isLoading ? "typing…" : "AI-powered assistant"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-surface-hover flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-3">
                    <SplineCharacter state="idle" size={130} />
                  </div>
                  <p className="text-sm text-text-secondary">
                    Ask about Tanmay&apos;s projects, stack, philosophy, or the Odoo 17 cutover.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                    {SUGGESTED_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(""); sendMessage(q); }}
                        className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="shrink-0 mt-0.5">
                      <SplineCharacter state="idle" size={24} compact />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm border ${
                      msg.role === "user"
                        ? "bg-accent text-black rounded-br-sm border-transparent"
                        : "text-foreground rounded-bl-sm border-border"
                    }`}
                    style={
                      msg.role === "assistant"
                        ? { backgroundColor: "var(--surface-hover)", backdropFilter: "blur(8px)" }
                        : undefined
                    }
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-accent">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          code: ({ children }) => <code className="bg-black/20 px-1 rounded text-xs font-mono">{children}</code>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3 text-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="shrink-0 mt-0.5">
                    <SplineCharacter state="talking" size={24} compact />
                  </div>
                  <div className="px-3 py-2 rounded-xl rounded-bl-sm border border-border" style={{ backgroundColor: "var(--surface-hover)" }}>
                    <motion.div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-text-secondary"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={INPUT_PLACEHOLDER}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent text-black hover:bg-accent-hover transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — character avatar (drag the whole widget to reposition) */}
      <button
        onClick={() => {
          // when open, drag is disabled so this click fires normally → close.
          // when closed, framer's drag suppresses this; container onTap opens.
          if (isOpen) setIsOpen(false);
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative focus:outline-none transition-transform hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Chat with Tanmay's AI"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-xl shadow-black/30"
            >
              <X className="w-5 h-5 text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="character"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <SplineCharacter state={charState} size={96} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}
