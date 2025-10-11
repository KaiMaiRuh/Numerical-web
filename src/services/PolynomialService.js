// src/services/PolynomialService.js
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

const COL = "problems_polynomial";

export async function getPolynomialProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function savePolynomialProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "polynomial",
    createdAt: serverTimestamp(),
  });
}

export async function deletePolynomialProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getPolynomialProblems;
export const save = savePolynomialProblem;
export const remove = deletePolynomialProblem;
export const del = deletePolynomialProblem;
