'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Sparkles, Check, Send } from 'lucide-react';
import { Review } from '@/lib/types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded?: (newReview: Review) => void;
}

export default function AddReviewModal({ isOpen, onClose, onReviewAdded }: AddReviewModalProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [location, setLocation] = useState('Toghi Road, Quetta');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !comment.trim()) {
      setError('Please provide your name and review comment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          comment: comment.trim(),
          foodItem: foodItem.trim() || undefined,
          location: location.trim() || 'Quetta',
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setSubmitted(true);
        if (onReviewAdded) onReviewAdded(data.review);
        setTimeout(() => {
          setSubmitted(false);
          setName('');
          setComment('');
          setFoodItem('');
          onClose();
        }, 1500);
      } else {
        setError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 min-h-[44px] min-w-[44px] rounded-full glass-panel hover:bg-black/10 dark:hover:bg-white/20 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-center"
            aria-label="Close review dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[#F4B93B] font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Pizza House Quetta Reviews</span>
          </div>

          <h3 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-6 uppercase">
            Write A <span className="text-[#C8102E]">Customer Review</span>
          </h3>

          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/40 animate-bounce">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-[var(--color-text-primary)] text-lg">Thank You For Your Review!</h4>
              <p className="text-xs text-[var(--color-text-muted)]">Your feedback has been published live for Quetta foodies.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Kakar"
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:border-[#F4B93B] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                  Area / Neighborhood in Quetta
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Toghi Road, Cantt, Jinnah Town"
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:border-[#F4B93B] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                  Food Item Ordered (Optional)
                </label>
                <input
                  type="text"
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                  placeholder="e.g. Chicken Tikka Pizza / Loaded Zinger Burger"
                  className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:border-[#F4B93B] font-sans"
                />
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                  Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating !== null ? hoverRating : rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 min-h-[36px] min-w-[36px] transition-transform hover:scale-125 focus:outline-none"
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            active ? 'fill-[#F4B93B] text-[#F4B93B]' : 'text-[var(--color-text-muted)]/30'
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-extrabold text-[#F4B93B] ml-2">
                    {rating}.0 / 5.0 Star Rating
                  </span>
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-1.5">
                  Review & Taste Experience *
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the cheese pull, spice flavor, delivery speed or crust..."
                  className="w-full p-3.5 rounded-xl bg-[var(--color-dark-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs focus:outline-none focus:border-[#F4B93B] font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 min-h-[44px] rounded-2xl bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
