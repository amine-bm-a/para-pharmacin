import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LangProvider } from './context/LangContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserNotifProvider } from './context/UserNotifContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import CategoryMenu from './components/layout/CategoryMenu';
import FloatingButtons from './components/layout/FloatingButtons';
import Footer from './components/layout/Footer';
import BackToTop from './components/ui/BackToTop';
import PWAInstallBanner from './components/ui/PWAInstallBanner';

// Pages publiques
import Home from './pages/Home';
import Products from './pages/Products';
import Brands from './pages/Brands';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Promotions from './pages/Promotions';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderHistory from './pages/OrderHistory';
import Account from './pages/Account';

// Pages publiques/client
import SearchResults from './pages/SearchResults';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import Nouveautes from './pages/Nouveautes';
import OrderConfirmation from './pages/OrderConfirmation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import FAQ from './pages/FAQ';
import OrderTracking from './pages/OrderTracking';
import ProductComparison from './pages/ProductComparison';
import PageBebe from './pages/PageBebe';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import CGV from './pages/CGV';
import NotFound from './pages/NotFound';

// Admin pages
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminStocks from './pages/admin/AdminStocks';
import AdminClients from './pages/admin/AdminClients';
import AdminStaff from './pages/admin/AdminStaff';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminBanners from './pages/admin/AdminBanners';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSubCategories from './pages/admin/AdminSubCategories';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminDeliveries from './pages/admin/AdminDeliveries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminBlog from './pages/admin/AdminBlog';
import AdminPartners from './pages/admin/AdminPartners';

// Pharmacien pages
import PharmacienLayout from './components/layout/PharmacienLayout';
import PharmacienDashboard from './pages/pharmacien/PharmacienDashboard';
import PharmacienScanOrder from './pages/pharmacien/PharmacienScanOrder';
import PharmacienPrepareOrder from './pages/pharmacien/PharmacienPrepareOrder';
import PharmacienOrders from './pages/pharmacien/PharmacienOrders';
import PharmacienStock from './pages/pharmacien/PharmacienStock';
import PharmacienNotifications from './pages/pharmacien/PharmacienNotifications';
import PharmacienPrescriptions from './pages/pharmacien/PharmacienPrescriptions';
import PharmacienProfile from './pages/pharmacien/PharmacienProfile';

// Account sub-pages
import Loyalty from './pages/account/Loyalty';
import Subscriptions from './pages/account/Subscriptions';

// Route Guard — clients connectés
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="text-center" style={{ padding: '80px' }}>Chargement...</div>;
  return user ? children : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
};

// Route Guard — Administrateurs
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center" style={{ padding: '80px' }}>Chargement...</div>;
  return user && isAdmin ? children : <Navigate to="/login?redirect=admin" />;
};

// Route Guard — Pharmaciens / Employés
const PharmacienRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center" style={{ padding: '80px' }}>Chargement...</div>;
  const isPharmacien = user && (user.role === 'pharmacien' || user.role === 'employe' || user.role === 'admin');
  return isPharmacien ? children : <Navigate to="/login?redirect=pharmacien" />;
};

// Layout conditionnel (header/footer masqués sur dashboards)
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/pharmacien') ||
    location.pathname.startsWith('/mon-compte');
  const isAuthRoute =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/mot-de-passe-oublie' ||
    location.pathname === '/reset-password';

  return (
    <>
      {!isDashboardRoute && !isAuthRoute && (
        <>
          <Header />
          <Navbar />
          <CategoryMenu />
        </>
      )}
      <main style={{ minHeight: isDashboardRoute || isAuthRoute ? '100vh' : 'calc(100vh - 400px)' }}>
        {children}
      </main>
      {!isDashboardRoute && !isAuthRoute && <Footer />}
      {!isDashboardRoute && !isAuthRoute && <BackToTop />}
      {!isDashboardRoute && !isAuthRoute && <FloatingButtons />}
      {!isDashboardRoute && !isAuthRoute && <PWAInstallBanner />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <UserNotifProvider>
                    <ErrorBoundary>
                      <LayoutWrapper>
                        <Routes>
                          {/* Routes publiques */}
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/marques" element={<Brands />} />
                          <Route path="/products/:slug" element={<ProductDetails />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/promotions" element={<Promotions />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/nos-conseils" element={<Blog />} />
                          <Route path="/a-propos" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/faq" element={<FAQ />} />

                          {/* Nouvelles routes publiques/client */}
                          <Route path="/recherche" element={<SearchResults />} />
                          <Route path="/categories/:slug" element={<CategoryPage />} />
                          <Route path="/marques/:slug" element={<BrandPage />} />
                          <Route path="/nouveautes" element={<Nouveautes />} />
                          <Route path="/commande-confirmee" element={<OrderConfirmation />} />
                          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/comparaison" element={<ProductComparison />} />
                          <Route path="/espace-bebe" element={<PageBebe />} />
                          <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
                          <Route path="/cgv" element={<CGV />} />

                          {/* Espace client (protégé) */}
                          <Route path="/mon-compte" element={<PrivateRoute><Account /></PrivateRoute>} />
                          <Route path="/account" element={<Navigate to="/mon-compte" />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/mes-commandes" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
                          <Route path="/favoris" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                          <Route path="/suivi-commande/:id" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
                          <Route path="/mon-compte/fidelite" element={<PrivateRoute><Loyalty /></PrivateRoute>} />
                          <Route path="/mon-compte/abonnements" element={<PrivateRoute><Subscriptions /></PrivateRoute>} />

                          {/* Panel Admin */}
                          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route index element={<AdminOverview />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="subcategories" element={<AdminSubCategories />} />
                            <Route path="brands" element={<AdminBrands />} />
                            <Route path="stocks" element={<AdminStocks />} />
                            <Route path="clients" element={<AdminClients />} />
                            <Route path="staff" element={<AdminStaff />} />
                            <Route path="promotions" element={<AdminPromotions />} />
                            <Route path="coupons" element={<AdminCoupons />} />
                            <Route path="suppliers" element={<AdminSuppliers />} />
                            <Route path="deliveries" element={<AdminDeliveries />} />
                            <Route path="banners" element={<AdminBanners />} />
                            <Route path="reviews" element={<AdminReviews />} />
                            <Route path="settings" element={<AdminSettings />} />
                            <Route path="profile" element={<AdminProfile />} />
                            <Route path="notifications" element={<AdminNotifications />} />
                            <Route path="blog" element={<AdminBlog />} />
                            <Route path="partners" element={<AdminPartners />} />
                          </Route>

                          {/* Panel Pharmacien */}
                          <Route path="/pharmacien" element={<PharmacienRoute><PharmacienLayout /></PharmacienRoute>}>
                            <Route index element={<PharmacienDashboard />} />
                            <Route path="scan" element={<PharmacienScanOrder />} />
                            <Route path="prepare" element={<PharmacienPrepareOrder />} />
                            <Route path="orders" element={<PharmacienOrders />} />
                            <Route path="stock" element={<PharmacienStock />} />
                            <Route path="prescriptions" element={<PharmacienPrescriptions />} />
                            <Route path="notifications" element={<PharmacienNotifications />} />
                            <Route path="profile" element={<PharmacienProfile />} />
                          </Route>

                          {/* Fallback */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </LayoutWrapper>
                    </ErrorBoundary>
                  </UserNotifProvider>
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
