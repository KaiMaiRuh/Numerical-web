// src/services/GaussSeidelService.js
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

const COL = "problems_gaussseidel";

export async function getGaussSeidelProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveGaussSeidelProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "gaussseidel",
    createdAt: serverTimestamp(),
  });
}

export async function deleteGaussSeidelProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases
export const getProblems = getGaussSeidelProblems;
export const save = saveGaussSeidelProblem;
export const remove = deleteGaussSeidelProblem;
export const del = deleteGaussSeidelProblem;
