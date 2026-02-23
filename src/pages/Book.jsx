import { useEffect } from "react";

export default function Book() {

    useEffect(() => {
        // Load Calendly script only once
        if (!document.getElementById("calendly-widget")) {
            const script = document.createElement("script");
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;
            script.id = "calendly-widget";
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div className="h-screen bg-gradient-to-br from-[#00F0FF] to-[#B0E0E6] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="text-center py-8 px-4 shrink-0">
                <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">Book a Session</h1>
                <p className="text-black/80 text-lg max-w-xl mx-auto">
                    Choose a time that works for you — it'll sync directly to Google Calendar.
                </p>
            </div>

            {/* Calendly — fills remaining space */}
            <div className="flex-1 mx-4 mb-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl">
                <div
                    className="calendly-inline-widget w-full h-full"
                    data-url="https://calendly.com/notiondgzmn/30min?background_color=96c0f3"
                    style={{ minWidth: "320px", height: "100%" }}
                />
            </div>

        </div>
    );
}