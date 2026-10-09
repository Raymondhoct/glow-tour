import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import tours from '../data/tours.json';
import countries from '../data/countries.json';
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

  // 顯示/隱藏 main 內容
  const [showMore, setShowMore] = useState(false);
  // 手機carousel輪播索引
  const [carouselIndex, setCarouselIndex] = useState(0);
  // 燈箱放大圖
  const [activeImage, setActiveImage] = useState(null);

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

  // 景點相片網格
  const photoContent = tourPhotos.length > 0 ? (
    <div className="scenery-photo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
      {tourPhotos.map((photo, index) => (
        <div
          key={index}
          onClick={() => setActiveImage(photo)}
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

  return (
    <div className={`page-wrap container ${country?.themeClass || ""}`}>
      {/* 影片背景區 */}
      <div
        style={{
          position: "relative",
          height: "420px",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <video
          src={tour.video}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "flex-end",
            padding: "2rem",
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

      {/* 全螢幕燈箱 */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          {/* 還原（關閉）按鈕 */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // 防止點擊按鈕時觸發外層背景的關閉事件
              setActiveImage(null);
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
          <img
            src={activeImage}
            alt="Fullscreen Preview"
            onClick={(e) => e.stopPropagation()} // 點擊圖片本身不會關閉燈箱
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 5px 25px rgba(0,0,0,0.5)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TourDetailPage;
