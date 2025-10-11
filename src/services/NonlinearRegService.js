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

const COL = "problems_nonlinearreg";

export async function getNonlinearRegProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveNonlinearRegProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "nonlinearreg",
    createdAt: serverTimestamp(),
  });
}

export async function deleteNonlinearRegProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getNonlinearRegProblems;
export const save = saveNonlinearRegProblem;
export const remove = deleteNonlinearRegProblem;
export const del = deleteNonlinearRegProblem;
