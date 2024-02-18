// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-yada.firebaseapp.com",
  projectId: "mern-estate-yada",
  storageBucket: "mern-estate-yada.appspot.com",
  messagingSenderId: "964700999979",
  appId: "1:964700999979:web:f197adffcf3879089f356e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
