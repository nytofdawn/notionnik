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

// ─── Mechanic Character SVG ───────────────────────────────────────────────────
function MechanicSVG({ walkFrame, hovered, idle }) {
  const legSwing = idle ? 0 : Math.sin((walkFrame / 4) * Math.PI * 2) * 18;
  const armSwing = idle ? 0 : Math.sin((walkFrame / 4) * Math.PI * 2 + Math.PI) * 22;
  const bodyBob = idle ? 0 : Math.abs(Math.sin((walkFrame / 4) * Math.PI * 2)) * 2.5;
  const eyeX = hovered ? 2 : 0;
  const wrenchAngle = idle ? Math.sin(Date.now() / 500) * 15 - 10 : -30 + armSwing * 0.5;

  return (
    <svg
      viewBox="0 0 60 100"
      width="52"
      height="87"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        filter: hovered
          ? "drop-shadow(0 0 8px rgba(251,191,36,0.9)) drop-shadow(0 4px 16px rgba(0,0,0,0.5))"
          : "drop-shadow(0 0 5px rgba(99,102,241,0.5)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
        transition: "filter 0.25s ease",
        transform: `translateY(${-bodyBob}px)`,
      }}
    >
      <defs>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF7A" />
          <stop offset="100%" stopColor="#F59E5A" />
        </linearGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="bootGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="wrenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        <linearGradient id="beltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="gearBadge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="legGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      {/* LEFT LEG */}
      <g transform={`translate(22, 68) rotate(${-legSwing * 0.7}, 5, 0)`}>
        <rect x="1" y="0" width="9" height="14" rx="3" fill="url(#suitGrad)" />
        <rect x="1" y="13" width="9" height="11" rx="2" fill="#3730a3" />
        <rect x="0" y="23" width="11" height="6" rx="2" fill="url(#bootGrad)" />
        <rect x="-1" y="27" width="13" height="3" rx="1.5" fill="#1f2937" />
      </g>

      {/* RIGHT LEG */}
      <g transform={`translate(34, 68) rotate(${legSwing * 0.7}, 5, 0)`}>
        <rect x="1" y="0" width="9" height="14" rx="3" fill="url(#suitGrad)" />
        <rect x="1" y="13" width="9" height="11" rx="2" fill="#3730a3" />
        <rect x="0" y="23" width="11" height="6" rx="2" fill="url(#bootGrad)" />
        <rect x="-1" y="27" width="13" height="3" rx="1.5" fill="#1f2937" />
      </g>

      {/* BODY */}
      <rect x="14" y="38" width="32" height="32" rx="5" fill="url(#suitGrad)" />
      <rect x="18" y="42" width="24" height="16" rx="3" fill="#3730a3" opacity="0.6" />
      <circle cx="30" cy="50" r="6" fill="url(#gearBadge)" opacity="0.9" />
      <circle cx="30" cy="50" r="3" fill="rgba(0,0,0,0.3)" />
      <circle cx="30" cy="50" r="1.5" fill="#fbbf24" />
      <circle cx="21" cy="62" r="1.5" fill="#818cf8" opacity="0.8" />
      <circle cx="39" cy="62" r="1.5" fill="#818cf8" opacity="0.8" />
      <rect x="14" y="64" width="32" height="5" rx="1.5" fill="url(#beltGrad)" />
      <rect x="26" y="64.5" width="8" height="4" rx="1" fill="#1e1b4b" />
      <rect x="28" y="65.5" width="4" height="2" rx="0.5" fill="#fbbf24" />
      <rect x="16" y="55" width="8" height="7" rx="1.5" fill="#3730a3" />
      <line x1="16" y1="58" x2="24" y2="58" stroke="#4338ca" strokeWidth="0.8" />

      {/* LEFT ARM (wrench) */}
      <g transform={`translate(9, 40) rotate(${armSwing * 0.6 - 10}, 5, 0)`}>
        <rect x="0" y="0" width="8" height="13" rx="3" fill="url(#suitGrad)" />
        <rect x="1" y="12" width="7" height="11" rx="2.5" fill="#4338ca" />
        <ellipse cx="4.5" cy="25" rx="4" ry="3.5" fill="#1e1b4b" />
        <g transform={`translate(1, 26) rotate(${wrenchAngle}, 3, 0)`}>
          <rect x="2" y="0" width="3.5" height="14" rx="1.5" fill="url(#wrenchGrad)" />
          <rect x="-1" y="-4" width="8" height="5" rx="1.5" fill="url(#wrenchGrad)" />
          <rect x="0" y="-2.5" width="3" height="3" rx="0.5" fill="#374151" />
          <rect x="0" y="13" width="6" height="4" rx="1.5" fill="url(#wrenchGrad)" />
          <rect x="2.5" y="1" width="1.2" height="11" rx="0.6" fill="rgba(255,255,255,0.2)" />
        </g>
      </g>

      {/* RIGHT ARM */}
      <g transform={`translate(43, 40) rotate(${-armSwing * 0.6 + 10}, 5, 0)`}>
        <rect x="0" y="0" width="8" height="13" rx="3" fill="url(#suitGrad)" />
        <rect x="1" y="12" width="7" height="11" rx="2.5" fill="#4338ca" />
        <ellipse cx="4.5" cy="25" rx="4" ry="3.5" fill="#1e1b4b" />
      </g>

      {/* NECK */}
      <rect x="24" y="33" width="12" height="7" rx="2" fill="url(#skinGrad)" />

      {/* HEAD */}
      <rect x="14" y="12" width="32" height="28" rx="7" fill="url(#skinGrad)" />
      <path d="M13 22 Q13 10 30 10 Q47 10 47 22 L47 18 Q47 6 30 6 Q13 6 13 18 Z" fill="url(#helmetGrad)" />
      <rect x="13" y="18" width="34" height="8" rx="3" fill="url(#helmetGrad)" />
      <rect x="11" y="24" width="38" height="4" rx="2" fill="#1e1b4b" />
      <rect x="12" y="25" width="36" height="2" rx="1" fill="#6366f1" opacity="0.6" />
      <circle cx="30" cy="14" r="3.5" fill={hovered ? "#fbbf24" : "#6366f1"} style={{ transition: "fill 0.2s" }} />
      <circle cx="30" cy="14" r="2" fill={hovered ? "#fff7ed" : "#a5b4fc"} style={{ transition: "fill 0.2s" }} />
      <rect x="16" y="27" width="28" height="9" rx="3" fill="url(#visorGrad)" opacity="0.85" />
      <rect x="17" y="28" width="10" height="2.5" rx="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx={27 + eyeX} cy="31.5" r="2.5" fill="white" opacity="0.9" />
      <circle cx={33 + eyeX} cy="31.5" r="2.5" fill="white" opacity="0.9" />
      <circle cx={28 + eyeX} cy="31.5" r="1.3" fill={hovered ? "#f97316" : "#6366f1"} style={{ transition: "fill 0.2s" }} />
      <circle cx={34 + eyeX} cy="31.5" r="1.3" fill={hovered ? "#f97316" : "#6366f1"} style={{ transition: "fill 0.2s" }} />
      <rect x="10" y="22" width="5" height="8" rx="2" fill="#1e1b4b" />
      <rect x="45" y="22" width="5" height="8" rx="2" fill="#1e1b4b" />
      <circle cx="12" cy="26" r="1.5" fill="#6366f1" opacity="0.7" />
      <circle cx="48" cy="26" r="1.5" fill="#6366f1" opacity="0.7" />
      <rect x="13" y="39" width="7" height="4" rx="1.5" fill="#fbbf24" opacity="0.9" />
      <rect x="40" y="39" width="7" height="4" rx="1.5" fill="#fbbf24" opacity="0.9" />
      <text x="16.5" y="42.5" fontSize="3" fill="#1e1b4b" fontFamily="monospace" fontWeight="bold">AI</text>
      <text x="43.5" y="42.5" fontSize="3" fill="#1e1b4b" fontFamily="monospace" fontWeight="bold">AI</text>
    </svg>
  );
}

// ─── Mini Wandering Mechanic ──────────────────────────────────────────────────
const SPEED = 0.85;

function MiniMechanic({ onOpen, hasUnread }) {
  const posRef = useRef({ x: 120, y: window.innerHeight - 160 });
  const targetRef = useRef({ x: 300, y: window.innerHeight / 2 });
  const pauseRef = useRef(60);
  const rafRef = useRef(null);
  const domRef = useRef(null);
  const walkTickRef = useRef(0);
  const idleRef = useRef(false);

  const [walkFrame, setWalkFrame] = useState(0);
  const [facingLeft, setFacingLeft] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [idle, setIdle] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  const [bubbleText] = useState(() => {
    const opts = ["Need help? 🔧", "Let's automate! ⚙️", "Got a task? 🤖", "Workflows = my thing 💡"];
    return opts[Math.floor(Math.random() * opts.length)];
  });

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const pickTarget = () => {
    const margin = 90;
    targetRef.current = {
      x: margin + Math.random() * (window.innerWidth - margin * 2),
      y: margin + Math.random() * (window.innerHeight - margin * 2),
    };
    pauseRef.current = 90 + Math.random() * 140;
    idleRef.current = false;
    setIdle(false);
  };

  useEffect(() => {
    pickTarget();
    const animate = () => {
      if (pauseRef.current > 0) {
        pauseRef.current--;
        idleRef.current = true;
        setIdle(true);
      } else {
        idleRef.current = false;
        setIdle(false);
        const dx = targetRef.current.x - posRef.current.x;
        const dy = targetRef.current.y - posRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8) {
          pickTarget();
        } else {
          posRef.current.x += (dx / dist) * SPEED;
          posRef.current.y += (dy / dist) * SPEED;
          setFacingLeft(dx < 0);
          walkTickRef.current++;
          if (walkTickRef.current % 10 === 0) setWalkFrame((f) => (f + 1) % 4);
        }
      }
      if (domRef.current) {
        domRef.current.style.left = `${posRef.current.x}px`;
        domRef.current.style.top = `${posRef.current.y}px`;
      }
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
        width: "52px",
        height: "87px",
      }}
    >
      {hasUnread && (
        <div style={{
          position: "absolute", top: "-4px", right: "-4px",
          width: "13px", height: "13px",
          background: "#ef4444", borderRadius: "50%",
          border: "2px solid #18181b", zIndex: 2,
        }} />
      )}
      {(showBubble || hovered) && (
        <div style={{
          position: "absolute", top: "-40px", left: "50%",
          transform: `translateX(-50%) scaleX(${facingLeft ? -1 : 1})`,
          background: "linear-gradient(135deg, #4338ca, #ec4899)",
          color: "white", fontSize: "10px", fontFamily: "monospace",
          fontWeight: "bold", padding: "5px 11px", borderRadius: "10px",
          whiteSpace: "nowrap", boxShadow: "0 0 14px rgba(99,102,241,0.7)",
          pointerEvents: "none", zIndex: 3,
        }}>
          {hovered ? "Click to chat! 💬" : bubbleText}
          <div style={{
            position: "absolute", bottom: "-5px", left: "50%",
            transform: "translateX(-50%)", width: 0, height: 0,
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: "5px solid #ec4899",
          }} />
        </div>
      )}
      <MechanicSVG walkFrame={walkFrame} facingLeft={facingLeft} hovered={hovered} idle={idle} />
    </div>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
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
      const conversationHistory = [...messages, { sender: "user", text: trimmed }].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversation: conversationHistory }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const botReply = await response.text();
      addMessage({ sender: "bot", text: botReply?.trim() || "I'll have someone from our team follow up shortly!" });
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error("ChatBot error:", err);
      addMessage({ sender: "bot", text: "Oops! Something went wrong. Please try again or book a free call directly." });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {!isOpen && (
        <MiniMechanic
          onOpen={() => { setIsOpen(true); setHasUnread(false); }}
          hasUnread={hasUnread}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-[99990] w-80 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/60"
          style={{ height: "420px" }}>

          {/* Header */}
          <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm shadow-md shadow-violet-900/40 shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Notionnik AI</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  Online · replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center text-xs"
            >✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-zinc-900 px-3 py-2.5 flex flex-col gap-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed break-words ${
                  msg.sender === "user"
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-zinc-800 text-zinc-100 border border-zinc-700/50 rounded-bl-sm"
                }`}>
                  {msg.sender === "bot" ? (
                    <div className="prose prose-invert prose-xs max-w-none prose-p:my-0.5 prose-strong:text-violet-300 prose-a:text-violet-300">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : msg.text}
                </div>
                <span className="text-[9px] text-zinc-600 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {isSending && (
              <div className="flex items-start">
                <div className="bg-zinc-800 border border-zinc-700/50 rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1">
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
            <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-zinc-900 border-t border-zinc-800 shrink-0">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => handleSend(qr)}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-violet-500 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="bg-zinc-950 border-t border-zinc-800 px-2.5 py-2 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition disabled:opacity-50"
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
              className="w-8 h-8 shrink-0 bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-violet-900/40 transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] text-zinc-600 py-1 bg-zinc-950 border-t border-zinc-800 shrink-0">
            Powered by <span className="text-violet-400 font-medium">Notionnik AI</span>
          </div>

        </div>
      )}
    </>
  );
}