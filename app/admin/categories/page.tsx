'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderTree, X } from 'lucide-react';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Pizza');
  const [sortOrder, setSortOrder] = useState('1');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setIcon('Pizza');
    setSortOrder(String(categories.length + 1));
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Pizza');
    setSortOrder(String(cat.sortOrder));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      if (editingCat) {
        const res = await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCat.id,
            name,
            description,
            icon,
            sortOrder: Number(sortOrder),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            icon,
            sortOrder: Number(sortOrder),
          }),
        });
        const data = await res.json();
        if (data.success) {
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight text-white">
            Category <span className="text-[#F4B93B]">Manager</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Organize food categories (Pizzas, Burgers, Shawarma, Crispy Chicken, Fries).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C8102E] to-[#A00B23] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-white/60">Loading Categories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-[#F4B93B]/40 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#F4B93B]/10 text-[#F4B93B] font-bold text-xs">
                    Sort #{cat.sortOrder}
                  </span>
                  <span className="text-xs text-white/40 font-mono">ID: {cat.id}</span>
                </div>

                <h3 className="font-heading text-xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed mb-6">{cat.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs font-bold transition-colors flex items-center gap-1 border border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#1A1A1A] rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 z-10 text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="font-heading text-2xl font-bold uppercase mb-6">
              {editingCat ? 'Edit Category' : 'Create Category'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E]"
                  placeholder="e.g. Italian Pizzas"
                />
              </div>

              <div>
                <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E]"
                  placeholder="Category description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Icon Type</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="Pizza">Pizza</option>
                    <option value="Beef">Beef / Burger</option>
                    <option value="Wrap">Wrap / Roll</option>
                    <option value="CookingPot">Pasta</option>
                    <option value="Drumstick">Chicken Broast</option>
                    <option value="Utensils">Utensils</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold uppercase tracking-wider text-white/70 block mb-1">Sort Priority</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-xl bg-[#C8102E] hover:bg-red-700 font-bold text-white shadow-lg transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
