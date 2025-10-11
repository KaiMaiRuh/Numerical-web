// src/services/LinearSplineService.js
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

const COL = "problems_linearspline";

export async function getLinearSplineProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveLinearSplineProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "linearspline",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLinearSplineProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getLinearSplineProblems;
export const save = saveLinearSplineProblem;
export const remove = deleteLinearSplineProblem;
export const del = deleteLinearSplineProblem;
