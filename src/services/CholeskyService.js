// src/services/CholeskyService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_cholesky";

export async function getCholeskyProblems() {
  return list(COL);
}

export async function saveCholeskyProblem(problem) {
  return add(COL, {
    ...problem,
    method: "cholesky",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCholeskyProblem(id) {
  return dbRemove(COL, id);
}

// ✅ generic aliases
export const getProblems = getCholeskyProblems;
export const save = saveCholeskyProblem;
export const remove = deleteCholeskyProblem;
export const del = deleteCholeskyProblem;
