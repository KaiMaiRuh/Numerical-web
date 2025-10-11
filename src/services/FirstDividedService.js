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

const COL = "problems_first_divided";

export async function getFirstDividedProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveFirstDividedProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "first_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteFirstDividedProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases for useProblems
export const getProblems = getFirstDividedProblems;
export const save = saveFirstDividedProblem;
export const remove = deleteFirstDividedProblem;
export const del = deleteFirstDividedProblem;
