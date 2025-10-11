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

const COL = "problems_single_trapezoidal";

export async function getSingleTrapezoidalProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveSingleTrapezoidalProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "single_trapezoidal",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSingleTrapezoidalProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems
export const getProblems = getSingleTrapezoidalProblems;
export const save = saveSingleTrapezoidalProblem;
export const remove = deleteSingleTrapezoidalProblem;
export const del = deleteSingleTrapezoidalProblem;
