// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChZpK9iYx26IAlfASqc6ZDzmwMKz1I62c",
  authDomain: "chatapp-9a575.firebaseapp.com",
  projectId: "chatapp-9a575",
  storageBucket: "chatapp-9a575.appspot.com",
  messagingSenderId: "814947607164",
  appId: "1:814947607164:web:96de5724866d3a03965ff9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore();