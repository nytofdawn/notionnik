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

const ROBOT_LINES = [
  "⚙️ Automate your invoices!",
  "🔁 Connect Make + Notion!",
  "🤖 n8n saves you hours!",
  "📋 SOPs on autopilot!",
  "⚡ Zapier workflows = 🔥",
  "🗂️ CRM in Notion? Yes!",
  "📊 Auto-reports daily!",
  "🧠 AI does your grunt work!",
  "🔗 API integrations FTW!",
  "💡 Let systems run 24/7!",
];

// ─── Cute Robot SVG ───────────────────────────────────────────────────────────
function RobotSVG({ walkFrame, hovered, idle, facingLeft }) {
  const legSwing    = idle ? 0 : Math.sin((walkFrame / 4) * Math.PI * 2) * 12;
  const armSwing    = idle ? Math.sin(Date.now() / 700) * 6 : Math.sin((walkFrame / 4) * Math.PI * 2 + Math.PI) * 18;
  const pointArm    = hovered ? -40 : armSwing;
  const bodyBob     = idle ? Math.abs(Math.sin(Date.now() / 800)) * 1.5 : Math.abs(Math.sin((walkFrame / 4) * Math.PI * 2)) * 2;
  const eyeGlow     = hovered ? "#00f0ff" : "#40c8ff";
  const antennaGlow = hovered ? "#fbbf24" : "#7dd3fc";

  return (
    <svg viewBox="0 0 80 120" width="68" height="102" xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        transform: `translateY(${-bodyBob}px)`,
        filter: hovered
          ? "drop-shadow(0 0 10px rgba(0,240,255,0.9)) drop-shadow(0 6px 18px rgba(0,0,0,0.5))"
          : "drop-shadow(0 0 6px rgba(64,200,255,0.6)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
        transition: "filter 0.25s ease",
      }}>
      <defs>
        <radialGradient id="headGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#dbeafe" />
          <stop offset="40%"  stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
        <radialGradient id="bodyGrad" cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stopColor="#e0f2fe" />
          <stop offset="50%"  stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>
        <radialGradient id="limbGrad" cx="35%" cy="25%" r="70%">
          <stop offset="0%"   stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <radialGradient id="eyeGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%"   stopColor={eyeGlow} />
          <stop offset="60%"  stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        <radialGradient id="visorGrad" cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="rgba(30,40,60,0.7)" />
          <stop offset="100%" stopColor="rgba(5,15,30,0.95)" />
        </radialGradient>
        <linearGradient id="chestPanelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <filter id="eyeBloom">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* LEFT LEG */}
      <g transform={`translate(24, 88) rotate(${-legSwing * 0.6}, 6, 0)`}>
        <rect x="1" y="0"  width="11" height="14" rx="4" fill="url(#limbGrad)" />
        <rect x="0" y="13" width="13" height="10" rx="4" fill="url(#bodyGrad)" />
        <rect x="-1" y="21" width="15" height="8" rx="4" fill="url(#limbGrad)" />
        <ellipse cx="6.5" cy="29" rx="7" ry="3" fill="#1d4ed8" opacity="0.5" />
        <ellipse cx="4" cy="23" rx="3" ry="1.5" fill="white" opacity="0.3" />
      </g>

      {/* RIGHT LEG */}
      <g transform={`translate(45, 88) rotate(${legSwing * 0.6}, 6, 0)`}>
        <rect x="1" y="0"  width="11" height="14" rx="4" fill="url(#limbGrad)" />
        <rect x="0" y="13" width="13" height="10" rx="4" fill="url(#bodyGrad)" />
        <rect x="-1" y="21" width="15" height="8" rx="4" fill="url(#limbGrad)" />
        <ellipse cx="6.5" cy="29" rx="7" ry="3" fill="#1d4ed8" opacity="0.5" />
        <ellipse cx="4"   cy="23" rx="3" ry="1.5" fill="white" opacity="0.3" />
      </g>

      {/* BODY */}
      <rect x="16" y="55" width="48" height="36" rx="10" fill="url(#bodyGrad)" />
      <ellipse cx="30" cy="60" rx="10" ry="5" fill="white" opacity="0.2" />
      <rect x="19" y="86" width="42" height="6" rx="3" fill="#1e40af" opacity="0.6" />
      <circle cx="21" cy="75" r="2.5" fill="#0ea5e9" opacity="0.8" />
      <circle cx="59" cy="75" r="2.5" fill="#0ea5e9" opacity="0.8" />

      {/* CHEST PANEL */}
      <rect x="25" y="60" width="30" height="22" rx="5" fill="url(#chestPanelGrad)" />
      <rect x="26" y="61" width="28" height="20" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.6" />
      <line x1="28" y1="66" x2="38" y2="66" stroke="#00f0ff" strokeWidth="1"   opacity="0.7" />
      <line x1="28" y1="69" x2="35" y2="69" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5" />
      <line x1="28" y1="72" x2="40" y2="72" stroke="#00f0ff" strokeWidth="1"   opacity="0.7" />
      <circle cx="47" cy="70" r="6"   fill="none" stroke="#00f0ff" strokeWidth="1"   opacity="0.6" />
      <circle cx="47" cy="70" r="3.5" fill="none" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5" />
      <circle cx="47" cy="70" r="1.5" fill="#00f0ff" opacity="0.8" />

      {/* LEFT ARM */}
      <g transform={`translate(6, 58) rotate(${pointArm - 5}, 7, 0)`}>
        <rect x="1" y="0"  width="12" height="16" rx="5" fill="url(#limbGrad)" />
        <rect x="2" y="14" width="10" height="14" rx="5" fill="url(#bodyGrad)" />
        <circle cx="7" cy="15" r="4" fill="url(#limbGrad)" />
        <ellipse cx="7" cy="29" rx="6" ry="5" fill="url(#limbGrad)" />
        {hovered && <rect x="5.5" y="20" width="3" height="10" rx="1.5" fill="url(#bodyGrad)" />}
        <ellipse cx="5" cy="27" rx="2.5" ry="1.5" fill="white" opacity="0.25" />
      </g>

      {/* RIGHT ARM */}
      <g transform={`translate(62, 58) rotate(${-armSwing * 0.5 + 5}, 7, 0)`}>
        <rect x="1" y="0"  width="12" height="16" rx="5" fill="url(#limbGrad)" />
        <rect x="2" y="14" width="10" height="14" rx="5" fill="url(#bodyGrad)" />
        <circle cx="7" cy="15" r="4" fill="url(#limbGrad)" />
        <ellipse cx="7" cy="29" rx="6" ry="5" fill="url(#limbGrad)" />
        <ellipse cx="5" cy="27" rx="2.5" ry="1.5" fill="white" opacity="0.25" />
      </g>

      {/* NECK */}
      <rect x="29" y="48" width="22" height="9" rx="4" fill="#1e40af" opacity="0.8" />
      <rect x="31" y="49" width="18" height="7" rx="3" fill="url(#limbGrad)" opacity="0.6" />

      {/* HEAD */}
      <ellipse cx="40" cy="28" rx="28" ry="26" fill="url(#headGrad)" />
      <ellipse cx="32" cy="16" rx="10" ry="7" fill="white" opacity="0.35" />
      <ellipse cx="28" cy="14" rx="5"  ry="3" fill="white" opacity="0.2" />

      {/* EAR PIECES */}
      <rect x="10" y="22" width="8" height="14" rx="4" fill="url(#limbGrad)" />
      <circle cx="14" cy="29" r="4"   fill="#0369a1" />
      <circle cx="14" cy="29" r="2.5" fill={eyeGlow} opacity="0.7" />
      <rect x="62" y="22" width="8" height="14" rx="4" fill="url(#limbGrad)" />
      <circle cx="66" cy="29" r="4"   fill="#0369a1" />
      <circle cx="66" cy="29" r="2.5" fill={eyeGlow} opacity="0.7" />

      {/* VISOR */}
      <rect x="14" y="18" width="52" height="28" rx="12" fill="url(#visorGrad)" />
      <rect x="15" y="19" width="50" height="26" rx="11" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="1" />

      {/* EYES */}
      <circle cx="28" cy="30" r="8.5" fill="url(#eyeGrad)" filter="url(#eyeBloom)" />
      <circle cx="28" cy="30" r="6"   fill="#003366" />
      <circle cx="28" cy="30" r="4"   fill={eyeGlow} opacity="0.9" />
      <circle cx="25.5" cy="27.5" r="1.8" fill="white" opacity="0.6" />
      <circle cx="28" cy="30" r="8.5" fill="none" stroke={eyeGlow} strokeWidth="0.8" opacity="0.5" />

      <circle cx="52" cy="30" r="8.5" fill="url(#eyeGrad)" filter="url(#eyeBloom)" />
      <circle cx="52" cy="30" r="6"   fill="#003366" />
      <circle cx="52" cy="30" r="4"   fill={eyeGlow} opacity="0.9" />
      <circle cx="49.5" cy="27.5" r="1.8" fill="white" opacity="0.6" />
      <circle cx="52" cy="30" r="8.5" fill="none" stroke={eyeGlow} strokeWidth="0.8" opacity="0.5" />

      {/* EYEBROWS */}
      <path d="M 21 20 Q 28 17 35 20" fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 45 20 Q 52 17 59 20" fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />

      {/* SMILE */}
      <path d={hovered ? "M 30 42 Q 40 48 50 42" : "M 31 42 Q 40 47 49 42"}
        fill="none" stroke={eyeGlow} strokeWidth="2" strokeLinecap="round" />

      {/* CHEEK DOTS */}
      <circle cx="22" cy="40" r="1.5" fill={eyeGlow} opacity="0.5" />
      <circle cx="19" cy="40" r="1"   fill={eyeGlow} opacity="0.3" />
      <circle cx="58" cy="40" r="1.5" fill={eyeGlow} opacity="0.5" />
      <circle cx="61" cy="40" r="1"   fill={eyeGlow} opacity="0.3" />

      {/* ANTENNAS */}
      <line x1="28" y1="4"  x2="22" y2="-8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="22" cy="-9" r="3.5" fill={antennaGlow} />
      <circle cx="22" cy="-9" r="2"   fill="white" opacity="0.6" />
      <line x1="52" y1="4"  x2="58" y2="-8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="58" cy="-9" r="3.5" fill={antennaGlow} />
      <circle cx="58" cy="-9" r="2"   fill="white" opacity="0.6" />

      {/* TOP BUTTON */}
      <circle cx="40" cy="4" r="4"   fill="#1e40af" />
      <circle cx="40" cy="4" r="2.5" fill="#0ea5e9" opacity="0.8" />

      {/* SHADOW */}
      <ellipse cx="40" cy="118" rx="22" ry="4" fill="rgba(0,200,255,0.2)" />
    </svg>
  );
}

// ─── Wandering Robot ──────────────────────────────────────────────────────────
const SPEED = 0.75;

function RobotBot({ onOpen, hasUnread }) {
  const posRef      = useRef({ x: 150, y: window.innerHeight - 200 });
  const targetRef   = useRef({ x: 300, y: window.innerHeight / 2 });
  const pauseRef    = useRef(60);
  const rafRef      = useRef(null);
  const domRef      = useRef(null);
  const walkTickRef = useRef(0);

  const [walkFrame,  setWalkFrame]  = useState(0);
  const [facingLeft, setFacingLeft] = useState(false);
  const [hovered,    setHovered]    = useState(false);
  const [idle,       setIdle]       = useState(false);

  // ── Always-visible bubble with 3.5s fade rotation ──
  const [lineIdx,   setLineIdx]   = useState(0);
  const [fadeIn,    setFadeIn]    = useState(true);

  useEffect(() => {
    const cycle = () => {
      // Fade out
      setFadeIn(false);
      setTimeout(() => {
        // Swap text while invisible
        setLineIdx((i) => (i + 1) % ROBOT_LINES.length);
        // Fade back in
        setFadeIn(true);
      }, 400); // 400ms fade-out before swap
    };

    const iv = setInterval(cycle, 3500);
    return () => clearInterval(iv);
  }, []);

  // Walk / wander logic
  const pickTarget = () => {
    const margin = 80;
    targetRef.current = {
      x: margin + Math.random() * (window.innerWidth  - margin * 2),
      y: margin + Math.random() * (window.innerHeight - margin * 2),
    };
    pauseRef.current = 80 + Math.random() * 130;
    setIdle(false);
  };

  useEffect(() => {
    pickTarget();
    const animate = () => {
      if (pauseRef.current > 0) {
        pauseRef.current--;
        setIdle(true);
      } else {
        setIdle(false);
        const dx   = targetRef.current.x - posRef.current.x;
        const dy   = targetRef.current.y - posRef.current.y;
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
        domRef.current.style.top  = `${posRef.current.y}px`;
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
        width: "68px",
        height: "102px",
      }}
    >
      {/* Unread dot */}
      {hasUnread && (
        <div style={{
          position: "absolute", top: "-4px", right: "-4px",
          width: "13px", height: "13px",
          background: "#ef4444", borderRadius: "50%",
          border: "2px solid #0f172a", zIndex: 2,
        }} />
      )}

      {/* ── Speech bubble — ALWAYS visible, fades text between lines ── */}
      <div style={{
        position: "absolute",
        top: "-48px",
        left: "50%",
        transform: `translateX(-50%) scaleX(${facingLeft ? -1 : 1})`,
        background: hovered
          ? "linear-gradient(135deg, #0ea5e9, #00f0ff)"
          : "linear-gradient(135deg, #1e40af, #0ea5e9)",
        color: "white",
        fontSize: "10px",
        fontFamily: "monospace",
        fontWeight: "bold",
        padding: "6px 13px",
        borderRadius: "10px",
        whiteSpace: "nowrap",
        boxShadow: hovered
          ? "0 0 14px rgba(0,240,255,0.9)"
          : "0 0 12px rgba(14,165,233,0.7)",
        pointerEvents: "none",
        zIndex: 3,
        // Bubble itself always fully visible
        opacity: 1,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        minWidth: "120px",
        textAlign: "center",
      }}>
        {/* Text inside fades in/out on line change */}
        <span style={{
          display: "block",
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}>
          {hovered ? "Click to chat! 💬" : ROBOT_LINES[lineIdx]}
        </span>

        {/* Tail */}
        <div style={{
          position: "absolute", bottom: "-5px", left: "50%",
          transform: "translateX(-50%)", width: 0, height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `5px solid ${hovered ? "#00f0ff" : "#0ea5e9"}`,
        }} />
      </div>

      <RobotSVG
        walkFrame={walkFrame}
        hovered={hovered}
        idle={idle}
        facingLeft={facingLeft}
      />
    </div>
  );
}

// ─── Chatbot Window ───────────────────────────────────────────────────────────
export default function NotionnikChatBot() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([INITIAL_MESSAGE]);
  const [input,     setInput]     = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

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
        <RobotBot
          onOpen={() => { setIsOpen(true); setHasUnread(false); }}
          hasUnread={hasUnread}
        />
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 z-[99990] w-80 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/60" style={{ height: "420px" }}>

          {/* Header */}
          <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-sm shadow-md shrink-0">🤖</div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Notionnik AI</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
                  Online · replies instantly
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex items-center justify-center text-xs">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-zinc-900 px-3 py-2.5 flex flex-col gap-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed break-words ${
                  msg.sender === "user"
                    ? "bg-sky-600 text-white rounded-br-sm"
                    : "bg-zinc-800 text-zinc-100 border border-zinc-700/50 rounded-bl-sm"
                }`}>
                  {msg.sender === "bot" ? (
                    <div className="prose prose-invert prose-xs max-w-none prose-p:my-0.5 prose-strong:text-sky-300 prose-a:text-sky-300">
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
                  {[0,1,2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && !isSending && (
            <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-zinc-900 border-t border-zinc-800 shrink-0">
              {QUICK_REPLIES.map((qr) => (
                <button key={qr} onClick={() => handleSend(qr)}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-400 hover:border-sky-500 hover:text-sky-300 hover:bg-sky-500/10 transition-all">
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="bg-zinc-950 border-t border-zinc-800 px-2.5 py-2 flex items-center gap-2 shrink-0">
            <input ref={inputRef} type="text"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition disabled:opacity-50"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              maxLength={500}
            />
            <button onClick={() => handleSend()} disabled={isSending || !input.trim()}
              className="w-8 h-8 shrink-0 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 rounded-xl flex items-center justify-center text-white shadow-md transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
              <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] text-zinc-600 py-1 bg-zinc-950 border-t border-zinc-800 shrink-0">
            Powered by <span className="text-sky-400 font-medium">Notionnik AI</span>
          </div>
        </div>
      )}
    </>
  );
}