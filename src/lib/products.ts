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
  type: "subscription" | "voucher";
  inputConfig?: {
    idLabel: string;
    idPlaceholder: string;
    hasZone?: boolean;
    zoneLabel?: string;
    zonePlaceholder?: string;
  };
  categories: Category[];
}

export const productsConfig: Product[] = [
  {
    id: "youtube",
    name: "YouTube",
    description: "Ad-free videos, background play, and YouTube Music.",
    icon: "MonitorPlay",
    type: "subscription",
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
    type: "subscription",
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
    type: "subscription",
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
  },
  {
    id: "mobile-legends",
    name: "Mobile Legends",
    description: "Top up Mobile Legends Diamonds instantly.",
    icon: "Gamepad2",
    type: "voucher",
    inputConfig: {
      idLabel: "User ID",
      idPlaceholder: "Masukkan User ID",
      hasZone: true,
      zoneLabel: "Zone ID",
      zonePlaceholder: "Masukkan Zone ID"
    },
    categories: [
      {
        id: "ml-86-dm",
        name: "86 Diamonds",
        description: "86 Diamonds Mobile Legends",
        price: 1.50,
        stripeEnvKey: "VITE_STRIPE_ML_86_DM",
        features: ["Instant Delivery", "Official Top Up"]
      },
      {
        id: "ml-172-dm",
        name: "172 Diamonds",
        description: "172 Diamonds Mobile Legends",
        price: 2.99,
        stripeEnvKey: "VITE_STRIPE_ML_172_DM",
        features: ["Instant Delivery", "Official Top Up"],
        popular: true
      },
      {
        id: "ml-257-dm",
        name: "257 Diamonds",
        description: "257 Diamonds Mobile Legends",
        price: 4.50,
        stripeEnvKey: "VITE_STRIPE_ML_257_DM",
        features: ["Instant Delivery", "Official Top Up"]
      }
    ]
  },
  {
    id: "free-fire",
    name: "Free Fire",
    description: "Top up Free Fire Diamonds instantly.",
    icon: "Flame",
    type: "voucher",
    inputConfig: {
      idLabel: "Player ID",
      idPlaceholder: "Masukkan Player ID"
    },
    categories: [
      {
        id: "ff-70-dm",
        name: "70 Diamonds",
        description: "70 Diamonds Free Fire",
        price: 0.99,
        stripeEnvKey: "VITE_STRIPE_FF_70_DM",
        features: ["Instant Delivery", "Official Top Up"]
      },
      {
        id: "ff-140-dm",
        name: "140 Diamonds",
        description: "140 Diamonds Free Fire",
        price: 1.99,
        stripeEnvKey: "VITE_STRIPE_FF_140_DM",
        features: ["Instant Delivery", "Official Top Up"],
        popular: true
      }
    ]
  },
  {
    id: "valorant",
    name: "Valorant",
    description: "Top up Valorant Points (VP) instantly.",
    icon: "Gamepad2",
    type: "voucher",
    inputConfig: {
      idLabel: "Riot ID",
      idPlaceholder: "Username#Tag"
    },
    categories: [
      {
        id: "val-625-vp",
        name: "625 Points",
        description: "625 Valorant Points",
        price: 4.99,
        stripeEnvKey: "VITE_STRIPE_VAL_625_VP",
        features: ["Instant Delivery", "Official Top Up"]
      },
      {
        id: "val-1125-vp",
        name: "1125 Points",
        description: "1125 Valorant Points",
        price: 8.99,
        stripeEnvKey: "VITE_STRIPE_VAL_1125_VP",
        features: ["Instant Delivery", "Official Top Up"],
        popular: true
      }
    ]
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    description: "Top up PUBG Mobile Unknown Cash (UC) instantly.",
    icon: "Gamepad2",
    type: "voucher",
    inputConfig: {
      idLabel: "Player ID",
      idPlaceholder: "Masukkan Player ID"
    },
    categories: [
      {
        id: "pubg-60-uc",
        name: "60 UC",
        description: "60 Unknown Cash",
        price: 0.99,
        stripeEnvKey: "VITE_STRIPE_PUBG_60_UC",
        features: ["Instant Delivery", "Official Top Up"]
      },
      {
        id: "pubg-325-uc",
        name: "325 UC",
        description: "325 Unknown Cash",
        price: 4.99,
        stripeEnvKey: "VITE_STRIPE_PUBG_325_UC",
        features: ["Instant Delivery", "Official Top Up"],
        popular: true
      }
    ]
  }
];
