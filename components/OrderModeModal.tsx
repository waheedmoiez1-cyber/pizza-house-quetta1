'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bike, 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';

interface OrderModeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}

const quettaAreas = [
  'Toghi Road & Serena Chowk',
  'Jinnah Town',
  'Quetta Cantt',
  'Model Town',
  'Satellite Town',
  'Samungli Road',
  'Alamdar Road & Marriabad',
  'Airport Road',
  'Brewery Road & IT University',
  'Zarghoon Road',
  'Shahrah-e-Iqbal & Liaquat Bazaar',
  'Other / Custom Address',
];

export default function OrderModeModal({ isOpen: propIsOpen, onClose: propOnClose, forceOpen = false }: OrderModeModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select-mode' | 'configure-details'>('select-mode');
  const [selectedMode, setSelectedMode] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedArea, setSelectedArea] = useState<string>(quettaAreas[0]);
  const [customAddress, setCustomAddress] = useState('');

  // Auto popup on website open
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
      return;
    }

    // Check if session has already dismissed or opened
    const sessionSeen = sessionStorage.getItem('phq_modal_seen');
    if (!sessionSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [propIsOpen, forceOpen]);

  const handleSelectMode = (mode: 'delivery' | 'pickup') => {
    setSelectedMode(mode);
    setStep('configure-details');
  };

  const handleStartOrder = () => {
    const preference = {
      mode: selectedMode,
      area: selectedMode === 'delivery' ? (selectedArea === 'Other / Custom Address' ? customAddress || 'Quetta' : selectedArea) : 'Toghi Road Outlet',
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('phq_order_preference', JSON.stringify(preference));
    sessionStorage.setItem('phq_modal_seen', 'true');
    setIsOpen(false);
    if (propOnClose) propOnClose();

    // Dispatch custom event so Navbar / Checkout can update live
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('phq_order_mode_changed', { detail: preference }));
    }

    // Navigate to full menu to confirm and choose food items!
    router.push('/menu');
  };

  const handleClose = () => {
    sessionStorage.setItem('phq_modal_seen', 'true');
    setIsOpen(false);
    if (propOnClose) propOnClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-mode-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-[0_25px_80px_rgba(0,0,0,0.85)] overflow-hidden z-10 my-auto"
        >
          {/* Top Decorative Brand Arch Header */}
          <div className="relative h-20 bg-gradient-to-b from-[#C8102E] via-[#A00B23] to-transparent overflow-hidden flex items-center justify-center">
            <div className="absolute -top-16 inset-x-0 h-32 bg-[#C8102E] rounded-[100%] opacity-80" />
            
            {/* Close Button (X) */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/40 hover:bg-[#C8102E] text-white transition-all duration-200 flex items-center justify-center border border-white/20 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Close order mode popup"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="p-6 sm:p-8 -mt-6">
            {step === 'select-mode' ? (
              /* Step 1: Initial Choice (Delivery vs Take Away) */
              <div className="text-center space-y-6">
                <div>
                  <h2
                    id="order-mode-modal-title"
                    className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase"
                  >
                    How would you like to order?
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-md mx-auto">
                    Choose your order method to view available deals and freshly baked items in Quetta!
                  </p>
                </div>

                {/* 2 Big Choice Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-lg mx-auto pt-2">
                  {/* Delivery Card */}
                  <motion.button
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectMode('delivery')}
                    className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#C8102E] to-[#8A0A1F] text-white border-2 border-red-400/40 shadow-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      <Bike className="w-10 h-10 text-white stroke-[1.75]" />
                    </div>

                    <div className="text-center">
                      <span className="font-heading text-2xl font-extrabold tracking-wider uppercase block">
                        Delivery
                      </span>
                      <span className="text-[11px] text-amber-200 font-semibold mt-0.5 block">
                        Hot to your doorstep (25–35m)
                      </span>
                    </div>

                    <div className="w-full pt-3 border-t border-white/15 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-white/90">
                      <span>Select Delivery</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>

                  {/* Take Away Card */}
                  <motion.button
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectMode('pickup')}
                    className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1E3A2F] to-[#12241D] text-white border-2 border-emerald-500/40 shadow-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-black/20 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                      <Store className="w-10 h-10 text-emerald-300 stroke-[1.75]" />
                    </div>

                    <div className="text-center">
                      <span className="font-heading text-2xl font-extrabold tracking-wider uppercase block">
                        Take Away
                      </span>
                      <span className="text-[11px] text-emerald-200 font-semibold mt-0.5 block">
                        Pick up at Toghi Road Outlet
                      </span>
                    </div>

                    <div className="w-full pt-3 border-t border-white/15 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wider text-white/90">
                      <span>Select Take Away</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                </div>
              </div>
            ) : (
              /* Step 2: Configure Delivery Location or View Take Away Outlet */
              <div className="space-y-6">
                {/* Switcher Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] uppercase">
                      {selectedMode === 'delivery' ? 'Select Delivery Area' : 'Pickup Store Details'}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {selectedMode === 'delivery'
                        ? 'Where should we deliver your hot food?'
                        : 'Collect fresh from our Toghi Road kitchen.'}
                    </p>
                  </div>

                  {/* Mode Toggle Button */}
                  <div className="flex items-center p-1 rounded-2xl bg-black/10 dark:bg-black/40 border border-[var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => setSelectedMode('delivery')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedMode === 'delivery'
                          ? 'bg-[#C8102E] text-white shadow-md'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMode('pickup')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedMode === 'pickup'
                          ? 'bg-emerald-700 text-white shadow-md'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Take Away</span>
                    </button>
                  </div>
                </div>

                {/* Mode Details Form / Cards */}
                {selectedMode === 'delivery' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                        Select Your Quetta Neighborhood <span className="text-[#C8102E]">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#C8102E] absolute left-4 top-1/2 -translate-y-1/2" />
                        <select
                          value={selectedArea}
                          onChange={(e) => setSelectedArea(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-bold focus:outline-none focus:border-[#F4B93B] cursor-pointer"
                        >
                          {quettaAreas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedArea === 'Other / Custom Address' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                          Specific Address / Street
                        </label>
                        <input
                          type="text"
                          value={customAddress}
                          onChange={(e) => setCustomAddress(e.target.value)}
                          placeholder="e.g. House #12, Street 4, Near..."
                          className="w-full px-4 py-3 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B]"
                        />
                      </motion.div>
                    )}

                    {/* Delivery Info Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-primary)]">25–35 Mins</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">Fast Thermal Bag Delivery</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F4B93B]/20 text-[#F4B93B] flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--color-text-primary)]">Free Delivery</p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">On orders over Rs. 1500</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Take Away Details Card */
                  <div className="space-y-4">
                    <div className="p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#C8102E]/15 text-[#C8102E] flex items-center justify-center shrink-0">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Pizza House Quetta</h4>
                            <p className="text-xs text-[var(--color-text-muted)]">Main Kitchen & Dine-In</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                          OPEN NOW
                        </span>
                      </div>

                      <div className="space-y-2 text-xs pt-2 border-t border-[var(--color-border)]">
                        <p className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          <MapPin className="w-4 h-4 text-[#C8102E] shrink-0" />
                          <span>Toghi Road, Near Serena Chowk, Quetta</span>
                        </p>
                        <p className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          <Clock className="w-4 h-4 text-[#F4B93B] shrink-0" />
                          <span>Daily: 10:00 AM – 12:00 AM Midnight</span>
                        </p>
                        <p className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Hotline: 0300-1234567</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom CTA Button: "START MY ORDER" -> Navigates to /menu */}
                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('select-mode')}
                    className="text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] underline py-2 cursor-pointer"
                  >
                    Back to Choice
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStartOrder}
                    className="flex-1 py-4 min-h-[48px] rounded-2xl bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-red-600/40 flex items-center justify-center gap-2 border border-red-400/40 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Confirm & Go To Menu ({selectedMode === 'delivery' ? 'Delivery' : 'Take Away'})</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
