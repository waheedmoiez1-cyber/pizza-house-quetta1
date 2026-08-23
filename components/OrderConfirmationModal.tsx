'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, ChefHat, Truck, Home, Phone, X, MessageSquare, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderConfirmationModal({ order, onClose }: OrderConfirmationModalProps) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);

  useEffect(() => {
    setCurrentOrder(order);

    if (!order?.id) return;

    // Poll server every 4 seconds to live-update order status when Admin modifies it
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        const data = await res.json();
        if (data && data.orderStatus) {
          setCurrentOrder(data);
        }
      } catch (err) {}
    }, 4000);

    return () => clearInterval(interval);
  }, [order]);

  if (!currentOrder) return null;

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'Pending', label: 'Order Received', icon: Clock },
    { status: 'Preparing', label: 'In Kitchen', icon: ChefHat },
    { status: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
    { status: 'Delivered', label: 'Delivered!', icon: Home },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'Pending':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentOrder.orderStatus);

  const orderNo = currentOrder.orderNumber || currentOrder.id;
  const whatsappMsg = encodeURIComponent(
    `Hi Pizza House Quetta! I placed order #${orderNo} for Rs. ${currentOrder.total.toLocaleString('en-PK')}. Please send me live delivery progress updates!`
  );
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMsg}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[var(--color-dark-surface)] rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 z-10 text-[var(--color-text-primary)] my-auto max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)]">Order Confirmed!</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Order Ref: <span className="text-[#F4B93B] font-bold text-sm">#{orderNo}</span>
            </p>
          </div>

          {/* Live Order Timeline Progress */}
          <div className="bg-black/5 dark:bg-black/40 p-4 rounded-2xl border border-[var(--color-border)] mb-6">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4B93B] mb-3">
              Live Kitchen Progress
            </h4>
            <div className="flex items-center justify-between relative">
              {steps.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex flex-col items-center z-10 w-1/4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 transition-all ${
                        isCurrent
                          ? 'bg-[#C8102E] text-white shadow-lg shadow-red-600/40 ring-2 ring-[#F4B93B]'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[9px] text-center font-bold uppercase ${
                        isCurrent
                          ? 'text-[#F4B93B]'
                          : isPassed
                          ? 'text-[var(--color-text-primary)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
              {/* Progress track line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-black/10 dark:bg-white/10 -z-0" />
            </div>
          </div>

          {/* Customer & Delivery Summary */}
          <div className="space-y-2.5 text-xs bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-[var(--color-border)] mb-6">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Recipient:</span>
              <span className="font-bold text-[var(--color-text-primary)]">{currentOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Contact Phone:</span>
              <span className="font-bold text-[var(--color-text-primary)]">{currentOrder.customerPhone || currentOrder.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Payment Mode:</span>
              <span className="font-bold text-[#F4B93B]">{currentOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-muted)]">Delivery Location:</span>
              <span className="font-medium text-[var(--color-text-primary)] text-right max-w-[200px] truncate">
                {currentOrder.address}
              </span>
            </div>
          </div>

          {/* Ordered items breakdown */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Items Ordered ({currentOrder.items.length})
            </h4>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {currentOrder.items.map((item: any, idx) => {
                const itemName = item.item?.name || item.name || 'Delicious Item';
                const sizeName = typeof item.selectedSize === 'object' ? item.selectedSize?.name : item.selectedSize || '';
                const price = item.unitPrice || item.price || 0;
                const qty = item.quantity || 1;
                return (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-[var(--color-border)]">
                    <span className="text-[var(--color-text-secondary)]">
                      <strong className="text-[#F4B93B]">{qty}x</strong> {itemName}
                      {sizeName ? ` (${sizeName})` : ''}
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      Rs. {(price * qty).toLocaleString('en-PK')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border)] mt-2 font-bold">
              <span className="text-sm text-[var(--color-text-primary)]">Total Paid / Due:</span>
              <span className="text-xl text-[#F4B93B]">Rs. {currentOrder.total.toLocaleString('en-PK')}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 min-h-[44px] rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Get WhatsApp Live Updates</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-3.5 min-h-[44px] rounded-2xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 text-[var(--color-text-primary)] font-bold text-xs uppercase tracking-wider transition-colors border border-[var(--color-border)]"
            >
              Close Receipt
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
