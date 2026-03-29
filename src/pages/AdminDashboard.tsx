import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Plus,
  Bell,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useNavigate, Navigate } from "react-router-dom";

interface Order {
  id: string;
  user_id: string;
  product_name: string;
  category_name: string;
  price: number;
  status: string;
  date: string;
  target_id: string;
  zone_id: string;
}

interface SocialProof {
  id: string;
  name: string;
  location: string;
  product_name: string;
  category_name: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "social-proof">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [socialProofs, setSocialProofs] = useState<SocialProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const navigate = useNavigate();

  const adminToken = localStorage.getItem("adminToken");

  const fetchData = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      if (activeTab === "orders") {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Orders data is not an array:", data);
          setOrders([]);
        }
      } else if (activeTab === "products") {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Products data is not an array:", data);
          setProducts([]);
        }
      } else if (activeTab === "social-proof") {
        const response = await fetch("/api/admin/social-proofs");
        const data = await response.json();
        if (Array.isArray(data)) {
          setSocialProofs(data);
        } else {
          console.error("Social proofs data is not an array:", data);
          setSocialProofs([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchData();
    }
  }, [adminToken, activeTab]);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: "", description: "", icon: "MonitorPlay", type: "subscription" });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ 
    name: "", 
    price: "", 
    description: "", 
    features: "Akses Premium, Garansi Full",
    popular: false 
  });

  const [isAddingProof, setIsAddingProof] = useState(false);
  const [newProof, setNewProof] = useState({
    name: "",
    location: "Indonesia",
    product_name: "",
    category_name: ""
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'product' | 'category' | 'order' | 'proof', id: string } | null>(null);

  const handleAddProof = async (e: React.FormEvent) => {
    e.preventDefault();
    const proofId = `proof-${Date.now()}`;
    try {
      const response = await fetch("/api/admin/social-proofs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProof, id: proofId, timestamp: new Date().toISOString() }),
      });
      if (response.ok) {
        setIsAddingProof(false);
        setNewProof({ name: "", location: "Indonesia", product_name: "", category_name: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add proof:", error);
    }
  };

  const deleteProof = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/social-proofs/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDeleteConfirm(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete proof:", error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = newProduct.name.toLowerCase().replace(/\s+/g, "-");
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, id: productId }),
      });
      if (response.ok) {
        setIsAddingProduct(false);
        setNewProduct({ name: "", description: "", icon: "MonitorPlay" });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (response.ok) {
        setIsEditingProduct(false);
        setEditingProduct(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to edit product:", error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const categoryId = `cat-${Math.floor(Math.random() * 1000000)}`;
    
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: categoryId,
          product_id: selectedProductId,
          ...newCategory,
          price: parseInt(newCategory.price),
          features: newCategory.features.split(",").map(f => f.trim()).filter(f => f !== ""),
        }),
      });
      if (response.ok) {
        setIsAddingCategory(false);
        setNewCategory({ name: "", price: "", description: "", features: "Akses Premium, Garansi Full", popular: false });
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingCategory,
          price: parseInt(editingCategory.price),
          features: typeof editingCategory.features === "string" 
            ? editingCategory.features.split(",").map((f: string) => f.trim()).filter((f: string) => f !== "")
            : editingCategory.features,
        }),
      });
      if (response.ok) {
        setIsEditingCategory(false);
        setEditingCategory(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to edit category:", error);
    }
  };

  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // --- Order Actions ---
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrders(prev => Array.isArray(prev) ? prev.map(o => o.id === id ? { ...o, status: newStatus } : o) : []);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteConfirm(null);
        setOrders(prev => Array.isArray(prev) ? prev.filter(o => o.id !== id) : []);
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  // --- Product Actions ---
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDeleteConfirm(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (response.ok) {
        setDeleteConfirm(null);
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'product') {
      deleteProduct(deleteConfirm.id);
    } else if (deleteConfirm.type === 'category') {
      deleteCategory(deleteConfirm.id);
    } else if (deleteConfirm.type === 'order') {
      deleteOrder(deleteConfirm.id);
    } else if (deleteConfirm.type === 'proof') {
      deleteProof(deleteConfirm.id);
    }
  };

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.target_id && order.target_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "Semua" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Proses": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Menunggu": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Dibatalkan": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-violet-400" />
            Admin Dashboard
          </h1>
          <p className="text-zinc-400">Kelola operasional Andikilz Store di satu tempat.</p>
        </div>
        <div className="flex gap-3">
          {activeTab === "products" && (
            <Button onClick={() => setIsAddingProduct(true)} className="w-fit bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
            </Button>
          )}
          <Button onClick={fetchData} variant="outline" className="w-fit border-white/10">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleLogout} variant="outline" className="w-fit border-rose-500/20 text-rose-400 hover:bg-rose-500/10">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(isAddingProduct || isEditingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">{isEditingProduct ? "Edit Produk" : "Tambah Produk Baru"}</h2>
            <form onSubmit={isEditingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={isEditingProduct ? editingProduct.name : newProduct.name}
                  onChange={(e) => isEditingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                  placeholder="Contoh: Netflix Premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Deskripsi</label>
                <textarea
                  required
                  value={isEditingProduct ? editingProduct.description : newProduct.description}
                  onChange={(e) => isEditingProduct ? setEditingProduct({ ...editingProduct, description: e.target.value }) : setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all h-24"
                  placeholder="Deskripsi singkat produk..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Tipe Produk</label>
                <select
                  value={isEditingProduct ? editingProduct.type : newProduct.type}
                  onChange={(e) => isEditingProduct ? setEditingProduct({ ...editingProduct, type: e.target.value }) : setNewProduct({ ...newProduct, type: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                >
                  <option value="subscription">Subscription (Email/Akun)</option>
                  <option value="topup">Top Up (User ID/Zone ID)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Icon (Lucide Name)</label>
                <select
                  value={isEditingProduct ? editingProduct.icon : newProduct.icon}
                  onChange={(e) => isEditingProduct ? setEditingProduct({ ...editingProduct, icon: e.target.value }) : setNewProduct({ ...newProduct, icon: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                >
                  <option value="MonitorPlay">MonitorPlay</option>
                  <option value="Palette">Palette</option>
                  <option value="Bot">Bot</option>
                  <option value="Gamepad2">Gamepad2</option>
                  <option value="Flame">Flame</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Tv">Tv</option>
                  <option value="Music">Music</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={() => { setIsAddingProduct(false); setIsEditingProduct(false); }} variant="outline" className="flex-1 rounded-xl">Batal</Button>
                <Button type="submit" className="flex-1 bg-violet-500 hover:bg-violet-600 rounded-xl">Simpan</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {(isAddingCategory || isEditingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">{isEditingCategory ? "Edit Paket" : "Tambah Paket Baru"}</h2>
            <form onSubmit={isEditingCategory ? handleEditCategory : handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Paket</label>
                <input
                  type="text"
                  required
                  value={isEditingCategory ? editingCategory.name : newCategory.name}
                  onChange={(e) => isEditingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                  placeholder="Contoh: 1 Bulan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={isEditingCategory ? editingCategory.price : newCategory.price}
                  onChange={(e) => isEditingCategory ? setEditingCategory({ ...editingCategory, price: e.target.value }) : setNewCategory({ ...newCategory, price: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                  placeholder="Contoh: 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Deskripsi</label>
                <input
                  type="text"
                  value={isEditingCategory ? editingCategory.description : newCategory.description}
                  onChange={(e) => isEditingCategory ? setEditingCategory({ ...editingCategory, description: e.target.value }) : setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                  placeholder="Deskripsi singkat paket..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Fitur (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={isEditingCategory ? (Array.isArray(editingCategory.features) ? editingCategory.features.join(", ") : editingCategory.features) : newCategory.features}
                  onChange={(e) => isEditingCategory ? setEditingCategory({ ...editingCategory, features: e.target.value }) : setNewCategory({ ...newCategory, features: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                  placeholder="Contoh: Akses Premium, Garansi Full"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={isEditingCategory ? editingCategory.popular : newCategory.popular}
                  onChange={(e) => isEditingCategory ? setEditingCategory({ ...editingCategory, popular: e.target.checked }) : setNewCategory({ ...newCategory, popular: e.target.checked })}
                  className="w-4 h-4 accent-violet-500"
                />
                <label htmlFor="popular" className="text-sm font-medium text-zinc-400">Tandai sebagai Populer</label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={() => { setIsAddingCategory(false); setIsEditingCategory(false); }} variant="outline" className="flex-1 rounded-xl">Batal</Button>
                <Button type="submit" className="flex-1 bg-violet-500 hover:bg-violet-600 rounded-xl">Simpan</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Konfirmasi Hapus</h2>
            <p className="text-zinc-400 mb-8">
              {deleteConfirm.type === 'product' 
                ? "Apakah Anda yakin ingin menghapus produk ini? Semua paket di dalamnya juga akan terhapus." 
                : deleteConfirm.type === 'category'
                ? "Apakah Anda yakin ingin menghapus paket ini?"
                : "Apakah Anda yakin ingin menghapus pesanan ini?"}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="flex-1 rounded-xl">Batal</Button>
              <Button onClick={handleDeleteConfirm} className="flex-1 bg-rose-500 hover:bg-rose-600 rounded-xl text-white">Hapus</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#0a0a0a] border border-white/5 rounded-2xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "orders" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
        >
          Pesanan
        </button>
        <button 
          onClick={() => setActiveTab("products")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "products" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
        >
          Produk & Harga
        </button>
        <button 
          onClick={() => setActiveTab("social-proof")}
          className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "social-proof" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
        >
          Social Proof
        </button>
      </div>

      {activeTab === "orders" ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Pesanan", value: (Array.isArray(orders) ? orders : []).length, icon: Package, color: "text-blue-400" },
              { label: "Menunggu", value: (Array.isArray(orders) ? orders : []).filter(o => o.status === "Menunggu").length, icon: Clock, color: "text-amber-400" },
              { label: "Dalam Proses", value: (Array.isArray(orders) ? orders : []).filter(o => o.status === "Proses").length, icon: RefreshCw, color: "text-blue-400" },
              { label: "Selesai", value: (Array.isArray(orders) ? orders : []).filter(o => o.status === "Selesai").length, icon: CheckCircle2, color: "text-emerald-400" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Cari ID Pesanan, Produk, atau Target ID..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <select 
                className="bg-transparent text-sm focus:outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">ID Pesanan</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Produk & Paket</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Memuat data pesanan...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                        Tidak ada pesanan ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-zinc-300">{order.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{order.product_name}</div>
                          <div className="text-xs text-zinc-500">{order.category_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          {order.target_id ? (
                            <div className="text-sm">
                              <span className="text-zinc-300">{order.target_id}</span>
                              {order.zone_id && <span className="text-zinc-500 ml-1">({order.zone_id})</span>}
                            </div>
                          ) : (
                            <span className="text-zinc-600 text-xs italic">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">Rp {order.price.toLocaleString('id-ID')}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-zinc-400">
                            {new Date(order.date).toLocaleDateString('id-ID', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select 
                              className="bg-zinc-900 border border-white/10 rounded-lg text-[10px] px-2 py-1 focus:outline-none"
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                            >
                              <option value="Menunggu">Menunggu</option>
                              <option value="Proses">Proses</option>
                              <option value="Selesai">Selesai</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                            <button 
                              onClick={() => setDeleteConfirm({ type: 'order', id: order.id })}
                              className="p-1.5 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-zinc-500 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === "social-proof" ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Manual Social Proof</h2>
            <Button onClick={() => setIsAddingProof(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Social Proof
            </Button>
          </div>

          {isAddingProof && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-6">Tambah Social Proof</h2>
                <form onSubmit={handleAddProof} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Pembeli</label>
                    <input
                      type="text"
                      required
                      value={newProof.name}
                      onChange={(e) => setNewProof({ ...newProof, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                      placeholder="Contoh: Budi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Lokasi</label>
                    <input
                      type="text"
                      required
                      value={newProof.location}
                      onChange={(e) => setNewProof({ ...newProof, location: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                      placeholder="Contoh: Jakarta"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Produk</label>
                    <input
                      type="text"
                      required
                      value={newProof.product_name}
                      onChange={(e) => setNewProof({ ...newProof, product_name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                      placeholder="Contoh: Netflix Premium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Paket</label>
                    <input
                      type="text"
                      required
                      value={newProof.category_name}
                      onChange={(e) => setNewProof({ ...newProof, category_name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                      placeholder="Contoh: 1 Bulan"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" onClick={() => setIsAddingProof(false)} variant="outline" className="flex-1 rounded-xl">Batal</Button>
                    <Button type="submit" className="flex-1 bg-violet-500 hover:bg-violet-600 rounded-xl">Simpan</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialProofs.map((proof) => (
              <div key={proof.id} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{proof.name}</div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="w-3 h-3" />
                      {proof.location}
                    </div>
                  </div>
                  <button 
                    onClick={() => setDeleteConfirm({ type: 'proof', id: proof.id })}
                    className="p-2 rounded-lg hover:bg-rose-500/10 hover:text-rose-400 text-zinc-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-zinc-300">
                    Membeli <span className="font-bold text-white">{proof.product_name}</span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    Paket: {proof.category_name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-600 pt-2 border-t border-white/5">
                    <Calendar className="w-3 h-3" />
                    {new Date(proof.timestamp).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Daftar Produk</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{product.name}</h3>
                      <p className="text-sm text-zinc-500">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsEditingProduct(true); }} className="border-white/10">Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm({ type: 'product', id: product.id })} className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10">Hapus</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Kategori / Paket</h4>
                    <Button onClick={() => { setSelectedProductId(product.id); setIsAddingCategory(true); }} variant="outline" size="sm" className="text-xs border-white/5">Tambah Paket</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.categories.map((cat: any) => (
                      <div key={cat.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-white">{cat.name}</div>
                          {cat.popular && <span className="text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20">Populer</span>}
                        </div>
                        <div className="text-lg font-bold text-violet-400 mb-3">Rp {cat.price.toLocaleString('id-ID')}</div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingCategory(cat); setIsEditingCategory(true); }} className="text-xs text-zinc-500 hover:text-white">Edit</button>
                          <button onClick={() => setDeleteConfirm({ type: 'category', id: cat.id })} className="text-xs text-rose-500/70 hover:text-rose-400">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
