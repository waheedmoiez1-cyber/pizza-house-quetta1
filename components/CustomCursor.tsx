'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only run on desktop/devices with fine pointer (mouse)
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.pod-card') ||
          target.closest('.interactive-target');

        setIsHovered(Boolean(isClickable));
      }
    };

    const handleMouseDown = () => setIsPointer(true);
    const handleMouseUp = () => setIsPointer(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Hide on touch screens
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      {/* Small Glowing Inner Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-[#F4B93B] pointer-events-none z-[9999] shadow-[0_0_15px_#F4B93B] mix-blend-difference"
        animate={{
          x: mousePos.x - 6,
          y: mousePos.y - 6,
          scale: isPointer ? 0.7 : isHovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 35, mass: 0.1 }}
      />

      {/* Trailing Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full border-2 border-[#C8102E]/70 pointer-events-none z-[9998] shadow-[0_0_20px_rgba(200,16,46,0.5)]"
        animate={{
          x: mousePos.x - 18,
          y: mousePos.y - 18,
          scale: isPointer ? 0.8 : isHovered ? 1.8 : 1,
          borderColor: isHovered ? '#F4B93B' : '#C8102E',
          backgroundColor: isHovered ? 'rgba(244, 185, 59, 0.15)' : 'rgba(200, 16, 46, 0.05)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.2 }}
      />
    </>
  );
}
