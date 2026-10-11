import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRecord, imageStore } from '../contexts/RecordContext';
import { useLang } from '../contexts/LanguageContext';
import { compressImage } from '../utils';

const RecordForm = () => {
  const { lang } = useLang();
  // 修正 1：在這裡直接取得 addPoints 函數，而不是在 submit 裡面用 import 和 hook
  const { currentUser, addPoints } = useAuth();
  const { addRecord, addUserReview } = useRecord();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    travelDate:'', location:'', title:'', note:'', imgKey:null, imgPreview:null
  });
  const [loading, setLoading] = useState(false);

  if(!currentUser) {
    return (
      <div className="page-wrap container">
        <p>{lang==='zh' ? '請先登入' : 'Please login first'}</p>
      </div>
    );
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setLoading(true);
    try {
      const { blob, base64 } = await compressImage(file,1080,0.7);
      const key = `img-${Date.now()}`;
      await imageStore.setItem(key, blob);
      setForm(p=>({...p, imgKey:key, imgPreview:base64}));
    } catch(err) {
      alert(lang==='zh' ? '圖片處理失敗' : 'Image process failed');
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if(form.note.length>100) {
    alert(lang==='zh' ? '隨記不能超過100字' : 'Note max 100 chars');
    return;
  }
  try {
    addRecord({
      userId: currentUser.id,
      travelDate: form.travelDate,
      location: form.location,
      title: form.title,
      note: form.note,
      imgKey: form.imgKey
    });
    // ✅ 重點：userReview 只存 imgKey，不要存 base64！
    addUserReview({
      username: currentUser.username,
      textZh: `【${form.title}】${form.note}`,
      textEn: `[${form.title}] ${form.note}`,
      imgKey: form.imgKey, // <--- 修改這裡！
      createdAt: Date.now()
    });
    addPoints(50);
    alert(lang === 'zh' ? '已分享並獲取積分！' : 'Shared successfully and earned points!');
    navigate('/my-records');
  } catch (err) {
    console.error(err);
    alert(lang === 'zh' ? '提交失敗，請稍後再試' : 'Submission failed, please try again');
  }
};


  return (
    <div className="page-wrap container">
      <h2 style={{marginBottom:'1.5rem', color:'var(--text-gold)'}}>
        {lang==='zh' ? '新增旅遊記錄' : 'New Travel Record'}
      </h2>
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
          <label>{lang==='zh' ? '日期' : 'Date'}</label>
          <input type="date" value={form.travelDate} onChange={e=>setForm({...form, travelDate:e.target.value})} required />
        </div>
        <div className="form-group">
          <label>{lang==='zh' ? '旅遊地點' : 'Location'}</label>
          <input type="text" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} required />
        </div>
        <div className="form-group">
          <label>{lang==='zh' ? '標題' : 'Title'}</label>
          <input type="text" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        </div>
        <div className="form-group">
          <label>{lang==='zh' ? '旅遊隨記（100字以內）' : 'Note (max 100 chars)'}</label>
          <textarea maxLength={100} value={form.note} onChange={e=>setForm({...form, note:e.target.value})} required />
          <small>{form.note.length}/100</small>
        </div>
        <div className="form-group">
          <label>{lang==='zh' ? '上傳照片' : 'Upload photo'}</label>
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
          {form.imgPreview && <img src={form.imgPreview} alt="preview" style={{maxWidth:'240px', marginTop:'0.6rem', borderRadius:'8px'}} />}
          {loading && <p>{lang==='zh' ? '壓縮中…' : 'Compressing…'}</p>}
        </div>
        <button type="submit" className="btn-primary" style={{marginTop:'1rem'}}>
          {lang==='zh' ? '儲存並分享（+50積分）' : 'Save & Share (+50 pts)'}
        </button>
      </form>
    </div>
  );
};

export default RecordForm;