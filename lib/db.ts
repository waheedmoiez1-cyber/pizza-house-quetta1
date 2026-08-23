import fs from 'fs';
import path from 'path';
import { MenuItem, Category, StoreSettings, Order, Review, DBData } from './types';
import seedData from '../data/db.json';

const LOCAL_DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const TMP_DB_PATH = path.join('/tmp', 'phq_db.json');

// In-memory cache for fast serverless execution
let inMemoryDB: DBData | null = null;
let lastCloudSync = 0;

// Cloud KV / Upstash Redis credentials
const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

/**
 * Helper to sync data to Upstash Redis / Vercel KV cloud database if configured
 */
async function syncToCloudKV(data: DBData): Promise<boolean> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return false;
  try {
    const res = await fetch(`${KV_REST_API_URL.replace(/\/$/, '')}/set/phq_database`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(data)),
    });
    return res.ok;
  } catch (err) {
    console.error('Error syncing to Cloud KV:', err);
    return false;
  }
}

/**
 * Helper to fetch data from Upstash Redis / Vercel KV cloud database
 */
export async function fetchFromCloudKV(): Promise<DBData | null> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return null;
  try {
    const res = await fetch(`${KV_REST_API_URL.replace(/\/$/, '')}/get/phq_database`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
    return parsed as DBData;
  } catch (err) {
    console.error('Error fetching from Cloud KV:', err);
    return null;
  }
}

/**
 * Synchronous getDBData with multi-layer fallback:
 * 1. In-memory cache (fastest)
 * 2. Local filesystem data/db.json (if present and readable)
 * 3. /tmp/phq_db.json (if running in serverless container)
 * 4. Statically bundled seedData from data/db.json
 */
export function getDBData(): DBData {
  if (inMemoryDB) {
    return inMemoryDB;
  }

  // 1. Try reading from local data/db.json
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const fileData = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      inMemoryDB = parsed;
      return parsed;
    }
  } catch (error) {
    // Silently fall through
  }

  // 2. Try reading from /tmp/phq_db.json
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      const tmpData = fs.readFileSync(TMP_DB_PATH, 'utf-8');
      const parsed = JSON.parse(tmpData);
      inMemoryDB = parsed;
      return parsed;
    }
  } catch (error) {
    // Silently fall through
  }

  // 3. Fallback to statically imported seed data (guarantees zero missing items)
  const initial = (seedData as unknown as DBData) || {
    admin: { username: 'admin', password: 'Dtan@1234' },
    settings: {
      storeName: 'Pizza House Quetta',
      tagline: "Quetta's Favorite Slice Since Day One",
      address: 'Toghi Road, Quetta, Balochistan, Pakistan',
      phone: '0300-1234567',
      hours: 'Daily, 10:00 AM – 12:00 AM',
      isOpen: true,
      taxRate: 5,
      deliveryFee: 150,
      freeDeliveryThreshold: 1500,
      announcementText: '🔥 Midnight Craving Special: Free Delivery on orders above Rs. 1500! Call 0300-1234567',
      announcementActive: true,
    },
    categories: [],
    items: [],
    orders: [],
    reviews: [],
  };

  inMemoryDB = JSON.parse(JSON.stringify(initial));
  return inMemoryDB!;
}

/**
 * Asynchronous getDBDataAsync that also checks Cloud KV when available
 */
export async function getDBDataAsync(): Promise<DBData> {
  const now = Date.now();
  // If Cloud KV configured and not fetched recently (or no memory cache), check cloud
  if (KV_REST_API_URL && KV_REST_API_TOKEN && (!inMemoryDB || now - lastCloudSync > 15000)) {
    const cloudData = await fetchFromCloudKV();
    if (cloudData) {
      inMemoryDB = cloudData;
      lastCloudSync = now;
      return inMemoryDB;
    }
  }
  return getDBData();
}

/**
 * Safe database persistence with multi-layer saving:
 * 1. Updates in-memory DB
 * 2. Tries writing to data/db.json (local dev)
 * 3. Tries writing to /tmp/phq_db.json (serverless safe)
 * 4. Syncs to Cloud KV / Redis if configured
 */
export function saveDBData(data: DBData): void {
  inMemoryDB = data;

  // 1. Try local data/db.json
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // On Vercel / read-only filesystem, writing to process.cwd() fails with EROFS.
    // We gracefully try /tmp/phq_db.json
    try {
      fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (tmpErr) {
      // Memory DB still updated
    }
  }

  // 2. Trigger Cloud KV sync asynchronously if configured
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    syncToCloudKV(data).catch((err) => console.error('Background Cloud KV sync failed:', err));
  }
}

/**
 * Admin Credentials Verification
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;

  // Priority 1: Environment Variables (e.g. set in Vercel Dashboard)
  if (envUser && envPass) {
    if (username === envUser && password === envPass) {
      return true;
    }
  }

  // Priority 2: Database admin credentials
  const db = getDBData();
  if (db.admin?.username && db.admin?.password) {
    if (db.admin.username === username && db.admin.password === password) {
      return true;
    }
  }

  // Priority 3: Fallback default
  return username === 'admin' && password === 'Dtan@1234';
}

export function isAdminSessionValid(token?: string): boolean {
  if (!token) return false;
  return token === 'active_admin_session_token';
}

export function verifyAdminSessionCookie(cookieHeader?: string | null): boolean {
  if (!cookieHeader) return false;
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const adminCookie = cookies.find((c) => c.startsWith('phq_admin_session='));
  if (!adminCookie) return false;
  const value = adminCookie.split('=')[1];
  return isAdminSessionValid(value);
}

// Menu Items helper functions
export function getMenuItems(category?: string, search?: string): MenuItem[] {
  const db = getDBData();
  let items: MenuItem[] = db.items || [];

  if (category && category !== 'all') {
    items = items.filter((item: MenuItem) => item.categoryId === category);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    items = items.filter(
      (item: MenuItem) =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }

  return items;
}

export function getMenuItemById(id: string): MenuItem | undefined {
  const db = getDBData();
  return (db.items || []).find((item: MenuItem) => item.id === id);
}

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  const db = getDBData();
  return (db.items || []).find((item: MenuItem) => item.slug === slug);
}

export function createMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt'>): MenuItem {
  const db = getDBData();
  const id = `item-${Date.now()}`;
  const item: MenuItem = {
    ...itemData,
    id,
    createdAt: new Date().toISOString(),
  };
  if (!db.items) db.items = [];
  db.items.unshift(item);
  saveDBData(db);
  return item;
}

export function addMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt'>): MenuItem {
  return createMenuItem(itemData);
}

export function updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
  const db = getDBData();
  if (!db.items) db.items = [];
  const index = db.items.findIndex((item: MenuItem) => item.id === id);
  if (index === -1) return null;

  db.items[index] = { ...db.items[index], ...updates };
  saveDBData(db);
  return db.items[index];
}

export function deleteMenuItem(id: string): boolean {
  const db = getDBData();
  if (!db.items) return false;
  const initialLen = db.items.length;
  db.items = db.items.filter((item: MenuItem) => item.id !== id);
  if (db.items.length < initialLen) {
    saveDBData(db);
    return true;
  }
  return false;
}

export function toggleInventoryStatus(id: string, isAvailable: boolean): MenuItem | null {
  return updateMenuItem(id, { isAvailable });
}

// Categories helper functions
export function getCategories(): Category[] {
  const db = getDBData();
  return (db.categories || []).sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);
}

export function addCategory(category: Omit<Category, 'id'>): Category {
  const db = getDBData();
  if (!db.categories) db.categories = [];
  const id = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const newCat: Category = { ...category, id };
  db.categories.push(newCat);
  saveDBData(db);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const db = getDBData();
  if (!db.categories) db.categories = [];
  const index = db.categories.findIndex((c: Category) => c.id === id);
  if (index === -1) return null;
  db.categories[index] = { ...db.categories[index], ...updates };
  saveDBData(db);
  return db.categories[index];
}

export function deleteCategory(id: string): boolean {
  const db = getDBData();
  if (!db.categories) return false;
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c: Category) => c.id !== id);
  if (db.categories.length < initialLen) {
    saveDBData(db);
    return true;
  }
  return false;
}

// Store Settings helper functions
export function getSettings(): StoreSettings {
  const db = getDBData();
  return db.settings;
}

export function updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
  const db = getDBData();
  db.settings = { ...db.settings, ...newSettings };
  saveDBData(db);
  return db.settings;
}

// Orders helper functions
export function getOrders(): Order[] {
  const db = getDBData();
  return (db.orders || []).sort(
    (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | undefined {
  const db = getDBData();
  const cleanId = (id || '').trim().replace(/^#+/, '');
  const searchDigits = cleanId.replace(/\D/g, '');

  return (db.orders || []).find((o: Order) => {
    const oId = (o.id || '').replace(/^#+/, '');
    const oNum = (o.orderNumber || '').replace(/^#+/, '');
    const phone = (o.phone || o.customerPhone || '').replace(/\D/g, '');

    return (
      o.id === id ||
      o.id === cleanId ||
      o.orderNumber === id ||
      o.orderNumber === cleanId ||
      (oId && oId.toLowerCase() === cleanId.toLowerCase()) ||
      (oNum && oNum.toLowerCase() === cleanId.toLowerCase()) ||
      (oNum && oNum.toLowerCase().includes(cleanId.toLowerCase())) ||
      (cleanId && oNum && cleanId.toLowerCase().includes(oNum.toLowerCase())) ||
      (searchDigits.length >= 3 && oNum && oNum.includes(searchDigits)) ||
      (searchDigits.length >= 7 && phone && phone.includes(searchDigits))
    );
  });
}

export function createOrder(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>
): Order {
  const db = getDBData();
  if (!db.orders) db.orders = [];
  const count = (db.orders?.length || 0) + 1002;
  const orderNumber = `PHQ-${count}`;
  const id = `ord-${Date.now()}`;
  const newOrder: Order = {
    ...orderData,
    id,
    orderNumber,
    orderStatus: 'Pending',
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(newOrder);
  saveDBData(db);
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['orderStatus']): Order | null {
  const db = getDBData();
  if (!db.orders) db.orders = [];
  const index = db.orders.findIndex((o: Order) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  db.orders[index].orderStatus = status;
  db.orders[index].status = status;
  if (status === 'Delivered') {
    db.orders[index].paymentStatus = 'paid';
  }
  saveDBData(db);
  return db.orders[index];
}

// Reviews helper functions
export function getReviews(): Review[] {
  const db = getDBData();
  return (db.reviews || []).sort(
    (a: Review, b: Review) =>
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
  );
}

export function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'date'>): Review {
  const db = getDBData();
  if (!db.reviews) db.reviews = [];
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    date: 'Just now',
    createdAt: new Date().toISOString(),
  };
  db.reviews.unshift(newReview);
  saveDBData(db);
  return newReview;
}

