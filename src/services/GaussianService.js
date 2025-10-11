// src/services/GaussianService.js
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

const COL = "problems_gaussian";

export async function getGaussianProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveGaussianProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "gaussian",
    createdAt: serverTimestamp(),
  });
}

export async function deleteGaussianProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ Generic aliases for useProblems hook compatibility
export const getProblems = getGaussianProblems;
export const save = saveGaussianProblem;
export const remove = deleteGaussianProblem;
export const del = deleteGaussianProblem;
