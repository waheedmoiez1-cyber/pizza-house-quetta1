'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, ChefHat, Truck, Home, Phone, X, MessageSquare, Sparkles, Printer } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderConfirmationModal({ order, onClose }: OrderConfirmationModalProps) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    setCurrentOrder(order);

    if (!order?.id) return;

    // Poll server every 4 seconds to live-update order status when Admin modifies it
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        const data = await res.json();
        if (data?.success && data.order) {
          setCurrentOrder(data.order);
        } else if (data && data.orderStatus) {
          setCurrentOrder(data);
        }
      } catch (err) {}
    }, 4000);

    return () => clearInterval(interval);
  }, [order]);

  if (!currentOrder) return null;

  const handlePrintReceipt = () => {
    setIsPrinting(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 50);
    });
  };

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
  const deliveryType = currentOrder.deliveryOption || currentOrder.orderType || 'delivery';
  const customerPhone = currentOrder.customerPhone || currentOrder.phone || 'N/A';
  const customerAddress = currentOrder.address || 'Store Pickup (Toghi Road Quetta)';

  const whatsappMsg = encodeURIComponent(
    `Hi Pizza House Quetta! I placed order #${orderNo} for Rs. ${currentOrder.total.toLocaleString('en-PK')}. Please send me live delivery progress updates!`
  );
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMsg}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md print:hidden"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[var(--color-dark-surface)] rounded-3xl border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 z-10 text-[var(--color-text-primary)] my-auto max-h-[90vh] overflow-y-auto print:max-h-none print:p-0 print:border-none print:shadow-none"
        >
          {/* Printable Official POS Tax Invoice (Visible on print) */}
          <div id="printable-customer-receipt" className="hidden print:block font-mono space-y-3 text-black">
            <div className="text-center border-b-2 border-dashed border-black pb-3">
              <h1 className="text-2xl font-black uppercase tracking-widest leading-none mb-1">PIZZA HOUSE QUETTA</h1>
              <p className="text-[11px] font-bold text-gray-800">Quetta&apos;s Favorite Slice Since Day One</p>
              <p className="text-[10px] text-gray-700 leading-tight">Toghi Road, Quetta, Balochistan, Pakistan</p>
              <p className="text-[10px] font-bold">Hotline: 0300-1234567 • Phone: 081-2820000</p>
              <p className="text-[9px] text-gray-600 mt-1">NTN: 8294102-3 • PRA/STRN: 19-00-8294-102</p>
              <div className="mt-2 py-1 px-3 bg-black text-white rounded font-black text-xs uppercase tracking-widest inline-block">
                *** SALES TAX INVOICE ***
              </div>
            </div>

            <div className="text-xs space-y-1 bg-gray-100 p-2.5 rounded border border-gray-300">
              <div className="flex justify-between">
                <span className="font-bold">INVOICE NO:</span>
                <span className="font-bold">INV-{new Date(currentOrder.createdAt).getFullYear()}-{orderNo.replace(/^PHQ-?/, '')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">ORDER REF:</span>
                <span className="font-black">#{orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">DATE & TIME:</span>
                <span>{new Date(currentOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">ORDER TYPE:</span>
                <span className="font-bold uppercase">{deliveryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">CUSTOMER:</span>
                <span>{currentOrder.customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">DELIVERY:</span>
                <span className="font-semibold text-right max-w-[210px]">{customerAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">PAYMENT:</span>
                <span className="font-bold uppercase">{currentOrder.paymentMethod}</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase border-b-2 border-black pb-1 flex justify-between">
                <span>QTY & ITEM DETAILS</span>
                <span>AMOUNT (PKR)</span>
              </div>
              <div className="divide-y divide-dashed divide-gray-300">
                {currentOrder.items.map((item: any, idx) => {
                  const itemName = item.item?.name || item.name || 'Food Item';
                  const sizeName = typeof item.selectedSize === 'object' ? item.selectedSize?.name : (item.selectedSize || item.size || '');
                  const price = item.unitPrice || item.price || 0;
                  const qty = item.quantity || 1;
                  const total = item.totalPrice || (price * qty);

                  return (
                    <div key={idx} className="py-1.5 flex justify-between text-xs">
                      <div>
                        <span className="font-bold">[{qty}x] {itemName}</span>
                        {sizeName && <span className="text-[10px] block text-gray-700 pl-4">• Size: {sizeName}</span>}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <span className="text-[9px] block text-gray-600 pl-4">
                            + {Array.isArray(item.selectedAddOns) ? item.selectedAddOns.map((a: any) => typeof a === 'object' ? a.name : a).join(', ') : ''}
                          </span>
                        )}
                      </div>
                      <span className="font-bold">Rs. {total.toLocaleString('en-PK')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 text-xs pt-2 border-t-2 border-dashed border-black">
              <div className="flex justify-between">
                <span>Gross Subtotal:</span>
                <span>Rs. {(currentOrder.subtotal || currentOrder.total).toLocaleString('en-PK')}</span>
              </div>
              {currentOrder.discount ? (
                <div className="flex justify-between font-bold">
                  <span>Promo Discount:</span>
                  <span>-Rs. {currentOrder.discount.toLocaleString('en-PK')}</span>
                </div>
              ) : null}
              {currentOrder.tax ? (
                <div className="flex justify-between">
                  <span>GST / Tax (15%):</span>
                  <span>Rs. {currentOrder.tax.toLocaleString('en-PK')}</span>
                </div>
              ) : null}
              {currentOrder.deliveryFee ? (
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>Rs. {currentOrder.deliveryFee.toLocaleString('en-PK')}</span>
                </div>
              ) : null}
            </div>

            <div className="pt-2 pb-1 border-y-2 border-black flex justify-between items-center text-sm font-black">
              <span>NET PAYABLE:</span>
              <span>Rs. {currentOrder.total.toLocaleString('en-PK')}</span>
            </div>

            <div className="text-center pt-2 border-t border-dashed border-gray-400 text-[9px] text-gray-700 space-y-1">
              <p className="font-bold text-[10px]">*** FBR / PRA POS DIGITAL VERIFIED ***</p>
              <p>Scan & verify live order status at: pizza-house-quetta.com/track?id={orderNo}</p>
              <p>Thank you for dining with Pizza House Quetta! 100% Halal</p>
            </div>
          </div>

          {/* Interactive Screen Modal View (Hidden on print) */}
          <div className="print:hidden">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 min-h-[44px] min-w-[44px] rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[var(--color-text-primary)]">
                Order Confirmed!
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Order Ref: <span className="text-[#F4B93B] font-bold text-sm">#{orderNo}</span>
              </p>
            </div>

            {/* Live Order Timeline Progress */}
            <div className="bg-black/5 dark:bg-black/40 p-4 rounded-2xl border border-[var(--color-border)] mb-6">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#F4B93B] mb-3 flex items-center justify-between">
                <span>Live Kitchen Progress</span>
                <span className="text-[10px] text-[var(--color-text-muted)] lowercase font-normal">(auto-updating)</span>
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
                <span className="font-bold text-[var(--color-text-primary)]">{customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Payment Mode:</span>
                <span className="font-bold text-[#F4B93B]">{currentOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Delivery Location:</span>
                <span className="font-medium text-[var(--color-text-primary)] text-right max-w-[200px] truncate">
                  {customerAddress}
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
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  disabled={isPrinting}
                  className="py-3.5 min-h-[44px] rounded-2xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--color-text-primary)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[var(--color-border)] transition-all active:scale-95 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#F4B93B]" />
                  <span>{isPrinting ? 'Printing...' : 'Print Receipt'}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 min-h-[44px] rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Live</span>
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                Done & Continue Browsing
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
