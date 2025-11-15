// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0YCZXzpkjrE1zEATmz4KLW0o0_Gf-anM",
  authDomain: "campus-connect-gr19.firebaseapp.com",
  projectId: "campus-connect-gr19",
  storageBucket: "campus-connect-gr19.firebasestorage.app",
  messagingSenderId: "794887817202",
  appId: "1:794887817202:web:0d06f8cf3bae7591738d6b"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;