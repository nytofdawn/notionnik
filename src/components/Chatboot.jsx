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

// ─── Gear Math ────────────────────────────────────────────────────────────────
function gearPath(cx, cy, outerR, innerR, holeR, teeth = 10) {
  const toothAngle = (2 * Math.PI) / teeth;
  let path = "";
  for (let i = 0; i < teeth; i++) {
    const base = toothAngle * i - Math.PI / 2;
    const t0 = base + toothAngle * 0.15;
    const t1 = base + toothAngle * 0.35;
    const t2 = base + toothAngle * 0.65;
    const t3 = base + toothAngle * 0.85;
    const x0 = cx + innerR * Math.cos(base), y0 = cy + innerR * Math.sin(base);
    const x1 = cx + outerR * Math.cos(t0), y1 = cy + outerR * Math.sin(t0);
    const x2 = cx + outerR * Math.cos(t1), y2 = cy + outerR * Math.sin(t1);
    const x3 = cx + innerR * Math.cos(t2), y3 = cy + innerR * Math.sin(t2);
    const x4 = cx + innerR * Math.cos(t3), y4 = cy + innerR * Math.sin(t3);
    if (i === 0) path += `M${x0.toFixed(2)},${y0.toFixed(2)}`;
    else path += `L${x0.toFixed(2)},${y0.toFixed(2)}`;
    path += `L${x1.toFixed(2)},${y1.toFixed(2)}L${x2.toFixed(2)},${y2.toFixed(2)}L${x3.toFixed(2)},${y3.toFixed(2)}L${x4.toFixed(2)},${y4.toFixed(2)}`;
  }
  path += "Z";
  const hp = 32;
  path += ` M${(cx + holeR).toFixed(2)},${cy.toFixed(2)}`;
  for (let i = 1; i <= hp; i++) {
    const a = (2 * Math.PI * i) / hp;
    path += ` L${(cx + holeR * Math.cos(a)).toFixed(2)},${(cy + holeR * Math.sin(a)).toFixed(2)}`;
  }
  return path + "Z";
}

function spokeHoles(cx, cy, spokeR, holeSize = 4, count = 5) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = cx + spokeR * Math.cos(angle);
    const y = cy + spokeR * Math.sin(angle);
    let p = `M${(x + holeSize).toFixed(2)},${y.toFixed(2)}`;
    for (let j = 1; j <= 20; j++) {
      const a = (2 * Math.PI * j) / 20;
      p += ` L${(x + holeSize * Math.cos(a)).toFixed(2)},${(y + holeSize * Math.sin(a)).toFixed(2)}`;
    }
    return p + "Z";
  });
}

// ─── Mini Bot SVG ─────────────────────────────────────────────────────────────
function BotSVG({ bodyRot, hovered }) {
  const bodyGear = gearPath(50, 50, 46, 31, 10, 10);
  const bodyHoles = spokeHoles(50, 50, 21, 4, 5);
  const headGear = gearPath(50, 50, 46, 31, 13, 7);

  const fill = hovered ? "url(#hoverGrad)" : "url(#bodyGrad)";
  const glow = hovered ? "rgba(251,191,36,0.85)" : "rgba(99,102,241,0.75)";

  return (
    <svg
      viewBox="0 0 80 110"
      width="56"
      height="78"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", filter: `drop-shadow(0 0 7px ${glow}) drop-shadow(0 0 18px ${glow})`, transition: "filter 0.25s ease" }}
      fillRule="evenodd"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="hoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <line x1="40" y1="6" x2="40" y2="14" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="4" r="3.5" fill={hovered ? "#fbbf24" : "#a5b4fc"} style={{ transition: "fill 0.2s" }} />

      {/* Head gear */}
      <g transform="translate(16, 8) scale(0.48)">
        <path d={headGear} fill={fill} fillRule="evenodd" />
        {spokeHoles(50, 50, 20, 3.5, 4).map((h, i) => (
          <path key={i} d={h} fill="rgba(0,0,0,0.35)" />
        ))}
        {/* Eyes */}
        <circle cx="35" cy="50" r="7" fill="white" />
        <circle cx="65" cy="50" r="7" fill="white" />
        <circle cx={hovered ? 37 : 35} cy="50" r="4" fill={hovered ? "#fbbf24" : "#6366f1"} style={{ transition: "all 0.2s" }} />
        <circle cx={hovered ? 67 : 65} cy="50" r="4" fill={hovered ? "#fbbf24" : "#6366f1"} style={{ transition: "all 0.2s" }} />
        <circle cx="37" cy="48" r="1.5" fill="white" opacity="0.7" />
        <circle cx="67" cy="48" r="1.5" fill="white" opacity="0.7" />
        {/* Mouth */}
        <path
          d={hovered ? "M 33 64 Q 50 74 67 64" : "M 33 64 Q 50 58 67 64"}
          fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"
          style={{ transition: "d 0.3s" }}
        />
        <circle cx="50" cy="50" r="8" fill="none" stroke={hovered ? "#fbbf24" : "rgba(165,180,252,0.5)"} strokeWidth="2" style={{ transition: "stroke 0.2s" }} />
        <circle cx="50" cy="50" r="3.5" fill={hovered ? "#fbbf24" : "#a5b4fc"} style={{ transition: "fill 0.2s" }} />
      </g>

      {/* Body gear — spins */}
      <g transform={`translate(8, 42) scale(0.64)`} style={{ transformOrigin: "50px 50px", transformBox: "fill-box" }}>
        <g style={{ transform: `rotate(${bodyRot}deg)`, transformOrigin: "50% 50%", transition: "none" }}>
          <path d={bodyGear} fill={fill} fillRule="evenodd" />
          {bodyHoles.map((h, i) => (
            <path key={i} d={h} fill="rgba(0,0,0,0.4)" />
          ))}
          <circle cx="50" cy="50" r="13" fill="none" stroke={hovered ? "#fbbf24" : "rgba(165,180,252,0.5)"} strokeWidth="2.5" style={{ transition: "stroke 0.2s" }} />
          <circle cx="50" cy="50" r="5" fill={hovered ? "#fbbf24" : "#a5b4fc"} style={{ transition: "fill 0.2s" }} />
          <circle cx="50" cy="50" r="2.5" fill="rgba(0,0,0,0.4)" />
        </g>
      </g>

      {/* Left leg gear */}
      <g transform="translate(4, 82) scale(0.28)">
        <g style={{ transform: `rotate(${-bodyRot * 1.4}deg)`, transformOrigin: "50% 50%", transition: "none" }}>
          <path d={gearPath(50, 50, 46, 31, 13, 6)} fill="url(#legGrad)" fillRule="evenodd" />
          <circle cx="50" cy="50" r="4" fill="#818cf8" />
        </g>
      </g>

      {/* Right leg gear */}
      <g transform="translate(48, 82) scale(0.28)">
        <g style={{ transform: `rotate(${bodyRot * 1.4}deg)`, transformOrigin: "50% 50%", transition: "none" }}>
          <path d={gearPath(50, 50, 46, 31, 13, 6)} fill="url(#legGrad)" fillRule="evenodd" />
          <circle cx="50" cy="50" r="4" fill="#818cf8" />
        </g>
      </g>
    </svg>
  );
}

// ─── Mini Wandering Bot ───────────────────────────────────────────────────────
const SPEED = 0.9;
const BOT_W = 56;
const BOT_H = 78;

function MiniBot({ onOpen, hasUnread }) {
  const posRef = useRef({ x: 100, y: window.innerHeight - 160 });
  const targetRef = useRef({ x: 200, y: window.innerHeight - 200 });
  const pauseRef = useRef(80);
  const rafRef = useRef(null);
  const domRef = useRef(null);
  const bodyRotRef = useRef(0);
  const [bodyRot, setBodyRot] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [facingLeft, setFacingLeft] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const pickTarget = () => {
    const margin = 80;
    targetRef.current = {
      x: margin + Math.random() * (window.innerWidth - margin * 2),
      y: margin + Math.random() * (window.innerHeight - margin * 2),
    };
    pauseRef.current = 80 + Math.random() * 120;
  };

  useEffect(() => {
    pickTarget();

    const animate = () => {
      if (pauseRef.current > 0) {
        pauseRef.current--;
        // idle: slow spin
        bodyRotRef.current += 0.3;
      } else {
        const dx = targetRef.current.x - posRef.current.x;
        const dy = targetRef.current.y - posRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 6) {
          pickTarget();
        } else {
          posRef.current.x += (dx / dist) * SPEED;
          posRef.current.y += (dy / dist) * SPEED;
          bodyRotRef.current += SPEED * 3;
          setFacingLeft(dx < 0);
        }
      }

      if (domRef.current) {
        domRef.current.style.left = `${posRef.current.x}px`;
        domRef.current.style.top = `${posRef.current.y}px`;
      }

      setBodyRot(Math.round(bodyRotRef.current));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={domRef}
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        transform: `translate(-50%, -50%) scaleX(${facingLeft ? -1 : 1})`,
        zIndex: 99980,
        cursor: "none",
        userSelect: "none",
        width: `${BOT_W}px`,
        height: `${BOT_H}px`,
        transition: "transform 0.1s",
      }}
    >
      {/* Unread dot */}
      {hasUnread && (
        <div style={{
          position: "absolute", top: "-4px", right: "-4px",
          width: "12px", height: "12px",
          background: "#ef4444", borderRadius: "50%",
          border: "2px solid #18181b",
          zIndex: 1,
          animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
        }} />
      )}

      {/* Speech bubble — always upright even when flipped */}
      {(showBubble || hovered) && (
        <div style={{
          position: "absolute",
          top: "-38px",
          left: "50%",
          transform: `translateX(-50%) scaleX(${facingLeft ? -1 : 1})`,
          background: "linear-gradient(135deg, #6366f1, #ec4899)",
          color: "white",
          fontSize: "10px",
          fontFamily: "monospace",
          fontWeight: "bold",
          padding: "5px 10px",
          borderRadius: "10px",
          whiteSpace: "nowrap",
          boxShadow: "0 0 12px rgba(99,102,241,0.7)",
          pointerEvents: "none",
          zIndex: 2,
        }}>
          {hovered ? "Click to chat! 💬" : "Need help? ⚙️"}
          <div style={{
            position: "absolute", bottom: "-5px", left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #ec4899",
          }} />
        </div>
      )}

      <BotSVG bodyRot={bodyRot} hovered={hovered} />
    </div>
  );
}

// ─── Main Chatbot Component ───────────────────────────────────────────────────
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

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  return (
    <>
      {/* Wandering Mini Bot */}
      {!isOpen && <MiniBot onOpen={handleOpen} hasUnread={hasUnread} />}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-[99990]">
          <div className="w-[90vw] sm:w-[350px] md:w-[400px] h-[70vh] sm:h-[500px] md:h-[700px] bg-zinc-900 border border-zinc-700/60 rounded-2xl flex flex-col shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-base shadow-lg shadow-violet-900/40 shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight tracking-tight">Notionnik AI</p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    Online · replies instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center text-sm"
              >✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 sm:gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                    msg.sender === "user"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-zinc-800 text-zinc-100 border border-zinc-700/60 rounded-bl-sm"
                  }`}>
                    {msg.sender === "bot" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-violet-300 prose-a:text-violet-300">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : msg.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}

              {isSending && (
                <div className="flex items-start">
                  <div className="bg-zinc-800 border border-zinc-700/60 rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
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
                  <button key={qr} onClick={() => handleSend(qr)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-violet-500 hover:text-violet-300 hover:bg-violet-500/10 transition-all">
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-zinc-800 bg-zinc-950 p-2 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition disabled:opacity-50"
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
        </div>
      )}
    </>
  );
}