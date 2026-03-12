import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

const API_BASE     = import.meta.env.VITE_API_URL || "";
const WEBHOOK_URL  = `${API_BASE}/api/chat`;
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

const BOOKING_KEYWORDS = [
  "book","booking","schedule","calendly","call","free call",
  "consult","consultation","meeting","appointment","talk",
  "chat with","speak with","demo","discovery","30 min","30min",
  "get started","connect","reach out","contact",
];
function isBookingIntent(text) {
  return BOOKING_KEYWORDS.some((kw) => text.toLowerCase().includes(kw));
}
const BOOKING_REPLIES = [
  "Absolutely! 🎉 Pick a time that works for you below 👇",
  "Great choice! A free 30-min call is the best way to start. Here's our Calendly 👇",
  "Of course! Click below to book your free slot 👇",
  "Sure thing! Pick a time — it syncs straight to Google Calendar 👇",
];

// ─── Booking Card ─────────────────────────────────────────────────────────────
function BookingCard() {
  return (
    <div style={{ background:"linear-gradient(135deg,#0c1a3a,#0e2a50)", border:"1px solid rgba(14,165,233,0.35)", borderRadius:"16px", padding:"16px", marginTop:"4px", boxShadow:"0 4px 20px rgba(14,165,233,0.15)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
        <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:"linear-gradient(135deg,#0ea5e9,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>📅</div>
        <div>
          <p style={{ margin:0, fontSize:"14px", fontWeight:700, color:"white", lineHeight:1.2 }}>Book a Free 30-Min Call</p>
          <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#7dd3fc" }}>with NotionNik Team</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"14px" }}>
        {[{ icon:"⏱️", label:"30 minutes" },{ icon:"🎥", label:"Video call" },{ icon:"🆓", label:"100% Free" }].map((item) => (
          <span key={item.label} style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"11px", color:"#bae6fd", background:"rgba(14,165,233,0.12)", border:"1px solid rgba(14,165,233,0.25)", borderRadius:"999px", padding:"3px 10px" }}>{item.icon} {item.label}</span>
        ))}
      </div>
      <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", width:"100%", padding:"11px 16px", background:"linear-gradient(135deg,#0ea5e9,#2563eb)", color:"white", fontWeight:700, fontSize:"14px", borderRadius:"12px", textDecoration:"none", boxShadow:"0 4px 16px rgba(14,165,233,0.45)", transition:"all 0.2s ease" }}
        onMouseEnter={(e) => { e.currentTarget.style.background="linear-gradient(135deg,#38bdf8,#3b82f6)"; e.currentTarget.style.transform="translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background="linear-gradient(135deg,#0ea5e9,#2563eb)"; e.currentTarget.style.transform="translateY(0)"; }}
      >
        <svg style={{ width:"15px", height:"15px", fill:"white", flexShrink:0 }} viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7zm0 4h7v2H7z"/></svg>
        Open Calendly & Pick a Time
        <svg style={{ width:"13px", height:"13px", fill:"white", flexShrink:0 }} viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
      </a>
      <p style={{ margin:"10px 0 0", textAlign:"center", fontSize:"10.5px", color:"#64748b" }}>
        Or visit{" "}<a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ color:"#38bdf8", textDecoration:"underline" }}>calendly.com/jannikm/30min</a>
      </p>
    </div>
  );
}

// ─── Peeking Robot SVG ────────────────────────────────────────────────────────
// Only renders head + hands gripping the edge — body is hidden "below" the screen edge
function PeekingRobotSVG({ hovered, side }) {
  const eyeGlow     = hovered ? "#00f0ff" : "#40c8ff";
  const antennaGlow = hovered ? "#fbbf24" : "#7dd3fc";
  // When peeking from left, robot faces right (normal). From right, faces left (flipped).
  const flip = side === "right" ? -1 : 1;

  return (
    <svg
      viewBox="0 0 110 100"
      width="110" height="100"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        filter: hovered
          ? "drop-shadow(0 0 12px rgba(0,240,255,0.9)) drop-shadow(0 4px 14px rgba(0,0,0,0.6))"
          : "drop-shadow(0 0 7px rgba(64,200,255,0.7)) drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
        transition: "filter 0.25s ease",
        transform: `scaleX(${flip})`,
        transformOrigin: "center center",
      }}
    >
      <defs>
        <radialGradient id="pkHeadG" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#dbeafe"/><stop offset="40%" stopColor="#93c5fd"/><stop offset="100%" stopColor="#3b82f6"/>
        </radialGradient>
        <radialGradient id="pkLimbG" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#bfdbfe"/><stop offset="100%" stopColor="#1d4ed8"/>
        </radialGradient>
        <radialGradient id="pkBodyG" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#e0f2fe"/><stop offset="50%" stopColor="#7dd3fc"/><stop offset="100%" stopColor="#2563eb"/>
        </radialGradient>
        <radialGradient id="pkEyeG" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={eyeGlow}/><stop offset="60%" stopColor="#0ea5e9"/><stop offset="100%" stopColor="#0369a1"/>
        </radialGradient>
        <radialGradient id="pkVisG" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="rgba(30,40,60,0.7)"/><stop offset="100%" stopColor="rgba(5,15,30,0.95)"/>
        </radialGradient>
        <filter id="pkEyeF">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── LEFT HAND gripping edge (appears at bottom-left of SVG) ── */}
      <g transform="translate(2, 72)">
        {/* palm */}
        <ellipse cx="18" cy="12" rx="14" ry="11" fill="url(#pkBodyG)"/>
        {/* fingers gripping down */}
        <rect x="5"  y="18" width="7" height="14" rx="3.5" fill="url(#pkLimbG)"/>
        <rect x="14" y="20" width="7" height="16" rx="3.5" fill="url(#pkLimbG)"/>
        <rect x="23" y="18" width="7" height="14" rx="3.5" fill="url(#pkLimbG)"/>
        {/* knuckle shine */}
        <ellipse cx="18" cy="8" rx="8" ry="4" fill="white" opacity="0.2"/>
      </g>

      {/* ── RIGHT HAND gripping edge ── */}
      <g transform="translate(70, 72)">
        <ellipse cx="18" cy="12" rx="14" ry="11" fill="url(#pkBodyG)"/>
        <rect x="5"  y="18" width="7" height="14" rx="3.5" fill="url(#pkLimbG)"/>
        <rect x="14" y="20" width="7" height="16" rx="3.5" fill="url(#pkLimbG)"/>
        <rect x="23" y="18" width="7" height="14" rx="3.5" fill="url(#pkLimbG)"/>
        <ellipse cx="18" cy="8" rx="8" ry="4" fill="white" opacity="0.2"/>
      </g>

      {/* ── HEAD (centered, peeking up) ── */}
      {/* Neck stub */}
      <rect x="44" y="62" width="22" height="12" rx="5" fill="#1e40af" opacity="0.8"/>

      {/* Head */}
      <ellipse cx="55" cy="40" rx="32" ry="30" fill="url(#pkHeadG)"/>
      {/* Head shine */}
      <ellipse cx="44" cy="24" rx="12" ry="8" fill="white" opacity="0.3"/>

      {/* Ear pieces */}
      <rect x="20" y="30" width="9" height="18" rx="4.5" fill="url(#pkLimbG)"/>
      <circle cx="24.5" cy="39" r="4.5" fill="#0369a1"/>
      <circle cx="24.5" cy="39" r="2.8" fill={eyeGlow} opacity="0.75"/>
      <rect x="81" y="30" width="9" height="18" rx="4.5" fill="url(#pkLimbG)"/>
      <circle cx="85.5" cy="39" r="4.5" fill="#0369a1"/>
      <circle cx="85.5" cy="39" r="2.8" fill={eyeGlow} opacity="0.75"/>

      {/* Visor */}
      <rect x="26" y="22" width="58" height="34" rx="14" fill="url(#pkVisG)"/>
      <rect x="27" y="23" width="56" height="32" rx="13" fill="none" stroke="rgba(0,240,255,0.3)" strokeWidth="1.2"/>

      {/* Eyes */}
      <circle cx="41" cy="37" r="10" fill="url(#pkEyeG)" filter="url(#pkEyeF)"/>
      <circle cx="41" cy="37" r="7"  fill="#003366"/>
      <circle cx="41" cy="37" r="4.5" fill={eyeGlow} opacity="0.9"/>
      <circle cx="37.5" cy="33.5" r="2.2" fill="white" opacity="0.6"/>
      <circle cx="41" cy="37" r="10" fill="none" stroke={eyeGlow} strokeWidth="1" opacity="0.5"/>

      <circle cx="69" cy="37" r="10" fill="url(#pkEyeG)" filter="url(#pkEyeF)"/>
      <circle cx="69" cy="37" r="7"  fill="#003366"/>
      <circle cx="69" cy="37" r="4.5" fill={eyeGlow} opacity="0.9"/>
      <circle cx="65.5" cy="33.5" r="2.2" fill="white" opacity="0.6"/>
      <circle cx="69" cy="37" r="10" fill="none" stroke={eyeGlow} strokeWidth="1" opacity="0.5"/>

      {/* Eyebrows — raised = curious peek */}
      <path d="M 31 25 Q 41 20 51 25" fill="none" stroke="rgba(180,220,255,0.6)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 59 25 Q 69 20 79 25" fill="none" stroke="rgba(180,220,255,0.6)" strokeWidth="2" strokeLinecap="round"/>

      {/* Smile */}
      <path d={hovered ? "M 42 50 Q 55 58 68 50" : "M 43 50 Q 55 56 67 50"} fill="none" stroke={eyeGlow} strokeWidth="2.5" strokeLinecap="round"/>

      {/* Cheek blushes */}
      <circle cx="32" cy="48" r="2" fill={eyeGlow} opacity="0.45"/>
      <circle cx="28" cy="48" r="1.3" fill={eyeGlow} opacity="0.28"/>
      <circle cx="78" cy="48" r="2" fill={eyeGlow} opacity="0.45"/>
      <circle cx="82" cy="48" r="1.3" fill={eyeGlow} opacity="0.28"/>

      {/* Antennas */}
      <line x1="42" y1="12" x2="34" y2="-4" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="34" cy="-5" r="4.5" fill={antennaGlow}/>
      <circle cx="34" cy="-5" r="2.5" fill="white" opacity="0.6"/>
      <line x1="68" y1="12" x2="76" y2="-4" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="76" cy="-5" r="4.5" fill={antennaGlow}/>
      <circle cx="76" cy="-5" r="2.5" fill="white" opacity="0.6"/>
    </svg>
  );
}

// ─── Peeking Robot Component ──────────────────────────────────────────────────
const PEEK_VISIBLE_MS = 5000;   // how long robot stays peeked
const PEEK_HIDDEN_MS  = 4000;   // how long robot hides before next peek
const PEEK_SLIDE_MS   = 480;    // slide animation duration

function PeekingRobot({ onOpen, hasUnread }) {
  const [side,    setSide]    = useState("right");
  const [yFrac,   setYFrac]   = useState(0.55);
  const [phase,   setPhase]   = useState("hidden");  // hidden | sliding-in | visible | sliding-out
  const [hovered, setHovered] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [fadeIn,  setFadeIn]  = useState(true);

  // Tip rotation
  useEffect(() => {
    const iv = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => { setLineIdx((i) => (i + 1) % ROBOT_LINES.length); setFadeIn(true); }, 380);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  // State machine
  useEffect(() => {
    let t;
    if (phase === "hidden") {
      t = setTimeout(() => {
        // pick new position & side
        setSide(Math.random() > 0.5 ? "left" : "right");
        setYFrac(0.2 + Math.random() * 0.55);
        setPhase("sliding-in");
      }, PEEK_HIDDEN_MS);
    }
    if (phase === "sliding-in") {
      t = setTimeout(() => setPhase("visible"), PEEK_SLIDE_MS);
    }
    if (phase === "visible") {
      t = setTimeout(() => setPhase("sliding-out"), PEEK_VISIBLE_MS);
    }
    if (phase === "sliding-out") {
      t = setTimeout(() => setPhase("hidden"), PEEK_SLIDE_MS);
    }
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "hidden") return null;

  // How far peeked head shows — head+hands = ~100px tall
  // When "peeking from bottom-left/right", the robot grips the bottom edge
  // We position it so hands grip the viewport edge at yFrac from top
  const PEEK_HEIGHT = 100; // SVG height in px
  const PEEK_WIDTH  = 110;

  // sliding transforms: slide from off-screen side
  const isSliding = phase === "sliding-in" || phase === "sliding-out";
  const offscreen = side === "right" ? `translateX(${PEEK_WIDTH + 4}px)` : `translateX(-${PEEK_WIDTH + 4}px)`;
  const onscreen  = "translateX(0px)";

  const translateX = phase === "sliding-out" ? offscreen : (phase === "sliding-in" && isSliding ? offscreen : onscreen);
  // For sliding-in we want: start offscreen → animate to onscreen
  // CSS transition handles it: we set initial=offscreen, then next tick React sets onscreen

  return (
    <>
      <div
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position:   "fixed",
          top:        `${yFrac * 100}%`,
          [side]:     "0px",
          transform:  `${phase === "visible" ? onscreen : offscreen} translateY(-50%)`,
          transition: `transform ${PEEK_SLIDE_MS}ms cubic-bezier(0.34,1.45,0.64,1)`,
          zIndex:     99980,
          cursor:     "pointer",
          userSelect: "none",
          width:      `${PEEK_WIDTH}px`,
          height:     `${PEEK_HEIGHT}px`,
        }}
      >
        {/* Unread badge */}
        {hasUnread && (
          <div style={{
            position:"absolute", top:"2px",
            [side === "left" ? "right" : "left"]: "6px",
            width:"14px", height:"14px",
            background:"#ef4444", borderRadius:"50%",
            border:"2px solid #0f172a", zIndex:3,
            animation:"pkPulse 1.5s ease-in-out infinite",
          }}/>
        )}

        {/* Speech bubble */}
        <div style={{
          position:    "absolute",
          bottom:      "108px",
          [side === "left" ? "left" : "right"]: "0px",
          background:  hovered
            ? "linear-gradient(135deg,#0ea5e9,#00f0ff)"
            : "linear-gradient(135deg,#1e40af,#0ea5e9)",
          color:       "white",
          fontSize:    "10px",
          fontFamily:  "monospace",
          fontWeight:  "bold",
          padding:     "6px 12px",
          borderRadius:"10px",
          whiteSpace:  "nowrap",
          boxShadow:   hovered
            ? "0 0 14px rgba(0,240,255,0.9)"
            : "0 0 10px rgba(14,165,233,0.7)",
          pointerEvents:"none",
          zIndex:      3,
          opacity:     phase === "visible" ? 1 : 0,
          transition:  "opacity 0.4s ease 0.2s, background 0.3s ease",
          minWidth:    "120px",
          textAlign:   "center",
          transform:   "scaleX(1)",
        }}>
          <span style={{ display:"block", opacity: fadeIn ? 1 : 0, transition:"opacity 0.35s ease" }}>
            {hovered ? "Click to chat! 💬" : ROBOT_LINES[lineIdx]}
          </span>
          {/* Tail pointing down toward robot head */}
          <div style={{
            position:"absolute", bottom:"-5px", left:"50%",
            transform:"translateX(-50%)", width:0, height:0,
            borderLeft:"5px solid transparent", borderRight:"5px solid transparent",
            borderTop:`5px solid ${hovered ? "#00f0ff" : "#0ea5e9"}`,
          }}/>
        </div>

        <PeekingRobotSVG hovered={hovered} side={side} />
      </div>

      <style>{`
        @keyframes pkPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        @keyframes pkBobble  { 0%,100%{transform:translateY(-50%)} 50%{transform:translateY(calc(-50% - 5px))} }
      `}</style>
    </>
  );
}

// ─── Floating Chat Button ─────────────────────────────────────────────────────
function FloatingChatButton({ onClick, hasUnread }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:     "fixed",
        bottom:       "24px",
        right:        "24px",
        zIndex:       99985,
        cursor:       "pointer",
        userSelect:   "none",
        display:      "flex",
        alignItems:   "center",
        gap:          "10px",
        background:   hovered
          ? "linear-gradient(135deg,#38bdf8,#3b82f6)"
          : "linear-gradient(135deg,#0ea5e9,#2563eb)",
        borderRadius: "999px",
        padding:      "12px 20px 12px 16px",
        boxShadow:    hovered
          ? "0 8px 30px rgba(14,165,233,0.65), 0 0 0 3px rgba(14,165,233,0.25)"
          : "0 6px 24px rgba(14,165,233,0.45), 0 0 0 2px rgba(14,165,233,0.15)",
        transition:   "all 0.25s cubic-bezier(0.34,1.4,0.64,1)",
        transform:    hovered ? "translateY(-3px) scale(1.04)" : "translateY(0) scale(1)",
      }}
    >
      {/* Unread badge */}
      {hasUnread && (
        <div style={{
          position:"absolute", top:"-4px", right:"-4px",
          width:"16px", height:"16px",
          background:"#ef4444", borderRadius:"50%",
          border:"2px solid #0f172a",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"9px", color:"white", fontWeight:700,
          animation:"pkPulse 1.5s ease-in-out infinite",
        }}>!</div>
      )}

      {/* Chat icon */}
      <svg style={{ width:"22px", height:"22px", fill:"white", flexShrink:0 }} viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>

      <style>{`@keyframes pkPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isMobile }) {
  const isBot  = msg.sender === "bot";
  const isUser = msg.sender === "user";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems: isUser?"flex-end":"flex-start" }}>
      <div style={{
        maxWidth: isMobile?"88%":"80%", padding:"10px 14px",
        borderRadius: isUser?"18px 18px 4px 18px":"18px 18px 18px 4px",
        fontSize: isMobile?"13px":"13.5px", lineHeight:1.55, wordBreak:"break-word",
        background: isUser?"linear-gradient(135deg,#0284c7,#2563eb)":"#27272a",
        color:"white",
        border: isBot?"1px solid rgba(63,63,70,0.6)":"none",
        boxShadow: isUser?"0 2px 12px rgba(37,99,235,0.3)":"none",
      }}>
        {isBot
          ? <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-strong:text-sky-300 prose-a:text-sky-300"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
          : msg.text}
      </div>
      {isBot && msg.showBooking && <BookingCard />}
      <span style={{ fontSize:"10px", color:"#52525b", marginTop:"3px", padding:"0 4px" }}>{msg.time}</span>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────
export default function NotionnikChatBot() {
  const [isOpen,           setIsOpen]           = useState(false);
  const [messages,         setMessages]         = useState([INITIAL_MESSAGE]);
  const [input,            setInput]            = useState("");
  const [isSending,        setIsSending]        = useState(false);
  const [hasUnread,        setHasUnread]        = useState(false);
  const [isMobile,         setIsMobile]         = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); setHasUnread(false); }
  }, [isOpen]);

  const addMessage = useCallback((msg) => {
    const time = new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
    setMessages((prev) => [...prev, { ...msg, id: Date.now(), time }]);
  }, []);

  const handleSend = async (overrideText) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isSending) return;
    setInput("");
    const wantsBooking = isBookingIntent(trimmed);
    addMessage({ sender:"user", text: trimmed });
    setIsSending(true);
    try {
      if (wantsBooking) {
        await new Promise((r) => setTimeout(r, 600));
        addMessage({ sender:"bot", text: BOOKING_REPLIES[Math.floor(Math.random() * BOOKING_REPLIES.length)], showBooking: true });
        if (!isOpen) setHasUnread(true);
        setIsSending(false);
        return;
      }
      const history = [...messages, { sender:"user", text: trimmed }].map((m) => ({
        role: m.sender === "user" ? "user" : "assistant", content: m.text,
      }));
      const res = await fetch(WEBHOOK_URL, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message: trimmed, conversation: history }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const replyText = (await res.text())?.trim() || "I'll have someone follow up shortly!";
      addMessage({ sender:"bot", text: replyText, showBooking: isBookingIntent(replyText) });
      if (!isOpen) setHasUnread(true);
    } catch {
      addMessage({ sender:"bot", text:"Oops! Something went wrong. Try again or book a free call.", showBooking: true });
    } finally {
      setIsSending(false);
    }
  };

  const handleOpen = () => { setIsOpen(true); setHasUnread(false); };

  const windowStyle = isMobile
    ? { position:"fixed", inset:0, zIndex:99990, display:"flex", flexDirection:"column", background:"#09090b", overflow:"hidden" }
    : { position:"fixed", bottom:"90px", right:"24px", width:"420px", height:"580px", zIndex:99990, display:"flex", flexDirection:"column", borderRadius:"20px", overflow:"hidden", boxShadow:"0 25px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.06)", border:"1px solid rgba(113,113,122,0.4)" };

  return (
    <>
      {/* Peeking robot — hidden when chat is open */}
      {!isOpen && <PeekingRobot onOpen={handleOpen} hasUnread={hasUnread} />}

      {/* Floating chat button — always visible when closed */}
      {!isOpen && <FloatingChatButton onClick={handleOpen} hasUnread={hasUnread} />}

      {/* Chat window */}
      {isOpen && (
        <div style={windowStyle}>

          {/* Header */}
          <div style={{ background:"#09090b", borderBottom:"1px solid #27272a", padding: isMobile?"12px 14px":"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, gap:"8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", minWidth:0 }}>
              <div style={{ width: isMobile?"38px":"42px", height: isMobile?"38px":"42px", borderRadius:"12px", background:"linear-gradient(135deg,#0ea5e9,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile?"17px":"19px", flexShrink:0, boxShadow:"0 4px 12px rgba(14,165,233,0.4)" }}>🤖</div>
              <div>
                <p style={{ fontSize: isMobile?"14px":"15px", fontWeight:700, color:"white", margin:0, lineHeight:1.2 }}>Notionnik AI</p>
                <p style={{ fontSize:"10px", color:"#34d399", margin:"2px 0 0", display:"flex", alignItems:"center", gap:"4px" }}>
                  <span style={{ display:"inline-block", width:"6px", height:"6px", background:"#34d399", borderRadius:"50%", animation:"cbPulse 2s infinite" }}/>
                  Online · replies instantly
                </p>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
              <button onClick={() => setIsOpen(false)}
                style={{ width:"30px", height:"30px", borderRadius:"8px", background:"#27272a", border:"1px solid #3f3f46", color:"#a1a1aa", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", transition:"all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background="#3f3f46"; e.currentTarget.style.color="white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background="#27272a"; e.currentTarget.style.color="#a1a1aa"; }}
              >✕</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", background:"#18181b", padding: isMobile?"14px 12px":"18px 16px", display:"flex", flexDirection:"column", gap:"10px" }}>
            {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} isMobile={isMobile}/>)}
            {isSending && (
              <div style={{ display:"flex" }}>
                <div style={{ background:"#27272a", border:"1px solid rgba(63,63,70,0.6)", borderRadius:"18px 18px 18px 4px", padding:"10px 16px", display:"flex", gap:"5px", alignItems:"center" }}>
                  {[0,1,2].map((i) => <span key={i} style={{ width:"7px", height:"7px", background:"#71717a", borderRadius:"50%", display:"inline-block", animation:`cbBounce 1s infinite ${i*0.15}s` }}/>)}
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && !isSending && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", padding: isMobile?"10px 12px":"12px 16px", background:"#18181b", borderTop:"1px solid #27272a", flexShrink:0 }}>
              {QUICK_REPLIES.map((qr) => (
                <button key={qr} onClick={() => handleSend(qr)}
                  style={{ fontSize: isMobile?"12px":"11.5px", padding:"7px 13px", borderRadius:"999px", border:"1px solid #3f3f46", background:"transparent", color:"#a1a1aa", cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor="#0ea5e9"; e.currentTarget.style.color="#38bdf8"; e.currentTarget.style.background="rgba(14,165,233,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor="#3f3f46"; e.currentTarget.style.color="#a1a1aa"; e.currentTarget.style.background="transparent"; }}
                >{qr}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ background:"#09090b", borderTop:"1px solid #27272a", padding: isMobile?"10px 12px":"12px 16px", display:"flex", alignItems:"center", gap:"10px", flexShrink:0 }}>
            <input ref={inputRef} type="text" placeholder="Ask me anything..."
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} }}
              disabled={isSending} maxLength={500}
              style={{ flex:1, background:"#27272a", border:"1px solid #3f3f46", borderRadius:"12px", padding: isMobile?"11px 14px":"10px 14px", fontSize: isMobile?"16px":"13.5px", color:"white", outline:"none", transition:"border-color 0.15s", opacity: isSending?0.5:1 }}
              onFocus={(e) => { e.currentTarget.style.borderColor="#0ea5e9"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor="#3f3f46"; }}
            />
            <button onClick={() => handleSend()} disabled={isSending||!input.trim()}
              style={{ width: isMobile?"44px":"40px", height: isMobile?"44px":"40px", flexShrink:0, borderRadius:"12px", background:"linear-gradient(135deg,#0ea5e9,#2563eb)", border:"none", cursor: isSending||!input.trim()?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity: isSending||!input.trim()?0.4:1, transition:"all 0.15s", boxShadow:"0 4px 12px rgba(14,165,233,0.4)" }}>
              <svg style={{ width:"16px", height:"16px", fill:"white" }} viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ textAlign:"center", fontSize:"10px", color:"#52525b", padding:"6px", background:"#09090b", borderTop:"1px solid #27272a", flexShrink:0 }}>
            Powered by <span style={{ color:"#38bdf8", fontWeight:600 }}>Notionnik AI</span>
          </div>

          <style>{`
            @keyframes cbPulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
            @keyframes cbBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
          `}</style>
        </div>
      )}
    </>
  );
}