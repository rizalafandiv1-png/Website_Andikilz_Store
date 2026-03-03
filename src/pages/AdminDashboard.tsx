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
  Plus
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<any[]>([]);
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
        setOrders(data);
      } else {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(data);
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
  const [newProduct, setNewProduct] = useState({ name: "", description: "", icon: "MonitorPlay" });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = newProduct.name.toLowerCase().replace(/\s+/g, "-");
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, id: productId, type: "subscription" }),
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

  const handleAddCategory = async (productId: string) => {
    const name = prompt("Nama Paket (contoh: 1 Bulan):");
    if (!name) return;
    const price = prompt("Harga (angka saja):");
    if (!price) return;
    const description = prompt("Deskripsi:");
    const categoryId = `cat-${Math.floor(Math.random() * 1000000)}`;
    
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: categoryId,
          product_id: productId,
          name,
          price: parseInt(price),
          description: description || "",
          features: ["Akses Premium", "Garansi Full"],
          popular: false
        }),
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
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
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) return;
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  // --- Product Actions ---
  const deleteProduct = async (id: string) => {
    if (!confirm("Hapus produk ini? Semua kategori di dalamnya juga akan terhapus.")) return;
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const filteredOrders = orders.filter(order => {
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

      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Tambah Produk Baru</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                  placeholder="Contoh: Netflix Premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Deskripsi</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all h-24"
                  placeholder="Deskripsi singkat produk..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Icon (Lucide Name)</label>
                <select
                  value={newProduct.icon}
                  onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 outline-none transition-all"
                >
                  <option value="MonitorPlay">MonitorPlay</option>
                  <option value="Palette">Palette</option>
                  <option value="Bot">Bot</option>
                  <option value="Gamepad2">Gamepad2</option>
                  <option value="Flame">Flame</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={() => setIsAddingProduct(false)} variant="outline" className="flex-1 rounded-xl">Batal</Button>
                <Button type="submit" className="flex-1 bg-violet-500 hover:bg-violet-600 rounded-xl">Simpan</Button>
              </div>
            </form>
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
      </div>

      {activeTab === "orders" ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: "Total Pesanan", value: orders.length, icon: Package, color: "text-blue-400" },
              { label: "Menunggu", value: orders.filter(o => o.status === "Menunggu").length, icon: Clock, color: "text-amber-400" },
              { label: "Dalam Proses", value: orders.filter(o => o.status === "Proses").length, icon: RefreshCw, color: "text-blue-400" },
              { label: "Selesai", value: orders.filter(o => o.status === "Selesai").length, icon: CheckCircle2, color: "text-emerald-400" },
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
                              onClick={() => deleteOrder(order.id)}
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
                    <Button variant="outline" size="sm" className="border-white/10">Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => deleteProduct(product.id)} className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10">Hapus</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Kategori / Paket</h4>
                    <Button onClick={() => handleAddCategory(product.id)} variant="outline" size="sm" className="text-xs border-white/5">Tambah Paket</Button>
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
                          <button className="text-xs text-zinc-500 hover:text-white">Edit</button>
                          <button onClick={() => deleteCategory(cat.id)} className="text-xs text-rose-500/70 hover:text-rose-400">Hapus</button>
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
