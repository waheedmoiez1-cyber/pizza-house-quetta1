'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pizza, 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Phone, 
  Search, 
  Sparkles,
  Bike,
  Store,
  MapPin
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  onSearchOpen?: () => void;
  onOrderModeOpen?: () => void;
}

export default function Navbar({ onSearchOpen, onOrderModeOpen }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderPreference, setOrderPreference] = useState<{ mode: string; area: string } | null>(null);

  const { getItemCount, toggleCart, cartBounceKey } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Load initial preference
    try {
      const saved = localStorage.getItem('phq_order_preference');
      if (saved) setOrderPreference(JSON.parse(saved));
    } catch (e) {}

    // Listen to custom mode change event
    const handleModeChange = (e: any) => {
      if (e.detail) setOrderPreference(e.detail);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('phq_order_mode_changed', handleModeChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('phq_order_mode_changed', handleModeChange);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Full Menu', href: '/menu' },
    { name: 'Track Order', href: '/track', badge: 'LIVE' },
    { name: 'Popular', href: '/#popular' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Location', href: '/#location' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'glass-nav shadow-2xl py-2.5'
            : 'bg-[var(--glass-nav-bg)] backdrop-blur-md py-3.5 border-b border-[var(--color-border)]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="Pizza House Quetta Home">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C8102E] to-[#F4B93B] flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
              <Pizza className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-wider text-[var(--color-text-primary)] flex items-center gap-1.5">
                PIZZA HOUSE <span className="text-[#F4B93B]">QUETTA</span>
              </span>
              <p className="text-[10px] text-[var(--color-text-muted)] font-medium tracking-widest uppercase -mt-1 hidden sm:block">
                Quetta&apos;s Favorite Slice
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 glass-panel p-1.5 rounded-full border border-[var(--color-border)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white shadow-md shadow-red-600/30'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/10'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#F4B93B] text-[#111111] text-[9px] font-extrabold uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Delivery / Pickup Mode Selector Pill */}
            {onOrderModeOpen && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOrderModeOpen}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--color-text-primary)] text-xs font-extrabold border border-[var(--color-border)] hover:border-[#F4B93B]/50 transition-all cursor-pointer"
                title="Change Delivery or Pickup Mode"
              >
                {orderPreference?.mode === 'pickup' ? (
                  <>
                    <Store className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Take Away (Toghi Rd)</span>
                  </>
                ) : (
                  <>
                    <Bike className="w-3.5 h-3.5 text-[#C8102E]" />
                    <span className="truncate max-w-[180px] xl:max-w-none">{orderPreference?.area || 'Delivery in Quetta'}</span>
                  </>
                )}
                <span className="text-[10px] text-[#F4B93B] font-bold underline ml-0.5">Change</span>
              </motion.button>
            )}

            {/* Search Trigger Button */}
            {onSearchOpen && (
              <button
                onClick={onSearchOpen}
                className="p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-white/5 hover:bg-white/15 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)] flex items-center justify-center cursor-pointer"
                title="Search menu (Shortcut)"
                aria-label="Search food catalog"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Theme Change Toggle Button */}
            <ThemeToggle />

            {/* Cart Drawer Trigger Button */}
            <motion.button
              key={cartBounceKey}
              animate={cartBounceKey > 0 ? { scale: [1, 1.25, 1] } : {}}
              transition={{ duration: 0.3 }}
              onClick={toggleCart}
              className="relative p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white shadow-lg hover:shadow-red-600/40 hover:scale-105 transition-all duration-200 flex items-center justify-center border border-red-500/30 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4B93B] text-[#1A1A1A] font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {itemCount}
                </span>
              )}
            </motion.button>

            {/* Phone Call Hotline Pill */}
            <a
              href="tel:03001234567"
              className="hidden xl:inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-[#F4B93B] hover:bg-[#F6C75E] text-[#111111] text-xs font-extrabold uppercase tracking-wider shadow-lg transition-all duration-200"
              aria-label="Call Hotline 0300-1234567"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>0300-1234567</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-2xl bg-white/5 text-[var(--color-text-primary)] hover:bg-white/10 transition-colors border border-[var(--color-border)] flex items-center justify-center cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-x-0 top-[65px] bg-[var(--color-dark-surface)] border-b border-[var(--color-border)] shadow-2xl z-40 overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Mobile Mode Changer */}
              {onOrderModeOpen && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOrderModeOpen();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] flex items-center justify-between text-xs font-bold text-[var(--color-text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    {orderPreference?.mode === 'pickup' ? (
                      <Store className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Bike className="w-4 h-4 text-[#C8102E]" />
                    )}
                    <span>Mode: {orderPreference?.mode === 'pickup' ? 'Take Away' : orderPreference?.area || 'Delivery'}</span>
                  </span>
                  <span className="text-[#F4B93B] font-extrabold underline">Change</span>
                </button>
              )}

              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold flex items-center justify-between transition-colors ${
                      pathname === link.href
                        ? 'bg-[#C8102E] text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F4B93B] text-[#111111] text-[10px] font-extrabold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-[var(--color-border)] flex flex-col gap-2.5">
                <a
                  href="tel:03001234567"
                  className="w-full py-3.5 min-h-[44px] rounded-2xl bg-[#F4B93B] text-[#111111] text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call Hotline 0300-1234567</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
