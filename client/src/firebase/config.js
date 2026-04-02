import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCikgtq9b5zLrc1R_yTb5i0feXTmcU0fMc",
  authDomain: "savemore-8b7b9.firebaseapp.com",
  projectId: "savemore-8b7b9",
  storageBucket: "savemore-8b7b9.firebasestorage.app",
  messagingSenderId: "965397710264",
  appId: "1:965397710264:web:62e0e9637dc18de08efb4d",
  measurementId: "G-QTZDGSFFVM"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
