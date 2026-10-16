"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Send, User, MessageSquare, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { INPUT_PLACEHOLDER, SUGGESTED_PROMPTS } from "@/data/chatbot-context";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage } = useChat();
  const reducedMotion = useReducedMotion();
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [messages, isLoading, isOpen, reducedMotion]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const closeChat = () => {
    setIsOpen(false);
    launcherRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 left-3 z-50 md:bottom-5 md:left-5">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="portfolio-assistant"
            role="dialog"
            aria-labelledby="portfolio-assistant-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                closeChat();
              }
            }}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            className="absolute bottom-14 left-0 flex max-h-[calc(100svh-7rem)] w-[calc(100vw-1.5rem)] max-w-96 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="size-4 text-text-secondary" aria-hidden="true" />
                <div>
                  <div id="portfolio-assistant-title" className="text-sm font-semibold text-foreground">Ask about Tanmay</div>
                  <div className="mt-0.5 text-xs text-text-secondary">AI assistant for my work and projects</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeChat} aria-label="Close assistant">
                <X aria-hidden="true" />
              </Button>
            </div>

            <div ref={messagesRef} className="h-72 min-h-0 space-y-3 overflow-y-auto overscroll-contain p-4" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text">
              {messages.length === 0 && (
                <div className="py-3">
                  <p className="text-sm leading-relaxed text-text-secondary">
                    Curious about a project or how I work? Start here.
                  </p>
                  <div className="mt-4 flex flex-col items-start gap-2">
                    {SUGGESTED_PROMPTS.map((question) => (
                      <Button
                        key={question}
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => { setInput(""); sendMessage(question); }}
                        className="h-auto whitespace-normal px-3 py-2 text-left text-xs leading-relaxed"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={index} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <Bot className="mt-2 size-4 shrink-0 text-text-secondary" aria-hidden="true" />
                  )}
                  <div className={`max-w-[85%] rounded-xl border px-3 py-2 text-sm ${message.role === "user" ? "rounded-br-sm border-transparent bg-foreground text-background" : "rounded-bl-sm border-border bg-surface-hover text-foreground"}`}>
                    {message.role === "user" ? message.content : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          ul: ({ children }) => <ul className="my-1 list-inside list-disc space-y-0.5">{children}</ul>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          code: ({ children }) => <code className="rounded bg-foreground/10 px-1 font-mono text-xs">{children}</code>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                  {message.role === "user" && <User className="mt-2 size-4 shrink-0 text-text-secondary" aria-hidden="true" />}
                </div>
              ))}

              {isLoading && <p role="status" className="pl-6 text-xs text-text-secondary">Writing a reply…</p>}
            </div>

            <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-border p-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={INPUT_PLACEHOLDER}
                aria-label="Your question about Tanmay"
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="size-10" aria-label="Send question">
                <Send aria-hidden="true" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        ref={launcherRef}
        variant="outline"
        onClick={() => { if (isOpen) closeChat(); else setIsOpen(true); }}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "portfolio-assistant" : undefined}
        className="h-10 gap-2 rounded-full bg-background/95 px-3.5 text-xs text-foreground shadow-sm backdrop-blur-md sm:h-11 sm:px-4 sm:text-sm dark:bg-background/95"
      >
        {isOpen ? <X aria-hidden="true" /> : <MessageSquare aria-hidden="true" />}
        {isOpen ? "Close assistant" : "Ask about my work"}
      </Button>
    </div>
  );
}
