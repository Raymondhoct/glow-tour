import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LanguageSwitch from './LanguageSwitch';
import logo from '../assets/unicorn.svg'

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { t } = useLang();
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const [burgerOpen, setBurgerOpen] = useState(false);

  return (
    <nav>
      <div className="container" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div className="nav-logo" style={{display:'flex', alignItems:'left', justifyContent:'space-between'}}>
        <img src={logo} alt="logo" className="logo" />
          {/* 1. 加上 className="brand-link" */}
        <Link to="/home" className="brand-link" style={{fontWeight:'bold', fontSize:'1.2rem' }}>
          {t('siteName')}
        </Link>


        </div>
        {/* <div className="burger-btn" style={{display:'none'}} onClick={()=>setBurgerOpen(!burgerOpen)}>☰</div> */}
        <div className="burger-btn" style={{display:'none', cursor:'pointer'}} onClick={()=>setBurgerOpen(!burgerOpen)}>
        {burgerOpen ? '✕' : '☰'}
        </div>


        <div className="nav-links" style={{display:'flex', gap:'1.2rem', alignItems:'center'}}>
          <Link to="/country">{t('country')}</Link>
          <Link to="/browse">{t('exploreTitle')}</Link>
          <Link to="/my-records">{t('myRecords')}</Link>
          <Link to="/cart">
            {t('cart')}
            {cartItems.length > 0 && <span style={{color:'var(--text-gold)', marginLeft:'4px'}}>({cartItems.length})</span>}
          </Link>
          <Link to="/coupon">{t('coupon')}</Link>
          <LanguageSwitch />

          {!currentUser ? (
            <>
              <button className="btn-outline" onClick={onOpenLogin}>{t('login')}</button>
              <button className="btn-primary" onClick={onOpenRegister}>{t('register')}</button>
            </>
          ) : (
            <>
              <span style={{fontSize:'0.9rem'}}>{currentUser.username} · {currentUser.points}積分</span>
              <button className="btn-outline" onClick={logout}>{t('logout')}</button>
            </>
          )}
        </div>
      </div>

      <style>{`
        /* 2. 在這裡新增 hover 相關樣式 */
        .brand-link {
          display: inline-block;
          color: inherit;
          text-decoration: none;
          transition: all 0.3s ease; /* 讓放大和變色過程有平滑的動畫效果 */
        }
        
        .brand-link:hover {
          color: var(--text-gold); /* 變成金色 */
          transform: scale(1.08);    /* 放大字體 (可根據喜好調整數值，例如 1.05 到 1.15) */
        }

        @media (max-width:768px){
          .burger-btn{display:block !important; font-size:1.4rem;}
          .nav-links{
            display:${burgerOpen ? 'flex' : 'none'} !important;
            flex-direction:column; position:absolute; top:100%; left:0; right:0;
            background:rgba(15,15,35,0.96); padding:1rem; gap:0.8rem;
          }
        }
      `}</style>
    </nav>
  );
}
