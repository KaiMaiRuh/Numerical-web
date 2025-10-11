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

const COL = "problems_backward_divided";

export async function getBackwardDividedProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveBackwardDividedProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "backward_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteBackwardDividedProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getBackwardDividedProblems;
export const save = saveBackwardDividedProblem;
export const remove = deleteBackwardDividedProblem;
export const del = deleteBackwardDividedProblem;
