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
