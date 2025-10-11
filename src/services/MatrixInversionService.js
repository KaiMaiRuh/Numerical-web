// src/services/MatrixInversionService.js
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

const COL = "problems_matrixinversion";

export async function getMatrixInversionProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveMatrixInversionProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "matrixinversion",
    createdAt: serverTimestamp(),
  });
}

export async function deleteMatrixInversionProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// ✅ generic aliases for useProblems
export const getProblems = getMatrixInversionProblems;
export const save = saveMatrixInversionProblem;
export const remove = deleteMatrixInversionProblem;
export const del = deleteMatrixInversionProblem;
