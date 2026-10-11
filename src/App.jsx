import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import { LoginModal, RegisterModal, ScrollToTop } from './components';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { RecordProvider } from './contexts/RecordContext';
import { LanguageProvider } from './contexts/LanguageContext';
import {
  SplashPage, HomePage, BrowsePage, CountryPage, TourDetailPage,
  MyRecordsPage, RecordForm, CartPage, CouponPage
} from './pages';
import './assets/styles.css';

// 建立一個包含 Navbar、Footer 與共用 Modal 的 Layout 組件
function MainLayout({ onOpenLogin, onOpenRegister }) {
  return (
    <>
      <Navbar
        onOpenLogin={onOpenLogin}
        onOpenRegister={onOpenRegister}
      />
      <main>
        <Outlet /> {/* 這裡會渲染子路由的頁面 */}
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <RecordProvider>
            {/* <Router basename={import.meta.env.BASE_URL || '/'}> */}
            <Router basename={import.meta.env.VITE_BASE_PATH || '/'}>
              <ScrollToTop />   {/* ← 加入這個組件 for scrollToTop function */}
              <Routes>
                {/* 1. SplashPage 獨立在外，不包含 Navbar 和 Footer */}
                <Route path="/" element={<SplashPage />} />
                {/* <Route path="/glow-tour/" element={<SplashPage />} /> */}

                {/* 2. 其他所有頁面透過 MainLayout 共享 Navbar 和 Footer */}
                <Route element={
                  <MainLayout 
                    onOpenLogin={()=>setShowLogin(true)}
                    onOpenRegister={()=>setShowRegister(true)}
                  />
                }>
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/browse" element={<BrowsePage />} />
                  <Route path="/country/:countryId" element={<CountryPage />} />
                  <Route path="/tour/:tourId" element={<TourDetailPage />} />
                  <Route path="/my-records" element={<MyRecordsPage />} />
                  <Route path="/record/new" element={<RecordForm />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/coupon" element={<CouponPage />} />
                  <Route path="*" element={
                    <div className="page-wrap container">
                      <h2>404</h2>
                      <p>Page not found</p>
                    </div>
                  } />
                </Route>
              </Routes>

              {/* 全域的 Modal 保持在 Router 內即可，隨時可被喚起 */}
              <LoginModal
                isOpen={showLogin}
                onClose={()=>setShowLogin(false)}
                onSwitchToRegister={()=>{setShowLogin(false); setShowRegister(true);}}
              />
              <RegisterModal
                isOpen={showRegister}
                onClose={()=>setShowRegister(false)}
                onSwitchToLogin={()=>{setShowRegister(false); setShowLogin(true);}}
              />
            </Router>
          </RecordProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;