export interface Category {
  id: string;
  name: string;
  description: string;
  price: number;
  stripeEnvKey: string;
  features: string[];
  popular?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: Category[];
}

export const productsConfig: Product[] = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Ad-free videos, background play, and YouTube Music.",
    icon: "MonitorPlay",
    categories: [
      {
        id: "jaspay-1mo",
        name: "Jaspay YouTube 1 Month",
        description: "Upgrade your existing account via Jaspay.",
        price: 3.99,
        stripeEnvKey: "VITE_STRIPE_YOUTUBE_JASPAY",
        features: ["1 Month Access", "Ad-free videos", "Background play", "Use your own email"],
        popular: true
      },
      {
        id: "premium-account-1mo",
        name: "YouTube Premium Account 1 Month",
        description: "A fresh account with YouTube Premium pre-activated.",
        price: 4.99,
        stripeEnvKey: "VITE_STRIPE_YOUTUBE_ACCOUNT",
        features: ["1 Month Access", "Pre-activated account", "Instant delivery", "Full premium features"]
      },
      {
        id: "gmail-fresh",
        name: "Gmail Fresh",
        description: "A brand new, secure Gmail account.",
        price: 1.99,
        stripeEnvKey: "VITE_STRIPE_YOUTUBE_GMAIL",
        features: ["Freshly created", "Never used", "Secure login", "Full access"]
      }
    ]
  },
  {
    id: "canva",
    name: "Canva",
    description: "Premium templates, magic resize, and background remover.",
    icon: "Palette",
    categories: [
      {
        id: "invite-1mo",
        name: "Canva via Invite 1 Month",
        description: "Join a premium team via an invite link.",
        price: 2.99,
        stripeEnvKey: "VITE_STRIPE_CANVA_INVITE",
        features: ["1 Month Access", "Use your own email", "Pro templates", "Magic Resize"],
        popular: true
      },
      {
        id: "head-account-1mo",
        name: "Canva Head Account 1 Month",
        description: "Full admin access to a Canva Pro account.",
        price: 5.99,
        stripeEnvKey: "VITE_STRIPE_CANVA_HEAD",
        features: ["1 Month Access", "Admin privileges", "Invite others", "Full Pro features"]
      },
      {
        id: "jaspay-1mo",
        name: "Jaspay Canva 1 Month",
        description: "Upgrade your account via Jaspay.",
        price: 3.99,
        stripeEnvKey: "VITE_STRIPE_CANVA_JASPAY",
        features: ["1 Month Access", "Secure upgrade", "Keep your designs", "Pro access"]
      }
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Access to GPT-4, faster response speeds, and plugins.",
    icon: "Bot",
    categories: [
      {
        id: "jaspay-1mo",
        name: "Jaspay ChatGPT Plus 1 Month",
        description: "Upgrade your existing OpenAI account via Jaspay.",
        price: 12.99,
        stripeEnvKey: "VITE_STRIPE_CHATGPT_JASPAY",
        features: ["1 Month Access", "GPT-4 access", "DALL-E 3", "Use your own email"],
        popular: true
      },
      {
        id: "account-1mo",
        name: "ChatGPT Plus Account 1 Month",
        description: "A fresh account with ChatGPT Plus pre-activated.",
        price: 14.99,
        stripeEnvKey: "VITE_STRIPE_CHATGPT_ACCOUNT",
        features: ["1 Month Access", "Pre-activated account", "Instant delivery", "Priority access"]
      }
    ]
  }
];
