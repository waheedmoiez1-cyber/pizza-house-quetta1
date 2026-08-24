import { MenuItem, Category, StoreSettings, Order, OrderItem, Review } from './types';

// Connection pool singleton
let pool: any = null;
let mysqlModule: any = null;
let hasLoggedError = false;

/**
 * Safely load mysql2/promise
 */
function getMySQLModule() {
  if (mysqlModule) return mysqlModule;
  try {
    mysqlModule = require('mysql2/promise');
    return mysqlModule;
  } catch (err) {
    if (!hasLoggedError) {
      console.warn('⚠️ mysql2 package is not installed or not available in this environment. Falling back to JSON/KV store.');
      hasLoggedError = true;
    }
    return null;
  }
}

/**
 * Check if MySQL mode is enabled via environment variables
 */
export function isMySQLEnabled(): boolean {
  if (process.env.USE_MYSQL === 'false') return false;
  return Boolean(
    process.env.USE_MYSQL === 'true' ||
    process.env.MYSQL_HOST ||
    process.env.MYSQL_DATABASE ||
    process.env.MYSQL_URL
  );
}

/**
 * Get or create MySQL Connection Pool
 */
export function getMySQLPool() {
  if (pool) return pool;
  const mysql = getMySQLModule();
  if (!mysql) return null;

  try {
    if (process.env.MYSQL_URL) {
      pool = mysql.createPool({
        uri: process.env.MYSQL_URL,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
    } else {
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'pizza_house_quetta',
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
      });
    }
    return pool;
  } catch (err) {
    console.error('Failed to initialize MySQL pool:', err);
    return null;
  }
}

/**
 * Test MySQL connection and return diagnostic status
 */
export async function testMySQLConnection(): Promise<{
  connected: boolean;
  message: string;
  database?: string;
  tables?: string[];
  itemCount?: number;
  orderCount?: number;
}> {
  const p = getMySQLPool();
  if (!p) {
    return {
      connected: false,
      message: 'mysql2 library is not available or connection pool could not be created.',
    };
  }

  try {
    const [rows]: any = await p.query('SHOW TABLES');
    const dbName = process.env.MYSQL_DATABASE || 'pizza_house_quetta';
    const tables = rows.map((r: any) => Object.values(r)[0] as string);

    let itemCount = 0;
    let orderCount = 0;

    if (tables.includes('menu_items')) {
      const [itemRows]: any = await p.query('SELECT COUNT(*) AS count FROM menu_items');
      itemCount = itemRows[0]?.count || 0;
    }

    if (tables.includes('orders')) {
      const [orderRows]: any = await p.query('SELECT COUNT(*) AS count FROM orders');
      orderCount = orderRows[0]?.count || 0;
    }

    return {
      connected: true,
      message: `Successfully connected to MySQL database: ${dbName}`,
      database: dbName,
      tables,
      itemCount,
      orderCount,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || 'Failed to connect to MySQL database.',
    };
  }
}

// -------------------------------------------------------------
// Category Helpers
// -------------------------------------------------------------

export async function fetchCategoriesFromMySQL(): Promise<Category[] | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const [rows]: any = await p.query(
      'SELECT id, name, icon, description, sort_order AS sortOrder, is_available AS isAvailable FROM categories ORDER BY sort_order ASC'
    );
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      icon: r.icon || 'Utensils',
      description: r.description || '',
      sortOrder: Number(r.sortOrder) || 0,
      isAvailable: Boolean(r.isAvailable),
    }));
  } catch (error) {
    console.error('MySQL fetchCategories error:', error);
    return null;
  }
}

export async function addCategoryToMySQL(category: Omit<Category, 'id'>): Promise<Category | null> {
  const p = getMySQLPool();
  if (!p) return null;
  const id = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  try {
    await p.query(
      'INSERT INTO categories (id, name, icon, description, sort_order, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [
        id,
        category.name,
        category.icon || 'Utensils',
        category.description || '',
        category.sortOrder || 0,
        category.isAvailable !== false ? 1 : 0,
      ]
    );
    return { ...category, id };
  } catch (error) {
    console.error('MySQL addCategory error:', error);
    return null;
  }
}

export async function updateCategoryInMySQL(id: string, updates: Partial<Category>): Promise<Category | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.icon !== undefined) {
      fields.push('icon = ?');
      values.push(updates.icon);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.sortOrder !== undefined) {
      fields.push('sort_order = ?');
      values.push(updates.sortOrder);
    }
    if (updates.isAvailable !== undefined) {
      fields.push('is_available = ?');
      values.push(updates.isAvailable ? 1 : 0);
    }

    if (fields.length > 0) {
      values.push(id);
      await p.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    const [rows]: any = await p.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      icon: r.icon,
      description: r.description,
      sortOrder: r.sort_order,
      isAvailable: Boolean(r.is_available),
    };
  } catch (error) {
    console.error('MySQL updateCategory error:', error);
    return null;
  }
}

export async function deleteCategoryFromMySQL(id: string): Promise<boolean> {
  const p = getMySQLPool();
  if (!p) return false;
  try {
    const [res]: any = await p.query('DELETE FROM categories WHERE id = ?', [id]);
    return res.affectedRows > 0;
  } catch (error) {
    console.error('MySQL deleteCategory error:', error);
    return false;
  }
}

// -------------------------------------------------------------
// Menu Items Helpers
// -------------------------------------------------------------

function mapMenuItemRow(r: any): MenuItem {
  let sizes = undefined;
  if (r.sizes_json) {
    try {
      sizes = typeof r.sizes_json === 'string' ? JSON.parse(r.sizes_json) : r.sizes_json;
    } catch {}
  }

  let addOns = undefined;
  if (r.addons_json) {
    try {
      addOns = typeof r.addons_json === 'string' ? JSON.parse(r.addons_json) : r.addons_json;
    } catch {}
  }

  return {
    id: r.id,
    name: r.name,
    slug: r.slug || r.id,
    categoryId: r.category_id,
    price: Number(r.price) || 0,
    description: r.description || '',
    image: r.image || '',
    isBestseller: Boolean(r.is_bestseller),
    isPopular: Boolean(r.is_popular),
    isSpicy: Boolean(r.is_spicy),
    isAvailable: Boolean(r.is_available),
    rating: Number(r.rating) || 5.0,
    prepTime: r.prep_time || '15-20 min',
    sizes,
    addOns,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function fetchMenuItemsFromMySQL(category?: string, search?: string): Promise<MenuItem[] | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND category_id = ?';
      params.push(category);
    }

    if (search && search.trim()) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows]: any = await p.query(sql, params);
    return rows.map(mapMenuItemRow);
  } catch (error) {
    console.error('MySQL fetchMenuItems error:', error);
    return null;
  }
}

export async function fetchMenuItemByIdFromMySQL(id: string): Promise<MenuItem | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const [rows]: any = await p.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return null;
    return mapMenuItemRow(rows[0]);
  } catch (error) {
    console.error('MySQL fetchMenuItemById error:', error);
    return null;
  }
}

export async function addMenuItemToMySQL(itemData: Omit<MenuItem, 'id' | 'createdAt'>): Promise<MenuItem | null> {
  const p = getMySQLPool();
  if (!p) return null;
  const id = `item-${Date.now()}`;
  const createdAt = new Date().toISOString();
  try {
    await p.query(
      `INSERT INTO menu_items (
        id, name, slug, category_id, price, description, image, 
        is_bestseller, is_popular, is_spicy, is_available, rating, prep_time, 
        sizes_json, addons_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        itemData.name,
        itemData.slug || itemData.name.toLowerCase().replace(/\s+/g, '-'),
        itemData.categoryId,
        itemData.price,
        itemData.description || '',
        itemData.image || '',
        itemData.isBestseller ? 1 : 0,
        itemData.isPopular ? 1 : 0,
        itemData.isSpicy ? 1 : 0,
        itemData.isAvailable !== false ? 1 : 0,
        itemData.rating || 5.0,
        itemData.prepTime || '15-20 min',
        itemData.sizes ? JSON.stringify(itemData.sizes) : null,
        itemData.addOns ? JSON.stringify(itemData.addOns) : null,
      ]
    );

    return {
      ...itemData,
      id,
      createdAt,
    };
  } catch (error) {
    console.error('MySQL addMenuItem error:', error);
    return null;
  }
}

export async function updateMenuItemInMySQL(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.slug !== undefined) {
      fields.push('slug = ?');
      values.push(updates.slug);
    }
    if (updates.categoryId !== undefined) {
      fields.push('category_id = ?');
      values.push(updates.categoryId);
    }
    if (updates.price !== undefined) {
      fields.push('price = ?');
      values.push(updates.price);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.image !== undefined) {
      fields.push('image = ?');
      values.push(updates.image);
    }
    if (updates.isBestseller !== undefined) {
      fields.push('is_bestseller = ?');
      values.push(updates.isBestseller ? 1 : 0);
    }
    if (updates.isPopular !== undefined) {
      fields.push('is_popular = ?');
      values.push(updates.isPopular ? 1 : 0);
    }
    if (updates.isSpicy !== undefined) {
      fields.push('is_spicy = ?');
      values.push(updates.isSpicy ? 1 : 0);
    }
    if (updates.isAvailable !== undefined) {
      fields.push('is_available = ?');
      values.push(updates.isAvailable ? 1 : 0);
    }
    if (updates.rating !== undefined) {
      fields.push('rating = ?');
      values.push(updates.rating);
    }
    if (updates.prepTime !== undefined) {
      fields.push('prep_time = ?');
      values.push(updates.prepTime);
    }
    if (updates.sizes !== undefined) {
      fields.push('sizes_json = ?');
      values.push(updates.sizes ? JSON.stringify(updates.sizes) : null);
    }
    if (updates.addOns !== undefined) {
      fields.push('addons_json = ?');
      values.push(updates.addOns ? JSON.stringify(updates.addOns) : null);
    }

    if (fields.length > 0) {
      values.push(id);
      await p.query(`UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    return fetchMenuItemByIdFromMySQL(id);
  } catch (error) {
    console.error('MySQL updateMenuItem error:', error);
    return null;
  }
}

export async function deleteMenuItemFromMySQL(id: string): Promise<boolean> {
  const p = getMySQLPool();
  if (!p) return false;
  try {
    const [res]: any = await p.query('DELETE FROM menu_items WHERE id = ?', [id]);
    return res.affectedRows > 0;
  } catch (error) {
    console.error('MySQL deleteMenuItem error:', error);
    return false;
  }
}

// -------------------------------------------------------------
// Orders & Order Items Helpers
// -------------------------------------------------------------

export async function fetchOrdersFromMySQL(): Promise<Order[] | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const [orderRows]: any = await p.query('SELECT * FROM orders ORDER BY created_at DESC');
    if (!orderRows || orderRows.length === 0) return [];

    const orderIds = orderRows.map((o: any) => o.id);
    const [itemRows]: any = await p.query('SELECT * FROM order_items WHERE order_id IN (?)', [orderIds]);

    const itemsByOrder: Record<string, OrderItem[]> = {};
    for (const it of itemRows) {
      let addOns: string[] = [];
      if (it.selected_addons) {
        try {
          addOns = typeof it.selected_addons === 'string' ? JSON.parse(it.selected_addons) : it.selected_addons;
        } catch {}
      }
      if (!itemsByOrder[it.order_id]) itemsByOrder[it.order_id] = [];
      itemsByOrder[it.order_id].push({
        id: it.item_id || it.id?.toString(),
        name: it.name,
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        selectedSize: it.selected_size || undefined,
        selectedAddOns: addOns,
        totalPrice: Number(it.total_price) || 0,
      });
    }

    return orderRows.map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      phone: o.customer_phone,
      customerEmail: o.customer_email || undefined,
      orderType: o.order_type || 'delivery',
      deliveryOption: o.order_type || 'delivery',
      address: o.address || '',
      landmark: o.landmark || '',
      paymentMethod: o.payment_method || 'cod',
      paymentStatus: o.payment_status || 'pending',
      orderStatus: o.order_status || 'Pending',
      status: o.order_status || 'Pending',
      subtotal: Number(o.subtotal) || 0,
      tax: Number(o.tax) || 0,
      deliveryFee: Number(o.delivery_fee) || 0,
      discount: Number(o.discount) || 0,
      total: Number(o.total) || 0,
      items: itemsByOrder[o.id] || [],
      notes: o.notes || '',
      createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
      updatedAt: o.updated_at ? new Date(o.updated_at).toISOString() : undefined,
    }));
  } catch (error) {
    console.error('MySQL fetchOrders error:', error);
    return null;
  }
}

export async function fetchOrderByIdFromMySQL(id: string): Promise<Order | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const [orderRows]: any = await p.query(
      'SELECT * FROM orders WHERE id = ? OR order_number = ?',
      [id, id]
    );
    if (!orderRows || orderRows.length === 0) return null;
    const o = orderRows[0];

    const [itemRows]: any = await p.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
    const items: OrderItem[] = itemRows.map((it: any) => {
      let addOns: string[] = [];
      if (it.selected_addons) {
        try {
          addOns = typeof it.selected_addons === 'string' ? JSON.parse(it.selected_addons) : it.selected_addons;
        } catch {}
      }
      return {
        id: it.item_id || it.id?.toString(),
        name: it.name,
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        selectedSize: it.selected_size || undefined,
        selectedAddOns: addOns,
        totalPrice: Number(it.total_price) || 0,
      };
    });

    return {
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      phone: o.customer_phone,
      customerEmail: o.customer_email || undefined,
      orderType: o.order_type || 'delivery',
      deliveryOption: o.order_type || 'delivery',
      address: o.address || '',
      landmark: o.landmark || '',
      paymentMethod: o.payment_method || 'cod',
      paymentStatus: o.payment_status || 'pending',
      orderStatus: o.order_status || 'Pending',
      status: o.order_status || 'Pending',
      subtotal: Number(o.subtotal) || 0,
      tax: Number(o.tax) || 0,
      deliveryFee: Number(o.delivery_fee) || 0,
      discount: Number(o.discount) || 0,
      total: Number(o.total) || 0,
      items,
      notes: o.notes || '',
      createdAt: o.created_at ? new Date(o.created_at).toISOString() : new Date().toISOString(),
      updatedAt: o.updated_at ? new Date(o.updated_at).toISOString() : undefined,
    };
  } catch (error) {
    console.error('MySQL fetchOrderById error:', error);
    return null;
  }
}

export async function createOrderInMySQL(
  orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus'>
): Promise<Order | null> {
  const p = getMySQLPool();
  if (!p) return null;

  try {
    const [countRows]: any = await p.query('SELECT COUNT(*) AS total FROM orders');
    const count = (countRows[0]?.total || 0) + 1009;
    const orderNumber = `PHQ-${count}`;
    const id = `ord-${Date.now()}`;
    const createdAt = new Date().toISOString();

    await p.query(
      `INSERT INTO orders (
        id, order_number, customer_name, customer_phone, customer_email, 
        order_type, address, landmark, payment_method, payment_status, 
        order_status, subtotal, tax, delivery_fee, discount, total, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        orderNumber,
        orderData.customerName,
        orderData.customerPhone || (orderData as any).phone || '',
        orderData.customerEmail || null,
        orderData.orderType || 'delivery',
        orderData.address || '',
        orderData.landmark || '',
        orderData.paymentMethod || 'cod',
        orderData.paymentStatus || 'pending',
        'Pending',
        orderData.subtotal || 0,
        orderData.tax || 0,
        orderData.deliveryFee || 0,
        orderData.discount || 0,
        orderData.total || 0,
        orderData.notes || '',
      ]
    );

    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        await p.query(
          `INSERT INTO order_items (
            order_id, item_id, name, price, quantity, selected_size, selected_addons, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            item.id || null,
            item.name,
            item.price || 0,
            item.quantity || 1,
            item.selectedSize || null,
            item.selectedAddOns ? JSON.stringify(item.selectedAddOns) : null,
            item.totalPrice || (item.price * item.quantity),
          ]
        );
      }
    }

    return {
      ...orderData,
      id,
      orderNumber,
      orderStatus: 'Pending',
      status: 'Pending',
      createdAt,
    };
  } catch (error) {
    console.error('MySQL createOrder error:', error);
    return null;
  }
}

export async function updateOrderStatusInMySQL(
  id: string,
  status: Order['orderStatus']
): Promise<Order | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const paymentStatus = status === 'Delivered' ? 'paid' : undefined;
    if (paymentStatus) {
      await p.query(
        'UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ? OR order_number = ?',
        [status, paymentStatus, id, id]
      );
    } else {
      await p.query(
        'UPDATE orders SET order_status = ? WHERE id = ? OR order_number = ?',
        [status, id, id]
      );
    }
    return fetchOrderByIdFromMySQL(id);
  } catch (error) {
    console.error('MySQL updateOrderStatus error:', error);
    return null;
  }
}

export async function deleteOrderFromMySQL(id: string): Promise<boolean> {
  const p = getMySQLPool();
  if (!p) return false;
  try {
    const [res]: any = await p.query('DELETE FROM orders WHERE id = ? OR order_number = ?', [id, id]);
    return res.affectedRows > 0;
  } catch (error) {
    console.error('MySQL deleteOrder error:', error);
    return false;
  }
}

// -------------------------------------------------------------
// Reviews Helpers
// -------------------------------------------------------------

export async function fetchReviewsFromMySQL(): Promise<Review[] | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const [rows]: any = await p.query('SELECT * FROM reviews ORDER BY created_at DESC');
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      location: r.location || '',
      rating: Number(r.rating) || 5,
      comment: r.comment || '',
      itemOrdered: r.item_ordered || '',
      date: r.date || 'Recently',
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('MySQL fetchReviews error:', error);
    return null;
  }
}

export async function addReviewToMySQL(review: Review | Omit<Review, 'id' | 'createdAt' | 'date'>): Promise<Review | null> {
  const p = getMySQLPool();
  if (!p) return null;
  const id = ('id' in review && review.id) ? review.id : `rev-${Date.now()}`;
  const date = ('date' in review && review.date) ? review.date : 'Just now';
  const createdAt = ('createdAt' in review && review.createdAt) ? review.createdAt : new Date().toISOString();
  try {
    await p.query(
      'INSERT INTO reviews (id, name, location, rating, comment, item_ordered, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        review.name,
        review.location || '',
        review.rating || 5,
        review.comment,
        review.itemOrdered || '',
        date,
      ]
    );
    return {
      ...review,
      id,
      date,
      createdAt,
    };
  } catch (error) {
    console.error('MySQL addReview error:', error);
    return null;
  }
}

// -------------------------------------------------------------
// Store Settings Helpers
// -------------------------------------------------------------

export async function fetchStoreSettingsFromMySQL(): Promise<StoreSettings | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const [rows]: any = await p.query('SELECT * FROM store_settings WHERE id = 1 LIMIT 1');
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      storeName: r.store_name,
      tagline: r.tagline || '',
      address: r.address,
      phone: r.phone,
      hours: r.hours || '',
      isOpen: Boolean(r.is_open),
      taxRate: Number(r.tax_rate) || 0,
      deliveryFee: Number(r.delivery_fee) || 0,
      freeDeliveryThreshold: Number(r.free_delivery_threshold) || 0,
      announcementText: r.announcement_text || '',
      announcementActive: Boolean(r.announcement_active),
    };
  } catch (error) {
    console.error('MySQL fetchStoreSettings error:', error);
    return null;
  }
}

export async function updateStoreSettingsInMySQL(settings: Partial<StoreSettings>): Promise<StoreSettings | null> {
  const p = getMySQLPool();
  if (!p) return null;
  try {
    const fields: string[] = [];
    const values: any[] = [];

    if (settings.storeName !== undefined) {
      fields.push('store_name = ?');
      values.push(settings.storeName);
    }
    if (settings.tagline !== undefined) {
      fields.push('tagline = ?');
      values.push(settings.tagline);
    }
    if (settings.address !== undefined) {
      fields.push('address = ?');
      values.push(settings.address);
    }
    if (settings.phone !== undefined) {
      fields.push('phone = ?');
      values.push(settings.phone);
    }
    if (settings.hours !== undefined) {
      fields.push('hours = ?');
      values.push(settings.hours);
    }
    if (settings.isOpen !== undefined) {
      fields.push('is_open = ?');
      values.push(settings.isOpen ? 1 : 0);
    }
    if (settings.taxRate !== undefined) {
      fields.push('tax_rate = ?');
      values.push(settings.taxRate);
    }
    if (settings.deliveryFee !== undefined) {
      fields.push('delivery_fee = ?');
      values.push(settings.deliveryFee);
    }
    if (settings.freeDeliveryThreshold !== undefined) {
      fields.push('free_delivery_threshold = ?');
      values.push(settings.freeDeliveryThreshold);
    }
    if (settings.announcementText !== undefined) {
      fields.push('announcement_text = ?');
      values.push(settings.announcementText);
    }
    if (settings.announcementActive !== undefined) {
      fields.push('announcement_active = ?');
      values.push(settings.announcementActive ? 1 : 0);
    }

    if (fields.length > 0) {
      await p.query(`UPDATE store_settings SET ${fields.join(', ')} WHERE id = 1`, values);
    }

    return fetchStoreSettingsFromMySQL();
  } catch (error) {
    console.error('MySQL updateStoreSettings error:', error);
    return null;
  }
}
