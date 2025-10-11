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

const COL = "problems_composite_trapezoidal";

export async function getCompositeTrapezoidalProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCompositeTrapezoidalProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "composite_trapezoidal",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCompositeTrapezoidalProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getCompositeTrapezoidalProblems;
export const save = saveCompositeTrapezoidalProblem;
export const remove = deleteCompositeTrapezoidalProblem;
export const del = deleteCompositeTrapezoidalProblem;
