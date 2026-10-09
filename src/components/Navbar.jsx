import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LanguageSwitch from './LanguageSwitch';
import logo from '../assets/unicorn.svg'

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const { lang, t } = useLang(); // 修正 1：在這裡把 lang 解構出來
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const [burgerOpen, setBurgerOpen] = useState(false);

// ========== 下拉選單狀態 ==========
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const dropdownRef = useRef(null);

  // 讀取tours.json並自動過濾出不重複的國家列表
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/tours.json`)
      .then(res => res.json())
      .then(data => {
        // 修正 2：因為 tours.json 是行程陣列，我們透過 reduce 或 Set 來萃取出不重複的國家資訊
        const uniqueCountries = [];
        const map = new Map();
        for (const item of data) {
          if (!map.has(item.countryId)) {
            map.set(item.countryId, true);
            // 依據 countryId 對應中文與英文名稱（可自行調整或對應）
            let titleZh = '';
            let titleEn = '';
            if (item.countryId === 'china') { titleZh = '中國'; titleEn = 'China'; }
            else if (item.countryId === 'japan') { titleZh = '日本'; titleEn = 'Japan'; }
            else if (item.countryId === 'korea') { titleZh = '韓國'; titleEn = 'Korea'; }
            else if (item.countryId === 'thailand') { titleZh = '泰國'; titleEn = 'Thailand'; }
            else if (item.countryId === 'finland') { titleZh = '芬蘭'; titleEn = 'Finland'; }
            else { titleZh = item.countryId; titleEn = item.countryId; }

            uniqueCountries.push({
              countryId: item.countryId,
              titleZh,
              titleEn
            });
          }
        }
        setCountries(uniqueCountries);
      })
      .catch(err => console.error("讀取國家失敗", err));
  }, []);

  // 點擊頁面空白區關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCountryDropdownOpen(false);
      }
    };
    if(countryDropdownOpen){
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [countryDropdownOpen]);

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


        <div className="nav-links" style={{display:'flex', gap:'1rem', alignItems:'center'}}>

        {/* ========== 國家下拉按鈕區域 ========== */}
            <div className="nav-dropdown-wrap" ref={dropdownRef}>
              <button
                className="nav-link nav-dropdown-btn"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}>
                {t('country')}
                {countryDropdownOpen ? '✕' : '▾'}
              </button>
              {countryDropdownOpen && (
                <div className="nav-dropdown-menu">
                  {countries.map(c => (
                    <Link
                      key={c.countryId}
                      to={`/country/${c.countryId}`}
                      className="nav-dropdown-item"
                      onClick={() => setCountryDropdownOpen(false)}
                    >
                      {lang === 'zh' ? c.titleZh : c.titleEn}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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
              <span style={{fontSize:'0.9rem'}}>{currentUser.username} · {currentUser.points}{lang==='zh' ? ' 積分' : ' points'}</span>
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
