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

const COL = "problems_singlelinear";

export async function getSingleLinearProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveSingleLinearProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "single_linear",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSingleLinearProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getSingleLinearProblems;
export const save = saveSingleLinearProblem;
export const remove = deleteSingleLinearProblem;
export const del = deleteSingleLinearProblem;
