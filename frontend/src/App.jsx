import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { getToken } from './api/axios'
import Layout from './components/Layout'
import Catalog from './components/Catalog'
import AboutPage from './pages/AboutPage'
import ArticlesPage from './pages/ArticlesPage'
import GalleryPage from './pages/GalleryPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactsPage from './pages/ContactsPage'
import ProductPage from './pages/ProductPage'
import WarrantyPage from './pages/WarrantyPage'
import PrivacyPage from './pages/PrivacyPage'
import PaymentPage from './pages/PaymentPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'

/* Admin pages */
import AdminLogin        from './pages/admin/AdminLogin'
import AdminProducts     from './pages/admin/AdminProducts'
import AdminOrders       from './pages/admin/AdminOrders'
import AdminContent      from './pages/admin/AdminContent'
import AdminGallery      from './pages/admin/AdminGallery'
import AdminSiteSettings from './pages/admin/AdminSiteSettings'

/* ── Protected route ──────────────────────────────────────── */
function PrivateRoute({ children }) {
  const location = useLocation()
  return getToken() ? children : <Navigate to="/admin/login" state={{ from: location }} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Публичный сайт ─────────────────────────────────── */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/"          element={<Catalog showHero={true} />} />
                <Route path="/catalog"   element={<Catalog showHero={false} />} />
                <Route path="/about"     element={<AboutPage />} />
                <Route path="/workshop"  element={<Navigate to="/about" replace />} />
                <Route path="/news"      element={
                  <ArticlesPage
                    type="news"
                    title="Новости"
                    subtitle="Свежие новости производства НАМПАК, расширение ассортимента гофротары и анонсы."
                    emptyText="Новости скоро появятся"
                  />
                } />
                <Route path="/training"  element={
                  <ArticlesPage
                    type="training"
                    title="Обучение"
                    subtitle="Стандарты упаковки для Wildberries и Ozon, свойства картона и инструкции."
                    emptyText="Обучающие материалы скоро появятся"
                  />
                } />
                <Route path="/gallery"   element={<GalleryPage />} />
                <Route path="/checkout"  element={<CheckoutPage />} />
                <Route path="/order/success/:orderId" element={<OrderSuccessPage />} />
                <Route path="/order/:orderId" element={<OrderSuccessPage />} />
                <Route path="/contacts"  element={<ContactsPage />} />
                <Route path="/warranty"  element={<WarrantyPage />} />
                <Route path="/privacy"   element={<PrivacyPage />} />
                <Route path="/payment"   element={<PaymentPage />} />
                <Route path="/login"     element={<LoginPage />} />
                <Route path="/register"  element={<RegisterPage />} />
                <Route path="/account"   element={<AccountPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="*"          element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          }
        />

        {/* ── Панель администратора ──────────────────────────── */}
        <Route path="/admin/login"    element={<AdminLogin />} />
        <Route path="/admin/products" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/orders"   element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
        <Route path="/admin/content"  element={<PrivateRoute><AdminContent /></PrivateRoute>} />
        <Route path="/admin/gallery"  element={<PrivateRoute><AdminGallery /></PrivateRoute>} />
        <Route path="/admin/settings" element={<PrivateRoute><AdminSiteSettings /></PrivateRoute>} />
        <Route path="/admin"          element={<Navigate to="/admin/products" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
