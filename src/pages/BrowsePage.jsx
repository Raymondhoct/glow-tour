import { useState, useMemo, useEffect } from 'react';
import tours from '../data/tours.json';
import reviewsInit from '../data/reviews.json';
import { useLang } from '../contexts/LanguageContext';
import { useRecord, imageStore } from '../contexts/RecordContext';
import { TourCard, Paginator } from '../components';
import { isWithinLast7Days } from '../utils';
const BrowsePage = () => {
  const { t, lang } = useLang();
  const { userReviews } = useRecord();
  const tourPageSize = 6;
  const [tourPage, setTourPage] = useState(1);
  const [displayReviews, setDisplayReviews] = useState([]);
  const tourOffset = (tourPage - 1) * tourPageSize;
  const paginatedTours = tours.slice(tourOffset, tourOffset + tourPageSize);

  const rawReviews = useMemo(() => {
    const validUserReviews = userReviews.filter(r => isWithinLast7Days(r.createdAt));
    return [...reviewsInit, ...validUserReviews];
  }, [userReviews]);

  useEffect(() => {
    let objectUrls = [];
    const loadReviewImages = async () => {
      const arr = await Promise.all(rawReviews.map(async (r) => {
        // 優先處理使用者上傳圖片：有 imgKey，從 indexedDB 讀取
        if(r.imgKey){
          try{
            const blob = await imageStore.getItem(r.imgKey);
            if(blob){
              const url = URL.createObjectURL(blob);
              objectUrls.push(url);
              return {...r, displayImg: url};
            }
          }catch(e){
            console.error("載入評論圖片失敗", e);
          }
        }
        // 處理 Demo 靜態圖片（reviews.json 的圖片，自動加上 BASE_URL，支援 GitHub Pages）
        if(r.img){
          let imgSrc;
          if(r.img.startsWith('http') || r.img.startsWith('data:')){
            imgSrc = r.img;
          }else{
            imgSrc = `${import.meta.env.BASE_URL}${r.img.replace(/^\/+/, '')}`;
          }
          return {...r, displayImg: imgSrc};
        }
        return {...r, displayImg: null};
      }));
      setDisplayReviews(arr);
    };

    loadReviewImages();
    // cleanup：釋放 blob url，防止記憶體洩漏
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
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
