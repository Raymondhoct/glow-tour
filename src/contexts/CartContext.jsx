import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const KEY = 'nighttour_cart';

export const CartProvider = ({children})=>{
  const [cartItems, setCartItems] = useState([]);

  useEffect(()=>{
    const raw = localStorage.getItem(KEY);
    if(raw) try{ setCartItems(JSON.parse(raw)); }catch(e){ setCartItems([]); }
  },[]);

  const save = arr=>{ setCartItems(arr); localStorage.setItem(KEY, JSON.stringify(arr)); };

  const addToCart = (tour)=>{
    if(cartItems.some(i=>i.tourId===tour.tourId)) return;
    save([...cartItems, tour]);
  };

  const removeFromCart = (tourId)=>{
    save(cartItems.filter(i=>i.tourId!==tourId));
  };

  const clearCart = ()=> save([]);

  const totalPrice = cartItems.reduce((sum, i)=> sum + Number(i.price||0), 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = ()=> useContext(CartContext);

