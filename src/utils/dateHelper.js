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
