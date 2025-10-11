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

const COL = "problems_quadraticspline";

export async function getQuadraticSplineProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveQuadraticSplineProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "quadratic_spline",
    createdAt: serverTimestamp(),
  });
}

export async function deleteQuadraticSplineProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getQuadraticSplineProblems;
export const save = saveQuadraticSplineProblem;
export const remove = deleteQuadraticSplineProblem;
export const del = deleteQuadraticSplineProblem;
