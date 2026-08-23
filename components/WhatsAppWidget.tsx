'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const hotlinePhone = '923001234567';

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultMsg = message.trim() || 'Hi Pizza House Quetta! I would like to inquire about my order / menu items.';
    const encoded = encodeURIComponent(defaultMsg);
    const whatsappUrl = `https://wa.me/${hotlinePhone}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-24 right-5 z-40 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="relative p-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.5)] border border-emerald-400/40 flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white fill-white" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[var(--color-dark)] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[var(--color-dark)]" />

          {/* Hover Tooltip */}
          <div className="absolute right-16 px-3 py-1.5 rounded-xl bg-black/90 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-xl">
            Chat on WhatsApp 💬
          </div>
        </motion.button>
      )}

      {/* Pop-Up Chat Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-80 sm:w-96 glass-panel rounded-3xl p-5 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-2xl text-[var(--color-text-primary)] relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-500">
                  <MessageCircle className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Pizza House Hotline</h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online & Ready to Help
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/15 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Info */}
            <div className="bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-[var(--color-border)] mb-4 text-xs text-[var(--color-text-secondary)] leading-relaxed font-medium">
              👋 Hi there! Need quick help with your order, custom toppings, or delivery on Toghi Road? Send us a direct WhatsApp message!
            </div>

            {/* Quick Template Chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[
                'Order Status Update 🛵',
                'Menu & Deal Inquiry 🍕',
                'Custom Party Booking 👑',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(`Hi! I need help with: ${chip}`)}
                  className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400/50 text-[10px] font-bold text-[var(--color-text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-300 border border-[var(--color-border)] transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSendWhatsApp} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message or order #..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:border-emerald-400 transition-all resize-none font-sans"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 border border-emerald-400/30"
              >
                <Send className="w-4 h-4" />
                <span>Start WhatsApp Chat</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
