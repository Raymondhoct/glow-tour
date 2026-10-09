import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LanguageContext';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { lang } = useLang();
  const { register } = useAuth();
  const [form, setForm] = useState({ username:'', email:'', password:'', confirm:'' });
  const [err, setErr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr('');
    if(form.password !== form.confirm) {
      setErr(lang==='zh' ? '兩次密碼不一致' : 'Passwords do not match');
      return;
    }
    try {
      register({ username:form.username, email:form.email, password:form.password });
      onClose();
    } catch(ex) {
      setErr(ex.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <h3 style={{marginBottom:'1rem'}}>{lang==='zh' ? '註冊會員' : 'Register'}</h3>
        {err && <p style={{color:'#ff6b6b', fontSize:'0.9rem'}}>{err}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{lang==='zh' ? '用戶名' : 'Username'}</label>
            <input type="text" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>{lang==='zh' ? '電郵' : 'Email'}</label>
            <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>{lang==='zh' ? '密碼' : 'Password'}</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
          </div>
          <div className="form-group">
            <label>{lang==='zh' ? '確認密碼' : 'Confirm Password'}</label>
            <input type="password" value={form.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary" style={{width:'100%', marginTop:'0.5rem'}}>
            {lang==='zh' ? '註冊' : 'Sign Up'}
          </button>
        </form>
        <p style={{marginTop:'1rem', fontSize:'0.9rem'}}>
          {lang==='zh' ? '已有帳戶？' : 'Have account? '}
          <button className="text-link" onClick={onSwitchToLogin}>
            {lang==='zh' ? '前往登入' : 'Login'}
          </button>
        </p>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default RegisterModal;
