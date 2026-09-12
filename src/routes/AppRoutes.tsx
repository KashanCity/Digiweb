import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { SellerLayout } from '@/layouts/SellerLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// صفحات عمومی
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Categories from '@/pages/Categories';
import CategoryDetail from '@/pages/CategoryDetail';
import Sellers from '@/pages/Sellers';
import SellerProfile from '@/pages/SellerProfile';
import Sell from '@/pages/Sell';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';

// سبد خرید و پرداخت
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import OrderDetail from '@/pages/OrderDetail';

// احراز هویت
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ComingSoonPage from '@/pages/ComingSoonPage';

// پنل کاربری
import DashboardHome from '@/pages/dashboard/DashboardHome';
import Profile from '@/pages/dashboard/Profile';
import Orders from '@/pages/dashboard/Orders';
import Wishlist from '@/pages/dashboard/Wishlist';
import Addresses from '@/pages/dashboard/Addresses';
import Settings from '@/pages/dashboard/Settings';

// پنل فروشنده
import SellerDashboard from '@/pages/seller/SellerDashboard';
import SellerProducts from '@/pages/seller/SellerProducts';
import ProductForm from '@/pages/seller/ProductForm';
import SellerOrders from '@/pages/seller/SellerOrders';
import SellerEarnings from '@/pages/seller/SellerEarnings';
import SellerSettings from '@/pages/seller/SellerSettings';

// پنل ادمین
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminSellers from '@/pages/admin/AdminSellers';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminReviews from '@/pages/admin/AdminReviews';
import AdminSettings from '@/pages/admin/AdminSettings';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* عمومی */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* سبد خرید و پرداخت */}
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />

        {/* پنل کاربری */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* پنل فروشنده */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute roles={['seller', 'admin']}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="earnings" element={<SellerEarnings />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        {/* پنل ادمین */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* صفحات احراز هویت (بدون Navbar/Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ComingSoonPage title="تنظیم رمز عبور جدید" />} />
      </Route>

      <Route path="*" element={<ComingSoonPage title="صفحه مورد نظر پیدا نشد (۴۰۴)" />} />
    </Routes>
  );
}
