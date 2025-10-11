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

const COL = "problems_forward_divided";

export async function getForwardDividedProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveForwardDividedProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "forward_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteForwardDividedProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getForwardDividedProblems;
export const save = saveForwardDividedProblem;
export const remove = deleteForwardDividedProblem;
export const del = deleteForwardDividedProblem;
