'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, CookingPot, MessageSquare, Receipt } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

interface KitchenTicketModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'kot' | 'customer';
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void | Promise<void>;
}

export default function KitchenTicketModal({
  order,
  isOpen,
  onClose,
  initialMode = 'kot',
  onStatusUpdate,
}: KitchenTicketModalProps) {
  const [printMode, setPrintMode] = useState<'kot' | 'customer'>(initialMode);
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    // Use requestAnimationFrame & timeout to ensure completely smooth, zero-delay print execution
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 50);
    });
  };

  const deliveryType = order.deliveryOption || order.orderType || 'delivery';
  const customerPhone = order.customerPhone || order.phone || 'N/A';
  const customerAddress = order.address || 'Store Pickup (Toghi Road Quetta)';
  const orderNo = order.orderNumber || order.id;

  const formattedWhatsAppText = encodeURIComponent(
    `*KITCHEN ORDER TICKET (KOT)* 🍳\n` +
    `*Ticket #:* ${orderNo}\n` +
    `*Time:* ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n` +
    `*Type:* ${deliveryType.toUpperCase()}\n` +
    `*Customer:* ${order.customerName} (${customerPhone})\n` +
    `*Address:* ${customerAddress}\n\n` +
    `*ITEMS TO PREPARE:*\n` +
    order.items
      .map(
        (i, idx) =>
          `${idx + 1}. *[x${i.quantity}] ${i.name}* (${i.selectedSize || 'Standard'})\n` +
          (i.selectedAddOns?.length ? `   Add-ons: ${i.selectedAddOns.join(', ')}\n` : '')
      )
      .join('\n') +
    (order.notes ? `\n*Cooking Notes:* ${order.notes}` : '')
  );

  const whatsappUrl = `https://wa.me/923001234567?text=${formattedWhatsAppText}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#FFF8ED] text-[#111111] rounded-3xl p-6 shadow-2xl relative border-2 border-[#111111]/20 my-auto"
        >
          {/* Header Controls (Hidden on print) */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#111111]/20 print:hidden">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-black/10">
              <button
                type="button"
                onClick={() => setPrintMode('kot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all ${printMode === 'kot'
                    ? 'bg-[#C8102E] text-white shadow-md'
                    : 'text-[#111111]/70 hover:text-black'
                  }`}
              >
                <CookingPot className="w-3.5 h-3.5" />
                <span>Kitchen Slip (KOT)</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintMode('customer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all ${printMode === 'customer'
                    ? 'bg-[#111111] text-white shadow-md'
                    : 'text-[#111111]/70 hover:text-black'
                  }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Customer Invoice</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 min-h-[38px] min-w-[38px] rounded-full bg-[#111111]/10 hover:bg-[#111111]/20 text-[#111111] transition-colors flex items-center justify-center"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Printable Ticket Receipt Container */}
          <div id="printable-kitchen-ticket" className="font-mono space-y-3.5 text-[#111111]">
            {/* Store Brand Header */}
            <div className="text-center border-b border-dashed border-[#111111]/40 pb-3">
              <h2 className="text-xl font-extrabold uppercase tracking-widest text-[#C8102E]">
                PIZZA HOUSE QUETTA
              </h2>
              <p className="text-[10px] font-bold text-[#111111]/80">
                Toghi Road, Quetta • Ph: 0300-1234567
              </p>
              <p className="text-[11px] font-black uppercase tracking-wider mt-0.5">
                {printMode === 'kot' ? '🍳 KITCHEN PRODUCTION SLIP (KOT)' : '🧾 CUSTOMER TAX INVOICE / RECEIPT'}
              </p>
              <div className="mt-2 text-xs font-black bg-[#C8102E] text-white py-1 px-3.5 rounded-full inline-block">
                ORDER #{orderNo}
              </div>
            </div>

            {/* Meta details */}
            <div className="text-xs space-y-1 bg-[#111111]/5 p-3 rounded-xl border border-[#111111]/10">
              <div className="flex justify-between">
                <span className="font-bold">Date & Time:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Order Type:</span>
                <span className="font-black uppercase text-[#C8102E]">{deliveryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Customer:</span>
                <span>{order.customerName} ({customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Address:</span>
                <span className="truncate max-w-[200px] font-semibold">{customerAddress}</span>
              </div>
              {order.landmark && (
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold">Landmark:</span>
                  <span>{order.landmark}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] pt-1 border-t border-[#111111]/10">
                <span className="font-bold">Payment Method:</span>
                <span className="font-bold uppercase">
                  {order.paymentMethod?.toUpperCase()} ({order.paymentStatus || 'Pending'})
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <div className="text-xs font-black uppercase tracking-wider mb-2 text-[#111111]/90 flex justify-between border-b border-[#111111]/20 pb-1">
                <span>Items Ordered ({order.items.reduce((a, b) => a + (b.quantity || 1), 0)} qty)</span>
                <span>Amount</span>
              </div>

              <div className="divide-y divide-dashed divide-[#111111]/30">
                {order.items.map((item: any, idx) => {
                  const itemName = item.item?.name || item.name || 'Delicious Item';
                  const sizeName = typeof item.selectedSize === 'object' ? item.selectedSize?.name : (item.selectedSize || item.size || '');
                  const price = item.unitPrice || item.price || 0;
                  const qty = item.quantity || 1;
                  const itemTotal = item.totalPrice || (price * qty);

                  return (
                    <div key={idx} className="py-2 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs text-[#111111] block">
                          [{qty}x] {itemName}
                        </span>
                        {sizeName && (
                          <p className="text-[11px] font-semibold text-[#C8102E]">
                            Size: {sizeName}
                          </p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-[10px] text-[#111111]/70">
                            Add-ons: {Array.isArray(item.selectedAddOns) ? item.selectedAddOns.map((a: any) => typeof a === 'object' ? a.name : a).join(', ') : ''}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-xs shrink-0">
                        Rs. {itemTotal.toLocaleString('en-PK')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kitchen Notes */}
            {order.notes && (
              <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs">
                <strong className="text-amber-950 block font-bold mb-0.5">Special Instructions:</strong>
                <p className="italic text-amber-900">&ldquo;{order.notes}&rdquo;</p>
              </div>
            )}

            {/* Financial Breakdown (Customer Mode) */}
            {printMode === 'customer' && (
              <div className="space-y-1 text-xs pt-2 border-t border-dashed border-[#111111]/40">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs. {(order.subtotal || order.total).toLocaleString('en-PK')}</span>
                </div>
                {order.discount ? (
                  <div className="flex justify-between font-bold text-emerald-800">
                    <span>Discount:</span>
                    <span>-Rs. {order.discount.toLocaleString('en-PK')}</span>
                  </div>
                ) : null}
                {order.tax ? (
                  <div className="flex justify-between">
                    <span>GST / Tax (15%):</span>
                    <span>Rs. {order.tax.toLocaleString('en-PK')}</span>
                  </div>
                ) : null}
                {order.deliveryFee ? (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>Rs. {order.deliveryFee.toLocaleString('en-PK')}</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Grand Total Footer */}
            <div className="pt-2.5 border-t-2 border-black flex justify-between items-center text-sm font-black">
              <span>GRAND TOTAL AMOUNT:</span>
              <span className="text-base text-[#C8102E]">
                Rs. {order.total.toLocaleString('en-PK')}
              </span>
            </div>

            {/* Receipt Footer Message */}
            <div className="text-center pt-2 border-t border-dashed border-[#111111]/40 text-[10px] text-[#111111]/70">
              <p className="font-bold">Thank you for dining with Pizza House Quetta!</p>
              <p>Hotline: 0300-1234567 • 100% Halal Certified</p>
            </div>
          </div>

          {/* Action Buttons (Hidden on print) */}
          <div className="mt-5 grid grid-cols-2 gap-3 print:hidden">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="py-3 px-4 rounded-2xl bg-[#111111] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#F4B93B]" />
              <span>{isPrinting ? 'Printing...' : 'Print Slip Now'}</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forward to Staff</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
