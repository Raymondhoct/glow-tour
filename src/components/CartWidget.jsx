import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { useLang } from '../contexts/LanguageContext';

const CartWidget = () => {
  const { cartItems, totalPrice } = useCart();
  const { t } = useLang();
  const count = cartItems.length;

  return (
    <Link to="/cart" className="nav-link" style={{ position:'relative' }}>
      🛒 {t('nav.cart')}
      {count > 0 && (
        <span style={{
          position:'absolute', top:'-8px', right:'-12px',
          background:'var(--text-gold)', color:'#000',
          borderRadius:'999px', minWidth:'18px', height:'18px',
          fontSize:'0.7rem', display:'grid', placeItems:'center', fontWeight:'bold'
        }}>
          {count}
        </span>
      )}
      {count>0 && <span style={{marginLeft:'6px', fontSize:'0.85rem', color:'var(--text-gold)'}}>HK${totalPrice}</span>}
    </Link>
  );
};

export default CartWidget;
