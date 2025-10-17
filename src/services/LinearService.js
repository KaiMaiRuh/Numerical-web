// src/services/LinearService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_linear";

export async function getLinearProblems() {
  return list(COL);
}

export async function saveLinearProblem(problem) {
  return add(COL, {
    ...problem,
    method: "linear",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLinearProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getLinearProblems;
export const save = saveLinearProblem;
export const remove = deleteLinearProblem;
export const del = deleteLinearProblem;
