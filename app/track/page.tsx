'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Package, Clock, CheckCircle2, Truck, CookingPot, MessageCircle, AlertCircle, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

const timelineContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const timelineItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
    },
  },
};

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryOrder = searchParams.get('id') || '';
  const [searchQuery, setSearchQuery] = useState(queryOrder);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (queryOrder) {
      handleFetchOrder(queryOrder);
    }
  }, [queryOrder]);

  async function handleFetchOrder(idOrPhone: string) {
    if (!idOrPhone.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSearchedOrder(null);

    try {
      const sanitized = encodeURIComponent(idOrPhone.trim().replace(/^#+/, ''));
      const res = await fetch(`/api/orders/${sanitized}`);
      const data = await res.json();

      if (data.success && data.order) {
        setSearchedOrder(data.order);
      } else {
        setErrorMsg('No active order found for this reference. Please check your Order # (e.g. PHQ-1008) or Phone Number.');
      }
    } catch (err) {
      setErrorMsg('Failed to fetch order tracking status. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/track?id=${encodeURIComponent(searchQuery.trim())}`);
      handleFetchOrder(searchQuery.trim());
    }
  };

  // Step Status Timeline Configuration
  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const statusSteps: { key: OrderStatus; title: string; desc: string; icon: any }[] = [
    { key: 'Pending', title: 'Order Received', desc: 'Received at Toghi Road kitchen', icon: Clock },
    { key: 'Preparing', title: 'Preparing Food', desc: 'Hand-tossing dough & deck baking', icon: CookingPot },
    { key: 'Out for Delivery', title: 'Out for Delivery', desc: 'Rider dispatched to your address', icon: Truck },
    { key: 'Delivered', title: 'Delivered', desc: 'Order completed & enjoyed fresh!', icon: CheckCircle2 },
  ];

  const currentStep = searchedOrder ? getStepProgress(searchedOrder.orderStatus || searchedOrder.status) : 0;

  return (
    <div className="py-12 max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
      {/* Header Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8102E]/15 text-[#C8102E] text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/30">
          <Truck className="w-4 h-4 text-[#F4B93B]" />
          Real-Time Live Order Tracking
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">
          Track Your <span className="text-[#F4B93B]">Hot Order</span>
        </h1>
        <p className="mt-2 text-[var(--color-text-secondary)] text-sm sm:text-base">
          Enter your Order # (e.g. <strong className="text-[var(--color-text-primary)]">PHQ-84920</strong>) or Phone Number below to track live kitchen preparation & rider delivery status!
        </p>
      </motion.div>

      {/* Search Bar Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel p-4 sm:p-6 rounded-3xl border border-[var(--color-border)] shadow-2xl max-w-2xl mx-auto mb-12"
      >
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[var(--color-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order # or Phone Number..."
              className="w-full pl-12 pr-4 py-4 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-sm font-sans focus:outline-none focus:border-[#F4B93B] transition-all"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="px-8 py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all shrink-0 border border-red-500/30"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Track Live</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Quick Sample Order Pills */}
        <div className="flex items-center gap-2 mt-4 flex-wrap text-xs text-[var(--color-text-muted)]">
          <span className="font-semibold">Quick Search:</span>
          {['PHQ-1008', 'PHQ-1005', 'PHQ-1004', 'PHQ-1003'].map((sampleId) => (
            <button
              key={sampleId}
              type="button"
              onClick={() => {
                setSearchQuery(sampleId);
                router.push(`/track?id=${encodeURIComponent(sampleId)}`);
                handleFetchOrder(sampleId);
              }}
              className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-[#F4B93B]/20 hover:text-[#F4B93B] text-[11px] font-bold border border-[var(--color-border)] transition-all"
            >
              #{sampleId}
            </button>
          ))}
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Searched Order Tracking Card */}
      <AnimatePresence>
        {searchedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="glass-card rounded-3xl p-6 sm:p-10 border border-[var(--color-border)] shadow-2xl space-y-8"
          >
            {/* Order Header Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Order ID</span>
                  <span className="text-sm font-extrabold text-[#F4B93B] bg-[#F4B93B]/10 px-3 py-0.5 rounded-full border border-[#F4B93B]/20">
                    {searchedOrder.id}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    • {new Date(searchedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-text-primary)]">
                  Status: <span className="text-[#F4B93B]">{searchedOrder.orderStatus || searchedOrder.status}</span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFetchOrder(searchedOrder.id)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 text-[var(--color-text-primary)] text-xs font-bold transition-all border border-[var(--color-border)] flex items-center gap-2"
                  title="Refresh Status"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hi Pizza House Quetta! Inquiring about order status for #${searchedOrder.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Rider</span>
                </motion.a>
              </div>
            </div>

            {/* 4-Step Interactive Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Order Fulfillment Progress
                </h4>
                <span className="text-xs font-extrabold text-[#F4B93B] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Estimated 25–35 Mins
                </span>
              </div>

              {searchedOrder.status === 'Cancelled' || searchedOrder.orderStatus === 'Cancelled' ? (
                <div className="p-6 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-600 dark:text-red-300 text-sm font-semibold flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <span>This order was cancelled. Please contact hotline 0300-1234567 for assistance.</span>
                </div>
              ) : (
                <motion.div
                  variants={timelineContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative"
                >
                  {statusSteps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = currentStep >= stepNum;
                    const isCurrent = currentStep === stepNum;
                    const Icon = step.icon;

                    return (
                      <motion.div
                        key={step.key}
                        variants={timelineItemVariants}
                        className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${isCompleted
                          ? 'bg-[#C8102E]/15 border-red-500/50 text-[var(--color-text-primary)] shadow-md'
                          : 'bg-[var(--color-dark-surface)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                          } ${isCurrent ? 'ring-2 ring-[#F4B93B] bg-[#F4B93B]/10 shadow-lg shadow-amber-500/10' : ''}`}
                      >
                        {isCurrent && (
                          <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-0 right-0 w-16 h-16 bg-[#F4B93B]/20 blur-xl pointer-events-none"
                          />
                        )}

                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isCompleted
                              ? 'bg-[#C8102E] text-white shadow-md'
                              : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'
                              }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Step {stepNum}
                          </span>
                        </div>

                        <h4 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-1">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[var(--color-border)]">
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Delivery Details
                </h4>
                <div className="space-y-2 text-xs">
                  <p className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
                    <span className="text-[var(--color-text-muted)]">Customer:</span> {searchedOrder.customerName}
                  </p>
                  <p className="flex items-center gap-2 text-[var(--color-text-primary)] font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#F4B93B]" /> {searchedOrder.phone || searchedOrder.customerPhone}
                  </p>
                  <p className="flex items-start gap-2 text-[var(--color-text-secondary)] leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-[#C8102E] shrink-0 mt-0.5" /> {searchedOrder.address}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Order Items Summary
                </h4>
                <div className="space-y-1.5 text-xs max-h-36 overflow-y-auto pr-2">
                  {searchedOrder.items.map((it: any, idx: number) => {
                    const itemName = it.item?.name || it.name || 'Delicious Item';
                    const sizeName = typeof it.selectedSize === 'object' ? it.selectedSize?.name : (it.selectedSize || it.size || '');
                    const price = it.unitPrice || it.price || (it.totalPrice ? it.totalPrice / (it.quantity || 1) : 0);
                    const qty = it.quantity || 1;
                    const itemTotal = it.totalPrice || (price * qty);

                    return (
                      <div key={idx} className="flex justify-between items-center py-1.5 border-b border-[var(--color-border)]">
                        <span className="text-[var(--color-text-primary)]">
                          <strong className="text-[#F4B93B]">{qty}x</strong> {itemName}
                          {sizeName ? ` (${sizeName})` : ''}
                        </span>
                        <span className="font-bold text-[var(--color-text-primary)]">
                          Rs. {itemTotal.toLocaleString('en-PK')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-between items-center text-sm font-extrabold">
                  <span className="text-[var(--color-text-primary)]">Grand Total (Inc. Delivery & Tax):</span>
                  <span className="text-lg text-[#F4B93B]">
                    Rs. {searchedOrder.total.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Home Action */}
      <div className="text-center mt-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-bold transition-colors border border-[var(--color-border)] hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 text-[#F4B93B]" />
          <span>Back to Home Landing</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderTrackerPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-[var(--color-text-muted)]">
          <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Loading Order Tracker...</span>
        </div>
      }
    >
      <OrderTrackerContent />
    </Suspense>
  );
}
