import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import About from "./components/About";
import Contact from "./components/Contact";
import Feedback from "./components/Feedback";
import Cart from "./components/Cart";
import Wishlist from "./components/wishlist";
import Checkout from "./pages/Checkout";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";


/* ADMIN IMPORTS */
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProtected from "./admin/AdminProtected";
import AdminReviews from "./admin/AdminReviews";
import AdminUsers from "./admin/ManageUsers";
import ManageProducts from "./admin/ManageProducts";
import ViewFeedback from "./admin/ViewFeedback";
import ViewMessages from  "./admin/ViewMessages";
import ManageCart from "./admin/ManageCart";
import ManageWishlist from "./admin/ManageWishlist";
import ManageCategory from "./admin/ManageCategory";
import ManageOrders from "./admin/ManageOrders";

/* This wrapper is needed to hide navbar/footer on admin pages */
function LayoutWrapper() {
  const location = useLocation();

  const isAdminPage =
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<Hero />} />
        <Route path="/home" element={<Hero />} />
        <Route path="/products" element={<Products />} />

        <Route path="/products/:category/:subcategory/:type" element={<Products />} />
        <Route path="/products/:category/:subcategory" element={<Products />} />
        <Route path="/products/:category" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />\
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ADMIN PANEL */}
        <Route
          path="/admin"
          element={
            <AdminProtected>
              <AdminLayout />
            </AdminProtected>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="ViewFeedback" element={<ViewFeedback />} />
          <Route path="ViewMessages" element={<ViewMessages />}/>
          <Route path="ManageCart" element={<ManageCart />} />
          <Route path="ManageWishlist" element={<ManageWishlist />} />
          <Route path="categories" element={<ManageCategory />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;