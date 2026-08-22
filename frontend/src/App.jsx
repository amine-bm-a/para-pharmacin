import React, { Suspense, lazy } from 'react';
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

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement...</p>
    </div>
  </div>
);

// Pages publiques
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Brands = lazy(() => import('./pages/Brands'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Promotions = lazy(() => import('./pages/Promotions'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Account = lazy(() => import('./pages/Account'));

// Pages publiques/client
const SearchResults = lazy(() => import('./pages/SearchResults'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));
const Nouveautes = lazy(() => import('./pages/Nouveautes'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Notifications = lazy(() => import('./pages/Notifications'));
const FAQ = lazy(() => import('./pages/FAQ'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const ProductComparison = lazy(() => import('./pages/ProductComparison'));
const PageBebe = lazy(() => import('./pages/PageBebe'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const CGV = lazy(() => import('./pages/CGV'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'));
const AdminStocks = lazy(() => import('./pages/admin/AdminStocks'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'));
const AdminPromotions = lazy(() => import('./pages/admin/AdminPromotions'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminSubCategories = lazy(() => import('./pages/admin/AdminSubCategories'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminSuppliers = lazy(() => import('./pages/admin/AdminSuppliers'));
const AdminDeliveries = lazy(() => import('./pages/admin/AdminDeliveries'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminNotifications = lazy(() => import('./pages/admin/AdminNotifications'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));

// Pharmacien pages
const PharmacienLayout = lazy(() => import('./components/layout/PharmacienLayout'));
const PharmacienDashboard = lazy(() => import('./pages/pharmacien/PharmacienDashboard'));
const PharmacienScanOrder = lazy(() => import('./pages/pharmacien/PharmacienScanOrder'));
const PharmacienPrepareOrder = lazy(() => import('./pages/pharmacien/PharmacienPrepareOrder'));
const PharmacienOrders = lazy(() => import('./pages/pharmacien/PharmacienOrders'));
const PharmacienStock = lazy(() => import('./pages/pharmacien/PharmacienStock'));
const PharmacienNotifications = lazy(() => import('./pages/pharmacien/PharmacienNotifications'));
const PharmacienPrescriptions = lazy(() => import('./pages/pharmacien/PharmacienPrescriptions'));
const PharmacienProfile = lazy(() => import('./pages/pharmacien/PharmacienProfile'));

// Account sub-pages
const Loyalty = lazy(() => import('./pages/account/Loyalty'));
const Subscriptions = lazy(() => import('./pages/account/Subscriptions'));

// Route Guard — clients connectés
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><div style={{ textAlign: 'center' }}><div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement...</p></div></div>;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'pharmacien' || user.role === 'employe') return <Navigate to="/pharmacien" replace />;
  return children;
};

// Route Guard — Administrateurs
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><div style={{ textAlign: 'center' }}><div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement...</p></div></div>;
  return user && isAdmin ? children : <Navigate to="/login?redirect=admin" />;
};

// Route Guard — Pharmaciens / Employés
const PharmacienRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><div style={{ textAlign: 'center' }}><div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} /><p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chargement...</p></div></div>;
  const isPharmacien = user && (user.role === 'pharmacien' || user.role === 'employe' || user.role === 'admin');
  return isPharmacien ? children : <Navigate to="/login?redirect=pharmacien" />;
};

// Layout conditionnel (header/footer masqués sur dashboards)
const LayoutWrapper = React.memo(function LayoutWrapper({ children }) {
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
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </main>
      {!isDashboardRoute && !isAuthRoute && <Footer />}
      {!isDashboardRoute && !isAuthRoute && <BackToTop />}
      {!isDashboardRoute && !isAuthRoute && <FloatingButtons />}
      {!isDashboardRoute && !isAuthRoute && <PWAInstallBanner />}
    </>
  );
});

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
