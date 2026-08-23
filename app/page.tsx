'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import PopularCarousel from '@/components/PopularCarousel';
import MenuTabs from '@/components/MenuTabs';
import ComboDeals from '@/components/ComboDeals';
import ProductDetailModal from '@/components/ProductDetailModal';
import Testimonials from '@/components/Testimonials';
import LocationHours from '@/components/LocationHours';
import StickyMenuButton from '@/components/StickyMenuButton';
import { MenuItem, Category, StoreSettings } from '@/lib/types';

export default function HomePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | undefined>(undefined);
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [menuRes, settingsRes] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/settings'),
        ]);

        const menuData = await menuRes.json();
        const settingsData = await settingsRes.json();

        if (menuData.success) {
          setItems(menuData.items || []);
          setCategories(menuData.categories || []);
        }
        if (settingsData.success) {
          setSettings(settingsData.settings);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <Hero />
      <PopularCarousel items={items} onQuickView={(item) => setQuickViewItem(item)} />
      <MenuTabs
        items={items}
        categories={categories}
        onQuickView={(item) => setQuickViewItem(item)}
        isHomepage={true}
      />
      <ComboDeals />
      <Testimonials />
      <LocationHours settings={settings} />
      <StickyMenuButton />

      {/* Quick View Modal */}
      {quickViewItem && (
        <ProductDetailModal
          item={quickViewItem}
          isOpen={!!quickViewItem}
          onClose={() => setQuickViewItem(null)}
        />
      )}
    </>
  );
}
