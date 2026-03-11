import { useEffect, useRef, useState } from "react";

function gearPath(cx, cy, outerR, innerR, holeR, teeth = 8) {
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
  const hp = 24;
  path += ` M${(cx + holeR).toFixed(2)},${cy.toFixed(2)}`;
  for (let i = 1; i <= hp; i++) {
    const a = (2 * Math.PI * i) / hp;
    path += ` L${(cx + holeR * Math.cos(a)).toFixed(2)},${(cy + holeR * Math.sin(a)).toFixed(2)}`;
  }
  return path + "Z";
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

const CustomCursor = () => {
  const cursorRef  = useRef(null);
  const gearRef    = useRef(null);
  const mouse      = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos        = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafId      = useRef(null);
  const rotRef     = useRef(0);
  const speedRef   = useRef(0);
  const prevMouse  = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouch,    setIsTouch]    = useState(isTouchDevice);

  // Re-check on resize (e.g. DevTools toggling)
  useEffect(() => {
    const check = () => setIsTouch(isTouchDevice());
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Manage body cursor style
  useEffect(() => {
    document.body.style.cursor = isTouch ? "" : "none";
    return () => { document.body.style.cursor = ""; };
  }, [isTouch]);

  // Mouse tracking + animation — always registered, skipped when touch
  useEffect(() => {
    if (isTouch) return; // no-op on touch devices

    const handleMouseMove = (e) => {
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      speedRef.current = Math.sqrt(dx * dx + dy * dy);
      prevMouse.current = { x: e.clientX, y: e.clientY };
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp   = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover], input, textarea, label, select"))
        setIsHovering(true);
    };
    const handleMouseOut = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover], input, textarea, label, select"))
        setIsHovering(false);
    };

    const animate = () => {
      // Direct assignment = same speed as OS default cursor
      pos.current.x = mouse.current.x;
      pos.current.y = mouse.current.y;

      const boost = Math.min(speedRef.current, 30);
      rotRef.current += 3.5 + boost * 0.6;
      speedRef.current *= 0.85;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top  = `${pos.current.y}px`;
      }
      if (gearRef.current) {
        gearRef.current.style.transform = `rotate(${rotRef.current}deg)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove",  handleMouseMove);
    document.addEventListener("mousedown",  handleMouseDown);
    document.addEventListener("mouseup",    handleMouseUp);
    document.addEventListener("mouseover",  handleMouseOver);
    document.addEventListener("mouseout",   handleMouseOut);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove",  handleMouseMove);
      document.removeEventListener("mousedown",  handleMouseDown);
      document.removeEventListener("mouseup",    handleMouseUp);
      document.removeEventListener("mouseover",  handleMouseOver);
      document.removeEventListener("mouseout",   handleMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [isTouch]); // re-run if touch state changes

  // Render nothing on touch devices — AFTER all hooks
  if (isTouch) return null;

  const arrowScale = isClicking ? 0.88 : 1;
  const gearSize   = isHovering ? 13 : 11;
  const sprocket   = gearPath(50, 50, 46, 30, 13, 8);

  const rustMain  = isHovering ? "#cd5c1a" : "#b94a12";
  const rustLight = isHovering ? "#e8752a" : "#d4611e";
  const rustGlow  = isHovering ? "rgba(205,92,26,0.9)" : "rgba(185,74,18,0.7)";
  const arrowFill = isHovering ? "#fde68a" : "#fbbf24";

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "left, top",
      }}
    >
      <svg
        width="36"
        height="44"
        viewBox="0 0 36 44"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          transform: `scale(${arrowScale})`,
          transformOrigin: "top left",
          transition: "transform 0.1s ease",
          filter: `drop-shadow(0 0 3px rgba(251,191,36,0.55)) drop-shadow(0 0 5px ${rustGlow})`,
          overflow: "visible",
        }}
        fillRule="evenodd"
      >
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="rustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rustLight} />
            <stop offset="100%" stopColor={rustMain} />
          </linearGradient>
        </defs>

        {/* Yellow arrow */}
        <path
          d="M 2 2 L 2 22 L 6.5 17 L 10 23.5 L 12.5 22.5 L 9 16 L 15 16 Z"
          fill="url(#arrowGrad)"
          stroke="#92400e"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />

        {/* Rust sprocket at the tail */}
        <g
          ref={gearRef}
          style={{
            transformOrigin: `${15 + gearSize}px ${29 + gearSize}px`,
            willChange: "transform",
          }}
        >
          <svg
            x={15}
            y={29}
            width={gearSize * 2}
            height={gearSize * 2}
            viewBox="0 0 100 100"
            overflow="visible"
          >
            <circle cx="50" cy="50" r="48" fill="none"
              stroke={rustGlow} strokeWidth="3" opacity="0.35" />
            <path d={sprocket} fill="url(#rustGrad)" fillRule="evenodd" />
            {[0, 1, 2, 3].map((i) => {
              const a = (Math.PI * 2 * i) / 4;
              const x = 50 + 22 * Math.cos(a);
              const y = 50 + 22 * Math.sin(a);
              return <circle key={i} cx={x} cy={y} r="7" fill="rgba(0,0,0,0.35)" />;
            })}
            <circle cx="50" cy="50" r="12" fill="none"
              stroke="rgba(0,0,0,0.25)" strokeWidth="3" />
            <circle cx="50" cy="50" r="6" fill={arrowFill} />
            <circle cx="50" cy="50" r="3" fill="rgba(0,0,0,0.3)" />
          </svg>
        </g>
      </svg>
    </div>
  );
};

export default CustomCursor;