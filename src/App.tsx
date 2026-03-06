import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import CategorySelection from "./pages/CategorySelection";
import CategoryDetail from "./pages/CategoryDetail";
import Checkout from "./pages/Checkout";
import QrisPayment from "./pages/QrisPayment";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Success from "./pages/Success";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<CategorySelection />} />
            <Route path="/products/:productId/:categoryId" element={<CategoryDetail />} />
            <Route path="/checkout/:productId/:categoryId" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<QrisPayment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order-history" element={<MyOrders />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
