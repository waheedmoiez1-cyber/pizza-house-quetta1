'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MenuTabs from '@/components/MenuTabs';
import ProductDetailModal from '@/components/ProductDetailModal';
import { MenuItem, MenuCategory } from '@/lib/types';
import { Utensils, Flame } from 'lucide-react';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.success) {
          setItems(data.items);
          setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  return (
    <div className="pt-8 pb-20">
      {/* Top Banner */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8102E]/15 text-[#C8102E] text-xs font-bold uppercase tracking-wider mb-3 border border-red-500/30">
          <Flame className="w-3.5 h-3.5" />
          Full Menu Catalog
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">
          Explore Our <span className="text-[#F4B93B]">Complete Menu</span>
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)] text-sm max-w-xl mx-auto">
          Over 40+ fresh hand-tossed pizzas, crispy zinger burgers, shawarma wraps, paratha rolls & broast!
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[var(--color-text-muted)]">
          <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading Menu Catalog...</span>
        </div>
      ) : (
        <MenuTabs
          items={items}
          categories={categories}
          onQuickView={(item) => setQuickViewItem(item)}
        />
      )}

      {quickViewItem && (
        <ProductDetailModal
          item={quickViewItem}
          isOpen={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
        />
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[var(--color-text-muted)]">Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}
