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

const COL = "problems_central_divided";

export async function getCentralDividedProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCentralDividedProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "central_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCentralDividedProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getCentralDividedProblems;
export const save = saveCentralDividedProblem;
export const remove = deleteCentralDividedProblem;
export const del = deleteCentralDividedProblem;
