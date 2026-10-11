// export * from './dateHelper';
// export * from './imageCompressor';
// export * from './exportHelper';
// export * from './couponHelper';
// export * from './storageWrapper';
// export * from './countryBackground';

// 圖片壓縮
export const compressImage = async (file, maxWidth=1080, quality=0.7) => {
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.src = ev.target.result;
      img.onload = ()=>{
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if(w>maxWidth){
          const ratio = maxWidth / w;
          w = maxWidth;
          h = h * ratio;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        canvas.toBlob(blob=>{
          if(!blob) return reject(new Error('compress fail'));
          const base64 = canvas.toDataURL('image/jpeg', quality);
          resolve({blob, base64});
        }, 'image/jpeg', quality);
      };
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// JSON匯出檔案
export const exportToJsonFile = (obj, filename)=>{
  const str = JSON.stringify(obj, null, 2);
  const blob = new Blob([str], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// 用戶完整備份
export const exportUserFullBackup = (user, records, coupons)=>{
  return {
    exportAt: new Date().toISOString(),
    user: { ...user },
    records,
    coupons
  };
};

// 優惠券規則（積分兌換）
export const COUPON_RULES = [
  {
id: 'cp-01',
nameZh: '30元優惠券',
nameEn: '$30 off min $200',
costPoints: 200,
value: 30,
imgUrl: `${import.meta.env.BASE_URL}images/coupons/coupon30.jpeg`
},
  {
id: 'cp-02',
nameZh: '80元優惠券',
nameEn: '$80 off min $500',
costPoints: 450,
value: 80,
imgUrl: `${import.meta.env.BASE_URL}images/coupons/coupon80.jpeg`
},
  {
id: 'cp-03',
nameZh: '200元優惠券',
nameEn: '$200 off min $1000',
costPoints: 900,
value: 200,
imgUrl: `${import.meta.env.BASE_URL}images/coupons/coupon200.jpeg`
}
];


export const canRedeemCoupon = (userPoints, rule) => userPoints >= rule.costPoints;

// 生成簡單唯一ID
export const genId = () => 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2);

// 7天過濾（分享牆：只顯示最近7日）
export const isWithinLast7Days = (timestamp) => {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - Number(timestamp) <= sevenDays;
};

// 格式化日期 YYYY‑MM‑DD
export const formatDate = (ts) => {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};

// 把 YYYY‑MM‑DD 轉 timestamp
export const dateToTs = (str) => new Date(str).getTime();

// localStorage 封裝（方便後續切換介面）
export const storage = {
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  get: (key) => {
    const raw = localStorage.getItem(key);
    try { return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear()
};

// src/utils/countryBackground.js
/** countryId 對應 public/images 底下背景檔名 */
export const COUNTRY_BG_ASSET = {
  china: "china-texture.jpg",
  japan: "japan-texture.jpg",
  korea: "korea-texture.jpg",
  thailand: "thailand-texture.jpg",
  finland: "finland-texture.jpg",
};

/**
 * 套用國家背景到 document.body
 * @param {string|null} countryId
 */
export function applyCountryBodyBackground(countryId) {
  // 傳入 null 清除背景
  if (!countryId || !COUNTRY_BG_ASSET[countryId]) {
    document.body.style.backgroundImage = "";
    document.body.style.backgroundAttachment = "";
    document.body.style.backgroundSize = "";
    document.body.style.backgroundPosition = "";
    document.body.style.backgroundRepeat = "";
    // 還回網站預設css的background
    document.body.style.background = "";
    return;
  }

  const imageFile = COUNTRY_BG_ASSET[countryId];
  // import.meta.env.BASE_URL 自動適配GitHub Pages子repo路徑
  const imageUrl = `${import.meta.env.BASE_URL}images/${imageFile}`;

  document.body.style.background = `url("${imageUrl}")`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center center";
  document.body.style.backgroundRepeat = "no‑repeat";
  // 核心：內容滾動，背景固定
  document.body.style.backgroundAttachment = "fixed";
}

