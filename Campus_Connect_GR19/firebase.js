// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


const db = getFirestore(app);

export { auth, db };
export default app;

