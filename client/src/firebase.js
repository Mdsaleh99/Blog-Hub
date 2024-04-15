// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-hub-9eb90.firebaseapp.com",
  projectId: "blog-hub-9eb90",
  storageBucket: "blog-hub-9eb90.appspot.com",
  messagingSenderId: "564132499900",
  appId: "1:564132499900:web:03ab74b173e463f0491bb9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);