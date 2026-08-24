'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Plus, Check, ShoppingBag, Tag } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useCartStore } from '@/lib/cart-store';
import { MenuItem } from '@/lib/types';

export default function ComboDeals() {
  const [addedDealId, setAddedDealId] = useState<string | null>(null);
  const [dealImages, setDealImages] = useState<Record<string, string>>({});
  const addItem = useCartStore((state) => state.addItem);

  const deals: {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    saveBadge: string;
    image: string;
  }[] = [
    {
      id: 'deal-1',
      title: 'Family Pizza Feast',
      description: '2 Large 13" Hand-Tossed Pizzas (Choice of Flavors) + 1.5L Cold Drink',
      price: 2400,
      originalPrice: 2750,
      saveBadge: 'SAVE RS. 350',
      image: '/images/tikka_pizza.jpg',
    },
    {
      id: 'deal-2',
      title: 'Crown Crust Royale',
      description: '1 Crown Crust Pizza (Kabab Nugget Rim) + 2 Crispy Zinger Burgers',
      price: 1350,
      originalPrice: 1650,
      saveBadge: 'SAVE RS. 300',
      image: '/images/zinger_burger.jpg',
    },
    {
      id: 'deal-3',
      title: 'Midnight Craving Pack',
      description: '1 Medium 11" Pizza + 1 Loaded Pizza Fries + 2 Chilled Drinks',
      price: 1200,
      originalPrice: 1400,
      saveBadge: 'SAVE RS. 200',
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const handleAddDeal = (deal: typeof deals[0]) => {
    const mockItem: MenuItem = {
      id: deal.id,
      name: deal.title,
      slug: deal.id,
      categoryId: 'pizza',
      price: deal.price,
      description: deal.description,
      image: deal.image,
      isBestseller: true,
      isPopular: true,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    };

    addItem(mockItem);
    setAddedDealId(deal.id);
    setTimeout(() => setAddedDealId(null), 1500);
  };

  return (
    <section className="py-20 sm:py-28 bg-[var(--color-dark)] relative border-t border-[var(--color-border)] transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8102E]/15 text-[#C8102E] text-xs font-extrabold uppercase tracking-wider mb-4 border border-red-500/30">
              <Flame className="w-3.5 h-3.5" />
              Special Combo Value Deals
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">
              Chef&apos;s Special <span className="text-[#F4B93B]">Deals & Bundles</span>
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)] text-sm sm:text-base">
              Super-saver meal bundles crafted for families, friends, and late-night cravings in Quetta!
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deals.map((deal, idx) => (
            <ScrollReveal key={deal.id} direction="up" delay={idx * 0.15}>
              <motion.div
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="pod-card p-6 flex flex-col justify-between h-full relative group hover:border-[#F4B93B]/60 transition-all duration-300 shadow-2xl"
              >
                {/* Save Badge */}
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.08 }}
                  className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-[#C8102E] text-white font-extrabold text-[10px] uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-400/30 flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>{deal.saveBadge}</span>
                </motion.div>

                <div>
                  {/* Image Frame */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 bg-black border border-[var(--color-border)] shadow-xl">
                    <Image
                      src={dealImages[deal.id] || deal.image}
                      alt={deal.title}
                      fill
                      onError={() => setDealImages((prev) => ({ ...prev, [deal.id]: '/images/hero_pizza.jpg' }))}
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[#F4B93B] transition-colors">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6 font-medium">
                    {deal.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[var(--color-text-muted)] line-through block">
                      Rs. {deal.originalPrice.toLocaleString('en-PK')}
                    </span>
                    <span className="text-2xl font-extrabold text-[#F4B93B]">
                      Rs. {deal.price.toLocaleString('en-PK')}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleAddDeal(deal)}
                    className={`px-5 py-3 min-h-[44px] rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-lg ${
                      addedDealId === deal.id
                        ? 'bg-emerald-600 text-white shadow-emerald-600/40'
                        : 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white shadow-red-600/30 border border-red-500/30'
                    }`}
                    aria-label={`Add ${deal.title} deal to cart`}
                  >
                    {addedDealId === deal.id ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Added!</span>
                      </motion.div>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add Bundle</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
