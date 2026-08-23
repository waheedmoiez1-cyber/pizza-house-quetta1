'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import { MenuItem } from '@/lib/types';

interface PopularCarouselProps {
  items: MenuItem[];
  onQuickView?: (item: MenuItem) => void;
}

export default function PopularCarousel({ items, onQuickView }: PopularCarouselProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pizza' | 'burgers'>('all');

  const popularItems = items.filter((item) => item.isPopular || item.isBestseller);

  const filteredItems = popularItems.filter((item) => {
    if (activeTab === 'pizza') return item.categoryId === 'pizza';
    if (activeTab === 'burgers') return item.categoryId === 'burgers';
    return true;
  });

  return (
    <section id="popular" className="py-20 sm:py-28 bg-[var(--color-dark)] relative border-t border-b border-[var(--color-border)] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header with ScrollReveal */}
        <ScrollReveal direction="up" duration={0.6}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4B93B]/10 border border-[#F4B93B]/20 text-amber-800 dark:text-[#F4B93B] text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-3.5 h-3.5 fill-[#F4B93B] text-[#F4B93B]" />
                Most Craved In Quetta
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">
                Popular <span className="text-[#C8102E]">Bestsellers</span>
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)] text-sm sm:text-base max-w-xl">
                Hand-picked favorites loved by thousands of Quetta foodies every single day.
              </p>
            </div>

            {/* Tab Filter Pills */}
            <div className="flex items-center gap-2 glass-panel p-1.5 rounded-full border border-[var(--color-border)] self-start md:self-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 min-h-[38px] rounded-full text-xs font-bold tracking-wide transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#C8102E] text-white shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                All Popular
              </button>
              <button
                onClick={() => setActiveTab('pizza')}
                className={`px-4 py-2 min-h-[38px] rounded-full text-xs font-bold tracking-wide transition-all ${
                  activeTab === 'pizza'
                    ? 'bg-[#C8102E] text-white shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                Pizzas Only
              </button>
              <button
                onClick={() => setActiveTab('burgers')}
                className={`px-4 py-2 min-h-[38px] rounded-full text-xs font-bold tracking-wide transition-all ${
                  activeTab === 'burgers'
                    ? 'bg-[#C8102E] text-white shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                Burgers Only
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.slice(0, 8).map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={idx * 0.08}>
              <ProductCard item={item} onQuickView={onQuickView} />
            </ScrollReveal>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-panel hover:bg-black/10 dark:hover:bg-white/15 text-[var(--color-text-primary)] font-extrabold text-xs uppercase tracking-wider border border-[var(--color-border)] hover:border-amber-400/40 hover:scale-105 transition-all duration-300 shadow-xl group"
          >
            <span>Explore Full 40+ Item Menu</span>
            <ChevronRight className="w-4 h-4 text-[#F4B93B] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
