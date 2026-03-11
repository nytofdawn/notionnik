import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

const API_BASE    = import.meta.env.VITE_API_URL || "";
const WEBHOOK_URL = `${API_BASE}/api/chat`;
const CALENDLY_URL = "https://calendly.com/jannikm/30min";

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

// Keywords that trigger the Calendly booking card
const BOOKING_KEYWORDS = [
  "book", "booking", "schedule", "calendly", "call", "free call",
  "consult", "consultation", "meeting", "appointment", "talk",
  "chat with", "speak with", "demo", "discovery", "30 min", "30min",
  "get started", "connect", "reach out", "contact",
];

function isBookingIntent(text) {
  const lower = text.toLowerCase();
  return BOOKING_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── Calendly Booking Card ────────────────────────────────────────────────────
function BookingCard() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0c1a3a, #0e2a50)",
      border: "1px solid rgba(14,165,233,0.35)",
      borderRadius: "16px",
      padding: "16px",
      marginTop: "4px",
      boxShadow: "0 4px 20px rgba(14,165,233,0.15)",
      maxWidth: "100%",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "10px",
          background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0,
          boxShadow: "0 4px 12px rgba(14,165,233,0.4)",
        }}>📅</div>
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "white", lineHeight: 1.2 }}>
            Book a Free 30-Min Call
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#7dd3fc" }}>
            with Notionnik Team · No commitment
          </p>
        </div>
      </div>

      {/* Info pills */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        {[
          { icon: "⏱️", label: "30 minutes" },
          { icon: "🎥", label: "Video call" },
          { icon: "🆓", label: "100% Free" },
        ].map((item) => (
          <span key={item.label} style={{
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "11px", color: "#bae6fd",
            background: "rgba(14,165,233,0.12)",
            border: "1px solid rgba(14,165,233,0.25)",
            borderRadius: "999px", padding: "3px 10px",
          }}>
            {item.icon} {item.label}
          </span>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", padding: "11px 16px",
          background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
          color: "white", fontWeight: 700, fontSize: "14px",
          borderRadius: "12px", textDecoration: "none",
          boxShadow: "0 4px 16px rgba(14,165,233,0.45)",
          transition: "all 0.2s ease",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #38bdf8, #3b82f6)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(14,165,233,0.6)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "linear-gradient(135deg, #0ea5e9, #2563eb)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,165,233,0.45)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <svg style={{ width: "15px", height: "15px", fill: "white", flexShrink: 0 }} viewBox="0 0 24 24">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7zm0 4h7v2H7z"/>
        </svg>
        Open Calendly & Pick a Time
        <svg style={{ width: "13px", height: "13px", fill: "white", flexShrink: 0 }} viewBox="0 0 24 24">
          <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
        </svg>
      </a>

      {/* Alt link */}
      <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: "10.5px", color: "#64748b" }}>
        Or visit{" "}
        <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
          style={{ color: "#38bdf8", textDecoration: "underline" }}>
          calendly.com/jannikm/30min
        </a>
      </p>
    </div>
  );
}

// ─── Robot SVG ────────────────────────────────────────────────────────────────
function RobotSVG({ walkFrame, hovered, idle }) {
  const legSwing    = idle ? 0 : Math.sin((walkFrame / 4) * Math.PI * 2) * 12;
  const armSwing    = idle ? Math.sin(Date.now() / 700) * 6 : Math.sin((walkFrame / 4) * Math.PI * 2 + Math.PI) * 18;
  const pointArm    = hovered ? -40 : armSwing;
  const bodyBob     = idle ? Math.abs(Math.sin(Date.now() / 800)) * 1.5 : Math.abs(Math.sin((walkFrame / 4) * Math.PI * 2)) * 2;
  const eyeGlow     = hovered ? "#00f0ff" : "#40c8ff";
  const antennaGlow = hovered ? "#fbbf24" : "#7dd3fc";

  return (
    <svg viewBox="0 0 80 120" width="68" height="102" xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block", transform: `translateY(${-bodyBob}px)`,
        filter: hovered
          ? "drop-shadow(0 0 10px rgba(0,240,255,0.9)) drop-shadow(0 6px 18px rgba(0,0,0,0.5))"
          : "drop-shadow(0 0 6px rgba(64,200,255,0.6)) drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
        transition: "filter 0.25s ease",
      }}>
      <defs>
        <radialGradient id="cbHeadGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#dbeafe"/><stop offset="40%" stopColor="#93c5fd"/><stop offset="100%" stopColor="#3b82f6"/>
        </radialGradient>
        <radialGradient id="cbBodyGrad" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#e0f2fe"/><stop offset="50%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#2563eb"/>
        </radialGradient>
        <radialGradient id="cbLimbGrad" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#bfdbfe"/><stop offset="100%" stopColor="#1d4ed8"/>
        </radialGradient>
        <radialGradient id="cbEyeGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={eyeGlow}/><stop offset="60%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#0369a1"/>
        </radialGradient>
        <radialGradient id="cbVisorGrad" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="rgba(30,40,60,0.7)"/><stop offset="100%" stopColor="rgba(5,15,30,0.95)"/>
        </radialGradient>
        <linearGradient id="cbChestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c4a6e"/><stop offset="100%" stopColor="#0369a1"/>
        </linearGradient>
        <filter id="cbEyeBloom">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g transform={`translate(24,88) rotate(${-legSwing*0.6},6,0)`}>
        <rect x="1" y="0" width="11" height="14" rx="4" fill="url(#cbLimbGrad)"/>
        <rect x="0" y="13" width="13" height="10" rx="4" fill="url(#cbBodyGrad)"/>
        <rect x="-1" y="21" width="15" height="8" rx="4" fill="url(#cbLimbGrad)"/>
        <ellipse cx="6.5" cy="29" rx="7" ry="3" fill="#1d4ed8" opacity="0.5"/>
        <ellipse cx="4" cy="23" rx="3" ry="1.5" fill="white" opacity="0.3"/>
      </g>
      <g transform={`translate(45,88) rotate(${legSwing*0.6},6,0)`}>
        <rect x="1" y="0" width="11" height="14" rx="4" fill="url(#cbLimbGrad)"/>
        <rect x="0" y="13" width="13" height="10" rx="4" fill="url(#cbBodyGrad)"/>
        <rect x="-1" y="21" width="15" height="8" rx="4" fill="url(#cbLimbGrad)"/>
        <ellipse cx="6.5" cy="29" rx="7" ry="3" fill="#1d4ed8" opacity="0.5"/>
        <ellipse cx="4" cy="23" rx="3" ry="1.5" fill="white" opacity="0.3"/>
      </g>
      <rect x="16" y="55" width="48" height="36" rx="10" fill="url(#cbBodyGrad)"/>
      <ellipse cx="30" cy="60" rx="10" ry="5" fill="white" opacity="0.2"/>
      <rect x="19" y="86" width="42" height="6" rx="3" fill="#1e40af" opacity="0.6"/>
      <circle cx="21" cy="75" r="2.5" fill="#0ea5e9" opacity="0.8"/>
      <circle cx="59" cy="75" r="2.5" fill="#0ea5e9" opacity="0.8"/>
      <rect x="25" y="60" width="30" height="22" rx="5" fill="url(#cbChestGrad)"/>
      <rect x="26" y="61" width="28" height="20" rx="4" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.6"/>
      <line x1="28" y1="66" x2="38" y2="66" stroke="#00f0ff" strokeWidth="1" opacity="0.7"/>
      <line x1="28" y1="69" x2="35" y2="69" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5"/>
      <line x1="28" y1="72" x2="40" y2="72" stroke="#00f0ff" strokeWidth="1" opacity="0.7"/>
      <circle cx="47" cy="70" r="6" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.6"/>
      <circle cx="47" cy="70" r="3.5" fill="none" stroke="#00f0ff" strokeWidth="0.8" opacity="0.5"/>
      <circle cx="47" cy="70" r="1.5" fill="#00f0ff" opacity="0.8"/>
      <g transform={`translate(6,58) rotate(${pointArm-5},7,0)`}>
        <rect x="1" y="0" width="12" height="16" rx="5" fill="url(#cbLimbGrad)"/>
        <rect x="2" y="14" width="10" height="14" rx="5" fill="url(#cbBodyGrad)"/>
        <circle cx="7" cy="15" r="4" fill="url(#cbLimbGrad)"/>
        <ellipse cx="7" cy="29" rx="6" ry="5" fill="url(#cbLimbGrad)"/>
        {hovered && <rect x="5.5" y="20" width="3" height="10" rx="1.5" fill="url(#cbBodyGrad)"/>}
        <ellipse cx="5" cy="27" rx="2.5" ry="1.5" fill="white" opacity="0.25"/>
      </g>
      <g transform={`translate(62,58) rotate(${-armSwing*0.5+5},7,0)`}>
        <rect x="1" y="0" width="12" height="16" rx="5" fill="url(#cbLimbGrad)"/>
        <rect x="2" y="14" width="10" height="14" rx="5" fill="url(#cbBodyGrad)"/>
        <circle cx="7" cy="15" r="4" fill="url(#cbLimbGrad)"/>
        <ellipse cx="7" cy="29" rx="6" ry="5" fill="url(#cbLimbGrad)"/>
        <ellipse cx="5" cy="27" rx="2.5" ry="1.5" fill="white" opacity="0.25"/>
      </g>
      <rect x="29" y="48" width="22" height="9" rx="4" fill="#1e40af" opacity="0.8"/>
      <rect x="31" y="49" width="18" height="7" rx="3" fill="url(#cbLimbGrad)" opacity="0.6"/>
      <ellipse cx="40" cy="28" rx="28" ry="26" fill="url(#cbHeadGrad)"/>
      <ellipse cx="32" cy="16" rx="10" ry="7" fill="white" opacity="0.35"/>
      <ellipse cx="28" cy="14" rx="5" ry="3" fill="white" opacity="0.2"/>
      <rect x="10" y="22" width="8" height="14" rx="4" fill="url(#cbLimbGrad)"/>
      <circle cx="14" cy="29" r="4" fill="#0369a1"/>
      <circle cx="14" cy="29" r="2.5" fill={eyeGlow} opacity="0.7"/>
      <rect x="62" y="22" width="8" height="14" rx="4" fill="url(#cbLimbGrad)"/>
      <circle cx="66" cy="29" r="4" fill="#0369a1"/>
      <circle cx="66" cy="29" r="2.5" fill={eyeGlow} opacity="0.7"/>
      <rect x="14" y="18" width="52" height="28" rx="12" fill="url(#cbVisorGrad)"/>
      <rect x="15" y="19" width="50" height="26" rx="11" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="1"/>
      <circle cx="28" cy="30" r="8.5" fill="url(#cbEyeGrad)" filter="url(#cbEyeBloom)"/>
      <circle cx="28" cy="30" r="6" fill="#003366"/>
      <circle cx="28" cy="30" r="4" fill={eyeGlow} opacity="0.9"/>
      <circle cx="25.5" cy="27.5" r="1.8" fill="white" opacity="0.6"/>
      <circle cx="28" cy="30" r="8.5" fill="none" stroke={eyeGlow} strokeWidth="0.8" opacity="0.5"/>
      <circle cx="52" cy="30" r="8.5" fill="url(#cbEyeGrad)" filter="url(#cbEyeBloom)"/>
      <circle cx="52" cy="30" r="6" fill="#003366"/>
      <circle cx="52" cy="30" r="4" fill={eyeGlow} opacity="0.9"/>
      <circle cx="49.5" cy="27.5" r="1.8" fill="white" opacity="0.6"/>
      <circle cx="52" cy="30" r="8.5" fill="none" stroke={eyeGlow} strokeWidth="0.8" opacity="0.5"/>
      <path d="M 21 20 Q 28 17 35 20" fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 45 20 Q 52 17 59 20" fill="none" stroke="rgba(180,220,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d={hovered ? "M 30 42 Q 40 48 50 42" : "M 31 42 Q 40 47 49 42"} fill="none" stroke={eyeGlow} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="22" cy="40" r="1.5" fill={eyeGlow} opacity="0.5"/>
      <circle cx="19" cy="40" r="1" fill={eyeGlow} opacity="0.3"/>
      <circle cx="58" cy="40" r="1.5" fill={eyeGlow} opacity="0.5"/>
      <circle cx="61" cy="40" r="1" fill={eyeGlow} opacity="0.3"/>
      <line x1="28" y1="4" x2="22" y2="-8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="22" cy="-9" r="3.5" fill={antennaGlow}/>
      <circle cx="22" cy="-9" r="2" fill="white" opacity="0.6"/>
      <line x1="52" y1="4" x2="58" y2="-8" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="58" cy="-9" r="3.5" fill={antennaGlow}/>
      <circle cx="58" cy="-9" r="2" fill="white" opacity="0.6"/>
      <circle cx="40" cy="4" r="4" fill="#1e40af"/>
      <circle cx="40" cy="4" r="2.5" fill="#0ea5e9" opacity="0.8"/>
      <ellipse cx="40" cy="118" rx="22" ry="4" fill="rgba(0,200,255,0.2)"/>
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
  const [lineIdx,    setLineIdx]    = useState(0);
  const [fadeIn,     setFadeIn]     = useState(true);

  useEffect(() => {
    const cycle = () => {
      setFadeIn(false);
      setTimeout(() => { setLineIdx((i) => (i + 1) % ROBOT_LINES.length); setFadeIn(true); }, 400);
    };
    const iv = setInterval(cycle, 3500);
    return () => clearInterval(iv);
  }, []);

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
        const dx = targetRef.current.x - posRef.current.x;
        const dy = targetRef.current.y - posRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 8) { pickTarget(); }
        else {
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
    <div ref={domRef} onClick={onOpen}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed", transform: `translate(-50%, -50%) scaleX(${facingLeft ? -1 : 1})`,
        zIndex: 99980, cursor: "none", userSelect: "none", width: "68px", height: "102px",
      }}>
      {hasUnread && (
        <div style={{
          position: "absolute", top: "-4px", right: "-4px",
          width: "13px", height: "13px", background: "#ef4444",
          borderRadius: "50%", border: "2px solid #0f172a", zIndex: 2,
        }} />
      )}
      <div style={{
        position: "absolute", top: "-48px", left: "50%",
        transform: `translateX(-50%) scaleX(${facingLeft ? -1 : 1})`,
        background: hovered ? "linear-gradient(135deg,#0ea5e9,#00f0ff)" : "linear-gradient(135deg,#1e40af,#0ea5e9)",
        color: "white", fontSize: "10px", fontFamily: "monospace", fontWeight: "bold",
        padding: "6px 13px", borderRadius: "10px", whiteSpace: "nowrap",
        boxShadow: hovered ? "0 0 14px rgba(0,240,255,0.9)" : "0 0 12px rgba(14,165,233,0.7)",
        pointerEvents: "none", zIndex: 3, opacity: 1,
        transition: "background 0.3s ease, box-shadow 0.3s ease",
        minWidth: "120px", textAlign: "center",
      }}>
        <span style={{ display: "block", opacity: fadeIn ? 1 : 0, transition: "opacity 0.35s ease" }}>
          {hovered ? "Click to chat! 💬" : ROBOT_LINES[lineIdx]}
        </span>
        <div style={{
          position: "absolute", bottom: "-5px", left: "50%",
          transform: "translateX(-50%)", width: 0, height: 0,
          borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
          borderTop: `5px solid ${hovered ? "#00f0ff" : "#0ea5e9"}`,
        }} />
      </div>
      <RobotSVG walkFrame={walkFrame} hovered={hovered} idle={idle} facingLeft={facingLeft} />
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isMobile }) {
  const isBot  = msg.sender === "bot";
  const isUser = msg.sender === "user";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
      <div style={{
        maxWidth: isMobile ? "88%" : "80%",
        padding: "10px 14px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        fontSize: isMobile ? "13px" : "13.5px",
        lineHeight: 1.55,
        wordBreak: "break-word",
        background: isUser ? "linear-gradient(135deg,#0284c7,#2563eb)" : "#27272a",
        color: "white",
        border: isBot ? "1px solid rgba(63,63,70,0.6)" : "none",
        boxShadow: isUser ? "0 2px 12px rgba(37,99,235,0.3)" : "none",
      }}>
        {isBot ? (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-sky-300 prose-a:text-sky-300">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ) : msg.text}
      </div>

      {/* Calendly card attached below bot message if booking intent */}
      {isBot && msg.showBooking && <BookingCard />}

      <span style={{ fontSize: "10px", color: "#52525b", marginTop: "3px", padding: "0 4px" }}>
        {msg.time}
      </span>
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
  const [isMobile,  setIsMobile]  = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

    // Check if user's message is booking-related
    const userWantsBooking = isBookingIntent(trimmed);

    addMessage({ sender: "user", text: trimmed });
    setIsSending(true);

    try {
      const conversationHistory = [...messages, { sender: "user", text: trimmed }].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      // If booking intent detected, we can short-circuit OR let the webhook respond too
      if (userWantsBooking) {
        // Show bot reply + booking card immediately, no webhook needed for this
        const bookingReplies = [
          "Absolutely! I'd love to set up a call. 🎉 Pick a time that works for you below 👇",
          "Great choice! A free 30-min call is the best way to get started. Here's our Calendly 👇",
          "Of course! Let's get something on the calendar. Click below to book your free slot 👇",
          "Sure thing! Use the link below to pick a time — it syncs straight to Google Calendar 👇",
        ];
        const reply = bookingReplies[Math.floor(Math.random() * bookingReplies.length)];
        addMessage({ sender: "bot", text: reply, showBooking: true });
        if (!isOpen) setHasUnread(true);
        setIsSending(false);
        return;
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversation: conversationHistory }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const botReply = await response.text();
      const replyText = botReply?.trim() || "I'll have someone from our team follow up shortly!";

      // Also check if the webhook response mentions booking/call
      const showBooking = isBookingIntent(replyText) || isBookingIntent(trimmed);
      addMessage({ sender: "bot", text: replyText, showBooking });
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error("ChatBot error:", err);
      addMessage({ sender: "bot", text: "Oops! Something went wrong. Please try again or book a free call directly.", showBooking: true });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const windowStyle = isMobile
    ? { position: "fixed", inset: 0, zIndex: 99990, display: "flex", flexDirection: "column", borderRadius: 0, border: "none", background: "#09090b" }
    : {
        position: "fixed", bottom: "20px", right: "20px",
        width: "420px", height: "580px", zIndex: 99990,
        display: "flex", flexDirection: "column",
        borderRadius: "20px", overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        border: "1px solid rgba(113,113,122,0.4)",
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
        <div style={windowStyle}>

          {/* Header */}
          <div style={{
            background: "#09090b", borderBottom: "1px solid #27272a",
            padding: isMobile ? "14px 16px" : "14px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: isMobile ? "40px" : "44px", height: isMobile ? "40px" : "44px",
                borderRadius: "12px", background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMobile ? "18px" : "20px", flexShrink: 0,
                boxShadow: "0 4px 12px rgba(14,165,233,0.4)",
              }}>🤖</div>
              <div>
                <p style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: 700, color: "white", margin: 0, lineHeight: 1.2 }}>
                  Notionnik AI
                </p>
                <p style={{ fontSize: "11px", color: "#34d399", margin: "3px 0 0", display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ display: "inline-block", width: "7px", height: "7px", background: "#34d399", borderRadius: "50%", animation: "pulse 2s infinite" }} />
                  Online · replies instantly
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "#27272a", border: "1px solid #3f3f46",
                color: "#a1a1aa", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#3f3f46"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#27272a"; e.currentTarget.style.color = "#a1a1aa"; }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", background: "#18181b",
            padding: isMobile ? "14px 12px" : "18px 16px",
            display: "flex", flexDirection: "column", gap: "10px",
          }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} isMobile={isMobile} />
            ))}

            {isSending && (
              <div style={{ display: "flex" }}>
                <div style={{
                  background: "#27272a", border: "1px solid rgba(63,63,70,0.6)",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "10px 16px", display: "flex", gap: "5px", alignItems: "center",
                }}>
                  {[0,1,2].map((i) => (
                    <span key={i} style={{
                      width: "7px", height: "7px", background: "#71717a",
                      borderRadius: "50%", display: "inline-block",
                      animation: `bounce 1s infinite ${i * 0.15}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && !isSending && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "8px",
              padding: isMobile ? "10px 12px" : "12px 16px",
              background: "#18181b", borderTop: "1px solid #27272a", flexShrink: 0,
            }}>
              {QUICK_REPLIES.map((qr) => (
                <button key={qr} onClick={() => handleSend(qr)}
                  style={{
                    fontSize: isMobile ? "12px" : "11.5px", padding: "7px 13px",
                    borderRadius: "999px", border: "1px solid #3f3f46",
                    background: "transparent", color: "#a1a1aa",
                    cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0ea5e9"; e.currentTarget.style.color = "#38bdf8"; e.currentTarget.style.background = "rgba(14,165,233,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3f3f46"; e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.background = "transparent"; }}
                >{qr}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            background: "#09090b", borderTop: "1px solid #27272a",
            padding: isMobile ? "10px 12px" : "12px 16px",
            display: "flex", alignItems: "center", gap: "10px", flexShrink: 0,
          }}>
            <input ref={inputRef} type="text" placeholder="Ask me anything..."
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} disabled={isSending} maxLength={500}
              style={{
                flex: 1, background: "#27272a", border: "1px solid #3f3f46",
                borderRadius: "12px", padding: isMobile ? "11px 14px" : "10px 14px",
                fontSize: isMobile ? "15px" : "13.5px",
                color: "white", outline: "none",
                transition: "border-color 0.15s", opacity: isSending ? 0.5 : 1,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0ea5e9"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = "#3f3f46"; }}
            />
            <button onClick={() => handleSend()} disabled={isSending || !input.trim()}
              style={{
                width: isMobile ? "44px" : "40px", height: isMobile ? "44px" : "40px",
                flexShrink: 0, borderRadius: "12px",
                background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
                border: "none", cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: isSending || !input.trim() ? 0.4 : 1,
                transition: "all 0.15s", boxShadow: "0 4px 12px rgba(14,165,233,0.4)",
              }}>
              <svg style={{ width: "16px", height: "16px", fill: "white" }} viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center", fontSize: "10px", color: "#52525b",
            padding: "6px", background: "#09090b", borderTop: "1px solid #27272a", flexShrink: 0,
          }}>
            Powered by <span style={{ color: "#38bdf8", fontWeight: 600 }}>Notionnik AI</span>
          </div>

          <style>{`
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
            @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
          `}</style>
        </div>
      )}
    </>
  );
}