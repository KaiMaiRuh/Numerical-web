// src/services/LUDecompositionService.js
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

const COL = "problems_lu";

export async function getLUProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveLUProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "lu",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLUProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases
export const getProblems = getLUProblems;
export const save = saveLUProblem;
export const remove = deleteLUProblem;
export const del = deleteLUProblem;
