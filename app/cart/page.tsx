'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ArrowLeft, Tag, Sparkles, Check } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getTaxAmount = useCartStore((state) => state.getTaxAmount);
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const tax = getTaxAmount(15);
  const delivery = getDeliveryFee(100, 1500);
  const total = getGrandTotal(15, 100, 1500);

  const amountNeededForFreeDelivery = Math.max(0, 1500 - subtotal);
  const progressPercent = Math.min(100, (subtotal / 1500) * 100);

  return (
    <div className="py-12 max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)]">
            Your Shopping <span className="text-[#F4B93B]">Cart</span>
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Review your selected pizzas, burgers & sides before checkout.</p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline font-bold px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 transition-all"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-[var(--color-border)] p-8 max-w-md mx-auto shadow-2xl">
          <ShoppingBag className="w-16 h-16 text-[#F4B93B] mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Your cart is empty</h2>
          <p className="text-xs text-[var(--color-text-muted)] mb-6 leading-relaxed">
            Looks like you haven&apos;t added any hot pizzas or crispy burgers yet!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-red-600/30 hover:scale-105 transition-all"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Delivery Bar */}
            <div className="p-4 rounded-2xl bg-[#F4B93B]/10 border border-[#F4B93B]/20 text-xs font-semibold">
              {amountNeededForFreeDelivery > 0 ? (
                <p className="text-amber-800 dark:text-[#F4B93B] mb-2 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4" />
                  Add <span className="font-extrabold text-[#C8102E] dark:text-white">Rs. {amountNeededForFreeDelivery.toLocaleString('en-PK')}</span> more for FREE Delivery across Quetta!
                </p>
              ) : (
                <p className="text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4" />
                  You unlocked FREE Delivery in Quetta! 🎉
                </p>
              )}
              <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#F4B93B] to-[#C8102E] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {items.map((cartItem) => (
              <div
                key={cartItem.cartId}
                className="glass-card p-5 rounded-2xl border border-[var(--color-border)] flex items-center justify-between gap-4 transition-all shadow-lg"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--color-border)]">
                  <Image src={cartItem.item.image} alt={cartItem.item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] truncate">
                    {cartItem.item.name}
                  </h3>
                  <div className="text-xs text-[var(--color-text-muted)] space-y-0.5 mt-0.5">
                    {cartItem.selectedSize && (
                      <p>
                        <span className="text-[var(--color-text-secondary)] font-semibold">Crust:</span> {cartItem.selectedSize.name}
                      </p>
                    )}
                    {cartItem.selectedAddOns && cartItem.selectedAddOns.length > 0 && (
                      <p className="truncate">
                        <span className="text-[var(--color-text-secondary)] font-semibold">Add-ons:</span>{' '}
                        {cartItem.selectedAddOns.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-extrabold text-[#F4B93B] mt-1.5">
                    Rs. {cartItem.totalPrice.toLocaleString('en-PK')}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => removeItem(cartItem.cartId)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 bg-black/10 dark:bg-black/50 p-1.5 rounded-full border border-[var(--color-border)]">
                    <button
                      onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 text-[var(--color-text-primary)] flex items-center justify-center min-h-[28px] min-w-[28px]"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-[var(--color-text-primary)] text-xs w-5 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white/10 dark:bg-white/10 hover:bg-white/20 text-[var(--color-text-primary)] flex items-center justify-center min-h-[28px] min-w-[28px]"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout summary box */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-3xl border border-[var(--color-border)] shadow-2xl sticky top-24 space-y-6">
              <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)] uppercase pb-3 border-b border-[var(--color-border)]">
                Bill Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Rs. {subtotal.toLocaleString('en-PK')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Promo Discount</span>
                    <span>-Rs. {discount.toLocaleString('en-PK')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>GST / Tax (15%)</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Rs. {tax.toLocaleString('en-PK')}</span>
                </div>

                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Delivery Fee (Quetta)</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {delivery === 0 ? 'FREE' : `Rs. ${delivery}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-[var(--color-border)] flex justify-between items-center">
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">Grand Total</span>
                  <span className="font-extrabold text-2xl text-[#F4B93B]">
                    Rs. {total.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all border border-red-500/40"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
