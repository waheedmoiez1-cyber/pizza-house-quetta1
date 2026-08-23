import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem, CartItem, PizzaSizeOption, AddOnOption } from './types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  cartBounceKey: number;
  promoCode: string;
  discountPercentage: number;
  
  // Actions
  addItem: (item: MenuItem, size?: PizzaSizeOption, addOns?: AddOnOption[], quantity?: number) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  
  // Derived helpers
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDiscount: () => number;
  getTaxAmount: (taxRate?: number) => number;
  getTax: (taxRate?: number) => number;
  getDeliveryFee: (baseFee?: number, threshold?: number) => number;
  getGrandTotal: (taxRate?: number, baseFee?: number, threshold?: number) => number;
}

function generateCartId(item: MenuItem, size?: PizzaSizeOption, addOns?: AddOnOption[]): string {
  const sizeKey = size ? size.name : 'default';
  const addOnsKey = addOns && addOns.length > 0 ? addOns.map((a) => a.id).sort().join('-') : 'none';
  return `${item.id}_${sizeKey}_${addOnsKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      cartBounceKey: 0,
      promoCode: '',
      discountPercentage: 0,

      addItem: (item, size, addOns = [], quantity = 1) => {
        const cartId = generateCartId(item, size, addOns);
        const unitPrice = item.price + (size ? size.priceOffset : 0) + addOns.reduce((acc, a) => acc + a.price, 0);

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.cartId === cartId);
          let newItems = [...state.items];

          if (existingIndex > -1) {
            const currentQty = newItems[existingIndex].quantity;
            const newQty = currentQty + quantity;
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newQty,
              totalPrice: newQty * unitPrice,
            };
          } else {
            newItems.push({
              cartId,
              item,
              selectedSize: size,
              selectedAddOns: addOns,
              quantity,
              unitPrice,
              totalPrice: unitPrice * quantity,
            });
          }

          return {
            items: newItems,
            isOpen: true, // Open cart drawer on add
            cartBounceKey: state.cartBounceKey + 1,
          };
        });
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => {
            if (i.cartId === cartId) {
              return {
                ...i,
                quantity,
                totalPrice: i.unitPrice * quantity,
              };
            }
            return i;
          }),
        }));
      },

      clearCart: () => set({ items: [], promoCode: '', discountPercentage: 0 }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyPromoCode: (code) => {
        const clean = code.toUpperCase().trim();
        if (clean === 'QUETTA10' || clean === 'PIZZA10' || clean === 'WELCOME10') {
          set({ promoCode: clean, discountPercentage: 10 });
          return { success: true, message: '10% promo discount applied!' };
        } else if (clean === 'FIRST15') {
          set({ promoCode: clean, discountPercentage: 15 });
          return { success: true, message: '15% welcome discount applied!' };
        }
        return { success: false, message: 'Invalid promo code. Try WELCOME10' };
      },

      getItemCount: () => {
        return get().items.reduce((total, i) => total + i.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, i) => total + i.totalPrice, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const pct = get().discountPercentage;
        return (subtotal * pct) / 100;
      },

      getDiscount: () => {
        return get().getDiscountAmount();
      },

      getTaxAmount: (taxRate = 0) => {
        const subtotalAfterDiscount = get().getSubtotal() - get().getDiscountAmount();
        return (subtotalAfterDiscount * (taxRate || 0)) / 100;
      },

      getTax: (taxRate = 0) => {
        return get().getTaxAmount(taxRate);
      },

      getDeliveryFee: (baseFee = 150, threshold = 1500) => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= threshold ? 0 : baseFee;
      },

      getGrandTotal: (taxRate = 0, baseFee = 150, threshold = 1500) => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const tax = get().getTaxAmount(taxRate);
        const delivery = get().getDeliveryFee(baseFee, threshold);
        return subtotal - discount + tax + delivery;
      },
    }),
    {
      name: 'pizza-house-quetta-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode, discountPercentage: state.discountPercentage }),
    }
  )
);
