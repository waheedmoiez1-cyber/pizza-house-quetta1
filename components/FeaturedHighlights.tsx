'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Flame, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import { MenuItem } from '@/lib/types';

interface FeaturedHighlightsProps {
  items: MenuItem[];
  onQuickView?: (item: MenuItem) => void;
}

export default function FeaturedHighlights({ items, onQuickView }: FeaturedHighlightsProps) {
  // Curate Top 8 signature highlights
  const featuredItems = items.slice(0, 8);

  return (
    <section className="py-20 sm:py-28 bg-[#0D0D0D] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4B93B]/10 border border-[#F4B93B]/20 text-[#F4B93B] text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-3.5 h-3.5 fill-[#F4B93B]" />
                Top Signature Highlights
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
                Featured <span className="text-[#C8102E]">Menu Highlights</span>
              </h2>
              <p className="mt-2 text-white/70 text-sm sm:text-base max-w-xl">
                A hand-picked selection of our top-rated pizzas, burgers, shawarma & fries.
              </p>
            </div>

            <Link
              href="/menu"
              className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/15 flex items-center gap-2 transition-all hover:scale-105 shrink-0 self-start md:self-auto"
            >
              <span>Explore All 40+ Items</span>
              <ArrowRight className="w-4 h-4 text-[#F4B93B]" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Top 8 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={idx * 0.08}>
              <ProductCard item={item} onQuickView={onQuickView} />
            </ScrollReveal>
          ))}
        </div>

        {/* View Full Menu CTA Banner */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="mt-14 p-8 rounded-3xl glass-panel border border-[#F4B93B]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl text-center sm:text-left">
            <div>
              <h3 className="font-heading text-2xl font-bold text-white uppercase mb-1">
                Hungry for More Delicious Options?
              </h3>
              <p className="text-xs text-white/70">
                Browse our complete 40+ item catalog including Crown Crust Pizzas, Shawarma, Pasta, Wings & Pizza Fries!
              </p>
            </div>

            <Link
              href="/menu"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-2 hover:scale-105 transition-transform shrink-0"
            >
              <Sparkles className="w-4 h-4 text-[#F4B93B]" />
              <span>Browse Full 40+ Item Menu</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
