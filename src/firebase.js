
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBln8qPTKUTITJ62eci0CNvnvxFFVVxQ7Y",
  authDomain: "study-planner-2dc84.firebaseapp.com",
  projectId: "study-planner-2dc84",
  storageBucket: "study-planner-2dc84.firebasestorage.app",
  messagingSenderId: "89272878942",
  appId: "1:89272878942:web:432c68925c1337855671cf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export default app;
