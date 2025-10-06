// src/services/FalsePositionService.js
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

const COL = "problems_falseposition";

// ดึงโจทย์ทั้งหมด (ใหม่สุดก่อน)
export async function getFalsePositionProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// บันทึกโจทย์ใหม่
export async function saveFalsePositionProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "falseposition",
    createdAt: serverTimestamp(),
  });
}

// ลบโจทย์ตาม id
export async function deleteFalsePositionProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

export default {
  getFalsePositionProblems,
  saveFalsePositionProblem,
  deleteFalsePositionProblem,
};
