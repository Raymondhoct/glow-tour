import { createContext, useContext, useState, useEffect } from 'react';
import { genId } from '../utils';

const AuthContext = createContext();
const STORAGE_KEY = 'nighttour_auth';
const ALL_USERS_KEY = 'nighttour_allusers';

export const AuthProvider = ({children})=>{
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(()=>{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      try{ setCurrentUser(JSON.parse(raw)); }catch(e){ setCurrentUser(null); }
    }
  },[]);

  const saveUser = (u)=>{
    setCurrentUser(u);
    if(u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const register = ({username, email, password})=>{
    const allUsers = JSON.parse(localStorage.getItem(ALL_USERS_KEY)||'[]');
    const exist = allUsers.find(u=>u.email===email);
    if(exist) throw new Error('Email already exists / 電郵已註冊');
    const newUser = {
      id: genId(), username, email, password,
      points:0, coupons:[], purchasedTours:[]
    };
    allUsers.push(newUser);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
    saveUser(newUser);
    return newUser;
  };

  const login = ({email, password})=>{
    const allUsers = JSON.parse(localStorage.getItem(ALL_USERS_KEY)||'[]');
    const found = allUsers.find(u=>u.email===email && u.password===password);
    if(!found) throw new Error('Email or password incorrect / 帳號密碼錯誤');
    saveUser(found);
    return found;
  };

  const logout = ()=> saveUser(null);

  const updateUser = (patch)=>{
    if(!currentUser) return;
    const updated = {
      ...currentUser,
      coupons: currentUser.coupons ?? [],
      purchasedTours: currentUser.purchasedTours ?? [],
      ...patch
    };
    const allUsers = JSON.parse(localStorage.getItem(ALL_USERS_KEY)||'[]');
    const idx = allUsers.findIndex(u=>u.id===currentUser.id);
    if(idx!==-1) allUsers[idx] = updated;
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
    saveUser(updated);
  };

  const addPoints = (num)=>{
    if(!currentUser) return;
    updateUser({ points: (currentUser.points||0) + Number(num) });
  };

  return (
    <AuthContext.Provider value={{
      currentUser, register, login, logout, updateUser, addPoints
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=> useContext(AuthContext);

