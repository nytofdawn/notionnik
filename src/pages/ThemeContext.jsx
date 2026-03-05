import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("notionnik-theme") !== "light"; }
    catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem("notionnik-theme", isDark ? "dark" : "light"); }
    catch {}
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggle: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}