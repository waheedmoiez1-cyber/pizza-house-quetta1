'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Clock, Tag, ArrowRight, Check, Copy, X, Zap } from 'lucide-react';
import { StoreSettings } from '@/lib/types';

interface FlashDealsBarProps {
  settings?: StoreSettings;
}

const liveTickerItems = [
  { type: 'promo', text: '🔥 Free Delivery on orders above Rs. 1500 in Quetta! Use promo code for 10% OFF', code: 'WELCOME10' },
  { type: 'live', name: 'Dr. Tariq', area: 'Civil Hospital Area', item: '2x Crown Crust Tikka Pizzas', time: '2m ago' },
  { type: 'live', name: 'Fatima Z.', area: 'Jinnah Town', item: 'Loaded Zinger Burger + Pizza Fries', time: '4m ago' },
  { type: 'promo', text: '⚡ Midnight Craving Special: Hot deck-baked pizzas delivered in 25–35 mins!', code: 'QUETTA10' },
  { type: 'live', name: 'Kashif B.', area: 'Cantt Quetta', item: 'Family Pizza Feast (Large)', time: '7m ago' },
];

export default function FlashDealsBar({ settings }: FlashDealsBarProps) {
  const [feedIdx, setFeedIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 24, seconds: 45 });
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Rotate ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setFeedIdx((prev) => (prev + 1) % liveTickerItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  const currentItem = liveTickerItems[feedIdx];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToMenu = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#990B23] via-[#C8102E] to-[#80071B] text-white border-b border-red-400/30 py-2 px-4 sm:px-8 lg:px-12 z-30 shadow-md transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 text-xs">
        {/* Left: Flash Deal Badge & Live Countdown Timer */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-amber-300/30 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-inner">
            <Zap className="w-3.5 h-3.5 fill-current text-[#F4B93B] animate-bounce" />
            <span className="text-[#F4B93B]">Flash Deal</span>
          </div>

          <span className="font-extrabold hidden md:inline text-white/95">
            20% OFF Combos
          </span>

          <div className="flex items-center gap-1 font-mono font-extrabold text-[11px] text-[#F4B93B] bg-black/40 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
            <Clock className="w-3 h-3 text-white/70" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Center: Dynamic Animated Live Activity & Promo Ticker */}
        <div className="flex-1 hidden sm:flex items-center justify-center overflow-hidden h-6 px-4">
          <AnimatePresence mode="wait">
            {currentItem.type === 'promo' ? (
              <motion.div
                key={'promo-' + feedIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-center truncate"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F4B93B] shrink-0 animate-pulse" />
                <span className="font-semibold text-white truncate">{currentItem.text}</span>
                {currentItem.code && (
                  <button
                    onClick={() => handleCopyCode(currentItem.code!)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 hover:bg-black/60 text-[10px] font-extrabold text-[#F4B93B] border border-amber-300/40 transition-all active:scale-95 shrink-0 cursor-pointer"
                    title="Click to copy promo code"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-300" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>CODE: {currentItem.code}</span>
                      </>
                    )}
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={'live-' + feedIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 truncate"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-200 shrink-0">
                  Live in Quetta:
                </span>
                <span className="text-white/95 font-medium truncate">
                  <strong>{currentItem.name}</strong> ({currentItem.area}) ordered{' '}
                  <span className="text-[#F4B93B] font-bold">{currentItem.item}</span> • {currentItem.time}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Quick Action Claim CTA & Dismiss Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/#popular"
            onClick={scrollToMenu}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4B93B] hover:bg-[#F6C75E] text-[#111111] font-extrabold text-[11px] uppercase tracking-wider shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-black/30 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
