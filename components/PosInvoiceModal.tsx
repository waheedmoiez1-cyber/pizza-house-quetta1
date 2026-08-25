'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, Receipt, CheckCircle2, ShieldCheck, Download, Share2, Phone, MapPin, Sparkles, Building2, QrCode } from 'lucide-react';
import { Order } from '@/lib/types';

interface PosInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PosInvoiceModal({ order, isOpen, onClose }: PosInvoiceModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [paperSize, setPaperSize] = useState<'80mm' | '58mm' | 'a4'>('80mm');
  const [tenderAmount, setTenderAmount] = useState<string>('');

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        setIsPrinting(false);
      }, 50);
    });
  };

  const orderNo = order.orderNumber || order.id;
  const invoiceNo = `INV-${new Date(order.createdAt).getFullYear()}-${orderNo.replace(/^PHQ-?/, '')}`;
  const deliveryType = (order.deliveryOption || order.orderType || 'delivery').toUpperCase();
  const customerPhone = order.customerPhone || order.phone || 'N/A';
  const customerAddress = order.address || 'Store Pickup Counter (Toghi Road Quetta)';

  const subtotal = order.subtotal || order.items.reduce((s, i) => s + (i.totalPrice || (i.price * i.quantity)), 0);
  const discount = order.discount || 0;
  const tax = order.tax || Math.round(subtotal * 0.15);
  const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : (deliveryType === 'DELIVERY' ? 150 : 0);
  const grandTotal = order.total || (subtotal - discount + tax + deliveryFee);

  const tenderedNum = Number(tenderAmount) || grandTotal;
  const changeDue = Math.max(0, tenderedNum - grandTotal);

  // Generate QR Code data url for live tracking verification
  const verificationUrl = `https://pizza-house-quetta.com/track?id=${encodeURIComponent(orderNo)}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=0&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className={`w-full ${
            paperSize === '58mm' ? 'max-w-sm' : paperSize === 'a4' ? 'max-w-2xl' : 'max-w-lg'
          } bg-[#FBFBFB] text-[#111111] rounded-3xl p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.7)] relative border-2 border-[#111111]/20 my-auto transition-all duration-200`}
        >
          {/* Top Control Bar (Hidden on Print) */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#111111]/15 print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#C8102E] text-white flex items-center justify-center shadow-md">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold uppercase tracking-tight text-[#111111] leading-none">
                  Official POS Tax Invoice
                </h3>
                <span className="text-[10px] text-[#111111]/60 font-mono">
                  {invoiceNo} • #{orderNo}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Paper Format Selector */}
              <div className="hidden sm:flex items-center p-1 rounded-xl bg-black/10 text-[10px] font-extrabold uppercase">
                <button
                  type="button"
                  onClick={() => setPaperSize('80mm')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    paperSize === '80mm' ? 'bg-[#111111] text-white shadow-sm' : 'text-black/60 hover:text-black'
                  }`}
                >
                  80mm POS
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('58mm')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    paperSize === '58mm' ? 'bg-[#111111] text-white shadow-sm' : 'text-black/60 hover:text-black'
                  }`}
                >
                  58mm Slip
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    paperSize === 'a4' ? 'bg-[#111111] text-white shadow-sm' : 'text-black/60 hover:text-black'
                  }`}
                >
                  A4 / Bill
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 min-h-[36px] min-w-[36px] rounded-full bg-[#111111]/10 hover:bg-[#111111]/20 text-[#111111] transition-colors flex items-center justify-center cursor-pointer"
                aria-label="Close invoice modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =========================================================================
              PRINTABLE OFFICIAL POS TAX INVOICE
              ========================================================================= */}
          <div
            id="printable-customer-receipt"
            className="font-mono text-[#111111] bg-white p-4 sm:p-6 rounded-2xl border border-dashed border-[#111111]/30 shadow-inner space-y-3.5 print:p-0 print:border-none print:shadow-none"
          >
            {/* Header: Store Identity & FBR/PRA Tax Info */}
            <div className="text-center pb-3 border-b-2 border-dashed border-black">
              <h1 className="text-2xl font-black uppercase tracking-widest text-[#C8102E] leading-none mb-1">
                PIZZA HOUSE QUETTA
              </h1>
              <p className="text-[11px] font-bold text-[#111111]/90">
                Quetta&apos;s Favorite Slice Since Day One
              </p>
              <p className="text-[10px] text-[#111111]/80 leading-tight mt-0.5">
                Toghi Road, Quetta, Balochistan, Pakistan
              </p>
              <p className="text-[10px] font-bold text-[#111111]/90">
                Hotline: 0300-1234567 • Phone: 081-2820000
              </p>
              <p className="text-[9px] font-mono text-[#111111]/70 mt-1">
                NTN: 8294102-3 • PRA/STRN: 19-00-8294-102
              </p>

              <div className="mt-2 py-1 px-3 bg-black text-white rounded font-black text-xs uppercase tracking-widest inline-block">
                *** SALES TAX INVOICE ***
              </div>
            </div>

            {/* Invoice & Customer Metadata Grid */}
            <div className="text-xs space-y-1 bg-[#111111]/5 p-3 rounded-xl border border-[#111111]/10">
              <div className="flex justify-between">
                <span className="font-bold">INVOICE NO:</span>
                <span className="font-bold text-[#C8102E]">{invoiceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">ORDER REF:</span>
                <span className="font-black">#{orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">DATE & TIME:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">POS TERMINAL:</span>
                <span>POS-01 (MAIN COUNTER)</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#111111]/10">
                <span className="font-bold">ORDER TYPE:</span>
                <span className="font-black text-[11px] px-2 py-0.5 rounded bg-[#C8102E] text-white uppercase">
                  {deliveryType}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#111111]/10">
                <span className="font-bold">CUSTOMER:</span>
                <span className="font-bold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">PHONE:</span>
                <span>{customerPhone}</span>
              </div>
              {order.address && (
                <div className="flex justify-between items-start pt-0.5">
                  <span className="font-bold shrink-0 mr-2">DELIVERY:</span>
                  <span className="font-semibold text-right leading-tight break-words max-w-[220px]">
                    {customerAddress}
                  </span>
                </div>
              )}
              {order.landmark && (
                <div className="flex justify-between text-[10px] text-amber-900 font-bold">
                  <span>LANDMARK:</span>
                  <span>{order.landmark}</span>
                </div>
              )}
            </div>

            {/* Itemized Billing Table */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider mb-2 flex justify-between border-b-2 border-black pb-1">
                <span>QTY & ITEM DETAILS</span>
                <span>PRICE (PKR)</span>
              </div>

              <div className="divide-y divide-dashed divide-[#111111]/30">
                {order.items.map((item: any, idx) => {
                  const itemName = item.item?.name || item.name || 'Food Item';
                  const sizeName = typeof item.selectedSize === 'object' ? (item.selectedSize as any)?.name : (item.selectedSize || item.size || '');
                  const price = item.unitPrice || item.price || 0;
                  const qty = item.quantity || 1;
                  const itemTotal = item.totalPrice || (price * qty);

                  return (
                    <div key={idx} className="py-2 flex items-start justify-between gap-2 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="bg-black text-white px-1.5 py-0.2 rounded text-[10px] leading-none">
                            {qty}X
                          </span>
                          <span className="text-[#111111]">{itemName}</span>
                        </div>

                        {sizeName && (
                          <p className="text-[10px] font-bold text-[#C8102E] pl-6 mt-0.5">
                            • Size: {sizeName}
                          </p>
                        )}

                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="text-[10px] text-[#111111]/70 pl-6 space-y-0.5 mt-0.5">
                            {Array.isArray(item.selectedAddOns) &&
                              item.selectedAddOns.map((addon: any, aIdx: number) => {
                                const addOnName = typeof addon === 'object' ? addon.name : addon;
                                return <p key={aIdx}>+ {addOnName}</p>;
                              })}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs">
                          Rs. {itemTotal.toLocaleString('en-PK')}
                        </span>
                        {qty > 1 && (
                          <span className="block text-[9px] text-[#111111]/60">
                            (@ Rs. {price})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Breakdown & Tax Calculations */}
            <div className="space-y-1 text-xs pt-2.5 border-t-2 border-dashed border-black">
              <div className="flex justify-between">
                <span>Gross Subtotal:</span>
                <span className="font-bold">Rs. {subtotal.toLocaleString('en-PK')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Special Promo Discount:</span>
                  <span>-Rs. {discount.toLocaleString('en-PK')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST / Provincial Sales Tax (15%):</span>
                <span className="font-bold">Rs. {tax.toLocaleString('en-PK')}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Service Fee:</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString('en-PK')}`}
                </span>
              </div>
            </div>

            {/* Grand Total Net Payable */}
            <div className="pt-2 pb-1 border-y-2 border-black flex justify-between items-center text-sm sm:text-base font-black">
              <span>NET PAYABLE AMOUNT:</span>
              <span className="text-lg text-[#C8102E]">
                Rs. {grandTotal.toLocaleString('en-PK')}
              </span>
            </div>

            {/* Payment Settlement & Change Calculation */}
            <div className="text-xs space-y-1 bg-[#111111]/5 p-2.5 rounded-xl border border-[#111111]/10">
              <div className="flex justify-between items-center">
                <span className="font-bold">PAYMENT METHOD:</span>
                <span className="font-black uppercase">
                  {order.paymentMethod || 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold">PAYMENT STATUS:</span>
                <span className="font-bold text-emerald-700 uppercase">
                  {(order.paymentStatus as string)?.toLowerCase() === 'paid' || (order.paymentStatus as string)?.toLowerCase() === 'completed' ? 'PAID / SETTLED' : 'PENDING ON DELIVERY'}
                </span>
              </div>
              {tenderAmount && Number(tenderAmount) > grandTotal && (
                <>
                  <div className="flex justify-between items-center pt-1 border-t border-[#111111]/10">
                    <span className="font-bold">TENDERED / CASH PAID:</span>
                    <span>Rs. {Number(tenderAmount).toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-emerald-800">
                    <span>CHANGE DUE:</span>
                    <span>Rs. {changeDue.toLocaleString('en-PK')}</span>
                  </div>
                </>
              )}
            </div>

            {/* Scannable Verification QR Code & POS Seal */}
            <div className="pt-2 border-t border-dashed border-black text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <div className="p-1.5 bg-white border border-black rounded-lg shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeApiUrl}
                    alt="Invoice QR Verification"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
                <div className="text-left text-[10px] space-y-0.5 max-w-[200px]">
                  <p className="font-black uppercase text-[#111111] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>POS VERIFIED INVOICE</span>
                  </p>
                  <p className="text-[9px] text-[#111111]/70 leading-tight">
                    Scan QR code with any mobile camera to verify receipt & track live order.
                  </p>
                </div>
              </div>

              <p className="text-[10px] font-bold text-[#111111]">
                Thank you for choosing Pizza House Quetta!
              </p>
              <p className="text-[9px] text-[#111111]/70">
                100% Real Mozzarella • Oven Fresh • Halal Certified
              </p>
            </div>

            {/* Thermal Cut Mark */}
            <div className="text-center pt-1 border-t border-dashed border-[#111111]/30 text-[9px] text-[#111111]/50 font-mono">
              - - - - - - - - - - - - [ CUT HERE ] - - - - - - - - - - - -
            </div>
          </div>

          {/* Bottom Interactive Cashier Actions (Hidden on Print) */}
          <div className="mt-4 space-y-3 print:hidden">
            {/* Quick Cash Tender Calculator for Staff */}
            <div className="flex items-center gap-2 bg-black/5 p-2 rounded-2xl border border-black/10">
              <span className="text-[11px] font-bold text-black/70 pl-2 shrink-0">
                Cash Tendered (Rs):
              </span>
              <input
                type="number"
                value={tenderAmount}
                onChange={(e) => setTenderAmount(e.target.value)}
                placeholder={`e.g. ${Math.ceil(grandTotal / 500) * 500}`}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-black/15 text-xs font-bold text-black focus:outline-none focus:border-[#C8102E]"
              />
              {tenderAmount && (
                <button
                  onClick={() => setTenderAmount('')}
                  className="px-2 text-xs font-bold text-[#C8102E] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                disabled={isPrinting}
                className="py-3.5 px-4 rounded-2xl bg-[#111111] hover:bg-black text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#F4B93B]" />
                <span>{isPrinting ? 'Printing Invoice...' : 'Print POS Invoice'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#A00B23] hover:from-[#E52E4D] hover:to-[#C8102E] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done & Dismiss</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
