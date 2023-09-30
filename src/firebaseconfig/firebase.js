import { initializeApp } from "firebase/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_Auth_Domain,
  projectId: process.env.REACT_APP_Project_Id,
  storageBucket: process.env.REACT_APP_Storage_Bucket,
  messagingSenderId:process.env.REACT_APP_Messaging_Sender_Id,
  appId: process.env.REACT_APP_App_Id,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default firebase;
