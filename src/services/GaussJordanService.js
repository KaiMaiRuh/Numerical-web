// src/services/GaussJordanService.js
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

const COL = "problems_gaussjordan";

export async function getGaussJordanProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveGaussJordanProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "gaussjordan",
    createdAt: serverTimestamp(),
  });
}

export async function deleteGaussJordanProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases
export const getProblems = getGaussJordanProblems;
export const save = saveGaussJordanProblem;
export const remove = deleteGaussJordanProblem;
export const del = deleteGaussJordanProblem;
