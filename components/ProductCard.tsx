'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Flame, Star, Eye, Check, AlertCircle, Sparkles, SlidersHorizontal } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';

interface ProductCardProps {
  item: MenuItem;
  onQuickView?: (item: MenuItem) => void;
}

export default function ProductCard({ item, onQuickView }: ProductCardProps) {
  const [addedToast, setAddedToast] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.image);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    // If it has sizes or customization options and quickview is provided, open customizer
    if (item.sizes && item.sizes.length > 0 && onQuickView) {
      onQuickView(item);
      return;
    }

    addItem(item);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const getFallbackImage = () => {
    if (item.categoryId === 'burgers') return '/images/zinger_burger.jpg';
    if (item.categoryId === 'pizza') return '/images/tikka_pizza.jpg';
    return '/images/hero_pizza.jpg';
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      onClick={() => onQuickView && onQuickView(item)}
      className={`group relative pod-card w-full flex flex-col justify-between overflow-hidden shadow-2xl p-4 sm:p-4.5 cursor-pointer ${
        !item.isAvailable ? 'opacity-70 border-[var(--color-border)]' : 'hover:border-[#F4B93B]/60'
      }`}
    >
      {/* Top Image Frame Container */}
      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black shadow-xl mb-3.5 sm:mb-4 border border-[var(--color-border)]">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImgSrc(getFallbackImage())}
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />

        {/* Status Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1.5 z-10">
          {!item.isAvailable ? (
            <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white font-bold text-[10px] uppercase tracking-wider shadow-lg backdrop-blur-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          ) : (
            <>
              {item.isBestseller && (
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-extrabold text-[10px] uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-1 border border-red-400/30"
                >
                  <Star className="w-3 h-3 fill-white text-white" />
                  Bestseller
                </motion.span>
              )}
              {item.isSpicy && (
                <span className="px-2.5 py-1 rounded-full bg-[#F4B93B] text-[#111111] font-extrabold text-[10px] uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-[#111111]" />
                  Spicy
                </span>
              )}
            </>
          )}
        </div>

        {/* Floating Price Pill Tag */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#F4B93B]/50 text-[#F4B93B] font-extrabold text-xs sm:text-sm shadow-xl z-10"
        >
          Rs. {item.price.toLocaleString('en-PK')}
        </motion.div>

        {/* Quick View / Customize Trigger Button */}
        {onQuickView && item.isAvailable && (
          <motion.button
            whileHover={{ scale: 1.12, rotate: 4 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(item);
            }}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/80 hover:bg-[#C8102E] text-white backdrop-blur-md transition-all duration-300 opacity-100 sm:opacity-90 sm:hover:opacity-100 shadow-xl flex items-center justify-center border border-white/30 z-20 cursor-pointer"
            title="Customize Toppings & Crust"
            aria-label={`Customize ${item.name}`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#F4B93B]" />
          </motion.button>
        )}
      </div>

      {/* Content Body */}
      <div className="px-1 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[#F4B93B] transition-colors line-clamp-1">
              {item.name}
            </h3>
            {item.rating && (
              <span className="flex items-center gap-1 text-xs font-extrabold text-[#F4B93B] shrink-0 bg-[#F4B93B]/10 px-2 py-0.5 rounded-full border border-[#F4B93B]/20">
                <Star className="w-3 h-3 fill-[#F4B93B]" />
                {item.rating}
              </span>
            )}
          </div>

          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed mb-3 sm:mb-4 font-medium">
            {item.description}
          </p>
        </div>

        {/* Action Buttons: Customize & Add */}
        <div className="pt-2.5 sm:pt-3 border-t border-[var(--color-border)] flex items-center gap-2">
          {onQuickView && item.isAvailable && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(item);
              }}
              className="px-3.5 py-3 min-h-[44px] rounded-xl sm:rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-[#F4B93B]/20 text-[var(--color-text-primary)] hover:text-[#F4B93B] border border-[var(--color-border)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Customize crust, cheese & extra toppings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F4B93B]" />
              <span className="hidden sm:inline">Customize</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`flex-1 py-3 min-h-[44px] rounded-xl sm:rounded-2xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              !item.isAvailable
                ? 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)] cursor-not-allowed'
                : addedToast
                ? 'bg-emerald-600 text-white shadow-emerald-600/40 border border-emerald-400/40'
                : 'bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white shadow-red-600/30 border border-red-500/30 hover:shadow-red-600/50'
            }`}
            aria-label={item.isAvailable ? `Add ${item.name} to cart` : `${item.name} is unavailable`}
          >
            {addedToast ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </motion.div>
            ) : !item.isAvailable ? (
              <span>Unavailable</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{item.sizes && item.sizes.length > 0 ? 'Choose & Add' : 'Add to Cart'}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
