import { useLang } from '../contexts/LanguageContext';

export default function LanguageSwitch() {
  const { lang, setLang } = useLang();

  // 判斷下一次點擊要切換成什麼語言
  const nextLang = lang === 'zh' ? 'en' : 'zh';
  const buttonText = lang === 'zh' ? 'EN' : '中文';

  return (
    <div className="lang-switch">
      <button
        className="btn-primary" // 您可以根據喜好調整 className
        onClick={() => setLang(nextLang)}
      >
        {buttonText}
      </button>
    </div>
  );
}