"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Theme"
      className="w-12 h-6 rounded-full relative border border-gray-300 duration-300 shadow-sm overflow-hidden"
      style={{
        background: "linear-gradient(to right, rgba(255, 255, 255, 0.6), rgba(237, 235, 235, 0.6))", // Fixed grey background for both themes
      }}
    >
      {/* Subtle CMYK glow — still theme-aware */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 opacity-10 blur-sm"
            : "bg-gradient-to-r from-cyan-300 via-pink-300 to-yellow-300 opacity-15 blur-sm"
        }`}
      />

      {/* Knob with crescent moon in dark mode */}
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white z-20 transition-transform duration-300 shadow"
        style={{
          left: isDark ? "2px" : "calc(100% - 22px)",
          boxShadow: isDark ? "inset 4px 0 0 0 black" : "none", // Left-facing crescent
        }}
      />
    </button>
  );
}
