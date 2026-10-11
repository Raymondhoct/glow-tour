import { useState, useMemo } from 'react';
import tours from '../data/tours.json';
import reviewsInit from '../data/reviews.json';
import { useLang } from '../contexts/LanguageContext';
import { useRecord } from '../contexts/RecordContext';
import { TourCard, Paginator } from '../components';
import { isWithinLast7Days } from '../utils';

const BrowsePage = () => {
  const { t, lang } = useLang();
  const { userReviews } = useRecord();

  const tourPageSize = 6;
  const [tourPage, setTourPage] = useState(1);
  const tourOffset = (tourPage - 1) * tourPageSize;
  const paginatedTours = tours.slice(tourOffset, tourOffset + tourPageSize);

  const allReviews = useMemo(() => {
    // 示範評論永遠顯示；使用者新增評論才執行7天過濾
    const validUserReviews = userReviews.filter(r => isWithinLast7Days(r.createdAt));
    return [...reviewsInit, ...validUserReviews];
  }, [userReviews]);

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
        {allReviews.length === 0 ? (
          <p style={{color:'var(--text-gray)'}}>
            {lang==='zh' ? '暫無7天內分享' : 'No shares in last 7 days'}
          </p>
        ) : (
          allReviews.map(r => (
            <div key={r.id} className="review-card">
              <div style={{fontWeight:'600', marginBottom:'0.4rem'}}>@{r.username}</div>
              <p>{lang==='zh' ? r.textZh : r.textEn}</p>
              {r.img && (
                <img
                  // src={`${import.meta.env.BASE_URL}${r.img.replace(/^\/+/, '')}`} 
                  src={r.img}
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
