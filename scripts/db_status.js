const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

async function checkDatabase() {
  console.log('\n===================================================');
  console.log('       PIZZA HOUSE QUETTA - DATABASE STATUS        ');
  console.log('===================================================\n');

  let mysqlOk = false;
  let mysqlInfo = '';

  try {
    const mysql = require('mysql2/promise');
    const host = process.env.MYSQL_HOST || 'localhost';
    const port = Number(process.env.MYSQL_PORT) || 3306;
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';
    const database = process.env.MYSQL_DATABASE || 'pizza_house_quetta';

    console.log(`[1/2] Connecting to MySQL at ${host}:${port} (${database})...`);

    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      connectTimeout: 5000,
    });

    const [rows] = await connection.query('SHOW TABLES');
    const tables = rows.map((r) => Object.values(r)[0]);

    let itemCount = 0;
    let orderCount = 0;

    if (tables.includes('menu_items')) {
      const [itemRows] = await connection.query('SELECT COUNT(*) AS count FROM menu_items');
      itemCount = itemRows[0]?.count || 0;
    }
    if (tables.includes('orders')) {
      const [orderRows] = await connection.query('SELECT COUNT(*) AS count FROM orders');
      orderCount = orderRows[0]?.count || 0;
    }

    await connection.end();

    console.log('  -> Status:    [CONNECTED]');
    console.log(`  -> Database:  ${database}`);
    console.log(`  -> Tables:    ${tables.join(', ') || 'None found'}`);
    console.log(`  -> Menu Items: ${itemCount} items`);
    console.log(`  -> Orders:    ${orderCount} orders`);
    mysqlOk = true;
  } catch (err) {
    console.log('  -> Status:    [NOT CONNECTED / OFFLINE]');
    console.log(`  -> Error:     ${err.message}`);
    console.log('  -> Note:      If using XAMPP, ensure MySQL is started in XAMPP Control Panel.');
  }

  console.log('\n[2/2] Checking Fallback & Cloud Stores...');
  const jsonPath = path.join(__dirname, '..', 'data', 'db.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log(`  -> Local JSON: [AVAILABLE] (${jsonData.items?.length || 0} items, ${jsonData.categories?.length || 0} categories)`);
    } catch (e) {
      console.log('  -> Local JSON: [ERROR PARSING db.json]');
    }
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.KV_URL;
  if (kvUrl) {
    console.log('  -> Cloud KV:   [CONFIGURED] (Upstash Redis fallback active)');
  }

  console.log('\n===================================================\n');
  process.exit(mysqlOk ? 0 : 0);
}

checkDatabase();
