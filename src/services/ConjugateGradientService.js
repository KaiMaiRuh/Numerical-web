// src/services/ConjugateGradientService.js
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

const COL = "problems_conjugategradient";

export async function getConjugateGradientProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveConjugateGradientProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "conjugategradient",
    createdAt: serverTimestamp(),
  });
}

export async function deleteConjugateGradientProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases
export const getProblems = getConjugateGradientProblems;
export const save = saveConjugateGradientProblem;
export const remove = deleteConjugateGradientProblem;
export const del = deleteConjugateGradientProblem;
