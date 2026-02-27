import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import CategorySelection from "./pages/CategorySelection";
import CategoryDetail from "./pages/CategoryDetail";
import Checkout from "./pages/Checkout";
import QrisPayment from "./pages/QrisPayment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<CategorySelection />} />
          <Route path="/products/:productId/:categoryId" element={<CategoryDetail />} />
          <Route path="/checkout/:productId/:categoryId" element={<Checkout />} />
          <Route path="/payment/qris/:productId/:categoryId" element={<QrisPayment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
