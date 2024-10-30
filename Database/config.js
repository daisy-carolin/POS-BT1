
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACH7NSF35pVN9JWbH9AlEZJX2cz-NCI7Y",
  authDomain: "pos-bt.firebaseapp.com",
  projectId: "pos-bt",
  storageBucket: "pos-bt.appspot.com",
  messagingSenderId: "475555559683",
  appId: "1:475555559683:web:220dc5e05315b167cd9136",
  measurementId: "G-SKXQQZW5SK"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  export{db,auth};