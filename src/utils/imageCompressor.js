/** 圖片壓縮：回傳 base64 + 可存入 localForage 的 blob */
export const compressImage = (file, maxWidth = 1080, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth) {
          const ratio = maxWidth / w;
          w = maxWidth;
          h = h * ratio;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          blob => {
            if (!blob) return reject(new Error('壓縮失敗'));
            const base64 = canvas.toDataURL('image/jpeg', quality);
            resolve({ blob, base64 });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};
