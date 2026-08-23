'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Pizza } from 'lucide-react';

export default function StickyMenuButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToMenu = (e: React.MouseEvent) => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      e.preventDefault();
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <motion.div
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94 }}
          >
            <Link
              href="/menu"
              onClick={handleScrollToMenu}
              className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#F4B93B] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-[0_8px_30px_rgba(200,16,46,0.6)] hover:shadow-[0_12px_40px_rgba(200,16,46,0.8)] transition-all duration-300 flex items-center gap-2 border border-white/30 backdrop-blur-xl"
            >
              <Pizza className="w-4 h-4 text-[#F4B93B] animate-spin" style={{ animationDuration: '8s' }} />
              <span>Explore Menu 🍕</span>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
