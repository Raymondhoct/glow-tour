import { useParams, Link } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import countries from '../data/countries.json';
import tours from '../data/tours.json';
import { useLang } from '../contexts/LanguageContext';
import { TourCard } from '../components';
import { applyCountryBodyBackground } from '../utils';

const CountryPage = () => {
  const { countryId } = useParams();
  const { lang } = useLang();
  const country = useMemo(() => countries.find(c => c.id === countryId), [countryId]);
  const countryTours = useMemo(() => tours.filter(t => t.countryId === countryId), [countryId]);

  // 設定頁面背景，離開頁面清除body背景
  useEffect(() => {
    applyCountryBodyBackground(countryId);
    return () => {
      applyCountryBodyBackground(null);
    };
  }, [countryId]);

  if (!country) {
    return (
      <div className="page-wrap container">
        <h2>404</h2>
        <p>{lang==='zh' ? '找不到該國家頁面' : 'Country not found'}</p>
        <Link to="/browse" className="btn-primary" style={{display:'inline-block', marginTop:'1rem'}}>
          {lang==='zh' ? '返回瀏覽' : 'Back to Browse'}
        </Link>
      </div>
    );
  }
  const name = lang === 'zh' ? country.nameZh : country.nameEn;
  const desc = lang === 'zh' ? country.descZh : country.descEn;
  const custom = lang === 'zh' ? country.customZh : country.customEn;
  return (
    <div className={`page-wrap container ${country.themeClass}`}>
      <div className="text-box-purple" style={{marginBottom:'2rem'}}>
        <h2 style={{color:'var(--theme-accent)', marginBottom:'0.8rem'}}>{name}</h2>
        <p style={{marginBottom:'1rem'}}>{desc}</p>
        <p style={{color:'var(--text-gray)', fontSize:'0.95rem'}}>
          <strong>{lang==='zh' ? '當地禮儀與注意事項：' : 'Local etiquette & notes:'}</strong>
          {custom}
        </p>
      </div>
      <h3 style={{color:'var(--text-gold)', marginBottom:'1rem'}}>
        {lang==='zh' ? '本國夜色旅遊行程' : 'Night Tours in this country'}
      </h3>
      <div className="grid-3">
        {countryTours.map(tour => <TourCard key={tour.tourId} tour={tour} />)}
      </div>
      {countryTours.length === 0 && (
        <p style={{color:'var(--text-gray)'}}>
          {lang==='zh' ? '暫無行程' : 'No tours available'}
        </p>
      )}
    </div>
  );
};
export default CountryPage;
