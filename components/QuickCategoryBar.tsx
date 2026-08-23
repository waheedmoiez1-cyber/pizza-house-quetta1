'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pizza, Sandwich, Drumstick, Utensils, Flame, Sparkles, Tag, Truck, Clock } from 'lucide-react';

const categories = [
  { id: 'pizza', name: 'Pizzas', icon: Pizza, badge: 'Popular', href: '/menu?category=pizza' },
  { id: 'burgers', name: 'Burgers', icon: Sandwich, badge: 'Crispy', href: '/menu?category=burgers' },
  { id: 'shawarma', name: 'Shawarma', icon: Sandwich, badge: 'Hot', href: '/menu?category=shawarma' },
  { id: 'crispy', name: 'Broast', icon: Drumstick, badge: 'Fried', href: '/menu?category=crispy' },
  { id: 'fries', name: 'Pizza Fries', icon: Utensils, badge: 'Cheese', href: '/menu?category=fries' },
  { id: 'deals', name: 'Value Deals', icon: Tag, badge: 'Save 30%', href: '/#popular', highlight: true },
];

export default function QuickCategoryBar() {
  return (
    <div className="w-full bg-[var(--color-dark-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)] py-2.5 px-4 sm:px-6 lg:px-8 z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Category Shortcut Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4B93B] hidden md:flex items-center gap-1 shrink-0 pr-2 border-r border-[var(--color-border)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Menu:</span>
          </span>

          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.id} whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={cat.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${
                    cat.highlight
                      ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white border-red-400/40 shadow-red-600/20'
                      : 'bg-[var(--color-dark)]/50 hover:bg-[var(--color-dark)] text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-[#F4B93B]/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${cat.highlight ? 'text-white' : 'text-[#F4B93B]'}`} />
                  <span>{cat.name}</span>
                  {cat.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
                        cat.highlight ? 'bg-white/20 text-white' : 'bg-[#F4B93B]/15 text-[#C8102E] dark:text-[#F4B93B]'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Live Delivery Micro-Badge on Right */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-[var(--color-text-secondary)] shrink-0">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>30-Min Delivery across Quetta</span>
          </div>
          <span className="text-[var(--color-border)]">•</span>
          <Link
            href="/track"
            className="text-xs font-bold text-[#F4B93B] hover:underline flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
