'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, Check, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

interface CartDrawerProps {
  taxRate?: number;
  deliveryFee?: number;
  freeDeliveryThreshold?: number;
}

export default function CartDrawer({
  taxRate = 15,
  deliveryFee = 100,
  freeDeliveryThreshold = 1500,
}: CartDrawerProps) {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const promoCode = useCartStore((state) => state.promoCode);
  const applyPromoCode = useCartStore((state) => state.applyPromoCode);
  const removePromoCode = useCartStore((state) => state.removePromoCode);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getTaxAmount = useCartStore((state) => state.getTaxAmount);
  const getDeliveryFee = useCartStore((state) => state.getDeliveryFee);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const tax = getTaxAmount(taxRate);
  const delivery = getDeliveryFee(deliveryFee, freeDeliveryThreshold);
  const total = getGrandTotal(taxRate, deliveryFee, freeDeliveryThreshold);

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!inputCode.trim()) return;

    const res = applyPromoCode(inputCode.trim());
    if (res.success) {
      setPromoSuccess(res.message);
      setInputCode('');
    } else {
      setPromoError(res.message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-screen max-w-md bg-[var(--color-dark-surface)] border-l border-[var(--color-border)] text-[var(--color-text-primary)] flex flex-col justify-between shadow-2xl z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-black/5 dark:bg-black/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#C8102E]/15 text-[#C8102E] border border-red-500/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold tracking-wide text-[var(--color-text-primary)]">Your Craving Cart</h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {items.length} item{items.length !== 1 ? 's' : ''} in order
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2.5 min-h-[44px] min-w-[44px] rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Meter */}
            {subtotal > 0 && (
              <div className="px-6 py-3.5 bg-[#F4B93B]/10 border-b border-[#F4B93B]/20 text-xs font-semibold">
                {amountNeededForFreeDelivery > 0 ? (
                  <p className="text-amber-800 dark:text-[#F4B93B] mb-1.5 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Add <span className="font-extrabold text-[#C8102E] dark:text-white">Rs. {amountNeededForFreeDelivery.toLocaleString('en-PK')}</span> more for FREE Delivery!
                  </p>
                ) : (
                  <p className="text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    Congratulations! You unlocked FREE Delivery in Quetta 🎉
                  </p>
                )}
                <div className="w-full bg-black/10 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F4B93B] to-[#C8102E] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">Your cart is currently empty</h3>
                  <p className="text-xs text-[var(--color-text-muted)] max-w-xs mb-6 leading-relaxed">
                    Looks like you haven&apos;t added any pizzas, burgers or shawarmas yet!
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30"
                  >
                    Start Exploring Menu
                  </button>
                </div>
              ) : (
                items.map((cartItem) => (
                  <div
                    key={cartItem.cartId}
                    className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] flex gap-4 items-center justify-between"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-[var(--color-border)]">
                      <Image
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-base font-bold text-[var(--color-text-primary)] truncate">
                        {cartItem.item.name}
                      </h4>
                      <div className="text-[11px] text-[var(--color-text-muted)] space-y-0.5 mt-0.5">
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
                      <p className="text-xs font-bold text-[#F4B93B] mt-1">
                        Rs. {cartItem.totalPrice.toLocaleString('en-PK')}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(cartItem.cartId)}
                        className="p-1 rounded-lg hover:bg-red-500/10 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2 bg-black/10 dark:bg-black/50 p-1 rounded-full border border-[var(--color-border)]">
                        <button
                          onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-[var(--color-text-primary)] flex items-center justify-center min-h-[24px] min-w-[24px]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-[var(--color-text-primary)] text-xs w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-[var(--color-text-primary)] flex items-center justify-center min-h-[24px] min-w-[24px]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout CTA */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--color-border)] bg-black/5 dark:bg-black/40 space-y-4">
                {/* Promo Code Input */}
                <div>
                  {promoCode ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Tag className="w-3.5 h-3.5" />
                        Code Applied: <span className="uppercase">{promoCode}</span> (-Rs. {discount})
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                          placeholder="Promo code (e.g. WELCOME10)"
                          className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] uppercase focus:outline-none focus:border-[#F4B93B]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 min-h-[44px] rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/20 text-[var(--color-text-primary)] text-xs font-bold uppercase transition-colors border border-[var(--color-border)]"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {promoError && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3 h-3" /> {promoError}
                    </p>
                  )}
                  {promoSuccess && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                      <Check className="w-3 h-3" /> {promoSuccess}
                    </p>
                  )}
                </div>

                {/* Subtotals & Taxes */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">Rs. {subtotal.toLocaleString('en-PK')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Discount</span>
                      <span>-Rs. {discount.toLocaleString('en-PK')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>GST (15%)</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">Rs. {tax.toLocaleString('en-PK')}</span>
                  </div>

                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {delivery === 0 ? 'FREE' : `Rs. ${delivery}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[var(--color-border)] flex justify-between items-center">
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">Total Amount</span>
                    <span className="font-extrabold text-xl text-[#F4B93B]">
                      Rs. {total.toLocaleString('en-PK')}
                    </span>
                  </div>
                </div>

                {/* Direct Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full py-4 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all border border-red-500/40"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
