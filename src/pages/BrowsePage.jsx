import { useState, useEffect, useMemo } from 'react';
import tours from '../data/tours.json';
import reviewsInit from '../data/reviews.json';
import { useLang } from '../contexts/LanguageContext';
import { useRecord, imageStore } from '../contexts/RecordContext'; // 引入 imageStore
import { TourCard, Paginator } from '../components';
import { isWithinLast7Days } from '../utils';

const BrowsePage = () => {
  const { t, lang } = useLang();
  const { userReviews } = useRecord();

  const tourPageSize = 6;
  const [tourPage, setTourPage] = useState(1);
  const tourOffset = (tourPage - 1) * tourPageSize;
  const paginatedTours = tours.slice(tourOffset, tourOffset + tourPageSize);

  // 1. 先組合所有評論（示範評論 + 符合 7 天內的使用者評論）
  const rawReviews = useMemo(() => {
    const validUserReviews = userReviews.filter(r => isWithinLast7Days(r.createdAt));
    return [...reviewsInit, ...validUserReviews];
  }, [userReviews]);

  // 2. 建立一個 state 用來存放包含「圖片預覽 URL (Blob URL)」的評論列表
  const [displayReviews, setDisplayReviews] = useState([]);

  // 3. 處理圖片載入：若是使用者上傳的評論（有 imgKey），從 imageStore 讀取 Blob 並轉成 ObjectURL
  useEffect(() => {
    const loadReviewImages = async () => {
      const arr = await Promise.all(rawReviews.map(async r => {
        // 如果該筆評論有 imgKey 且沒有實體 img 網址，就去 IndexedDB 抓取圖片
        if (r.imgKey && !r.img) {
          try {
            const blob = await imageStore.getItem(r.imgKey);
            if (blob) {
              const previewUrl = URL.createObjectURL(blob);
              return { ...r, displayImg: previewUrl };
            }
          } catch (e) {
            console.error("Failed to load review image from store", e);
          }
        }
        
        // 如果是原本的示範評論（有 r.img），則根據是否為 GitHub 子路徑加上 BASE_URL
        if (r.img) {
          const formattedImg = r.img.startsWith('http') 
            ? r.img 
            : `${import.meta.env.BASE_URL}${r.img.replace(/^\/+/, '')}`;
          return { ...r, displayImg: formattedImg };
        }

        return { ...r, displayImg: null };
      }));

      setDisplayReviews(arr);
    };

    loadReviewImages();
  }, [rawReviews]);

  return (
    <div className="page-wrap container">
      <section style={{marginBottom:'3rem'}}>
        <h2 style={{marginBottom:'1.5rem', color:'var(--text-gold)'}}>{t('exploreTitle')}</h2>
        <div className="grid-3">
          {paginatedTours.map(tour => <TourCard key={tour.tourId} tour={tour} />)}
        </div>
        <Paginator
          currentPage={tourPage}
          totalItems={tours.length}
          pageSize={tourPageSize}
          onPageChange={setTourPage}
        />
      </section>

      <section>
        <h2 style={{marginBottom:'1.5rem', color:'var(--text-gold)'}}>{t('reviewWallTitle')}</h2>
        {displayReviews.length === 0 ? (
          <p style={{color:'var(--text-gray)'}}>
            {lang==='zh' ? '暫無7天內分享' : 'No shares in last 7 days'}
          </p>
        ) : (
          displayReviews.map(r => (
            <div key={r.id} className="review-card">
              <div style={{fontWeight:'600', marginBottom:'0.4rem'}}>@{r.username}</div>
              <p>{lang==='zh' ? r.textZh : r.textEn}</p>
              {r.displayImg && (
                <img
                  src={r.displayImg}
                  alt="review"
                  style={{maxWidth:'320px', borderRadius:'8px', marginTop:'0.6rem'}}
                />
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default BrowsePage;