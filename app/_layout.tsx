import '../global.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, useRouter } from 'expo-router';
import Navbar from '../components/Navbar';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, db, appId, doc, setDoc, getDoc, Timestamp } from '../config/firebase';

export const AppContext = React.createContext(null);

const AppLayout = () => {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeZikr, setActiveZikr] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  const zikrCollectionPath = useMemo(() => userId ? `/artifacts/${appId}/users/${userId}/zikr-history` : null, [userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Authentication Error:", error);
        }
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const loadZikrData = useCallback(async (zikrName) => {
    if (!zikrCollectionPath) return;
    const docId = `${zikrName}-${new Date().toISOString().split('T')[0]}`;
    const docRef = doc(db, zikrCollectionPath, docId);
    const docSnap = await getDoc(docRef);

    let zikrData;
    if (docSnap.exists()) {
      const data = docSnap.data();
      zikrData = {
        name: data.name,
        count: data.count || 0,
        target: data.target || 100,
      };
    } else {
      zikrData = { name: zikrName, count: 0, target: 100 };
    }
    setActiveZikr(zikrData);
    setInputValue(zikrData.name);
  }, [zikrCollectionPath]);

  const selectZikr = (zikr) => {
    setActiveZikr(zikr);
    setInputValue(zikr.name);
    router.push('/');
  };

  useEffect(() => {
    if (userId) {
      loadZikrData('SubhanAllah');
    }
  }, [userId, loadZikrData]);

  const saveZikr = useCallback(async (dataToSave) => {
    if (!zikrCollectionPath || !dataToSave.name) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const docId = `${dataToSave.name}-${today.toISOString().split('T')[0]}`;
    const docRef = doc(db, zikrCollectionPath, docId);
    const finalData = { ...dataToSave, date: Timestamp.fromDate(today) };
    try { await setDoc(docRef, finalData, { merge: true }); } catch (error) { console.error("Error saving Zikr: ", error); }
  }, [zikrCollectionPath]);


  const appContextValue = {
    userId,
    activeZikr,
    setActiveZikr,
    inputValue,
    setInputValue,
    loadZikrData,
    saveZikr,
    zikrCollectionPath,
    selectZikr
  };

  if (!isAuthReady || !userId || !activeZikr) {
    return null;
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <Tabs tabBar={() => <Navbar />}>
        <Tabs.Screen name="index" options={{ headerShown: false }} />
        <Tabs.Screen name="today" options={{ headerShown: false }} />
        <Tabs.Screen name="stats" options={{ headerShown: false }} />
      </Tabs>
    </AppContext.Provider>
  );
};

export default AppLayout;
