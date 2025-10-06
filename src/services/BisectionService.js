// src/services/BisectionService.js
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const COL = "problems_bisection";

// ดึงโจทย์ทั้งหมด (ใหม่สุดก่อน)
export async function getBisectionProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// บันทึกโจทย์ใหม่
export async function saveBisectionProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "bisection",
    createdAt: serverTimestamp(),
  });
}

// ลบโจทย์ตาม id
export async function deleteBisectionProblem(id) {
  return deleteDoc(doc(db, COL, id));
}
