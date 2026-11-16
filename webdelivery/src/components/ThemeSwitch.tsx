"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface ThemeSwitchProps {
  styles?: string;
}

export function ThemeSwitch({ styles }: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita erro de hidratação no SSR
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className={clsx("flex items-center", styles)}>
      <motion.button
        onClick={toggleTheme}
        className={clsx(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cor1 focus:ring-offset-2",
          isDark ? "bg-cor1" : "bg-linear-to-r from-amber-200 to-yellow-400"
        )}
        aria-label="Alternar tema"
        role="switch"
        aria-checked={isDark}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        <span className="sr-only">Alternar tema</span>

        <motion.span
          className={clsx(
            "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-lg",
            isDark ? "translate-x-6" : "translate-x-1"
          )}
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          <motion.div
            initial={false}
            animate={{
              rotate: isDark ? 180 : 0,
              scale: isDark ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <Moon className="h-3 w-3 text-cor1" />
            ) : (
              <Sun className="h-3 w-3 text-yellow-500" />
            )}
          </motion.div>
        </motion.span>
      </motion.button>
    </div>
  );
}
