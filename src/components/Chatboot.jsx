import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

const WEBHOOK_URL = "https://hook.eu1.make.com/e45kq4zc7creuxjtjgk0b6ok9uryct1m";

const INITIAL_MESSAGE = {
  id: "init",
  sender: "bot",
  text: "Hey there! 👋 I'm the **Notionnik AI Assistant**.\n\nI help you explore our Notion workspaces and automation services. What business challenge can I help you solve today?",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const QUICK_REPLIES = [
  "What services do you offer?",
  "How much does it cost?",
  "Book a free call",
];

export default function NotionnikChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasUnread(false);
    }
  }, [isOpen]);

  const addMessage = useCallback((msg) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { ...msg, id: Date.now(), time }]);
  }, []);

  const handleSend = async (overrideText) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isSending) return;

    setInput("");
    addMessage({ sender: "user", text: trimmed });
    setIsSending(true);

    try {
      const conversationHistory = [
        ...messages,
        { sender: "user", text: trimmed },
      ].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          conversation: conversationHistory,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const botReply = await response.text();

      addMessage({
        sender: "bot",
        text: botReply?.trim() || "I'll have someone from our team follow up shortly!",
      });

      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error("ChatBot error:", err);
      addMessage({
        sender: "bot",
        text: "Oops! Something went wrong. Please try again or book a free call directly.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[350px] md:w-[400px] h-[70vh] sm:h-[500px] md:h-[700px] bg-zinc-900 border border-zinc-700/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-base shadow-lg shadow-violet-900/40 shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight tracking-tight">
                  Notionnik AI
                </p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Online · replies instantly
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center text-sm"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 sm:gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                    msg.sender === "user"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-bl-sm"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-violet-300 prose-a:text-violet-300">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {isSending && (
              <div className="flex items-start">
                <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && !isSending && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2 shrink-0">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => handleSend(qr)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-violet-500 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-zinc-800 bg-zinc-950 p-2 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              maxLength={500}
            />
            <button
              onClick={() => handleSend()}
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="w-9 h-9 shrink-0 bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-900/40 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-zinc-600 py-1 bg-zinc-950 border-t border-zinc-800 shrink-0">
            Powered by <span className="text-violet-400 font-medium">Notionnik AI</span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle chat"
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-2xl shadow-xl shadow-violet-900/50 hover:scale-105 transition-all flex items-center justify-center"
      >
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-zinc-900" />
        )}
        <span className={`transition-transform duration-200 ${isOpen ? "rotate-90 text-xl" : "rotate-0"}`}>
          {isOpen ? "✕" : "💬"}
        </span>
      </button>

    </div>
  );
}