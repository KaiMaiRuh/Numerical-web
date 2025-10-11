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

const COL = "problems_simpson";

export async function getSimpsonProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveSimpsonProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "simpson",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSimpsonProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems hook
export const getProblems = getSimpsonProblems;
export const save = saveSimpsonProblem;
export const remove = deleteSimpsonProblem;
export const del = deleteSimpsonProblem;
