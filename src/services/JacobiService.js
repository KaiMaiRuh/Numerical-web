// src/services/JacobiService.js
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

const COL = "problems_jacobi";

export async function getJacobiProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveJacobiProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "jacobi",
    createdAt: serverTimestamp(),
  });
}

export async function deleteJacobiProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases
export const getProblems = getJacobiProblems;
export const save = saveJacobiProblem;
export const remove = deleteJacobiProblem;
export const del = deleteJacobiProblem;
