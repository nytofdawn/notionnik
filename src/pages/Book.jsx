import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

export default function Book() {
  const { isDark } = useTheme();
  const calendlyRef = useRef(null);

  const textMain   = isDark ? "text-white"      : "text-black";
  const textSub    = isDark ? "text-white/60"   : "text-black/80";
  const cardBg     = isDark ? "bg-white/5"      : "bg-white/10";
  const cardBorder = isDark ? "border-white/10" : "border-white/20";
  const glow       = isDark ? "0 0 30px rgba(180,60,100,0.5)" : "none";

  useEffect(() => {
    function initCalendly() {
      if (window.Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: "https://calendly.com/jannikm/30min",
          parentElement: calendlyRef.current,
        });
      }
    }
    if (!window.Calendly) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      script.onload = initCalendly;
      document.body.appendChild(script);
    } else {
      initCalendly();
    }
  }, []);

  return (
    <div className="px-4 py-16 flex flex-col items-center">
      <div className="text-center mb-6">
        <h2 className={`text-2xl sm:text-3xl font-bold mb-1 ${textMain}`} style={{ textShadow: glow }}>
          Book a Session
        </h2>
        <p className={`text-sm sm:text-base max-w-md mx-auto ${textSub}`}>
          Pick a time that works for you — it'll sync directly to Google Calendar.
        </p>
      </div>
      <div className={`w-full max-w-md rounded-2xl backdrop-blur-md border overflow-hidden shadow-lg ${cardBg} ${cardBorder}`}>
        <div ref={calendlyRef} className="w-full h-[400px] sm:h-[480px] md:h-[520px]" />
      </div>
    </div>
  );
}