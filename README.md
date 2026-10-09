# 夜色旅遊平台 Night Tour Platform
React + Vite 前端示範專案（無後端，全部資料存在 localStorage / localForage）

⚠️ 注意：僅教學示範，用戶密碼未加密，不建議直接商用上線。

## 資料夾結構
- public/ 靜態資源（favicon等）
- src/
  - assets/ 樣式、圖片、影片
  - components/ 共用元件＋彈窗
  - contexts/ React Context 全域狀態
  - data/ JSON模擬資料
  - pages/ 頁面元件
  - utils/ 工具函數
  - App.jsx 路由＋佈局
  - main.jsx 入口
- vite.config.js Vite設定
- package.json 依賴
- .gitignore Git忽略清單

## 本地啟動（Ubuntu / Windows / Mac 通用）
```bash
npm install
npm run dev
