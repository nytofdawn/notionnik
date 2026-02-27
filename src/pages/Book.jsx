import { useEffect, useRef } from "react";

export default function Book() {
  const calendlyRef = useRef(null);

  useEffect(() => {
    function initCalendly() {
      if (window.Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = ""; // IMPORTANT: reset container

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
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#00F0FF] to-[#B0E0E6] px-4 py-6 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-1">
          Book a Session
        </h1>
        <p className="text-black/80 text-sm sm:text-base max-w-md mx-auto">
          Pick a time that works for you — it’ll sync directly to Google Calendar.
        </p>
      </div>

      {/* Calendly Container */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden">
        <div
          ref={calendlyRef}
          className="w-full h-[400px] sm:h-[480px] md:h-[520px]"
        />
      </div>

    </div>
  );
}