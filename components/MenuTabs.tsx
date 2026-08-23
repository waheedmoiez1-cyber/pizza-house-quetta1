'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Pizza, 
  Sandwich, 
  CookingPot, 
  Drumstick, 
  Utensils, 
  Search, 
  Flame, 
  Star, 
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import ProductCard from './ProductCard';
import { MenuItem, MenuCategory } from '@/lib/types';

interface MenuTabsProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onQuickView?: (item: MenuItem) => void;
  isHomepage?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

export default function MenuTabs({
  categories,
  items,
  onQuickView,
  isHomepage = false,
}: MenuTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  // Compute item counts per category for the chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    categories.forEach((cat) => {
      counts[cat.id] = items.filter((it) => it.categoryId === cat.id).length;
    });
    return counts;
  }, [categories, items]);

  // Filtered & Sorted items pipeline
  const processedItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        // Taste / Dietary filters
        if (spicyOnly && !item.isSpicy) return false;
        if (bestsellerOnly && !item.isBestseller) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [items, activeCategory, searchQuery, spicyOnly, bestsellerOnly, sortBy]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pizza':
        return <Pizza className="w-4 h-4" />;
      case 'Wrap':
      case 'Sandwich':
        return <Sandwich className="w-4 h-4" />;
      case 'CookingPot':
        return <CookingPot className="w-4 h-4" />;
      case 'Drumstick':
        return <Drumstick className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[var(--color-dark)] relative scroll-mt-20 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header if Homepage */}
        {isHomepage && (
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8102E]/15 text-[#C8102E] text-xs font-extrabold uppercase tracking-wider mb-3 border border-red-500/30">
              <Utensils className="w-3.5 h-3.5" />
              Interactive Live Menu
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">
              Explore Our <span className="text-[#F4B93B]">Full Gourmet Menu</span>
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)] text-sm sm:text-base">
              Select a category tab below or search across 40+ handcrafted recipes with real mozzarella.
            </p>
          </div>
        )}

        {/* Toolbar with Search, Filters & Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 glass-panel p-4 rounded-3xl border border-[var(--color-border)] shadow-2xl">
          {/* Glass Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pizzas, burgers, shawarma, broast..."
              className="w-full pl-11 pr-14 py-3.5 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C8102E] border border-[var(--color-border)] transition-all font-sans"
              aria-label="Search menu catalog"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#F4B93B] hover:underline font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Filters & Sort */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0">
            {/* Spicy Filter Pill */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setSpicyOnly(!spicyOnly)}
              className={`px-4 py-2.5 min-h-[44px] rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
                spicyOnly
                  ? 'bg-[#C8102E] text-white border-red-500 shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Spicy</span>
            </motion.button>

            {/* Bestsellers Filter Pill */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setBestsellerOnly(!bestsellerOnly)}
              className={`px-4 py-2.5 min-h-[44px] rounded-2xl text-xs font-bold transition-all border flex items-center gap-1.5 shrink-0 ${
                bestsellerOnly
                  ? 'bg-[#F4B93B] text-[#111111] border-[#F4B93B] shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Bestsellers</span>
            </motion.button>

            {/* Sort Selector */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-4 py-2.5 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] text-xs font-bold border border-[var(--color-border)] focus:outline-none focus:border-[#F4B93B] cursor-pointer"
                aria-label="Sort products by"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Selection Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {/* "All" category button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-3 min-h-[44px] rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shrink-0 border ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white border-red-500 shadow-lg shadow-red-600/30'
                : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-black/10 dark:hover:bg-white/10 hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F4B93B]" />
            <span>All Items</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeCategory === 'all' ? 'bg-black/40 text-white' : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'
              }`}
            >
              {categoryCounts.all || items.length}
            </span>
          </motion.button>

          {/* Dynamic Categories from database */}
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;

            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-3 min-h-[44px] rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white border-red-500 shadow-lg shadow-red-600/30'
                    : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-black/10 dark:hover:bg-white/10 hover:text-[var(--color-text-primary)]'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isSelected ? 'bg-black/40 text-white' : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Product Cards Catalog Grid with Framer Motion Layout & Staggered Animations */}
        <AnimatePresence mode="wait">
          {processedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-3xl border border-[var(--color-border)] p-8 max-w-md mx-auto"
            >
              <Utensils className="w-12 h-12 text-[#F4B93B] mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No food items matched your search</h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-6">
                Try modifying your search query or reset the dietary filters to explore our full menu.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSpicyOnly(false);
                  setBestsellerOnly(false);
                  setActiveCategory('all');
                }}
                className="px-6 py-2.5 rounded-full bg-[#C8102E] text-white font-bold text-xs uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchQuery + spicyOnly + bestsellerOnly + sortBy}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6"
            >
              {processedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemVariants}
                  className="h-full flex"
                >
                  <ProductCard item={item} onQuickView={onQuickView} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
