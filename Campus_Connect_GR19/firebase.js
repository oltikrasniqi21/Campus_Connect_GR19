// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:
  authDomain: 
  projectId: 
  storageBucket: 
  messagingSenderId: 
  appId: 
  measurementId:
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app);

const db = getFirestore(app);

export { auth, db };
export default app;