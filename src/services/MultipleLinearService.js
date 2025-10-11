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

const COL = "problems_multiplelinear";

export async function getMultipleLinearProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveMultipleLinearProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "multiple_linear",
    createdAt: serverTimestamp(),
  });
}

export async function deleteMultipleLinearProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getMultipleLinearProblems;
export const save = saveMultipleLinearProblem;
export const remove = deleteMultipleLinearProblem;
export const del = deleteMultipleLinearProblem;
