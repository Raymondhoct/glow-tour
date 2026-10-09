import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import countries from '../data/countries.json';
import tours from '../data/tours.json';
import { CategoryCard, TourCard } from '../components';

const HomePage = () => {
  const { t, lang } = useLang();
  // 每次載入元件時隨機抽 6 張
  const featuredTours = useMemo(() => {
    return [...tours].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, []);

  return (
    <>
      <div className="video-bg-wrap">
        <video src="https://res.cloudinary.com/rfexp9dj/video/upload/v1791535670/hero-bg.mp4" autoPlay muted loop playsInline />
        <div className="video-bg-overlay" />
      </div>

      <div
        className="page-wrap container"
        style={{ position: "relative", zIndex: 1 }}
      >
        <section
          className="text-box-purple"
          style={{ maxWidth: "700px", marginTop: "4rem", marginBottom: "4rem" }}
        >
          <h1 style={{ color: "var(--text-gold)", marginBottom: "1rem" }}>
            {t("siteName")}
          </h1>
          <p style={{ fontSize: "1.05rem", marginBottom: "1.5rem" }}>
            {t("homeIntro")}
          </p>
          <Link
            to="/browse"
            className="btn-primary"
            style={{ display: "inline-block" }}
          >
            {t("enterBtn")}
          </Link>
        </section>

        {/* <section className="box"> */}
          <aside className="cude-container">
            <div className="cube">
              <div className="face front">China</div>
              <div className="face back">Japan</div>
              <div className="face right">Korea</div>
              <div className="face left">Thailand</div>
              <div className="face top">Finland</div>
              {/* 第六個面放入影片 */}
              <div className="face bottom">
                <video
                  src="https://res.cloudinary.com/rfexp9dj/video/upload/v1791536577/countries.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </aside>
        {/* </section> */}

        <section className="grid-3-container" style={{ marginBottom: "4rem" }}>
          <h2 style={{ color: "var(--text-gold)", marginBottom: "1.5rem" }}>
            {lang === "zh" ? "目的地" : "Destinations"}
          </h2>
          <div className="grid-3">
            {countries.map((c) => (
              <CategoryCard key={c.id} country={c} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ color: "var(--text-gold)", marginBottom: "1.5rem" }}>
            {t("populartourTitle")}
          </h2>
          <div className="grid-3">
            {featuredTours.map((t) => (
              <TourCard key={t.tourId} tour={t} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
