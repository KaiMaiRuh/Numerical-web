import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";

const COL = "problems_newtonraphson";

export async function getNewtonProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveNewtonProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "newton",
    createdAt: serverTimestamp(),
  });
}

export async function deleteNewtonProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// compatibility aliases for useProblems hook (generic names)
export async function getProblems() {
  return getNewtonProblems();
}

export async function save(problem) {
  return saveNewtonProblem(problem);
}

export async function remove(id) {
  return deleteNewtonProblem(id);
}

// single default export including both specific and generic names
export default {
  getNewtonProblems,
  saveNewtonProblem,
  deleteNewtonProblem,
  getProblems,
  save,
  remove,
};
