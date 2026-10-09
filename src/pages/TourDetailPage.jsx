import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import tours from '../data/tours.json';
import countries from '../data/countries.json';
import toursVideos from '../data/toursVideos.json'; // 匯入獨立影片JSON
import { useLang } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { applyCountryBodyBackground } from '../utils';
// Vite import.meta.glob 遞歸抓取 src/assets/images/sceneries/ 所有子目錄圖片
const sceneryImages = import.meta.glob('../assets/images/sceneries/**/*.{jpg,jpeg,png,webp,svg}', { eager: true });
const TourDetailPage = () => {
const { tourId } = useParams();
const { t, lang } = useLang();
const { cartItems, addToCart } = useCart();
const tour = useMemo(() => tours.find(t => t.tourId === tourId), [tourId]);
const country = useMemo(() => tour ? countries.find(c => c.id === tour.countryId) : null, [tour]);
const isInCart = tour ? cartItems.some(i => i.tourId === tour.tourId) : false;
// ✅ 從獨立的 toursVideos.json 尋找對應行程的Youtube嵌入連結
const tourVideoItem = useMemo(() => {
return toursVideos.find(v => v.tourId === tourId);
}, [tourId]);
const videoEmbedUrlRaw = tourVideoItem?.embedUrl;
// 動態拼接參數，不開啟自動播放
const videoEmbedUrl = videoEmbedUrlRaw
? `${videoEmbedUrlRaw}${videoEmbedUrlRaw.includes('?') ? '&' : '?'}mute=1`
: null;
// 影片播放狀態：預設false，點擊按鈕才載入iframe
const [isVideoPlaying, setIsVideoPlaying] = useState(false);
// 顯示/隱藏 main 內容
const [showMore, setShowMore] = useState(false);
// 手機carousel輪播索引
const [carouselIndex, setCarouselIndex] = useState(0);
// ========== 燈箱狀態更新：不只存圖片，還存索引 ==========
const [lightboxIndex, setLightboxIndex] = useState(null);

// 動態獲取 tourId 資料夾底下所有圖片
const tourPhotos = useMemo(() => {
if (!tourId) return [];
const photos = [];
const targetFolder = `/sceneries/${tourId}/`;
for (const path in sceneryImages) {
// 嚴格匹配對應 tourId 的資料夾
if (path.includes(targetFolder)) {
const imgUrl = sceneryImages[path].default;
        photos.push(imgUrl);
      }
    }
// 依照檔名字母排序，確保圖片順序穩定
return photos.sort();
  }, [tourId]);

// Esc 關閉燈箱
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') setLightboxIndex(null);
  };
  if(lightboxIndex !== null){
    window.addEventListener('keydown', handleEsc);
  }
  return () => {
    window.removeEventListener('keydown', handleEsc);
  };
}, [lightboxIndex]);

// 切換上一張圖
const prevImage = () => {
  if (tourPhotos.length === 0) return;
  setLightboxIndex(prev => prev === 0 ? tourPhotos.length -1 : prev -1);
}
// 切換下一張圖
const nextImage = () => {
  if (tourPhotos.length === 0) return;
  setLightboxIndex(prev => prev === tourPhotos.length -1 ? 0 : prev +1);
}

useEffect(() => {
if (tour) {
applyCountryBodyBackground(tour.countryId);
    }
return () => {
applyCountryBodyBackground(null);
    };
  }, [tour]);
if (!tour) {
return (
<div className="page-wrap container">
<h2>404</h2>
<p>{lang === 'zh' ? '找不到該行程' : 'Tour not found'}</p>
<Link to="/browse" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
{lang === 'zh' ? '返回瀏覽' : 'Back to Browse'}
</Link>
</div>
    );
  }
const title = lang === 'zh' ? tour.titleZh : tour.titleEn;
const rawDetail = lang === 'zh' ? tour.detailZh : tour.detailEn;
const tourDetail = lang === 'zh' ? tour.tourdetailZh : tour.tourdetailEn;
const planDetail = lang === 'zh' ? tour.plandetailZh : tour.plandetailEn;
const detail = Array.isArray(rawDetail)
? rawDetail.map((item, i) => <li key={i}>{item}</li>)
: rawDetail;
const tourinfo = Array.isArray(tourDetail)
? tourDetail.map((item, i) => <li key={i}>{item}</li>)
: tourDetail;
const planinfo = Array.isArray(planDetail)
? planDetail.map((item, i) => <li key={i}>{item}</li>)
: planDetail;
// 景點相片網格，點擊時打開燈箱並傳入索引
const photoContent = tourPhotos.length > 0 ? (
<div className="scenery-photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
{tourPhotos.map((photo, index) => (
<div
key={index}
onClick={() => setLightboxIndex(index)}
style={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '6px', height: '100px', border: '1px solid var(--border-color)' }}
>
<img
src={photo}
alt={`${tourId} scenery ${index + 1}`}
style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s' }}
onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
/>
</div>
      ))}
</div>
  ) : (
<p style={{ color: 'var(--text-gray)' }}>
{lang === 'zh' ? '此行程尚無相片檔案' : 'No photos available for this tour'}
</p>
  );
const carouselItems = [
    {
className: "attractions-intro",
title: t("itineraryinfoTitle"),
content: tourinfo
    },
    {
className: "itinerary-plan",
title: t("itineraryplanTitle"),
content: planinfo
    },
    {
className: "attractions-photo",
title: t("itineraryphotoTitle"),
content: photoContent
    }
  ];
const nextSlide = () => {
setCarouselIndex(prev => (prev + 1) % carouselItems.length);
  }
const prevSlide = () => {
setCarouselIndex(prev => (prev - 1 + carouselItems.length) % carouselItems.length);
  }
// 重設影片函式：把狀態改回false，卸載iframe
const resetVideo = () => {
setIsVideoPlaying(false);
};
return (
<div className={`page-wrap container ${country?.themeClass || ""}`}>
{/* ========== 影片背景區 - 手動播放按鈕版本 ========== */}
<div
style={{
position: "relative",
height: "420px",
borderRadius: "12px",
overflow: "hidden",
marginBottom: "2rem",
        }}
>
{videoEmbedUrl ? (
<>
{isVideoPlaying ? (
<>
<iframe
src={videoEmbedUrl}
title="YouTube video player"
frameBorder="0"
allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
referrerPolicy="strict-origin-when-cross-origin"
allowFullScreen
style={{
width: "100%",
height: "100%",
transform: "scale(1.3)",
transformOrigin: "center",
position:"relative",
zIndex:1
      }}
/>
{/* 影片播放時，在右上角增加【重設影片】按鈕 */}
<button
onClick={resetVideo}
style={{
position:"absolute",
top:"16px",
right:"16px",
zIndex:3,
padding:"6px 12px",
background:"rgba(0,0,0,0.55)",
color:"#fff",
border:"1px solid #fff",
borderRadius:"6px",
cursor:"pointer"
  }}
>
{lang === "zh" ? "重設影片" : "Reset Video"}
</button>
</>
  ) : (
// 未播放狀態：顯示播放按鈕
<div
style={{
width: "100%",
height: "100%",
background: "#111",
display: "flex",
alignItems: "center",
justifyContent: "center",
position:"relative",
zIndex:1
      }}
>
<button
onClick={() => setIsVideoPlaying(true)}
style={{
width: "80px",
height: "80px",
borderRadius: "50%",
background: "rgba(255,255,255,0.25)",
border: "none",
color: "#fff",
fontSize: "2.2rem",
cursor: "pointer",
display: "flex",
alignItems: "center",
justifyContent: "center",
backdropFilter: "blur(4px)",
transition: "background 0.2s",
        }}
onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.4)"}
onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
>
        ▶
</button>
</div>
  )}
</>
        ) : (
// 沒有影片時，顯示黑色備用背景
<div style={{ width: "100%", height: "100%", background: "#000" }}></div>
        )}
{/* ===== 修改重點：只做底部文字遮罩，不再蓋滿整個畫面 ===== */}
<div
style={{
position: "absolute",
left:0,
right:0,
bottom:0,
padding: "2rem",
background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
zIndex: 2,
          }}
>
<div>
<h1 style={{ color: "#fff", marginBottom: "0.4rem" }}>{title}</h1>
<div style={{ color: "var(--text-gold)", fontSize: "1.1rem" }}>
{t("tour.priceFrom")} HK${tour.price} · {tour.days}{" "}
{t("tour.days")}
</div>
</div>
</div>
</div>
<div className="text-box-purple">
<h3 style={{ color: "var(--text-gold)", marginBottom: "1rem" }}>
{t("tour.infoTitle")}
</h3>
<p style={{ lineHeight: "1.8" }}>{detail}</p>
<div
style={{
marginTop: "2rem",
display: "flex",
gap: "1rem",
flexWrap: "wrap",
          }}
>
<button
onClick={() => addToCart(tour)}
disabled={isInCart}
className={isInCart ? "btn-outline" : "btn-primary"}
>
{isInCart
? "✓ " + (lang === "zh" ? "已加入購物車" : "Already in cart")
: t("tour.addCart")}
</button>
<Link
to={country ? `/country/${country.id}` : "/browse"}
className="btn-outline"
>
{lang === "zh" ? "返回國家頁" : "Back to country"}
</Link>
<button
className="btn-primary"
onClick={() => setShowMore(!showMore)}
>
{lang === 'zh' ? '了解更多' : 'See more'}
</button>
</div>
{showMore && (
<main>
<section className="tour-info">
<div className="desktop-tour-cards">
{carouselItems.map((item, idx) => (
<article key={idx} className={item.className}>
<h3 style={{ color: "var(--text-gold)", marginBottom: "1rem" }}>
{item.title}
</h3>
<div style={{ lineHeight: "1.8" }}>{item.content}</div>
</article>
                ))}
</div>
<div className="mobile-tour-carousel">
<button className="carousel-btn prev" onClick={prevSlide}>❮</button>
<article className={carouselItems[carouselIndex].className}>
<h3 style={{ color: "var(--text-gold)", marginBottom: "1rem" }}>
{carouselItems[carouselIndex].title}
</h3>
<div style={{ lineHeight: "1.8" }}>{carouselItems[carouselIndex].content}</div>
</article>
<button className="carousel-btn next" onClick={nextSlide}>❯</button>
<div className="carousel-dots">
{carouselItems.map((_, idx) => (
<span
key={idx}
className={`dot ${carouselIndex === idx ? 'active' : ''}`}
onClick={() => setCarouselIndex(idx)}
/>
                  ))}
</div>
</div>
</section>
</main>
        )}
</div>

{/* ===================== 全螢幕燈箱【新增左右箭頭】 ===================== */}
{lightboxIndex !== null && (
<div
onClick={() => setLightboxIndex(null)}
style={{
position: 'fixed',
inset: 0,
backgroundColor: 'rgba(0, 0, 0, 0.92)',
zIndex: 99999,
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
padding: '1.5rem',
mixBlendMode: 'normal',
}}
>
{/* 關閉按鈕 */}
<button
onClick={(e) => {
              e.stopPropagation();
setLightboxIndex(null);
            }}
className="btn-primary"
style={{
position: 'absolute',
top: '20px',
right: '20px',
zIndex: 100000,
padding: '0.5rem 1rem',
fontSize: '1rem'
            }}
>
{lang === 'zh' ? '還原頁面 ✕' : 'Restore ✕'}
</button>

{/* 左箭頭 上一張 */}
<button
onClick={(e)=>{e.stopPropagation(); prevImage()}}
style={{
position: 'absolute',
left: '20px',
zIndex:100000,
width: '48px',
height:'48px',
borderRadius:'50%',
background:'rgba(255,255,255,0.2)',
color:'#fff',
border:'none',
fontSize:'24px',
cursor:'pointer',
display:'flex',
alignItems:'center',
justifyContent:'center'
}}
>❮</button>

{/* 右箭頭 下一張 */}
<button
onClick={(e)=>{e.stopPropagation(); nextImage()}}
style={{
position: 'absolute',
right: '20px',
zIndex:100000,
width: '48px',
height:'48px',
borderRadius:'50%',
background:'rgba(255,255,255,0.2)',
color:'#fff',
border:'none',
fontSize:'24px',
cursor:'pointer',
display:'flex',
alignItems:'center',
justifyContent:'center'
}}
>❯</button>

{/* 圖片 */}
<img
src={tourPhotos[lightboxIndex]}
alt="Fullscreen Preview"
onClick={(e) => e.stopPropagation()}
style={{
maxWidth: '90vw',
maxHeight: '85vh',
objectFit: 'contain',
borderRadius: '8px',
boxShadow: '0 5px 25px rgba(0,0,0,0.6)',
mixBlendMode: 'normal',
filter: 'none',
}}
/>
{/* 底部圖片計數 (例：3 / 6) */}
<div style={{
position:'absolute',
bottom:'24px',
color:'white',
fontSize:'1rem',
zIndex:100000
}}>
{lightboxIndex +1 } / {tourPhotos.length}
</div>
</div>
      )}
</div>
  );
};
export default TourDetailPage;
