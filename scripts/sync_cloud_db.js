const fs = require('fs');
const path = require('path');

const KV_URL = 'https://up-gopher-78213.upstash.io';
const KV_TOKEN = 'gQAAAAAAATGFAAIgcDJkNTM1MDMxMmQxYTg0YzIzOWFiMWRmNGQzYmY1MGFmMA';

async function sync() {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'db.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);

    console.log(`Syncing ${data.items.length} items, ${data.categories.length} categories, ${data.orders ? data.orders.length : 0} orders to Upstash Cloud Redis...`);

    const res = await fetch(`${KV_URL}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'phq_database', JSON.stringify(data)]),
    });

    const json = await res.json();
    console.log('Upstash Cloud Response:', json);
    if (json.result === 'OK' || res.ok) {
      console.log('✅ Successfully updated live database on Upstash Cloud & Vercel!');
    } else {
      console.error('❌ Failed to update cloud database:', json);
    }
  } catch (err) {
    console.error('Error during cloud sync:', err);
  }
}

sync();
