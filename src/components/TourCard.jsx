import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useLang } from '../contexts/LanguageContext';

const TourCard = ({ tour }) => {
  const { lang, t } = useLang();
  const { cartItems, addToCart } = useCart();
  const isInCart = cartItems.some(i => i.tourId === tour.tourId);

  const title = lang === 'zh' ? tour.titleZh : tour.titleEn;
  const short = lang === 'zh' ? tour.shortZh : tour.shortEn;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isInCart) addToCart(tour);
  };

  return (
    <Link to={`/tour/${tour.tourId}`} className="card">
      <div className="card-img-wrap">
        <img src={`${import.meta.env.BASE_URL}${tour.img.replace(/^\/+/, '')}`} alt={title} />
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p style={{color:'var(--text-gray)', fontSize:'0.9rem', margin:'0.4rem 0'}}>{short}</p>
        <div className="card-price">{t('tour.priceFrom')} HK${tour.price}</div>
        <div style={{display:'flex', gap:'0.6rem', marginTop:'0.8rem', flexWrap:'wrap'}}>
          <button
            onClick={handleAdd}
            disabled={isInCart}
            className={isInCart ? "btn-outline" : "btn-primary"}
            style={{fontSize:'0.85rem', padding:'0.5rem 0.8rem'}}
          >
            {isInCart ? '✓ 已加入' : t('tour.addCart')}
          </button>
          <span style={{alignSelf:'center', fontSize:'0.85rem', color:'var(--text-gray)'}}>
            {tour.days} {t('tour.days')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
