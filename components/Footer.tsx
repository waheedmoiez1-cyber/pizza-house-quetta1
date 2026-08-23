'use client';

import Link from 'next/link';
import { Pizza, PhoneCall, MapPin, Clock, Heart, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '@/lib/types';

interface FooterProps {
  settings?: StoreSettings;
}

export default function Footer({ settings }: FooterProps) {
  const storeName = settings?.storeName || 'Pizza House Quetta';
  const tagline = settings?.tagline || "Quetta's Favorite Slice Since Day One";

  return (
    <footer className="bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] border-t border-[var(--color-border)] pt-16 pb-8 relative z-10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div>
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C8102E] to-[#F4B93B] flex items-center justify-center shadow-lg shadow-red-600/30">
                <Pizza className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-wider text-[var(--color-text-primary)]">
                PIZZA HOUSE <span className="text-[#F4B93B]">QUETTA</span>
              </span>
            </Link>

            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-6">
              {tagline}. Serving hand-tossed pizzas, crispy zinger burgers, stuffed rolls & broast using 100% fresh halal ingredients.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8102E] text-[var(--color-text-secondary)] hover:text-white flex items-center justify-center transition-colors border border-[var(--color-border)] text-xs font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8102E] text-[var(--color-text-secondary)] hover:text-white flex items-center justify-center transition-colors border border-[var(--color-border)] text-xs font-bold"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C8102E] text-[var(--color-text-secondary)] hover:text-white flex items-center justify-center transition-colors border border-[var(--color-border)] text-xs font-bold"
                aria-label="TikTok"
              >
                TK
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#F4B93B] uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--color-text-muted)]">
              <li>
                <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Categorized Full Menu
                </Link>
              </li>
              <li>
                <Link href="/#popular" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Bestseller Items
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Your Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Fast Order Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Food Categories */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#F4B93B] uppercase tracking-wider mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--color-text-muted)]">
              <li>
                <Link href="/menu?category=pizza" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Crown Crust & Stuffed Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=burgers" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Zinger & Double Decker Burgers
                </Link>
              </li>
              <li>
                <Link href="/menu?category=shawarma" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Creamy Chicken Shawarma
                </Link>
              </li>
              <li>
                <Link href="/menu?category=rolls" className="hover:text-white transition-colors">
                  Paratha Tikka Rolls
                </Link>
              </li>
              <li>
                <Link href="/menu?category=crispy" className="hover:text-[var(--color-text-primary)] transition-colors">
                  Golden Fried Chicken Broast
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#F4B93B] uppercase tracking-wider mb-4">
              Store Info & Delivery
            </h4>
            <div className="space-y-3 text-xs text-[var(--color-text-muted)]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <span>Toghi Road, Quetta, Balochistan</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#F4B93B] shrink-0" />
                <span>0300-1234567</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Daily: 10:00 AM – 12:00 AM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-[#C8102E] fill-[#C8102E]" /> for Quetta
            </span>
            {/* Secret subtle link for easy admin access during testing */}
            <Link
              href="/admin/login"
              className="text-[var(--color-text-muted)]/40 hover:text-[var(--color-text-muted)] transition-colors text-[10px]"
              title="Admin Portal"
            >
              [Admin Portal]
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
