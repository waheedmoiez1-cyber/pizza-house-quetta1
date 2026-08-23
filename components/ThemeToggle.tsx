'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('phq_theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('phq_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  if (!mounted) {
    return (
      <button
        className="p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-white/5 text-white/80 border border-white/10 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <Moon className="w-4 h-4" />
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      className={`relative p-2.5 min-h-[44px] min-w-[44px] rounded-full transition-all duration-300 flex items-center justify-center border shadow-md ${
        theme === 'dark'
          ? 'bg-white/5 hover:bg-white/15 text-[#F4B93B] border-white/15 hover:border-amber-400/50 shadow-black/40'
          : 'bg-amber-500/15 hover:bg-amber-500/25 text-[#C8102E] border-amber-500/30 shadow-amber-500/15'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'Warm Light' : 'Obsidian Dark'} theme`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#F4B93B]" />
        ) : (
          <Moon className="w-4 h-4 text-[#C8102E]" />
        )}
      </motion.div>
    </motion.button>
  );
}
