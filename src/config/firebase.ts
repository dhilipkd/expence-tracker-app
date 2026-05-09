import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCEMvgJ_UsktVrr5I3mdgEyGCWEwUTit_s",
    authDomain: "expense-tracker-app-7f62c.firebaseapp.com",
    projectId: "expense-tracker-app-7f62c",
    storageBucket: "expense-tracker-app-7f62c.firebasestorage.app",
    messagingSenderId: "84546578895",
    appId: "1:84546578895:web:79f796a99ed7c60b028aba",
    measurementId: "G-KK59WZ6F08"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);