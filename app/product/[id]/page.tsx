'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, Flame, Plus, Minus, Check, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { MenuItem, PizzaSizeOption, AddOnOption } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<PizzaSizeOption | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [detailImgSrc, setDetailImgSrc] = useState('');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/menu/${id}`);
        const data = await res.json();
        if (data.success && data.item) {
          setItem(data.item);
          setDetailImgSrc(data.item.image);
          if (data.item.sizes && data.item.sizes.length > 0) {
            setSelectedSize(data.item.sizes[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-white/60">
        <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <span>Loading Product Details...</span>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-24 text-center text-white max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
        <p className="text-xs text-white/60 mb-6">The requested food item does not exist or has been removed.</p>
        <Link href="/menu" className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B23] font-bold text-xs uppercase tracking-wider">
          Back to Menu
        </Link>
      </div>
    );
  }

  const basePrice = item.price;
  const sizePrice = selectedSize ? selectedSize.priceOffset : 0;
  const addOnsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + sizePrice + addOnsPrice;
  const totalPrice = unitPrice * quantity;

  const toggleAddOn = (addOn: AddOnOption) => {
    if (selectedAddOns.some((a) => a.id === addOn.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addOn.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    addItem(item, selectedSize, selectedAddOns, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const getFallbackImage = () => {
    if (item.categoryId === 'burgers') return '/images/zinger_burger.jpg';
    if (item.categoryId === 'pizza') return '/images/tikka_pizza.jpg';
    return '/images/hero_pizza.jpg';
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold transition-colors mb-8 border border-white/10"
      >
        <ArrowLeft className="w-4 h-4 text-[#F4B93B]" />
        <span>Back to Previous Page</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 glass-card p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-xl">
          <Image
            src={detailImgSrc || item.image}
            alt={item.name}
            fill
            onError={() => setDetailImgSrc(getFallbackImage())}
            className="object-cover"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-sm">
              <span className="px-4 py-2 rounded-full bg-red-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <AlertCircle className="w-4 h-4" />
                Currently Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Specs */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold text-[#F4B93B] uppercase tracking-wider bg-[#F4B93B]/10 px-3 py-1 rounded-full border border-[#F4B93B]/20">
                {item.categoryId}
              </span>
              {item.rating && (
                <span className="flex items-center gap-1 text-xs font-extrabold text-[#F4B93B]">
                  <Star className="w-4 h-4 fill-[#F4B93B]" />
                  {item.rating} (5,000+ Ratings)
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white mb-3">
              {item.name}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6 font-medium">{item.description}</p>

            <div className="flex items-center gap-3 mb-6">
              {item.prepTime && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-white/80 text-xs font-medium border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-[#F4B93B]" />
                  {item.prepTime} Fresh Preparation
                </span>
              )}
              {item.isSpicy && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4B93B]/15 text-[#F4B93B] text-xs font-bold border border-[#F4B93B]/30">
                  <Flame className="w-3.5 h-3.5" />
                  Spicy Specialty
                </span>
              )}
            </div>

            {/* Size Options */}
            {item.sizes && item.sizes.length > 0 && (
              <div className="mb-6">
                <label className="text-xs font-extrabold text-[#F4B93B] uppercase tracking-wider block mb-2">
                  Select Crust & Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {item.sizes.map((size) => {
                    const isSelected = selectedSize?.name === size.name;
                    return (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3.5 min-h-[44px] rounded-2xl text-xs font-bold flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white border-red-500 shadow-lg shadow-red-600/30'
                            : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span>{size.name}</span>
                        <span className="text-[11px] font-extrabold text-[#F4B93B]">
                          {size.priceOffset > 0 ? `+Rs. ${size.priceOffset}` : 'Base'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {item.addOns && item.addOns.length > 0 && (
              <div className="mb-6">
                <label className="text-xs font-extrabold text-[#F4B93B] uppercase tracking-wider block mb-2">
                  Custom Add-ons & Extra Dips
                </label>
                <div className="space-y-2">
                  {item.addOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                    return (
                      <button
                        key={addOn.id}
                        onClick={() => toggleAddOn(addOn)}
                        className={`w-full p-3.5 min-h-[44px] rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-[#F4B93B]/15 text-white border-[#F4B93B]/50'
                            : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-md flex items-center justify-center border text-[10px] ${isSelected ? 'bg-[#F4B93B] text-black border-[#F4B93B]' : 'border-white/30'}`}>
                            {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                          </span>
                          {addOn.name}
                        </span>
                        <span className="font-bold text-[#F4B93B]">+Rs. {addOn.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & CTA */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 bg-black/50 p-2 rounded-full border border-white/15">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center min-h-[32px] min-w-[32px]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-white text-base w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center min-h-[32px] min-w-[32px]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-white/50 block uppercase tracking-wider font-bold">Total Amount</span>
                <span className="text-2xl font-extrabold text-[#F4B93B]">
                  Rs. {totalPrice.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`w-full py-4 min-h-[44px] rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all active:scale-98 ${
                !item.isAvailable
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : addedToast
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white shadow-red-600/30 hover:scale-[1.02] border border-red-500/30'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Item Added To Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add To Cart (Rs. {totalPrice.toLocaleString('en-PK')})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
