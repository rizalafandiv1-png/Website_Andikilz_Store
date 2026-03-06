import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import firebaseConfigJson from './firebase-applet-config.json' assert { type: 'json' };
// @ts-ignore
import midtransClient from 'midtrans-client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfigJson);
const db = getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId);

// Initialize Midtrans
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// Seed initial data if empty
async function seedData() {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    if (productsSnap.empty) {
      console.log("Seeding initial data to Firestore...");
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
              popular: true
            },
            {
              id: "yt-premium-account-1mo",
              name: "Akun YouTube Premium 1 Bulan",
              description: "Akun baru dengan YouTube Premium yang sudah aktif.",
              price: 8000,
              features: ["Akses 1 Bulan", "Akun siap pakai", "Pengiriman instan", "Fitur premium lengkap"],
              popular: false
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
              popular: true
            }
          ]
        }
      ];

      for (const p of initialProducts) {
        const { categories, ...productData } = p;
        await setDoc(doc(db, "products", p.id), productData);
        for (const c of categories) {
          await setDoc(doc(db, "categories", c.id), { ...c, product_id: p.id });
        }
      }
      console.log("Seeding complete.");
    }
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seedData();

// --- API Routes ---

// Midtrans Payment Creation
app.post("/api/payments/create", async (req, res) => {
  const { orderId, amount, customerDetails, itemDetails } = req.body;
  
  if (!process.env.MIDTRANS_SERVER_KEY) {
    return res.status(500).json({ error: "Midtrans Server Key is not configured" });
  }

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    customer_details: customerDetails,
    item_details: itemDetails,
    credit_card: {
      secure: true
    }
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.json(transaction);
  } catch (error: any) {
    console.error("Midtrans transaction creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Midtrans Webhook
app.post("/api/payments/webhook", async (req, res) => {
  const notification = req.body;
  
  try {
    const statusResponse = await snap.transaction.notification(notification);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let orderStatus = "Menunggu";

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = "Challenge";
      } else if (fraudStatus === 'accept') {
        orderStatus = "Selesai";
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = "Selesai";
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      orderStatus = "Dibatalkan";
    } else if (transactionStatus === 'pending') {
      orderStatus = "Menunggu";
    }

    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: orderStatus });
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Midtrans webhook processing failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Products Management
app.get("/api/admin/products", async (req, res) => {
  try {
    const productsSnap = await getDocs(collection(db, "products"));
    const categoriesSnap = await getDocs(collection(db, "categories"));
    
    const products = productsSnap.docs.map(doc => doc.data());
    const categories = categoriesSnap.docs.map(doc => doc.data());
    
    const result = products.map((p: any) => ({
      ...p,
      categories: categories
        .filter((c: any) => c.product_id === p.id)
    }));
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/products", async (req, res) => {
  const { id, name, description, icon, type } = req.body;
  try {
    await setDoc(doc(db, "products", id), { id, name, description, icon, type });
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, type } = req.body;
  try {
    await updateDoc(doc(db, "products", id), { name, description, icon, type });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDoc(doc(db, "products", id));
    // Note: In a real app, you'd also delete associated categories
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Categories Management
app.post("/api/admin/categories", async (req, res) => {
  const { id, product_id, name, description, price, features, popular } = req.body;
  try {
    await setDoc(doc(db, "categories", id), { id, product_id, name, description, price, features, popular: !!popular });
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/admin/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, features, popular } = req.body;
  try {
    await updateDoc(doc(db, "categories", id), { name, description, price, features, popular: !!popular });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDoc(doc(db, "categories", id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  if (password === adminPassword) {
    res.json({ success: true, token: "admin-session-token-" + Date.now() });
  } else {
    res.status(401).json({ error: "Password salah" });
  }
});

// Get all orders (Admin)
app.get("/api/orders", async (req, res) => {
  try {
    const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("date", "desc")));
    res.json(ordersSnap.docs.map(doc => doc.data()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for a specific user
app.get("/api/orders/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const q = query(collection(db, "orders"), where("user_id", "==", userId), orderBy("date", "desc"));
    const ordersSnap = await getDocs(q);
    res.json(ordersSnap.docs.map(doc => doc.data()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order by ID
app.get("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orderDoc = await getDoc(doc(db, "orders", id));
    if (orderDoc.exists()) {
      res.json(orderDoc.data());
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new order
app.post("/api/orders", async (req, res) => {
  const { id, userId, productName, categoryName, price, date, targetId, zoneId } = req.body;
  try {
    await setDoc(doc(db, "orders", id), { 
      id, 
      user_id: userId, 
      product_name: productName, 
      category_name: categoryName, 
      price, 
      date, 
      target_id: targetId, 
      zone_id: zoneId,
      status: 'Menunggu'
    });
    res.status(201).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await updateDoc(doc(db, "orders", id), { status });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an order
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDoc(doc(db, "orders", id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Sync user
app.post("/api/user/sync", async (req, res) => {
  const { id, email, name } = req.body;
  if (!id || !email) {
    res.status(400).json({ error: "Missing id or email" });
    return;
  }

  try {
    const userRef = doc(db, "users", id);
    const userDoc = await getDoc(userRef);
    const userData = { id, email, name, updatedAt: new Date().toISOString() };
    
    if (!userDoc.exists()) {
      await setDoc(userRef, { ...userData, createdAt: new Date().toISOString() });
    } else {
      await updateDoc(userRef, userData);
    }
    
    const updatedUser = await getDoc(userRef);
    res.json(updatedUser.data());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default app;

if (process.env.NODE_ENV !== "production") {
  async function startServer() {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  startServer();
}
