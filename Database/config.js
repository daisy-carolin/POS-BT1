import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpAX3quNzJbYb5uIr3_2-BKqOKS7gkpaA",
  authDomain: "rwanda-air.firebaseapp.com",
  projectId: "rwanda-air",
  storageBucket: "rwanda-air.appspot.com",
  messagingSenderId: "833250541422",
  appId: "1:833250541422:web:b1818dc5422aeae350cb7f",
  measurementId: "G-QM91ELCZ5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseApp = app;

const db = getFirestore(app);

export { db};
