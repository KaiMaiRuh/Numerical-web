// src/services/LagrangeService.js
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

const COL = "problems_lagrange";

export async function getLagrangeProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveLagrangeProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "lagrange",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLagrangeProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getLagrangeProblems;
export const save = saveLagrangeProblem;
export const remove = deleteLagrangeProblem;
export const del = deleteLagrangeProblem;
