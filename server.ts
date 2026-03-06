import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize SQLite Database
const db = new Database("app.db");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    product_name TEXT,
    category_name TEXT,
    price INTEGER,
    status TEXT DEFAULT 'Menunggu',
    date TEXT,
    target_id TEXT,
    zone_id TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    icon TEXT,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    name TEXT,
    description TEXT,
    price INTEGER,
    features TEXT,
    popular INTEGER DEFAULT 0
  );
`);

// Seed initial data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as any;
if (productCount.count === 0) {
  const initialProducts = [
    {
      id: "youtube",
      name: "YouTube",
      description: "Video tanpa iklan, putar di latar belakang, dan YouTube Music.",
      icon: "MonitorPlay",
      type: "subscription",
      categories: [
        {
          id: "yt-jaspay-1mo",
          name: "Jaspay YouTube 1 Bulan",
          description: "Upgrade akun Anda yang sudah ada melalui Jaspay.",
          price: 5000,
          features: ["Akses 1 Bulan", "Video tanpa iklan", "Putar di latar belakang", "Gunakan email sendiri"],
          popular: 1
        },
        {
          id: "yt-premium-account-1mo",
          name: "Akun YouTube Premium 1 Bulan",
          description: "Akun baru dengan YouTube Premium yang sudah aktif.",
          price: 8000,
          features: ["Akses 1 Bulan", "Akun siap pakai", "Pengiriman instan", "Fitur premium lengkap"],
          popular: 0
        }
      ]
    },
    {
      id: "canva",
      name: "Canva",
      description: "Template premium, magic resize, dan penghapus latar belakang.",
      icon: "Palette",
      type: "subscription",
      categories: [
        {
          id: "cv-invite-1mo",
          name: "Canva via Invite 1 Bulan",
          description: "Bergabung dengan tim premium melalui link undangan.",
          price: 1000,
          features: ["Akses 1 Bulan", "Gunakan email sendiri", "Template Pro", "Magic Resize"],
          popular: 1
        }
      ]
    }
  ];

  for (const p of initialProducts) {
    db.prepare("INSERT INTO products (id, name, description, icon, type) VALUES (?, ?, ?, ?, ?)")
      .run(p.id, p.name, p.description, p.icon, p.type);
    
    for (const c of p.categories) {
      db.prepare("INSERT INTO categories (id, product_id, name, description, price, features, popular) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(c.id, p.id, c.name, c.description, c.price, JSON.stringify(c.features), c.popular);
    }
  }
}

// --- API Routes ---

// Products Management
app.get("/api/admin/products", (req, res) => {
  const products = db.prepare("SELECT * FROM products").all();
  const categories = db.prepare("SELECT * FROM categories").all();
  
  const result = products.map((p: any) => ({
    ...p,
    categories: categories
      .filter((c: any) => c.product_id === p.id)
      .map((c: any) => ({
        ...c,
        features: JSON.parse(c.features || "[]"),
        popular: !!c.popular
      }))
  }));
  
  res.json(result);
});

app.post("/api/admin/products", (req, res) => {
  const { id, name, description, icon, type } = req.body;
  try {
    db.prepare("INSERT INTO products (id, name, description, icon, type) VALUES (?, ?, ?, ?, ?)")
      .run(id, name, description, icon, type);
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, icon, type } = req.body;
  try {
    db.prepare("UPDATE products SET name = ?, description = ?, icon = ?, type = ? WHERE id = ?")
      .run(name, description, icon, type, id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    db.prepare("DELETE FROM categories WHERE product_id = ?").run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Categories Management
app.post("/api/admin/categories", (req, res) => {
  const { id, product_id, name, description, price, features, popular } = req.body;
  try {
    db.prepare("INSERT INTO categories (id, product_id, name, description, price, features, popular) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(id, product_id, name, description, price, JSON.stringify(features), popular ? 1 : 0);
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, features, popular } = req.body;
  try {
    db.prepare("UPDATE categories SET name = ?, description = ?, price = ?, features = ?, popular = ? WHERE id = ?")
      .run(name, description, price, JSON.stringify(features), popular ? 1 : 0, id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/categories/:id", (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Default for demo
  
  if (password === adminPassword) {
    res.json({ success: true, token: "admin-session-token-" + Date.now() });
  } else {
    res.status(401).json({ error: "Password salah" });
  }
});

// Get all orders (Admin)
app.get("/api/orders", (req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY date DESC").all();
  res.json(orders);
});

// Get orders for a specific user
app.get("/api/orders/user/:userId", (req, res) => {
  const { userId } = req.params;
  const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY date DESC").all(userId);
  res.json(orders);
});

// Get single order by ID
app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// Create a new order
app.post("/api/orders", (req, res) => {
  const { id, userId, productName, categoryName, price, date, targetId, zoneId } = req.body;
  
  try {
    db.prepare(`
      INSERT INTO orders (id, user_id, product_name, category_name, price, date, target_id, zone_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, productName, categoryName, price, date, targetId, zoneId);
    
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an order
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  
  try {
    db.prepare("DELETE FROM orders WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Sync user
app.post("/api/user/sync", (req, res) => {
  const { id, email, name } = req.body;
  if (!id || !email) {
    res.status(400).json({ error: "Missing id or email" });
    return;
  }

  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!existing) {
    db.prepare("INSERT INTO users (id, email, name) VALUES (?, ?, ?)").run(id, email, name);
  } else {
    db.prepare("UPDATE users SET email = ?, name = ? WHERE id = ?").run(email, name, id);
  }
  
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  res.json(user);
});

// --- Vite Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
