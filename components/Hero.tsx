'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Star, Clock, Flame, ShoppingBag, Check, Zap, ChevronLeft, ChevronRight, X, Tag, Utensils } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { MenuItem } from '@/lib/types';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [showScrollPopup, setShowScrollPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [promoClaimed, setPromoClaimed] = useState(false);
  const [heroImgSrc, setHeroImgSrc] = useState('');

  const heroRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Parallax Scroll Hooks
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 150]);
  const textY = useTransform(scrollY, [0, 800], [0, 80]);
  const stageY = useTransform(scrollY, [0, 800], [0, -40]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % showcaseItems.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Detect scroll position to show promo popup
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120 && !popupDismissed) {
        setShowScrollPopup(true);
      } else if (window.scrollY <= 120) {
        setShowScrollPopup(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [popupDismissed]);

  // 6 Showcase Food Items for interactive carousel
  const showcaseItems: (MenuItem & { tag: string; popBadge1: string; popBadge2: string })[] = [
    {
      id: 'p-1',
      name: 'Chicken Tikka Pizza',
      slug: 'chicken-tikka-pizza',
      categoryId: 'pizza',
      price: 605,
      description: 'Chicken tikka, onion, cheddar, mozzarella, green pepper & pizza sauce',
      image: '/images/tikka_pizza.jpg',
      isBestseller: true,
      isPopular: true,
      isSpicy: true,
      isAvailable: true,
      rating: 4.9,
      prepTime: '15-20 min',
      tag: '#1 Bestseller In Quetta',
      popBadge1: '🔥 Melted Mozzarella Pulled Fresh',
      popBadge2: '⭐ 4.9 Rated Top Tikka Pizza',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b-3',
      name: 'Crispy Zinger Burger',
      slug: 'zinger-burger',
      categoryId: 'burgers',
      price: 385,
      description: 'Signature crispy golden zinger chicken fillet with fresh coleslaw & spicy red sauce',
      image: '/images/zinger_burger.jpg',
      isBestseller: true,
      isPopular: true,
      isSpicy: true,
      isAvailable: true,
      rating: 4.9,
      prepTime: '12 min',
      tag: 'Crispy Zinger Specialty',
      popBadge1: '🍗 Double Crunchy Chicken Fillet',
      popBadge2: '🌶️ Signature Spicy Mayo Dip',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p-10',
      name: 'Crown Crust Pizza',
      slug: 'crown-crust-pizza',
      categoryId: 'pizza',
      price: 880,
      description: 'Royal crown-shaped crust filled with melted cheesy kabab nuggets & loaded chicken center',
      image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800&auto=format&fit=crop',
      isBestseller: true,
      isPopular: true,
      isSpicy: false,
      isAvailable: true,
      rating: 5.0,
      prepTime: '25 min',
      tag: 'Royal Kabab Crown Crust',
      popBadge1: '👑 Cheesy Kabab Stuffed Nuggets',
      popBadge2: '🌟 Royal Crown Favorite',
      createdAt: new Date().toISOString(),
    },
    {
      id: 's-4',
      name: 'Jumbo Shawarma',
      slug: 'jumbo-shawarma',
      categoryId: 'shawarma',
      price: 275,
      description: 'Extra large jumbo shawarma with double chicken portion, melted cheese & extra sauce',
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop',
      isBestseller: true,
      isPopular: true,
      isSpicy: false,
      isAvailable: true,
      rating: 4.9,
      prepTime: '10 min',
      tag: 'Loaded Garlic Shawarma',
      popBadge1: '🌯 Double Portion Grilled Chicken',
      popBadge2: '🧄 Extra Creamy Garlic Mayo',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'c-1',
      name: 'Broast Chicken',
      slug: 'broast',
      categoryId: 'crispy',
      price: 500,
      description: '2 pieces crispy fried chicken broast served with golden french fries, bun & garlic mayo dip',
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
      isBestseller: true,
      isPopular: true,
      isSpicy: false,
      isAvailable: true,
      rating: 4.8,
      prepTime: '15 min',
      tag: 'Golden Deep-Fried Broast',
      popBadge1: '🔥 Deep-Fried Golden Crunch',
      popBadge2: '🍟 Served with Fries & Dip',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'f-2',
      name: 'Pizza Fries',
      slug: 'pizza-fries',
      categoryId: 'fries',
      price: 500,
      description: 'Loaded french fries smothered in rich pizza sauce, melted mozzarella cheese, chicken tikka & jalapeños',
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?q=80&w=800&auto=format&fit=crop',
      isBestseller: true,
      isPopular: true,
      isSpicy: true,
      isAvailable: true,
      rating: 4.9,
      prepTime: '10 min',
      tag: 'Molten Mozzarella Fries',
      popBadge1: '🧀 Smothered Melted Cheese',
      popBadge2: '🌶️ Loaded Tikka & Jalapeños',
      createdAt: new Date().toISOString(),
    },
  ];

  const currentItem = showcaseItems[activeIdx];

  useEffect(() => {
    setHeroImgSrc(currentItem.image);
  }, [activeIdx, currentItem.image]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % showcaseItems.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
  };

  const handleAddToCart = () => {
    addItem(currentItem);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const handleClaimPromo = () => {
    navigator.clipboard.writeText('QUETTA10');
    setPromoClaimed(true);
    setTimeout(() => setPromoClaimed(false), 2000);
  };

  const marqueeItems = [
    '🔥 Hot & Fast Delivery in Quetta',
    '🍕 100% Real Mozzarella Cheese',
    '🍔 Crispy Zinger Burger Fillets',
    '🚚 Free Delivery on Orders Over Rs. 1500',
    '🌟 4.7/5 Rated by 5,000+ Foodies',
    '👑 Crown Crust & Molten Lava Specialties',
  ];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col justify-between overflow-hidden bg-[var(--color-dark)] pt-6 sm:pt-8 pb-0 select-none transition-colors duration-300"
    >
      {/* Interactive Background Follower */}
      <div
        className="absolute w-96 h-96 rounded-full bg-[#F4B93B]/20 blur-[100px] pointer-events-none transition-transform duration-100 ease-out z-0"
        style={{
          transform: `translate3d(${mousePos.x + 300}px, ${mousePos.y + 200}px, 0)`,
        }}
      />

      {/* Parallax Background Ambient Glow Orbs */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 -left-20 w-96 h-96 bg-[#C8102E]/35 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-0 w-[550px] h-[550px] bg-[#F4B93B]/25 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[var(--color-dark)]/60 to-[var(--color-dark)]" />
      </motion.div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 w-full pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline, CTAs & Spacious Feature Badges */}
          <motion.div style={{ y: textY }} className="lg:col-span-6 text-center lg:text-left">
            {/* Live Social Proof Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border-[#F4B93B]/40 text-[#FFF8ED] text-xs font-semibold mb-6 shadow-2xl backdrop-blur-2xl"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <Flame className="w-4 h-4 text-[#F4B93B]" />
              <span>18 fresh pizzas delivered in Quetta in the last hour!</span>
            </motion.div>

            {/* Main Shimmering Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase leading-[1.01]"
            >
              Quetta&apos;s Favorite <br />
              <span className="text-shimmer">Slice Since Day One</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-5 text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Hand-tossed golden crusts, 100% real melted mozzarella, loaded zinger burgers, spicy shawarma wraps, and golden crispy broast delivered smoking hot across Toghi Road!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 min-h-[44px] rounded-full bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white font-bold text-base tracking-wider uppercase shadow-[0_10px_35px_0_rgba(200,16,46,0.55)] hover:shadow-[0_15px_45px_0_rgba(200,16,46,0.75)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group border border-red-400/40"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <a
                href="tel:03001234567"
                className="w-full sm:w-auto px-8 py-4 min-h-[44px] rounded-full glass-panel hover:bg-black/10 dark:hover:bg-white/15 text-[var(--color-text-primary)] font-bold text-base tracking-wider uppercase border border-[var(--color-border)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#F4B93B]" />
                <span>Call Hotline (0300-1234567)</span>
              </a>
            </motion.div>

            {/* Feature Micro-Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 mb-6 pt-6 border-t border-[var(--color-border)] grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0"
            >
              <div className="glass-panel p-3 rounded-2xl border border-[var(--color-border)] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F4B93B]/15 border border-[#F4B93B]/30 flex items-center justify-center text-[#F4B93B] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">30-Min</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Hot Delivery</p>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-2xl border border-[var(--color-border)] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C8102E]/15 border border-[#C8102E]/30 flex items-center justify-center text-[#C8102E] shrink-0">
                  <Star className="w-4 h-4 fill-[#F4B93B] text-[#F4B93B]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">4.7 / 5.0</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">5,000+ Foodies</p>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-2xl border border-[var(--color-border)] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#F4B93B]/15 border border-[#F4B93B]/30 flex items-center justify-center text-[#F4B93B] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">100% Halal</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Fresh Ingredients</p>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-2xl border border-[var(--color-border)] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#C8102E]/15 border border-[#C8102E]/30 flex items-center justify-center text-[#C8102E] shrink-0">
                  <Flame className="w-4 h-4 text-[#C8102E]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">Toghi Road</p>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Quetta Outlet</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Enhanced Showcase Stage with 3D Card Deck & Spring Pop-Up Animations */}
          <motion.div
            style={{ y: stageY }}
            className="lg:col-span-6 flex flex-col items-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Navigation Header */}
            <div className="w-full max-w-lg flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#F4B93B] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 animate-spin text-[#F4B93B]" style={{ animationDuration: '6s' }} />
                <span>Interactive Showcase ({activeIdx + 1} / {showcaseItems.length})</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-colors border border-white/10"
                  aria-label="Previous item"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Indicator Dots */}
                <div className="flex items-center gap-1.5 px-2">
                  {showcaseItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeIdx ? 'w-5 bg-[#F4B93B]' : 'bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full glass-panel hover:bg-white/20 text-white transition-colors border border-white/10"
                  aria-label="Next item"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Showcase Stage Container with 3D Stacked Card Deck */}
            <div className="w-full max-w-lg relative min-h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing">
              {/* Pulsing Backlight Halo behind Food Frame */}
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-tr from-[#C8102E]/30 to-[#F4B93B]/30 blur-2xl animate-pulse pointer-events-none" />

              {/* 3D Stacked Deck Card Layer 1 (Offset) */}
              <div className="absolute -bottom-3 inset-x-5 h-[90%] rounded-3xl glass-card bg-black/60 border border-white/10 opacity-60 pointer-events-none z-0 transform translate-y-3 scale-[0.96] shadow-xl" />
              {/* 3D Stacked Deck Card Layer 2 (Deep Offset) */}
              <div className="absolute -bottom-6 inset-x-8 h-[85%] rounded-3xl glass-card bg-black/40 border border-white/5 opacity-30 pointer-events-none -z-10 transform translate-y-6 scale-[0.92] shadow-md" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) handleNext();
                    if (offset.x > 50) handlePrev();
                  }}
                  initial={{ opacity: 0, scale: 0.94, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.94, x: -40 }}
                  transition={{ duration: 0.35 }}
                  className="w-full glass-card rounded-3xl p-6 border border-white/15 shadow-2xl flex flex-col justify-between relative overflow-hidden z-10"
                >
                  {/* Top Header Tags */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-red-400/30">
                      <Flame className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                      {currentItem.tag}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#F4B93B] bg-[#F4B93B]/10 px-3 py-1 rounded-full border border-[#F4B93B]/20">
                      <Star className="w-3.5 h-3.5 fill-[#F4B93B]" /> {currentItem.rating} ★
                    </span>
                  </div>

                  {/* AI Photography Food Image Frame with Interactive Pop-Up Micro Badges */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-4 bg-black group">
                    <Image
                      src={heroImgSrc || currentItem.image}
                      alt={currentItem.name}
                      fill
                      priority
                      onError={() => setHeroImgSrc(currentItem.categoryId === 'burgers' ? '/images/zinger_burger.jpg' : '/images/tikka_pizza.jpg')}
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-85" />

                    {/* Spring Pop-Up Micro-Badge #1 (Top Right) */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
                      className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-extrabold text-[10px] uppercase tracking-wider shadow-xl border border-red-400/40 flex items-center gap-1.5 z-20 backdrop-blur-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F4B93B] animate-spin" style={{ animationDuration: '4s' }} />
                      <span>{currentItem.popBadge1}</span>
                    </motion.div>

                    {/* Spring Pop-Up Micro-Badge #2 (Bottom Left) */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.25 }}
                      className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#F4B93B]/50 text-[#F4B93B] font-extrabold text-[10px] uppercase tracking-wider shadow-xl flex items-center gap-1.5 z-20"
                    >
                      <Utensils className="w-3.5 h-3.5 text-[#F4B93B]" />
                      <span>{currentItem.popBadge2}</span>
                    </motion.div>

                    {/* Heat Emitter Badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-red-600/80 text-white font-bold text-[9px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-300 animate-bounce" />
                      Hot Served
                    </div>
                  </div>

                  {/* Meta & Interactive Spring CTA Action */}
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                      {currentItem.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mb-4 line-clamp-2 leading-relaxed font-medium">
                      {currentItem.description}
                    </p>

                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 22, delay: 0.3 }}
                      className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold block">Price</span>
                        <span className="text-2xl font-extrabold text-[#F4B93B]">
                          Rs. {currentItem.price.toLocaleString('en-PK')}
                        </span>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className={`px-6 py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2 shadow-lg ${
                          addedToast
                            ? 'bg-green-600 text-white shadow-green-600/40 scale-105'
                            : 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white hover:scale-105 shadow-red-600/30 border border-red-500/30'
                        }`}
                      >
                        {addedToast ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Live Marquee Ticker Pinned Cleanly at Bottom */}
      <div className="relative z-10 mt-10 py-4 bg-[#C8102E]/25 border-y border-[#C8102E]/40 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-widest text-[#FFF8ED]">
              <span>{item}</span>
              <Zap className="w-3.5 h-3.5 text-[#F4B93B]" />
            </span>
          ))}
        </div>
      </div>

      {/* Scroll-Driven Floating Popup Banner */}
      <AnimatePresence>
        {showScrollPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl glass-panel p-3.5 sm:p-4 rounded-full border-2 border-[#F4B93B]/60 shadow-[0_12px_45px_rgba(200,16,46,0.5)] flex items-center justify-between gap-3 text-white backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#C8102E] to-[#F4B93B] flex items-center justify-center text-white shrink-0 shadow-lg animate-pulse">
                <Tag className="w-4 h-4" />
              </div>

              <div className="text-left">
                <p className="text-xs font-extrabold text-[#F4B93B] flex items-center gap-1.5">
                  <span>SPECIAL OFFER (10% OFF)</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#C8102E] text-white text-[9px] font-mono font-bold">
                    QUETTA10
                  </span>
                </p>
                <p className="text-[11px] text-white/90 font-medium line-clamp-1">
                  Use code <strong className="text-white">QUETTA10</strong> + Free Delivery over Rs. 1500!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleClaimPromo}
                className="px-4 py-2 rounded-full bg-[#F4B93B] hover:bg-[#e2a82d] text-[#111111] font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
              >
                {promoClaimed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <span>Claim 10%</span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowScrollPopup(false);
                  setPopupDismissed(true);
                }}
                className="p-1.5 rounded-full hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
