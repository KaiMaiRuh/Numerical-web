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

const COL = "problems_taylor";

export async function getTaylorProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveTaylorProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "taylor",
    createdAt: serverTimestamp(),
  });
}

export async function deleteTaylorProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getTaylorProblems;
export const save = saveTaylorProblem;
export const remove = deleteTaylorProblem;
export const del = deleteTaylorProblem;
