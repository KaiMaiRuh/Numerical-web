// src/services/QuadraticService.js
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

const COL = "problems_quadratic";

export async function getQuadraticProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveQuadraticProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "quadratic",
    createdAt: serverTimestamp(),
  });
}

export async function deleteQuadraticProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getQuadraticProblems;
export const save = saveQuadraticProblem;
export const remove = deleteQuadraticProblem;
export const del = deleteQuadraticProblem;
