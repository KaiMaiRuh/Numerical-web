
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUabFVbZsdvJxSNLz9E6uooOHmHAYztMQ",
  authDomain: "numerical-web-fe12a.firebaseapp.com",
  projectId: "numerical-web-fe12a",
  storageBucket: "numerical-web-fe12a.appspot.com",
  messagingSenderId: "450601861029",
  appId: "1:450601861029:web:8ad42bf62f220abb7a324c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
export default app;
