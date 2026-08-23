export interface PizzaSizeOption {
  name: string;
  priceOffset: number;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number; // Base price in PKR
  description: string;
  image: string;
  isBestseller?: boolean;
  isPopular?: boolean;
  isSpicy?: boolean;
  isAvailable: boolean; // Inventory status (true = In Stock, false = Out of Stock)
  rating?: number;
  prepTime?: string;
  sizes?: PizzaSizeOption[];
  addOns?: AddOnOption[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  sortOrder: number;
  isAvailable: boolean;
}

export type MenuCategory = Category;

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  taxRate: number; // Percentage, e.g., 15 for 15% GST
  deliveryFee: number; // Flat delivery fee in PKR
  freeDeliveryThreshold: number; // Free delivery above this subtotal in PKR
  announcementText: string;
  announcementActive: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number; // Unit price with size & add-ons
  quantity: number;
  selectedSize?: string;
  selectedAddOns?: string[];
  totalPrice: number;
  image?: string;
}

export type PaymentMethod = 'Cash on Delivery' | 'JazzCash / EasyPaisa' | 'Credit / Debit Card' | 'cod' | 'jazzcash' | 'card';

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  phone?: string; // Alias for customerPhone
  customerEmail?: string;
  orderType: 'delivery' | 'pickup';
  deliveryOption?: string; // Alias for orderType
  address?: string;
  landmark?: string;
  paymentMethod: 'cod' | 'jazzcash' | 'card';
  paymentStatus: 'pending' | 'paid' | 'completed' | 'failed';
  orderStatus: OrderStatus;
  status?: OrderStatus; // Alias for orderStatus
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface CartItem {
  cartId: string; // Unique combination of itemId + size + add-ons
  item: MenuItem;
  selectedSize?: PizzaSizeOption;
  selectedAddOns?: AddOnOption[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  itemOrdered: string;
  date: string;
  createdAt?: string;
}
