// src/services/CholeskyService.js
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

const COL = "problems_cholesky";

export async function getCholeskyProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCholeskyProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "cholesky",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCholeskyProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases
export const getProblems = getCholeskyProblems;
export const save = saveCholeskyProblem;
export const remove = deleteCholeskyProblem;
export const del = deleteCholeskyProblem;
