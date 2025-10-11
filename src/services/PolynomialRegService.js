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

const COL = "problems_polynomialreg";

export async function getPolynomialRegProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function savePolynomialRegProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "polynomialreg",
    createdAt: serverTimestamp(),
  });
}

export async function deletePolynomialRegProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// Generic aliases
export const getProblems = getPolynomialRegProblems;
export const save = savePolynomialRegProblem;
export const remove = deletePolynomialRegProblem;
export const del = deletePolynomialRegProblem;
