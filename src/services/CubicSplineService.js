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

const COL = "problems_cubicspline";

export async function getCubicSplineProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCubicSplineProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "cubic_spline",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCubicSplineProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getCubicSplineProblems;
export const save = saveCubicSplineProblem;
export const remove = deleteCubicSplineProblem;
export const del = deleteCubicSplineProblem;
