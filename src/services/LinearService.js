// src/services/LinearService.js
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

const COL = "problems_linear";

export async function getLinearProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveLinearProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "linear",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLinearProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getLinearProblems;
export const save = saveLinearProblem;
export const remove = deleteLinearProblem;
export const del = deleteLinearProblem;
