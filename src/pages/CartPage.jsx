import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';

const CartPage = () => {
  const { lang } = useLang();
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const { currentUser, updateUser, addPoints } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if(!currentUser) {
      alert(lang==='zh' ? '請先登入再結帳' : 'Please login before checkout');
      return;
    }
    // 模擬結帳：把行程加入已購清單 + 贈積分（每HK$10 = 1積分）
    const purchasedIds = cartItems.map(i=>i.tourId);
    const newPoints = Math.floor(totalPrice / 10);
    updateUser({ purchasedTours: [...currentUser.purchasedTours, ...purchasedIds] });
    addPoints(newPoints);
    clearCart();
    alert(`${lang==='zh' ? '結帳成功！獲得' : 'Order success! Earned '}${newPoints} ${lang==='zh' ? '積分' : 'points'}`);
    navigate('/my-records');
  };

  return (
    <div className="page-wrap container">
      <h2 style={{marginBottom:'1.5rem', color:'var(--text-gold)'}}>{lang==='zh' ? '購物車' : 'Shopping Cart'}</h2>
      {cartItems.length===0 ? (
        <>
          <p style={{color:'var(--text-gray)'}}>{lang==='zh' ? '購物車是空的' : 'Cart is empty'}</p>
          <Link to="/browse" className="btn-primary" style={{display:'inline-block', marginTop:'1rem'}}>
            {lang==='zh' ? '瀏覽行程' : 'Browse Tours'}
          </Link>
        </>
      ) : (
        <>
          <div>
            {cartItems.map(item=>(
              <div key={item.tourId} className="cart-item-row">
                <div>
                  <h4>{lang==='zh' ? item.titleZh : item.titleEn}</h4>
                  <p>HK${item.price}</p>
                </div>
                <button onClick={()=>removeFromCart(item.tourId)} className="btn-outline">
                  {lang==='zh' ? '移除' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>{lang==='zh' ? '總計：' : 'Total: '}HK${totalPrice}</h3>
            <div style={{display:'flex', gap:'1rem', marginTop:'1rem'}}>
              <button onClick={clearCart} className="btn-outline">{lang==='zh' ? '清空購物車' : 'Clear Cart'}</button>
              <button onClick={handleCheckout} className="btn-primary">{lang==='zh' ? '模擬結帳' : 'Simulate Checkout'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
