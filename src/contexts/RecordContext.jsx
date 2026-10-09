import { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { genId } from '../utils';

export const imageStore = localforage.createInstance({ name:'nighttour_images' });
const RECORD_KEY = 'nighttour_records';
const REVIEW_KEY = 'nighttour_reviews';

const RecordContext = createContext();

export const RecordProvider = ({children})=>{
  const [records, setRecords] = useState([]);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(()=>{
    const r = JSON.parse(localStorage.getItem(RECORD_KEY)||'[]');
    const rev = JSON.parse(localStorage.getItem(REVIEW_KEY)||'[]');
    setRecords(r); setUserReviews(rev);
  },[]);

  const saveRecords = arr=>{ setRecords(arr); localStorage.setItem(RECORD_KEY, JSON.stringify(arr)); };
  const saveReviews = arr=>{ setUserReviews(arr); localStorage.setItem(REVIEW_KEY, JSON.stringify(arr)); };

  const addRecord = (data)=>{
    const rec = { id:genId(), createdAt:Date.now(), ...data };
    saveRecords([...records, rec]);
    return rec;
  };

  const deleteRecord = (id)=>{
    saveRecords(records.filter(r=>r.id!==id));
  };

  const addUserReview = (data)=>{
    const rev = { id:genId(), createdAt:Date.now(), ...data };
    saveReviews([...userReviews, rev]);
    return rev;
  };

  return (
    <RecordContext.Provider value={{
      records, userReviews, addRecord, deleteRecord, addUserReview, imageStore
    }}>
      {children}
    </RecordContext.Provider>
  );
};

export const useRecord = ()=> useContext(RecordContext);
