import { Routes, Route } from 'react-router-dom'

// 示範匯入（檔案建立完才不會報錯）
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import CountryChinaPage from './pages/country/CountryChinaPage'
import CountryJapanPage from './pages/country/CountryJapanPage'
import CountryKoreaPage from './pages/country/CountryKoreaPage'
import CountryThailandPage from './pages/country/CountryThailandPage'
import CountryFinlandPage from './pages/country/CountryFinlandPage'
import MyJourneyPage from './pages/MyJourneyPage'
import TourDetailPage from './pages/TourDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CouponPage from './pages/CouponPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/country/china" element={<CountryChinaPage />} />
      <Route path="/country/japan" element={<CountryJapanPage />} />
      <Route path="/country/korea" element={<CountryKoreaPage />} />
      <Route path="/country/thailand" element={<CountryThailandPage />} />
      <Route path="/country/finland" element={<CountryFinlandPage />} />
      <Route path="/my-journey" element={<MyJourneyPage />} />
      <Route path="/tour/:tourId" element={<TourDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/coupon" element={<CouponPage />} />
    </Routes>
  )
}
