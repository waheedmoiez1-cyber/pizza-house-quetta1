'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FlashDealsBar from '@/components/FlashDealsBar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import OrderModeModal from '@/components/OrderModeModal';
import SmoothLoader from '@/components/SmoothLoader';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { StoreSettings, MenuItem } from '@/lib/types';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  settings: StoreSettings;
}

export default function ClientLayoutWrapper({ children, settings }: ClientLayoutWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOrderModeOpen, setIsOrderModeOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items)) {
          setMenuItems(data.items);
        } else if (Array.isArray(data)) {
          setMenuItems(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <ScrollProgressBar />
      <SmoothLoader />
      <Navbar 
        onSearchOpen={() => setIsSearchOpen(true)} 
        onOrderModeOpen={() => setIsOrderModeOpen(true)}
      />
      <FlashDealsBar />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <CartDrawer
        taxRate={settings.taxRate}
        deliveryFee={settings.deliveryFee}
        freeDeliveryThreshold={settings.freeDeliveryThreshold}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={menuItems}
      />
      <OrderModeModal
        isOpen={isOrderModeOpen}
        onClose={() => setIsOrderModeOpen(false)}
      />
      <WhatsAppWidget />
    </>
  );
}
