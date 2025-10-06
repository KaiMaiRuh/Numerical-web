import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";

const COL = "problems_secant";

export async function getSecantProblems() {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function saveSecantProblem(problem) {
  return addDoc(collection(db, COL), {
    ...problem,
    method: "secant",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSecantProblem(id) {
  return deleteDoc(doc(db, COL, id));
}

// compatibility aliases
export async function getProblems() {
  return getSecantProblems();
}

export async function save(problem) {
  return saveSecantProblem(problem);
}

export async function remove(id) {
  return deleteSecantProblem(id);
}

export default {
  getSecantProblems,
  saveSecantProblem,
  deleteSecantProblem,
  getProblems,
  save,
  remove,
};
