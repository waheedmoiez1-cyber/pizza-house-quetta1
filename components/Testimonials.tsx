'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle, Plus, Sparkles, ThumbsUp } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import AddReviewModal from './AddReviewModal';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  itemOrdered: string;
  date: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[var(--color-dark)] relative border-t border-[var(--color-border)] overflow-hidden scroll-mt-16 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Title & Add Review CTA */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4B93B]/10 border border-[#F4B93B]/20 text-amber-800 dark:text-[#F4B93B] text-xs font-bold uppercase tracking-wider mb-4">
                <Star className="w-3.5 h-3.5 fill-[#F4B93B] text-[#F4B93B]" />
                4.8 Out of 5 Stars (5,000+ Customer Reviews)
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight uppercase">
                Loved By <span className="text-[#C8102E]">Quetta Foodies</span>
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)] text-sm sm:text-base max-w-xl">
                Real dining & delivery reviews from hungry pizza lovers all across Quetta city.
              </p>
            </div>

            {/* Add Review Button */}
            <button
              onClick={() => setIsAddReviewOpen(true)}
              className="px-6 py-3.5 min-h-[44px] rounded-full bg-gradient-to-r from-[#C8102E] via-[#E52E4D] to-[#A00B23] text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 hover:scale-105 transition-all shrink-0 self-start md:self-auto border border-red-500/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your Review</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Rating Breakdown Bar & Highlights */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 glass-panel p-6 rounded-3xl border border-[var(--color-border)]">
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-extrabold font-heading text-[#F4B93B]">4.8</div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F4B93B] text-[#F4B93B]" />
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 font-semibold">Overall Taste & Delivery Score</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-1.5 border-y md:border-y-0 md:border-x border-[var(--color-border)] py-3 md:py-0 md:px-6">
              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                <span>5 Stars (Exceptional)</span>
                <span className="font-bold text-[#F4B93B]">92%</span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#F4B93B] h-full w-[92%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                <span>4 Stars (Great)</span>
                <span className="font-bold text-[var(--color-text-muted)]">8%</span>
              </div>
              <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#F4B93B]/60 h-full w-[8%]" />
              </div>
            </div>

            <div className="flex items-center gap-3 md:justify-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-text-primary)]">100% Halal & Fresh</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Hand-tossed dough & pure mozzarella</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, idx) => (
            <ScrollReveal key={review.id} direction="up" delay={idx * 0.1}>
              <div className="pod-card p-6 flex flex-col justify-between h-full relative group">
                <Quote className="w-8 h-8 text-[#F4B93B]/20 absolute top-4 right-4" />

                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F4B93B] text-[#F4B93B]" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] italic leading-relaxed mb-6 font-medium">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--color-text-primary)] text-sm flex items-center gap-1.5">
                      <span>{review.name}</span>
                      <span title="Verified Customer">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </span>
                    </h4>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{review.location}</p>
                  </div>

                  {review.itemOrdered && (
                    <span className="text-[10px] font-bold text-[#F4B93B] bg-[#F4B93B]/10 px-2.5 py-1 rounded-full border border-[#F4B93B]/20">
                      {review.itemOrdered}
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Interactive Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        onReviewAdded={(newRev) => {
          setReviews([newRev, ...reviews]);
        }}
      />
    </section>
  );
}
