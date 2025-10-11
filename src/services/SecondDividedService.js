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

const COL = "problems_second_divided";

export async function getSecondDividedProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveSecondDividedProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "second_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSecondDividedProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getSecondDividedProblems;
export const save = saveSecondDividedProblem;
export const remove = deleteSecondDividedProblem;
export const del = deleteSecondDividedProblem;
