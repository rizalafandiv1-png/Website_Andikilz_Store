import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import Stripe from "stripe";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize SQLite Database
const db = new Database("app.db");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT,
    is_pro INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    requests_count INTEGER DEFAULT 0,
    last_request_date TEXT
  )
`);

// Lazy initialize Stripe
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is required");
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// Lazy initialize Gemini
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is required");
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// Helper to reset daily limits
function checkAndResetDailyLimit(userId: string) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];
  if (user.last_request_date !== today) {
    db.prepare("UPDATE users SET requests_count = 0, last_request_date = ? WHERE id = ?").run(today, userId);
  }
}

// --- API Routes ---

// Webhook needs raw body
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).send("Webhook secret missing");
    return;
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      if (userId) {
        db.prepare("UPDATE users SET is_pro = 1, stripe_customer_id = ?, stripe_subscription_id = ? WHERE id = ?")
          .run(session.customer as string, session.subscription as string, userId);
      }
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      db.prepare("UPDATE users SET is_pro = 0 WHERE stripe_subscription_id = ?")
        .run(subscription.id);
    }

    res.json({ received: true });
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Use JSON for other routes
app.use(express.json());

// Sync user from Firebase to DB
app.post("/api/user/sync", (req, res) => {
  const { id, email } = req.body;
  if (!id || !email) {
    res.status(400).json({ error: "Missing id or email" });
    return;
  }

  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!existing) {
    db.prepare("INSERT INTO users (id, email) VALUES (?, ?)").run(id, email);
  }
  
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  res.json(user);
});

// Get user status
app.get("/api/user/:id", (req, res) => {
  const { id } = req.params;
  checkAndResetDailyLimit(id);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

// Generate AI Content
app.post("/api/generate", async (req, res) => {
  const { userId, prompt } = req.body;
  if (!userId || !prompt) {
    res.status(400).json({ error: "Missing userId or prompt" });
    return;
  }

  try {
    checkAndResetDailyLimit(userId);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.is_pro && user.requests_count >= 3) {
      res.status(403).json({ error: "Free tier limit reached. Please upgrade to Pro." });
      return;
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Increment usage
    const today = new Date().toISOString().split("T")[0];
    db.prepare("UPDATE users SET requests_count = requests_count + 1, last_request_date = ? WHERE id = ?")
      .run(today, userId);

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Generate error:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
});

// Create Stripe Checkout Session
app.post("/api/stripe/create-checkout", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: "Missing userId" });
    return;
  }

  try {
    const stripe = getStripe();
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Nexus AI Pro Subscription",
              description: "Unlimited AI generations",
            },
            unit_amount: 900, // $9.00
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?success=true`,
      cancel_url: `${appUrl}/dashboard?canceled=true`,
      client_reference_id: userId,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message || "Failed to create checkout session" });
  }
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
