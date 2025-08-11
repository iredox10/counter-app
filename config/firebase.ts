
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, where, Timestamp, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBuzm6-xNBaEr_3iTK8Xfjv14udE_99LI8",
  authDomain: "tazkia-3db79.firebaseapp.com",
  projectId: "tazkia-3db79",
  storageBucket: "tazkia-3db79.appspot.com",
  messagingSenderId: "773328533371",
  appId: "1:773328533371:web:607613793e0efc950aafde",
  measurementId: "G-7R6PLMR0C3"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const appId = 'default-zikr-app';

export { auth, db, appId, doc, setDoc, onSnapshot, collection, query, where, Timestamp, getDoc, addDoc, updateDoc, deleteDoc };
