'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza, Flame } from 'lucide-react';

export default function SmoothLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[10000] bg-[#0A0A0A] flex flex-col items-center justify-center p-4 select-none"
        >
          {/* Ambient Glow */}
          <div className="absolute w-96 h-96 bg-[#C8102E]/25 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute w-96 h-96 bg-[#F4B93B]/20 rounded-full blur-[140px] pointer-events-none" />

          {/* Loader Icon Container */}
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 rounded-3xl glass-card border border-white/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <Pizza className="w-10 h-10 text-[#F4B93B] animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute -top-1 -right-1">
                <Flame className="w-5 h-5 text-[#C8102E] animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Branding Title */}
          <h2 className="font-heading text-2xl font-extrabold uppercase tracking-widest text-white mb-1">
            PIZZA HOUSE <span className="text-[#C8102E]">QUETTA</span>
          </h2>
          <p className="text-xs font-semibold text-[#F4B93B] tracking-wider uppercase mb-8">
            Quetta&apos;s Favorite Slice Since Day One
          </p>

          {/* Progress Bar */}
          <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden border border-white/10 relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="w-full h-full bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#F4B93B]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
