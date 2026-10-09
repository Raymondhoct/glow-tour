import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { COUPON_RULES, canRedeemCoupon } from '../utils';

const CouponPage = () => {
  const { lang } = useLang();
  const { currentUser, updateUser } = useAuth();

  if(!currentUser) {
    return (
      <div className="page-wrap container">
        <p>{lang==='zh' ? '請先登入' : 'Please login first'}</p>
      </div>
    );
  }

  const handleRedeem = (rule) => {
    if(!canRedeemCoupon(currentUser.points, rule)) {
      alert(lang==='zh' ? '積分不足' : 'Not enough points');
      return;
    }
    const newPoints = currentUser.points - rule.costPoints;
    const newCoupons = [...currentUser.coupons, { ...rule, redeemedAt: Date.now() }];
    updateUser({ points: newPoints, coupons: newCoupons });
    alert(`${lang==='zh' ? '兌換成功！' : 'Redeemed successfully!'}`);
  };

  return (
    <div className="page-wrap container">
      <h2 style={{marginBottom:'1rem', color:'var(--text-gold)'}}>{lang==='zh' ? '積分兌換優惠券' : 'Point Redemption'}</h2>
      <p style={{marginBottom:'1.5rem'}}>
        {lang==='zh' ? '當前積分：' : 'Current Points: '}<strong>{currentUser.points}</strong>
      </p>

      <div className="grid-3">
        {COUPON_RULES.map(rule=>(
          <div key={rule.id} className="card">
            <div className="card-body">
              <h4>{lang==='zh' ? rule.nameZh : rule.nameEn}</h4>
              <p>{lang==='zh' ? '需要積分：' : 'Cost: '}{rule.costPoints}</p>
              <button
                onClick={()=>handleRedeem(rule)}
                disabled={!canRedeemCoupon(currentUser.points, rule)}
                className={canRedeemCoupon(currentUser.points, rule) ? 'btn-primary' : 'btn-outline'}
                style={{width:'100%', marginTop:'0.8rem'}}
              >
                {lang==='zh' ? '立即兌換' : 'Redeem'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{marginTop:'3rem', color:'var(--text-gold)'}}>{lang==='zh' ? '我的優惠券' : 'My Coupons'}</h3>
      {currentUser.coupons?.length ===0 ? (
        <p style={{color:'var(--text-gray)'}}>{lang==='zh' ? '暫無優惠券' : 'No coupons yet'}</p>
      ) : (
        <div className="grid-3">
          {currentUser.coupons.map((cp,i)=>(
            <div key={i} className="card">
              <div className="card-body">
                <h4>{lang==='zh' ? cp.nameZh : cp.nameEn}</h4>
                <p>HK${cp.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponPage;
