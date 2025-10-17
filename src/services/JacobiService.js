// src/services/JacobiService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_jacobi";

export async function getJacobiProblems() {
  return list(COL);
}

export async function saveJacobiProblem(problem) {
  return add(COL, {
    ...problem,
    method: "jacobi",
    createdAt: serverTimestamp(),
  });
}

export async function deleteJacobiProblem(id) {
  return dbRemove(COL, id);
}

// ✅ generic aliases
export const getProblems = getJacobiProblems;
export const save = saveJacobiProblem;
export const remove = deleteJacobiProblem;
export const del = deleteJacobiProblem;
