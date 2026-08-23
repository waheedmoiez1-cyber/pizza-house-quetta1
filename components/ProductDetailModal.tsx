'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Minus, 
  Star, 
  Clock, 
  Flame, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Pizza, 
  Layers, 
  Utensils, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MenuItem, PizzaSizeOption, AddOnOption } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';

interface ProductDetailModalProps {
  item: MenuItem | null;
  isOpen?: boolean;
  onClose: () => void;
}

const defaultPizzaSizes: PizzaSizeOption[] = [
  { id: 'sz-small', name: 'Small (8")', priceOffset: 0 },
  { id: 'sz-medium', name: 'Medium (11")', priceOffset: 450 },
  { id: 'sz-large', name: 'Large (13")', priceOffset: 850 },
  { id: 'sz-xl', name: 'Extra Large (16")', priceOffset: 1400 },
];

const defaultCrustOptions = [
  { id: 'crust-pan', name: 'Original Pan Crust', desc: 'Golden & crispy hand-tossed classic', price: 0 },
  { id: 'crust-thin', name: 'Thin & Crispy Crust', desc: 'Light, crunchy authentic Italian style', price: 0 },
  { id: 'crust-crown', name: 'Crown Kabab Crust', desc: 'Stuffed with juicy chicken kabab bites', price: 250 },
  { id: 'crust-cheese', name: 'Cheese Burst Stuffed Rim', desc: 'Molten mozzarella filled golden edges', price: 300 },
];

const cheesePortionOptions = [
  { id: 'ch-regular', name: 'Regular Real Mozzarella', price: 0, tag: 'Standard' },
  { id: 'ch-extra', name: 'Extra Mozzarella Melt', price: 150, tag: 'Recommended' },
  { id: 'ch-double', name: 'Double Cheese Layer', price: 250, tag: 'Ultimate Cheese' },
  { id: 'ch-light', name: 'Light Cheese', price: 0, tag: 'Diet Friendly' },
];

const extraToppingOptions = [
  { id: 'top-tikka', name: 'Extra Chicken Tikka Chunks', price: 200, category: 'Meat' },
  { id: 'top-pepperoni', name: 'Beef Pepperoni Slices', price: 180, category: 'Meat' },
  { id: 'top-mushrooms', name: 'Fresh Sliced Mushrooms', price: 100, category: 'Veggie' },
  { id: 'top-olives', name: 'Black Sliced Olives', price: 80, category: 'Veggie' },
  { id: 'top-jalapenos', name: 'Spicy Green Jalapenos', price: 80, category: 'Veggie' },
  { id: 'top-onions', name: 'Crunchy Bell Peppers & Onions', price: 60, category: 'Veggie' },
  { id: 'top-garlic-dip', name: 'Signature Garlic Mayo Ranch Dip', price: 80, category: 'Sauce' },
  { id: 'top-chipotle', name: 'Spicy Chipotle BBQ Sauce Dip', price: 80, category: 'Sauce' },
];

export default function ProductDetailModal({ item, isOpen = true, onClose }: ProductDetailModalProps) {
  const isPizza = item?.categoryId === 'pizza' || item?.name.toLowerCase().includes('pizza');

  // Available Sizes
  const sizeList = useMemo(() => {
    if (item?.sizes && item.sizes.length > 0) return item.sizes;
    if (isPizza) return defaultPizzaSizes;
    return [];
  }, [item, isPizza]);

  const [selectedSize, setSelectedSize] = useState<PizzaSizeOption | undefined>(undefined);
  const [selectedCrust, setSelectedCrust] = useState(defaultCrustOptions[0]);
  const [selectedCheese, setSelectedCheese] = useState(cheesePortionOptions[0]);
  const [selectedToppings, setSelectedToppings] = useState<typeof extraToppingOptions>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [activeStep, setActiveStep] = useState<'size' | 'crust' | 'cheese' | 'toppings'>('size');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (item) {
      setSelectedSize(sizeList.length > 0 ? sizeList[0] : undefined);
      setSelectedCrust(defaultCrustOptions[0]);
      setSelectedCheese(cheesePortionOptions[0]);
      setSelectedToppings([]);
      setSpecialInstructions('');
      setQuantity(1);
      setAddedToast(false);
      setActiveStep('size');
    }
  }, [item, sizeList]);

  if (!isOpen || !item) return null;

  // Calculate live dynamic totals
  const basePrice = item.price;
  const sizePrice = selectedSize ? selectedSize.priceOffset : 0;
  const crustPrice = isPizza ? selectedCrust.price : 0;
  const cheesePrice = isPizza ? selectedCheese.price : 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);

  const unitPrice = basePrice + sizePrice + crustPrice + cheesePrice + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleTopping = (topping: typeof extraToppingOptions[0]) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    if (!item.isAvailable) return;

    // Convert custom choices into AddOnOption list for the cart store
    const allAddOns: AddOnOption[] = [];

    if (isPizza) {
      if (selectedCrust.price > 0) {
        allAddOns.push({ id: selectedCrust.id, name: `Crust: ${selectedCrust.name}`, price: selectedCrust.price });
      }
      if (selectedCheese.price > 0) {
        allAddOns.push({ id: selectedCheese.id, name: `Cheese: ${selectedCheese.name}`, price: selectedCheese.price });
      }
    }

    selectedToppings.forEach((top) => {
      allAddOns.push({ id: top.id, name: top.name, price: top.price });
    });

    if (specialInstructions.trim()) {
      allAddOns.push({ id: 'note-' + Date.now(), name: `Note: ${specialInstructions.trim()}`, price: 0 });
    }

    addItem(item, selectedSize, allAddOns, quantity);
    setAddedToast(true);

    setTimeout(() => {
      setAddedToast(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-customizer-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-4xl bg-[var(--color-dark-surface)] text-[var(--color-text-primary)] rounded-[2.5rem] border border-[var(--color-border)] shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-black/20">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C8102E] text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                Customizer
              </span>
              <span className="text-xs font-bold text-[var(--color-text-muted)]">
                Customize toppings, crust & cheese portions
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 min-h-[40px] min-w-[40px] rounded-full bg-black/30 hover:bg-[#C8102E] text-white transition-all flex items-center justify-center border border-white/15 cursor-pointer"
              aria-label="Close customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main 2-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
            {/* Left Column: Product Showcase & Step Navigation */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-black/10 flex flex-col justify-between">
              <div>
                {/* Food Image Container */}
                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden mb-4 bg-black border border-[var(--color-border)] shadow-xl">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#F4B93B] text-[#111111] font-extrabold text-xs shadow-lg">
                      Base: Rs. {item.price.toLocaleString('en-PK')}
                    </span>
                    {item.isBestseller && (
                      <span className="px-2.5 py-1 rounded-full bg-[#C8102E] text-white font-extrabold text-[10px] uppercase shadow-lg">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>

                <h2 id="modal-customizer-title" className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
                  {item.name}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Step Progress Navigation Pills */}
                {isPizza && (
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => setActiveStep('size')}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        activeStep === 'size'
                          ? 'bg-[#C8102E]/15 border-red-500 text-[var(--color-text-primary)] shadow-sm ring-1 ring-red-500'
                          : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold">1. Size: {selectedSize?.name || 'Default'}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#F4B93B]">
                        {selectedSize?.priceOffset ? `+Rs. ${selectedSize.priceOffset}` : 'Selected'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveStep('crust')}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        activeStep === 'crust'
                          ? 'bg-[#C8102E]/15 border-red-500 text-[var(--color-text-primary)] shadow-sm ring-1 ring-red-500'
                          : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold">2. Crust: {selectedCrust.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#F4B93B]">
                        {selectedCrust.price > 0 ? `+Rs. ${selectedCrust.price}` : 'Free'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveStep('cheese')}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        activeStep === 'cheese'
                          ? 'bg-[#C8102E]/15 border-red-500 text-[var(--color-text-primary)] shadow-sm ring-1 ring-red-500'
                          : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-xs font-bold">3. Cheese: {selectedCheese.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#F4B93B]">
                        {selectedCheese.price > 0 ? `+Rs. ${selectedCheese.price}` : 'Free'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveStep('toppings')}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        activeStep === 'toppings'
                          ? 'bg-[#C8102E]/15 border-red-500 text-[var(--color-text-primary)] shadow-sm ring-1 ring-red-500'
                          : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedToppings.length > 0 ? 'bg-emerald-500 text-white' : 'bg-black/20 text-white/60'}`}>
                          {selectedToppings.length > 0 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold">4. Toppings ({selectedToppings.length})</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#F4B93B]">
                        {toppingsPrice > 0 ? `+Rs. ${toppingsPrice}` : 'Optional'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Option Selectors */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-8 overflow-y-auto">
              {/* Section 1: Choose Size */}
              {sizeList.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] uppercase flex items-center gap-2">
                      <Pizza className="w-4 h-4 text-[#F4B93B]" />
                      <span>Choose Size Option <span className="text-[#C8102E]">*</span></span>
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-[#C8102E]">Required</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {sizeList.map((sz) => {
                      const isSelected = selectedSize?.id === sz.id;
                      const calculatedSizePrice = basePrice + sz.priceOffset;
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#C8102E]/15 border-red-500 text-[var(--color-text-primary)] shadow-md ring-2 ring-red-500'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-amber-400/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{sz.name}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-red-500 bg-[#C8102E]' : 'border-gray-400'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-[#F4B93B]">
                            Rs. {calculatedSizePrice.toLocaleString('en-PK')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: Crust For Pizza (Required for pizzas) */}
              {isPizza && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#F4B93B]" />
                      <span>Crust For Pizza</span>
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-[#C8102E]">Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {defaultCrustOptions.map((crust) => {
                      const isSelected = selectedCrust.id === crust.id;
                      return (
                        <button
                          key={crust.id}
                          type="button"
                          onClick={() => setSelectedCrust(crust)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600/15 border-emerald-500 text-[var(--color-text-primary)] shadow-md ring-2 ring-emerald-500'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{crust.name}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-emerald-500 bg-emerald-600' : 'border-gray-400'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-[var(--color-text-muted)] line-clamp-1 mb-1">{crust.desc}</p>
                          <span className="text-[11px] font-extrabold text-[#F4B93B]">
                            {crust.price > 0 ? `+ Rs. ${crust.price}` : 'Included in Base Price'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 3: Cheese Portion */}
              {isPizza && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F4B93B]" />
                      <span>Cheese Portion</span>
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Optional</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {cheesePortionOptions.map((ch) => {
                      const isSelected = selectedCheese.id === ch.id;
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setSelectedCheese(ch)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#F4B93B]/15 border-[#F4B93B] text-[var(--color-text-primary)] shadow-md ring-2 ring-[#F4B93B]'
                              : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-amber-400/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{ch.name}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#F4B93B] bg-[#F4B93B]' : 'border-gray-400'}`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                            </div>
                          </div>
                          <span className="text-[11px] font-extrabold text-[#F4B93B]">
                            {ch.price > 0 ? `+ Rs. ${ch.price}` : 'Standard Portion'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 4: Extra Toppings & Sauces */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] uppercase flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#F4B93B]" />
                    <span>Extra Toppings & Sauces</span>
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)]">Multi-Select</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {extraToppingOptions.map((topping) => {
                    const isChecked = selectedToppings.some((t) => t.id === topping.id);
                    return (
                      <label
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#C8102E]/15 border-red-500 text-[var(--color-text-primary)] shadow-sm'
                            : 'bg-black/5 dark:bg-white/5 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-amber-400/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                              isChecked
                                ? 'bg-[#C8102E] border-red-500 text-white'
                                : 'border-[var(--color-border)] bg-transparent'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs font-bold">{topping.name}</span>
                        </div>
                        <span className="text-xs font-extrabold text-[#F4B93B]">
                          + Rs. {topping.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions Note */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Special Kitchen Note (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra crispy, sauce on side, less spicy for kids..."
                  className="w-full px-4 py-3 min-h-[44px] rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[#F4B93B]"
                />
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar (Matches Reference Image) */}
          <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-dark-surface)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            {/* Quantity Stepper & Live Price */}
            <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
              {/* Stepper */}
              <div className="flex items-center gap-3 bg-black/10 dark:bg-black/40 p-1.5 rounded-2xl border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-black/30 hover:bg-[#C8102E] hover:text-white text-[var(--color-text-primary)] flex items-center justify-center transition-colors border border-[var(--color-border)] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-heading font-extrabold text-lg w-8 text-center text-[var(--color-text-primary)]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-black/30 hover:bg-[#C8102E] hover:text-white text-[var(--color-text-primary)] flex items-center justify-center transition-colors border border-[var(--color-border)] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Live Total Price */}
              <div>
                <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase block">Total Amount</span>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#F4B93B]">
                  RS. {totalPrice.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Big Green / Red Add To Cart CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`w-full sm:w-64 py-4 min-h-[50px] rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-2xl cursor-pointer ${
                !item.isAvailable
                  ? 'bg-black/10 dark:bg-white/10 text-[var(--color-text-muted)] cursor-not-allowed'
                  : addedToast
                  ? 'bg-emerald-600 text-white shadow-emerald-600/40 border border-emerald-400/40'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-600/40 border border-emerald-400/30'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added to Cart!</span>
                </>
              ) : !item.isAvailable ? (
                <span>Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>ADD TO CART</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
