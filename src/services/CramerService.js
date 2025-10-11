// src/services/CramerService.js
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

const COL = "problems_cramer";

export async function getCramerProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCramerProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "cramer",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCramerProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getCramerProblems;
export const save = saveCramerProblem;
export const remove = deleteCramerProblem;
export const del = deleteCramerProblem;
