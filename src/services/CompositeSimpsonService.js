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

const COL = "problems_composite_simpson";

export async function getCompositeSimpsonProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCompositeSimpsonProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "composite_simpson",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCompositeSimpsonProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getCompositeSimpsonProblems;
export const save = saveCompositeSimpsonProblem;
export const remove = deleteCompositeSimpsonProblem;
export const del = deleteCompositeSimpsonProblem;
