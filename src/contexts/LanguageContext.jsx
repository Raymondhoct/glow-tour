import { createContext, useContext, useState, useEffect } from 'react';
const translations = {
zh: {
siteName: '輝影旅遊',
homeIntro: '探索世界各地夜間特色旅遊行程，享受不一樣的世界，亦可於我們網站分享你的旅行回憶，累積積分兌換優惠券。',
enterBtn: '立即探索',
country: '國家',
exploreTitle: '精選行程',
populartourTitle: '最受歡迎行程',
myRecords: '我的旅遊記錄',
cart: '購物車',
coupon: '優惠券',
reviewWallTitle: '7天分享牆',
'tour.priceFrom': '價格',
'tour.days': '天',
'tour.addCart': '加入購物車',
'tour.infoTitle': '行程資訊',
//==== 新增Navbar、Footer翻譯(zh) 開始 ====
footerHome: "首頁",
footerTours: "精選行程",
footerRecords: "我的旅遊記錄",
navAbout: "關於我們",
langSwitch: "切換語言",
footerDesc: "發現全世界美好的旅行目的地，記錄你的每一次旅途。",
quickLink: "快速鏈接",
contact: "聯繫我們",
login: "登入",
register: "註冊",
enter: "進入",
itineraryinfoTitle: "景點介紹",
itineraryplanTitle: "行程規劃",
itineraryphotoTitle: "景點相片"

//==== 新增結束 ====
  },
en: {
siteName: 'Glow & Shadow Tourism',
homeIntro: 'Discover night tour experiences around the world, enjoy a different world, share memories, earn points for coupons in our website.',
enterBtn: 'Explore Now',
country: 'Country',
exploreTitle: 'Featured Tours',
populartourTitle: 'Most Popular Tours',
myRecords: 'My Travel Records',
cart: 'Cart',
coupon: 'Coupon',
reviewWallTitle: '7‑Day Share Wall',
'tour.priceFrom': 'From',
'tour.days': 'days',
'tour.addCart': 'Add to Cart',
'tour.infoTitle': 'Tour Info',
//==== 新增Navbar、Footer翻譯(en) 開始 ====
footerHome: "Home",
footerTours: "Featured Tours",
footerRecords: "My Travel Records",
navAbout: "About Us",
langSwitch: "Lang",
footerDesc: "Discover wonderful travel destinations around the world, record every journey.",
quickLink: "Quick Links",
contact: "Contact Us",
login: "Login",
register: "Register",
enter: "Enter",
itineraryinfoTitle: "Attractions Introduction",
itineraryplanTitle: "Itinerary Plan",
itineraryphotoTitle: "Attractions Photo"

//==== 新增結束 ====
  }
};
const LanguageContext = createContext();
const LANG_KEY = 'nighttour_lang';
export const LanguageProvider = ({children})=>{
const [lang, setLangRaw] = useState('zh');
useEffect(()=>{
const saved = localStorage.getItem(LANG_KEY);
if(saved) setLangRaw(saved);
  },[]);
const setLang = (val)=>{ setLangRaw(val); localStorage.setItem(LANG_KEY, val); };
const t = (key)=> translations[lang]?.[key] || key;
return (
<LanguageContext.Provider value={{ lang, setLang, t }}>
{children}
</LanguageContext.Provider>
  );
};
export const useLang = ()=> useContext(LanguageContext);
