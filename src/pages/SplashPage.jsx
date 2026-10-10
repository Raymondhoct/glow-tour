import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';
import siteConfig from '../data/siteConfig.json';

export default function SplashPage() {
  const { lang } = useLang();
  
  // 1. 建立本地語言狀態，初始值可對應全域語言，並設定計時器每 5 秒自動切換
  const [displayLang, setDisplayLang] = useState(lang);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayLang(prev => (prev === 'zh' ? 'en' : 'zh'));
    }, 5000); // 5000 毫秒 = 5 秒

    // 當元件卸載時清除計時器，避免記憶體洩漏
    return () => clearInterval(timer);
  }, []);

  // const [siteConfig, setSiteConfig] = useState(null);

  // useEffect(() => {
  //   fetch('/data/siteConfig.json')
  //   .then(res => res.json())
  //   .then(data => setSiteConfig(data));
  // },[]);

  // if (!siteConfig) {
  //   return <div>Loading...</div>;
  // }

  return (
    <section style={{
      position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'
    }}>
      <video
        autoPlay muted loop playsInline
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: -2
        }}
      >
        <source src={siteConfig.heroVideoPath} type="video/mp4" />
      </video>

      <div style={{
        position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: -1
      }} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        backgroundColor: 'var(--bg-purple-trans)', padding: '2rem 2.4rem', borderRadius: '12px',
        maxWidth: '520px', textAlign: 'center'
      }}>
        {/* 2. 根據自動切換的 displayLang 顯示 siteConfig 中的中英文標題 */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>
          {displayLang === 'zh' ? siteConfig.siteNameZh : siteConfig.siteNameEn}
        </h1>
        
        {/* 3. 根據 displayLang 顯示 siteConfig 中的中英文描述 */}
        <p style={{ opacity: 0.95, color: '#fff' }}>
          {displayLang === 'zh' ? siteConfig.heroDescZh : siteConfig.heroDescEn}
        </p>
      </div>

      <Link
        to="/home"
        style={{
          position: 'absolute', right: '2rem', bottom: '2rem',
          backgroundColor: 'var(--accent-purple)', color: '#fff',
          padding: '0.8rem 1.6rem', borderRadius: '8px', fontWeight: 'bold',
          textDecoration: 'none'
        }}
      >
        {/* 4. 根據 displayLang 切換按鈕文字（對應 LanguageContext 中的 enter） */}
        {displayLang === 'zh' ? '進入' : 'Enter'}
      </Link>
    </section>
  );
}