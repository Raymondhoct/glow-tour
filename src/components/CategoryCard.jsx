import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';

const CategoryCard = ({ country }) => {
  const { lang } = useLang();
  const name = lang === 'zh' ? country.nameZh : country.nameEn;
  const desc = lang === 'zh' ? country.descZh : country.descEn;
  const city = lang === 'zh' ? country.cityZh : country.cityEn;

  const imgSrc = `${import.meta.env.BASE_URL}images/countries/${country.id}.jpg`;

  return (
    <Link to={`/country/${country.id}`} className={`card ${country.themeClass}`}>
      <div className="card-img-wrap">
        <img
          src={imgSrc}
          alt={name}
        />
        <p className="tour-city">{city}</p>
      </div>
      <div className="card-body">
        <h3 className="card-title" style={{ color:'var(--theme-accent)' }}>{name}</h3>
        <p style={{ color:'var(--text-gray)', fontSize:'0.9rem', marginTop:'0.4rem' }}>
          {desc}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
