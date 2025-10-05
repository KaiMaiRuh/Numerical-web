// นำเข้า SDK หลักของ Firebase
import { initializeApp } from "firebase/app";

// ถ้าใช้ Firestore (Database)
import { getFirestore } from "firebase/firestore";

// 👇 วาง config ของโปรเจกต์เธอ (ที่ Firebase ให้มา)
const firebaseConfig = {
  apiKey: "AIzaSyBUabFVbZsdvJxSNLz9E6uooOHmHAYztMQ",
  authDomain: "numerical-web-fe12a.firebaseapp.com",
  projectId: "numerical-web-fe12a",
  storageBucket: "numerical-web-fe12a.appspot.com",
  messagingSenderId: "450601861029",
  appId: "1:450601861029:web:8ad42bf62f220abb7a324c"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firestore (ฐานข้อมูล)
const db = getFirestore(app);

// 🔥 export ไปใช้ที่อื่น
export { db };
export default app;
