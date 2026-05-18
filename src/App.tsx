import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useProductsStore } from './store/productsStore'
import { useSettingsStore } from './store/settingsStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'
import ErrorBoundary from './components/ErrorBoundary'

const HomePage = lazy(() => import('./pages/HomePage'))
const GaleriePage = lazy(() => import('./pages/GaleriePage'))
const TablouDetailPage = lazy(() => import('./pages/TablouDetailPage'))
const DesprePage = lazy(() => import('./pages/DesprePage'))
const InformatiiPage = lazy(() => import('./pages/InformatiiPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const LegalPages = lazy(() => import('./pages/LegalPages'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  const { initSession } = useAuthStore()
  const { fetchProducts } = useProductsStore()
  const { fetchSettings } = useSettingsStore()

  useEffect(() => {
    initSession()
    fetchProducts()
    fetchSettings()
  }, [initSession, fetchProducts, fetchSettings])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <CookieBanner />
        <ScrollToTopButton />
        <Suspense fallback={
          <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="text-center">
              <p className="font-serif text-2xl font-light text-charcoal tracking-widest animate-pulse">SNAART</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/galerie" element={<PublicLayout><GaleriePage /></PublicLayout>} />
            <Route path="/tablou/:id" element={<PublicLayout><TablouDetailPage /></PublicLayout>} />
            <Route path="/despre" element={<PublicLayout><DesprePage /></PublicLayout>} />
            <Route path="/informatii" element={<PublicLayout><InformatiiPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/termeni" element={<PublicLayout><LegalPages /></PublicLayout>} />
            <Route path="/confidentialitate" element={<PublicLayout><LegalPages /></PublicLayout>} />
            <Route path="/retur" element={<PublicLayout><LegalPages /></PublicLayout>} />
            <Route path="/gdpr" element={<PublicLayout><LegalPages /></PublicLayout>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="lucrari" element={<AdminProducts />} />
              <Route path="comenzi" element={<AdminOrders />} />
              <Route path="clienti" element={<AdminCustomers />} />
              <Route path="rapoarte" element={<AdminReports />} />
              <Route path="setari" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
