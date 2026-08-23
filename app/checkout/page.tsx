'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, ShieldCheck, Truck, Store, CreditCard, Banknote, Phone, MapPin, Mail, User, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { Order, PaymentMethod } from '@/lib/types';
import OrderConfirmationModal from '@/components/OrderConfirmationModal';

export default function CheckoutPage() {
  const { items, getSubtotal, getTax, getDeliveryFee, getGrandTotal, getDiscount, clearCart } = useCartStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phq_order_preference');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.mode === 'pickup' || parsed.mode === 'delivery') {
          setOrderType(parsed.mode);
        }
        if (parsed.mode === 'delivery' && parsed.area && !address) {
          setAddress(parsed.area);
        }
      }
    } catch (e) {}
  }, []);

  const subtotal = getSubtotal ? getSubtotal() : 0;
  const tax = getTax ? getTax() : 0;
  const delivery = orderType === 'pickup' ? 0 : (getDeliveryFee ? getDeliveryFee() : 150);
  const discount = getDiscount ? getDiscount() : 0;
  const grandTotal = Math.max(0, subtotal - discount + tax + delivery);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items to order.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setErrorMsg('Please provide your complete delivery address in Quetta.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        address: orderType === 'delivery' ? address : 'Store Pickup (Toghi Road Quetta)',
        landmark,
        paymentMethod,
        subtotal,
        tax,
        deliveryFee: orderType === 'delivery' ? delivery : 0,
        discount,
        total: orderType === 'delivery' ? grandTotal : subtotal - discount + tax,
        items: items.map((i) => ({
          id: i.item.id,
          name: i.item.name,
          price: i.unitPrice,
          quantity: i.quantity,
          selectedSize: i.selectedSize?.name,
          selectedAddOns: i.selectedAddOns?.map((a) => a.name),
          totalPrice: i.totalPrice,
          image: i.item.image,
        })),
        notes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
        clearCart();
      } else {
        setErrorMsg(data.error || 'Failed to submit order. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
      {/* Back button */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-bold transition-colors mb-8 border border-[var(--color-border)]"
      >
        <ArrowLeft className="w-4 h-4 text-[#F4B93B]" />
        <span>Return to Cart</span>
      </Link>

      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
          Order <span className="text-[#F4B93B]">Checkout</span>
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">Complete your delivery and contact details for live kitchen preparation.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {items.length === 0 && !confirmedOrder ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--color-border)] p-8 max-w-md mx-auto shadow-2xl">
          <ShoppingBag className="w-16 h-16 text-[#F4B93B] mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No Items in Cart</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-6">Add hot pizzas, burgers, or shawarmas to proceed to checkout.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30"
          >
            <span>Browse Full Menu</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Info */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl space-y-4">
              <h3 className="font-heading text-xl font-bold text-[#F4B93B] uppercase flex items-center gap-2">
                <User className="w-5 h-5" /> 1. Customer Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Tariq Baloch"
                      className="w-full pl-10 pr-3 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B] transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">
                    Phone Number (for Rider & SMS) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0300-1234567"
                      className="w-full pl-10 pr-3 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B] transition-all font-sans"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. yourname@domain.com"
                      className="w-full pl-10 pr-3 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B] transition-all font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Order Type & Delivery / Pickup Switcher */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl font-bold text-[#F4B93B] uppercase flex items-center gap-2">
                  <Truck className="w-5 h-5" /> 2. Order Fulfillment Method
                </h3>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/10 dark:bg-white/10 text-[var(--color-text-secondary)]">
                  {orderType === 'delivery' ? '🛵 Home Delivery' : '🏪 Store Pickup'}
                </span>
              </div>

              {/* 2 Big Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setOrderType('delivery');
                    try {
                      const pref = { mode: 'delivery', area: address || 'Quetta', timestamp: new Date().toISOString() };
                      localStorage.setItem('phq_order_preference', JSON.stringify(pref));
                      window.dispatchEvent(new CustomEvent('phq_order_mode_changed', { detail: pref }));
                    } catch (e) {}
                  }}
                  className={`p-4.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    orderType === 'delivery'
                      ? 'bg-gradient-to-br from-[#C8102E]/20 via-[#A00B23]/10 to-transparent border-red-500 shadow-xl ring-2 ring-red-500/60'
                      : 'bg-black/5 dark:bg-black/30 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${orderType === 'delivery' ? 'bg-[#C8102E] text-white' : 'bg-black/20 text-[var(--color-text-muted)]'}`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-[var(--color-text-primary)]">Home Delivery</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${orderType === 'delivery' ? 'border-red-500 bg-[#C8102E]' : 'border-gray-400'}`}>
                      {orderType === 'delivery' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Hot delivery in thermal bags (25–35 mins)</p>
                  <span className="text-[11px] font-extrabold text-[#F4B93B] mt-2 block">
                    {delivery === 0 ? 'FREE Delivery' : `Delivery Fee: Rs. ${delivery}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderType('pickup');
                    try {
                      const pref = { mode: 'pickup', area: 'Toghi Road Outlet', timestamp: new Date().toISOString() };
                      localStorage.setItem('phq_order_preference', JSON.stringify(pref));
                      window.dispatchEvent(new CustomEvent('phq_order_mode_changed', { detail: pref }));
                    } catch (e) {}
                  }}
                  className={`p-4.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    orderType === 'pickup'
                      ? 'bg-gradient-to-br from-emerald-600/20 via-emerald-800/10 to-transparent border-emerald-500 shadow-xl ring-2 ring-emerald-500/60'
                      : 'bg-black/5 dark:bg-black/30 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${orderType === 'pickup' ? 'bg-emerald-600 text-white' : 'bg-black/20 text-[var(--color-text-muted)]'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-[var(--color-text-primary)]">Take Away / Pickup</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${orderType === 'pickup' ? 'border-emerald-500 bg-emerald-600' : 'border-gray-400'}`}>
                      {orderType === 'pickup' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Collect fresh from Toghi Road kitchen (15–20 mins)</p>
                  <span className="text-[11px] font-extrabold text-emerald-400 mt-2 block">
                    Rs. 0 Delivery Fee
                  </span>
                </button>
              </div>

              {orderType === 'delivery' ? (
                <div className="space-y-4 text-xs pt-2">
                  <div>
                    <label className="font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">
                      Street Address in Quetta *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House #, Street name, Area (e.g. Toghi Road, Cantt, Jinnah Road)..."
                        className="w-full pl-10 pr-3 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near Serena Hotel / Behind Police Line"
                      className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B] transition-all font-sans"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed space-y-1">
                  <p className="font-bold">🏪 Pickup Outlet Address:</p>
                  <p>Pizza House Quetta, Toghi Road, Near Serena Chowk, Quetta.</p>
                  <p className="text-[11px] opacity-80">Your freshly baked order will be packed hot in thermal boxes ready within 15–20 minutes! Hotline: 0300-1234567</p>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[var(--color-border)] shadow-2xl space-y-4">
              <h3 className="font-heading text-xl font-bold text-[#F4B93B] uppercase flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> 3. Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
                {(['Cash on Delivery', 'JazzCash / EasyPaisa', 'Credit / Debit Card'] as PaymentMethod[]).map((method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 min-h-[44px] rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white border-red-500 shadow-lg shadow-red-600/30'
                          : 'bg-black/10 dark:bg-black/40 text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {method === 'Cash on Delivery' && <Banknote className="w-5 h-5" />}
                        {method === 'JazzCash / EasyPaisa' && <Phone className="w-5 h-5" />}
                        {method === 'Credit / Debit Card' && <CreditCard className="w-5 h-5" />}
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <span>{method}</span>
                    </button>
                  );
                })}
              </div>

              {/* Special Instructions */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1.5">
                  Special Kitchen or Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra spicy, don't ring the bell, ketchup sachets..."
                  className="w-full p-3.5 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:border-[#F4B93B] transition-all font-sans"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-2xl sticky top-24 space-y-6">
              <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] uppercase pb-3 border-b border-[var(--color-border)]">
                Order Summary
              </h3>

              {/* Item List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {items.map((i, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#F4B93B]">{i.quantity}x</span>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{i.item.name}</p>
                        {i.selectedSize && (
                          <p className="text-[10px] text-[var(--color-text-muted)]">{i.selectedSize.name}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      Rs. {i.totalPrice.toLocaleString('en-PK')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs pt-2 border-t border-[var(--color-border)]">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Rs. {subtotal.toLocaleString('en-PK')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Coupon Discount</span>
                    <span>-Rs. {discount.toLocaleString('en-PK')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>GST / Tax (15%)</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Rs. {tax.toLocaleString('en-PK')}</span>
                </div>

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {orderType === 'pickup' ? 'Free (Pickup)' : delivery === 0 ? 'FREE' : `Rs. ${delivery}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex justify-between items-center">
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">Grand Total</span>
                  <span className="font-extrabold text-2xl text-[#F4B93B]">
                    Rs. {(orderType === 'delivery' ? grandTotal : subtotal - discount + tax).toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 border border-red-500/40"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Place Order Now</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-[var(--color-text-muted)] text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Halal Certified & Freshly Baked in Quetta</span>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
}
