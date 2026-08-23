'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Check, X, AlertCircle, ToggleLeft, ToggleRight, Star, Flame, Upload, ImageIcon, Loader2 } from 'lucide-react';
import { MenuItem, Category } from '@/lib/types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('pizza');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIsSpicy, setFormIsSpicy] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormImage(data.url);
      } else {
        alert(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      alert('Error uploading file. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  async function fetchMenuData() {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
    } finally {
      setLoading(false);
    }
  }

  // Toggle Inventory Status (In Stock vs Out of Stock)
  const handleToggleInventory = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: nextStatus } : item))
    );

    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        fetchMenuData(); // revert on failure
      }
    } catch (err) {
      fetchMenuData();
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) fetchMenuData();
    } catch (err) {
      fetchMenuData();
    }
  };

  // Open Edit modal
  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategoryId(item.categoryId);
    setFormPrice(String(item.price));
    setFormDescription(item.description);
    setFormImage(item.image);
    setFormIsSpicy(Boolean(item.isSpicy));
    setFormIsBestseller(Boolean(item.isBestseller));
    setIsAddModalOpen(true);
  };

  // Open Add New modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategoryId('pizza');
    setFormPrice('');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop');
    setFormIsSpicy(false);
    setFormIsBestseller(false);
    setIsAddModalOpen(true);
  };

  // Save Item (Add or Edit)
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const payload = {
      name: formName,
      categoryId: formCategoryId,
      price: Number(formPrice),
      description: formDescription,
      image: formImage || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
      isSpicy: formIsSpicy,
      isBestseller: formIsBestseller,
      isAvailable: editingItem ? editingItem.isAvailable : true,
    };

    try {
      if (editingItem) {
        // PUT update
        const res = await fetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsAddModalOpen(false);
          fetchMenuData();
        }
      } else {
        // POST create
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setIsAddModalOpen(false);
          fetchMenuData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-white">
            Menu Items <span className="text-[#F4B93B]">Catalog Manager</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Add new items, update prices, edit food details & toggle live stock availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:scale-105 transition-transform shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name or description..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/40 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#C8102E] border border-white/10"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/40 text-white text-xs font-semibold border border-white/10 focus:outline-none"
        >
          <option value="all" className="bg-[#1A1A1A]">All Categories ({items.length})</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.name}</option>
          ))}
        </select>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="py-20 text-center text-white/60">Loading Menu Catalog...</div>
      ) : (
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 border-b border-white/10 text-white/60 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (PKR)</th>
                  <th className="p-4">Inventory Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                            {item.name}
                            {item.isBestseller && <span title="Bestseller"><Star className="w-3.5 h-3.5 fill-[#F4B93B] text-[#F4B93B]" /></span>}
                            {item.isSpicy && <span title="Spicy"><Flame className="w-3.5 h-3.5 fill-[#C8102E] text-[#C8102E]" /></span>}
                          </h4>
                          <p className="text-[11px] text-white/50 line-clamp-1 max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 uppercase font-bold text-[#F4B93B]">{item.categoryId}</td>

                    <td className="p-4 font-bold text-white text-sm">Rs. {item.price}</td>

                    <td className="p-4">
                      {/* Inventory Stock Switch */}
                      <button
                        onClick={() => handleToggleInventory(item.id, item.isAvailable)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors border ${
                          item.isAvailable
                            ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <Check className="w-3 h-3" /> In Stock
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Out of Stock
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors border border-white/10"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 transition-colors border border-red-500/30"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-lg bg-[#1A1A1A] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 z-10 text-white my-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-heading text-2xl font-bold uppercase mb-6">
              {editingItem ? 'Edit Menu Item' : 'Add New Food Item'}
            </h2>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E]"
                  placeholder="e.g. Special Crown Pizza"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E]"
                    placeholder="e.g. 605"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E]"
                  placeholder="Ingredients and description..."
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">
                  Food Photo / Image
                </label>

                {/* Upload Action Bar */}
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 border border-emerald-400/30">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Uploading File...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Choose Local Image File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Optional Manual URL Input */}
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E] text-xs font-mono"
                  placeholder="Or paste external image URL (https://...)"
                />

                {/* Live Image Preview Frame */}
                {formImage && (
                  <div className="mt-3 p-2 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-white/20">
                      <Image src={formImage} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-[10px] text-green-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-400" />
                        Image Selected & Ready
                      </p>
                      <p className="text-[10px] text-white/60 truncate font-mono">{formImage}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formIsSpicy}
                    onChange={(e) => setFormIsSpicy(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E] rounded"
                  />
                  <span>Mark as Spicy</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="w-4 h-4 accent-[#F4B93B] rounded"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-[#C8102E] hover:bg-red-700 font-bold text-white shadow-lg transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
