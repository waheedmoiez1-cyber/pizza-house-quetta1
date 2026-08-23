'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Star, Sparkles, Check, Flame } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
}

export default function GlobalSearchModal({ isOpen, onClose, items }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 6); // default show top 6 items
    const q = query.toLowerCase().trim();
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl glass-card rounded-3xl p-6 border border-[var(--color-border)] shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)] mb-4">
            <div className="flex items-center gap-2 text-[#F4B93B] font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Search Pizza House Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-full glass-panel hover:bg-black/10 dark:hover:bg-white/20 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center"
              aria-label="Close search dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F4B93B]" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pizzas, burgers, shawarma, broast, fries..."
              className="w-full pl-12 pr-14 py-4 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-sm font-medium border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[#C8102E] font-sans"
              aria-label="Search items query"
            >
            </input>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#F4B93B] hover:underline font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Grid */}
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/20">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                <p className="text-sm font-semibold">No food items found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Try searching for &quot;Tikka&quot;, &quot;Zinger&quot;, or &quot;Crown&quot;</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-3.5 rounded-2xl glass-panel hover:border-[#F4B93B]/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--color-border)]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading text-base font-bold text-[var(--color-text-primary)] truncate">
                          {item.name}
                        </h4>
                        {item.isSpicy && (
                          <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{item.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-extrabold text-[#F4B93B]">
                          Rs. {item.price.toLocaleString('en-PK')}
                        </span>
                        {item.rating && (
                          <span className="text-[10px] text-[var(--color-text-muted)] flex items-center gap-1 font-semibold">
                            <Star className="w-3 h-3 fill-[#F4B93B] text-[#F4B93B]" />
                            {item.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className={`p-3 min-h-[44px] min-w-[44px] rounded-xl font-bold text-xs uppercase transition-all flex items-center justify-center shrink-0 ${
                      !item.isAvailable
                        ? 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)] cursor-not-allowed'
                        : addedItemId === item.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-[#C8102E] hover:bg-red-700 text-white shadow-md shadow-red-600/30 active:scale-95'
                    }`}
                    title={item.isAvailable ? 'Add to cart' : 'Out of stock'}
                  >
                    {addedItemId === item.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
