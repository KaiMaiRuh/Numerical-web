// src/services/LUDecompositionService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_lu";

export async function getLUProblems() {
  return list(COL);
}

export async function saveLUProblem(problem) {
  return add(COL, {
    ...problem,
    method: "lu",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLUProblem(id) {
  return dbRemove(COL, id);

}
// ✅ generic aliases
export const getProblems = getLUProblems;
export const save = saveLUProblem;
export const remove = deleteLUProblem;
export const del = deleteLUProblem;
