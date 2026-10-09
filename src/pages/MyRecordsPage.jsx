import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRecord, imageStore } from '../contexts/RecordContext';
import { useLang } from '../contexts/LanguageContext';
import { exportToJsonFile, exportUserFullBackup } from '../utils';

const MyRecordsPage = () => {
  const { lang } = useLang();
  const { currentUser } = useAuth();
  const { records, deleteRecord } = useRecord();
  const [displayRecords, setDisplayRecords] = useState([]);

  // 1. 先安全地計算出當前使用者的記錄（如果 currentUser 為 null 則給空陣列）
  const myRecords = currentUser ? records.filter(r => r.userId === currentUser.id) : [];

  // 2. 確保所有 Hook 都放在最上方，順序固定不變
  useEffect(() => {
    if (!currentUser) return; // 如果未登入則不執行後續圖片載入

    const loadImages = async () => {
      const arr = await Promise.all(myRecords.map(async r => {
        let preview = null;
        if (r.imgKey) {
          try {
            const blob = await imageStore.getItem(r.imgKey);
            if (blob) preview = URL.createObjectURL(blob);
          } catch (e) {}
        }
        return { ...r, preview };
      }));
      setDisplayRecords(arr);
    };
    loadImages();
  }, [records, currentUser]);

  // 3. 條件判斷（如「請先登入」）必須放在所有 Hook 執行完畢之後！
  if (!currentUser) {
    return (
      <div className="page-wrap container">
        <p>{lang === 'zh' ? '請先登入' : 'Please login first'}</p>
      </div>
    );
  }

  const handleExport = () => {
    const backup = exportUserFullBackup(currentUser, myRecords, []);
    exportToJsonFile(backup, `tour-backup-${currentUser.username}.json`);
  };

  return (
    <div className="page-wrap container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap'}}>
        <h2 style={{color:'var(--text-gold)'}}>{lang==='zh' ? '我的旅遊記錄' : 'My Travel Records'}</h2>
        <div style={{display:'flex', gap:'0.8rem'}}>
          <Link to="/record/new" className="btn-primary">+ {lang==='zh' ? '新增記錄' : 'New Record'}</Link>
          <button onClick={handleExport} className="btn-outline">{lang==='zh' ? '匯出備份' : 'Export Backup'}</button>
        </div>
      </div>

      {displayRecords.length===0 ? (
        <p style={{color:'var(--text-gray)'}}>{lang==='zh' ? '暫無記錄' : 'No records yet'}</p>
      ) : (
        <div className="grid-2">
          {displayRecords.map(r=>(
            <div key={r.id} className="card">
              {r.preview && <img src={r.preview} alt={r.title} style={{width:'100%', height:'200px', objectFit:'cover'}} />}
              <div className="card-body">
                <h4>{r.title}</h4>
                
                <p>
                  <strong>{lang==='zh' ? '旅遊日期：' : 'Travel Date: '}</strong>
                  {r.travelDate || (lang==='zh' ? '未填寫' : 'N/A')}
                </p>

                {r.createdAt && (
                  <p style={{fontSize:'0.85rem', color:'var(--text-gray)'}}>
                    <strong>{lang==='zh' ? '建立時間：' : 'Created At: '}</strong>
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                )}

                <p><strong>{lang==='zh' ? '地點：' : 'Location: '}</strong>{r.location}</p>
                <p style={{color:'var(--text-gray)', fontSize:'0.9rem'}}>{r.note}</p>
                
                <button onClick={()=>deleteRecord(r.id)} className="btn-outline" style={{color:'#ff6b6b', marginTop:'0.6rem'}}>
                  {lang==='zh' ? '刪除' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecordsPage;