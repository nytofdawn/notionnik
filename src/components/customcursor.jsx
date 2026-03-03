import { useEffect, useRef, useState } from "react";

function gearPath(cx, cy, outerR, innerR, holeR, teeth = 10) {
  const toothAngle = (2 * Math.PI) / teeth;
  let path = "";

  for (let i = 0; i < teeth; i++) {
    const base = toothAngle * i - Math.PI / 2;
    const t0 = base + toothAngle * 0.15;
    const t1 = base + toothAngle * 0.35;
    const t2 = base + toothAngle * 0.65;
    const t3 = base + toothAngle * 0.85;

    const x0 = cx + innerR * Math.cos(base);
    const y0 = cy + innerR * Math.sin(base);
    const x1 = cx + outerR * Math.cos(t0);
    const y1 = cy + outerR * Math.sin(t0);
    const x2 = cx + outerR * Math.cos(t1);
    const y2 = cy + outerR * Math.sin(t1);
    const x3 = cx + innerR * Math.cos(t2);
    const y3 = cy + innerR * Math.sin(t2);
    const x4 = cx + innerR * Math.cos(t3);
    const y4 = cy + innerR * Math.sin(t3);

    if (i === 0) path += `M${x0.toFixed(2)},${y0.toFixed(2)}`;
    else path += `L${x0.toFixed(2)},${y0.toFixed(2)}`;

    path += `L${x1.toFixed(2)},${y1.toFixed(2)}`;
    path += `L${x2.toFixed(2)},${y2.toFixed(2)}`;
    path += `L${x3.toFixed(2)},${y3.toFixed(2)}`;
    path += `L${x4.toFixed(2)},${y4.toFixed(2)}`;
  }
  path += "Z";

  // Center hole
  const holePoints = 40;
  path += ` M${(cx + holeR).toFixed(2)},${cy.toFixed(2)}`;
  for (let i = 1; i <= holePoints; i++) {
    const angle = (2 * Math.PI * i) / holePoints;
    path += ` L${(cx + holeR * Math.cos(angle)).toFixed(2)},${(cy + holeR * Math.sin(angle)).toFixed(2)}`;
  }
  path += "Z";

  return path;
}

// Spoke holes inside the sprocket body
function spokeHoles(cx, cy, spokeR, holeSize = 5, count = 5) {
  let paths = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = cx + spokeR * Math.cos(angle);
    const y = cy + spokeR * Math.sin(angle);
    let p = `M${(x + holeSize).toFixed(2)},${y.toFixed(2)}`;
    for (let j = 1; j <= 20; j++) {
      const a = (2 * Math.PI * j) / 20;
      p += ` L${(x + holeSize * Math.cos(a)).toFixed(2)},${(y + holeSize * Math.sin(a)).toFixed(2)}`;
    }
    p += "Z";
    paths.push(p);
  }
  return paths;
}

const CustomCursor = () => {
  const gearRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rafId = useRef(null);
  const rotationRef = useRef(0);
  const prevMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const speedRef = useRef(0);

  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      speedRef.current = Math.sqrt(dx * dx + dy * dy);
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover], input, textarea, label, select"))
        setIsHoveringLink(true);
    };
    const handleMouseOut = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover], input, textarea, label, select"))
        setIsHoveringLink(false);
    };

    const animate = () => {
      const lerp = (a, b, t) => a + (b - a) * t;
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.1);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.1);
      const speed = Math.min(speedRef.current, 30);
      rotationRef.current += 1.2 + speed * 0.35;
      speedRef.current *= 0.82;

      if (gearRef.current) {
        gearRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%) rotate(${rotationRef.current}deg)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const size = isClicking ? 38 : isHoveringLink ? 64 : 50;
  const d = gearPath(50, 50, 47, 31, 10, 10);
  const holes = spokeHoles(50, 50, 21, 4.5, 5);

  return (
    <div
      ref={gearRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "transform",
        filter: isHoveringLink
          ? "drop-shadow(0 0 8px rgba(251,191,36,0.9)) drop-shadow(0 0 20px rgba(251,191,36,0.5))"
          : "drop-shadow(0 0 6px rgba(99,102,241,0.8)) drop-shadow(0 0 16px rgba(236,72,153,0.4))",
        transition: "filter 0.3s ease",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: "width 0.2s ease, height 0.2s ease", display: "block" }}
        fillRule="evenodd"
      >
        <defs>
          {/* Main sprocket gradient — purple → pink → orange */}
          <linearGradient id="sprocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="45%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Hover gradient — yellow → amber */}
          <linearGradient id="sprocketHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>

          {/* Inner ring rim gradient */}
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
        </defs>

        {/* Main sprocket body */}
        <path
          d={d}
          fill={isHoveringLink ? "url(#sprocketHover)" : "url(#sprocketGrad)"}
          fillRule="evenodd"
          style={{ transition: "fill 0.3s ease" }}
        />

        {/* Spoke holes cutout */}
        {holes.map((h, i) => (
          <path key={i} d={h} fill="rgba(0,0,0,0.55)" fillRule="nonzero" />
        ))}

        {/* Inner rim ring */}
        <circle cx="50" cy="50" r="14" fill="none"
          stroke={isHoveringLink ? "#fbbf24" : "url(#rimGrad)"}
          strokeWidth="2.5"
          style={{ transition: "stroke 0.3s ease" }}
        />

        {/* Center bolt */}
        <circle cx="50" cy="50" r="5"
          fill={isHoveringLink ? "#fbbf24" : "#a5b4fc"}
          style={{ transition: "fill 0.3s ease" }}
        />
        <circle cx="50" cy="50" r="2.5" fill="rgba(0,0,0,0.4)" />
      </svg>
    </div>
  );
};

export default CustomCursor;