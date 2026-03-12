import { useEffect, useRef, useState } from "react";
import { useTheme } from "../pages/ThemeContext";

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

// ── Rocket SVG (dark mode) ─────────────────────────────────────────────────────
function RocketIcon({ isHovering, isClicking }) {
  const scale = isClicking ? 0.88 : isHovering ? 1.12 : 1;
  return (
    <svg
      width="28" height="36"
      viewBox="0 0 28 36"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        transform: `scale(${scale}) rotate(-35deg)`,
        transformOrigin: "top left",
        transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
        filter: isHovering
          ? "drop-shadow(0 0 6px rgba(192,132,252,0.9)) drop-shadow(0 0 12px rgba(192,132,252,0.5))"
          : "drop-shadow(0 0 3px rgba(192,132,252,0.5)) drop-shadow(0 0 6px rgba(100,60,180,0.4))",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2d9f3" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="rocketWindow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
        <linearGradient id="flameFar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flameNear" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#fde68a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Exhaust flame — outer */}
      <ellipse cx="14" cy="30" rx={isHovering ? 5 : 4} ry={isHovering ? 9 : 6}
        fill="url(#flameFar)"
        style={{ transition: "all 0.2s ease" }}
      />
      {/* Exhaust flame — inner bright core */}
      <ellipse cx="14" cy="29" rx="2.5" ry={isHovering ? 5 : 3.5}
        fill="url(#flameNear)"
        style={{ transition: "all 0.2s ease" }}
      />

      {/* Fins */}
      <path d="M7 22 L3 28 L9 25 Z" fill="#7c3aed" opacity="0.85" />
      <path d="M21 22 L25 28 L19 25 Z" fill="#7c3aed" opacity="0.85" />

      {/* Main body */}
      <path
        d="M14 1 C14 1 5 8 5 18 L5 24 L23 24 L23 18 C23 8 14 1 14 1 Z"
        fill="url(#rocketBody)"
      />

      {/* Body highlight */}
      <path
        d="M14 3 C14 3 8 9 8 17 L8 22 L11 22 L11 17 C11 10 14 4 14 3 Z"
        fill="rgba(255,255,255,0.18)"
      />

      {/* Porthole window */}
      <circle cx="14" cy="15" r="4" fill="url(#rocketWindow)" />
      <circle cx="14" cy="15" r="4" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      {/* Window glint */}
      <circle cx="12.8" cy="13.8" r="1.2" fill="rgba(255,255,255,0.7)" />

      {/* Nose cone tip */}
      <circle cx="14" cy="2" r="1.5" fill="#f0e6ff" opacity="0.8" />
    </svg>
  );
}

// ── Anchor SVG (light mode) ────────────────────────────────────────────────────
function AnchorIcon({ isHovering, isClicking }) {
  const scale = isClicking ? 0.88 : isHovering ? 1.12 : 1;
  return (
    <svg
      width="28" height="34"
      viewBox="0 0 28 34"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
        filter: isHovering
          ? "drop-shadow(0 0 6px rgba(34,211,238,0.9)) drop-shadow(0 0 12px rgba(6,182,212,0.5))"
          : "drop-shadow(0 0 3px rgba(34,211,238,0.55)) drop-shadow(0 0 6px rgba(6,182,212,0.3))",
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="anchorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f7ff" />
          <stop offset="45%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="anchorShine" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Crossbar */}
      <rect x="4" y="7" width="20" height="2.8" rx="1.4" fill="url(#anchorGrad)" />
      {/* Crossbar end caps */}
      <circle cx="4.5" cy="8.4" r="2.2" fill="url(#anchorGrad)" />
      <circle cx="23.5" cy="8.4" r="2.2" fill="url(#anchorGrad)" />

      {/* Vertical shaft */}
      <rect x="12.6" y="2" width="2.8" height="26" rx="1.4" fill="url(#anchorGrad)" />

      {/* Ring at top */}
      <circle cx="14" cy="3.5" r="3.5" fill="none"
        stroke="url(#anchorGrad)" strokeWidth="2.6" />
      {/* Ring highlight */}
      <path d="M11.5 2 A3.5 3.5 0 0 1 16.5 2"
        fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Curved arms at bottom */}
      <path
        d="M13 28 C13 28 6 26 4 20 C3 17 5 15 7 16 C9 17 9 19 10 21 C11 23 13 24 14 24"
        fill="none" stroke="url(#anchorGrad)" strokeWidth="2.8" strokeLinecap="round"
      />
      <path
        d="M15 28 C15 28 22 26 24 20 C25 17 23 15 21 16 C19 17 19 19 18 21 C17 23 15 24 14 24"
        fill="none" stroke="url(#anchorGrad)" strokeWidth="2.8" strokeLinecap="round"
      />

      {/* Bottom ring */}
      <circle cx="14" cy="28.5" r="2.8" fill="none"
        stroke="url(#anchorGrad)" strokeWidth="2.4" />

      {/* Arm end circles */}
      <circle cx="4.2" cy="19.5" r="2.4" fill="url(#anchorGrad)" />
      <circle cx="23.8" cy="19.5" r="2.4" fill="url(#anchorGrad)" />

      {/* Shine overlay on shaft */}
      <rect x="13.2" y="8" width="1.4" height="14" rx="0.7" fill="url(#anchorShine)" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function CustomCursor() {
  const { isDark } = useTheme();
  const [isTouch,    setIsTouch]    = useState(isTouchDevice);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail,      setTrail]      = useState([]);
  const [clicks,     setClicks]     = useState([]);

  const cursorRef = useRef(null);
  const mouse     = useRef({ x: -200, y: -200 });
  const rafId     = useRef(null);
  const trailId   = useRef(0);
  const clickId   = useRef(0);

  useEffect(() => {
    const check = () => setIsTouch(isTouchDevice());
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.style.cursor = isTouch ? "" : "none";
    return () => { document.body.style.cursor = ""; };
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const id = ++trailId.current;
      setTrail(prev => [...prev.slice(-10), { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setTrail(prev => prev.filter(d => d.id !== id)), 380);
    };

    const onOver = (e) => {
      if (e.target.closest("a,button,[data-cursor-hover],input,textarea,label,select"))
        setIsHovering(true);
    };
    const onOut = (e) => {
      if (e.target.closest("a,button,[data-cursor-hover],input,textarea,label,select"))
        setIsHovering(false);
    };
    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);
    const onClick = (e) => {
      const id = ++clickId.current;
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setClicks(prev => prev.filter(c => c.id !== id)), 600);
    };

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouse.current.x}px`;
        cursorRef.current.style.top  = `${mouse.current.y}px`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove,  { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);
    document.addEventListener("click",     onClick);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      document.removeEventListener("click",     onClick);
      cancelAnimationFrame(rafId.current);
    };
  }, [isTouch]);

  if (isTouch) return null;

  const accentRgb  = isDark ? "192,132,252" : "34,211,238";
  const burstColor = isDark ? "#c084fc"     : "#22d3ee";

  return (
    <>
      <style>{`
        @keyframes burstRing {
          0%   { transform: scale(0.3); opacity: 0.9; }
          100% { transform: scale(2.6); opacity: 0;   }
        }
        @keyframes burstDot {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
        * { cursor: none !important; }
      `}</style>

      {/* ── Fading trail dots ───────────────────────────────────────────── */}
      {trail.map((dot, i) => {
        const opacity = ((i + 1) / trail.length) * 0.55;
        const size    = 4 + (i / trail.length) * 2;
        return (
          <div key={dot.id} style={{
            position: "fixed",
            top: dot.y - size / 2,
            left: dot.x - size / 2,
            width: size, height: size,
            borderRadius: "50%",
            background: `rgba(${accentRgb},${opacity})`,
            boxShadow: `0 0 5px 1px rgba(${accentRgb},${opacity * 0.5})`,
            pointerEvents: "none",
            zIndex: 99997,
            transition: "opacity 0.38s ease",
          }} />
        );
      })}

      {/* ── Main cursor icon ────────────────────────────────────────────── */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0, left: 0,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "left, top",
          transform: "translate(-2px, -2px)",
        }}
      >
        {isDark
          ? <RocketIcon isHovering={isHovering} isClicking={isClicking} />
          : <AnchorIcon isHovering={isHovering} isClicking={isClicking} />
        }
      </div>

      {/* ── Click burst ─────────────────────────────────────────────────── */}
      {clicks.map(({ id, x, y }) => (
        <div key={id} style={{
          position: "fixed",
          top: y, left: x,
          pointerEvents: "none",
          zIndex: 99998,
        }}>
          <div style={{
            position: "absolute",
            width: 28, height: 28,
            marginLeft: -14, marginTop: -14,
            borderRadius: "50%",
            border: `1.5px solid ${burstColor}`,
            boxShadow: `0 0 8px rgba(${accentRgb},0.4)`,
            animation: "burstRing 0.55s cubic-bezier(0.2,0,0.6,1) forwards",
          }} />
          <div style={{
            position: "absolute",
            width: 16, height: 16,
            marginLeft: -8, marginTop: -8,
            borderRadius: "50%",
            border: `1px solid rgba(${accentRgb},0.5)`,
            animation: "burstRing 0.45s 0.07s cubic-bezier(0.2,0,0.6,1) forwards",
          }} />
          {[0,60,120,180,240,300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const tx  = Math.round(Math.cos(rad) * 18);
            const ty  = Math.round(Math.sin(rad) * 18);
            return (
              <div key={deg} style={{
                position: "absolute",
                width: 4, height: 4,
                borderRadius: "50%",
                background: burstColor,
                marginLeft: -2, marginTop: -2,
                boxShadow: `0 0 5px rgba(${accentRgb},0.7)`,
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
                animation: "burstDot 0.5s cubic-bezier(0.2,0,0.8,1) forwards",
              }} />
            );
          })}
        </div>
      ))}
    </>
  );
}