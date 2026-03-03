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
    description: "Video tanpa iklan, putar di latar belakang, dan YouTube Music.",
    icon: "MonitorPlay",
    type: "subscription",
    categories: [
      {
        id: "jaspay-1mo",
        name: "Jaspay YouTube 1 Bulan",
        description: "Upgrade akun Anda yang sudah ada melalui Jaspay.",
        price: 5000,
        stripeEnvKey: "VITE_STRIPE_YOUTUBE_JASPAY",
        features: ["Akses 1 Bulan", "Video tanpa iklan", "Putar di latar belakang", "Gunakan email sendiri"],
        popular: true
      },
      {
        id: "premium-account-1mo",
        name: "Akun YouTube Premium 1 Bulan",
        description: "Akun baru dengan YouTube Premium yang sudah aktif.",
        price: 8000,
        stripeEnvKey: "VITE_STRIPE_YOUTUBE_ACCOUNT",
        features: ["Akses 1 Bulan", "Akun siap pakai", "Pengiriman instan", "Fitur premium lengkap"]
      },
      {
        id: "gmail-fresh",
        name: "Gmail Fresh",
        description: "Akun Gmail baru yang aman.",
        price: 1500,
        stripeEnvKey: "VITE_STRIPE_YOUTUBE_GMAIL",
        features: ["Baru dibuat", "Belum pernah digunakan", "Login aman", "Akses penuh"]
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
        id: "invite-1mo",
        name: "Canva via Invite 1 Bulan",
        description: "Bergabung dengan tim premium melalui link undangan.",
        price: 1000,
        stripeEnvKey: "VITE_STRIPE_CANVA_INVITE",
        features: ["Akses 1 Bulan", "Gunakan email sendiri", "Template Pro", "Magic Resize"],
        popular: true
      },
      {
        id: "head-account-1mo",
        name: "Akun Head Canva 1 Bulan",
        description: "Akses admin penuh ke akun Canva Pro.",
        price: 7000,
        stripeEnvKey: "VITE_STRIPE_CANVA_HEAD",
        features: ["Akses 1 Bulan", "Hak istimewa admin", "Undang orang lain", "Fitur Pro lengkap"]
      },
      {
        id: "jaspay-1mo",
        name: "Jaspay Canva 1 Bulan",
        description: "Upgrade akun Anda melalui Jaspay.",
        price: 5000,
        stripeEnvKey: "VITE_STRIPE_CANVA_JASPAY",
        features: ["Akses 1 Bulan", "Upgrade aman", "Simpan desain Anda", "Akses Pro"]
      }
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Akses ke GPT-4, kecepatan respon lebih cepat, dan plugin.",
    icon: "Bot",
    type: "subscription",
    categories: [
      {
        id: "jaspay-1mo",
        name: "Jaspay ChatGPT Plus 1 Bulan",
        description: "Upgrade akun OpenAI Anda yang sudah ada melalui Jaspay.",
        price: 5000,
        stripeEnvKey: "VITE_STRIPE_CHATGPT_JASPAY",
        features: ["Akses 1 Bulan", "Akses GPT-4", "DALL-E 3", "Gunakan email sendiri"],
        popular: true
      },
      {
        id: "account-1mo",
        name: "Akun ChatGPT Plus 1 Bulan",
        description: "Akun baru dengan ChatGPT Plus yang sudah aktif.",
        price: 8000,
        stripeEnvKey: "VITE_STRIPE_CHATGPT_ACCOUNT",
        features: ["Akses 1 Bulan", "Akun siap pakai", "Pengiriman instan", "Akses prioritas"]
      }
    ]
  }
];
