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
