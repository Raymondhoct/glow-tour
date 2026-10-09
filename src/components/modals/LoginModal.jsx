import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LanguageContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { t, lang } = useLang();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // 新增：成功提示狀態

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSuccessMsg('');
    
    try {
      // 加上 await 以正確等待登入 API 完成並捕捉錯誤
      await login({ email, password });
      
      // 顯示登入成功提示（支援中英文）
      setSuccessMsg(lang === 'zh' ? '登入成功！' : 'Login successful!');
      
      // 延遲 1 秒後關閉 Modal，確保使用者能看到提示
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
      
    } catch (ex) {
      setErr(ex.message || (lang === 'zh' ? '登入失敗，請檢查電郵或密碼' : 'Login failed, please check your credentials'));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem' }}>{lang === 'zh' ? '登入' : 'Login'}</h3>
        
        {/* 錯誤提示 */}
        {err && <p style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{err}</p>}
        
        {/* 成功提示 */}
        {successMsg && <p style={{ color: '#51cf66', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{successMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{lang === 'zh' ? '電郵' : 'Email'}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>{lang === 'zh' ? '密碼' : 'Password'}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {lang === 'zh' ? '登入' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          {lang === 'zh' ? '未有帳戶？' : 'No account? '}
          <button className="text-link" onClick={onSwitchToRegister}>
            {lang === 'zh' ? '立即註冊' : 'Register'}
          </button>
        </p>

        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default LoginModal;