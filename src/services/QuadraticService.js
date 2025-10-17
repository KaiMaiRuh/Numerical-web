// src/services/QuadraticService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_quadratic";

export async function getQuadraticProblems() {
  return list(COL);
}

export async function saveQuadraticProblem(problem) {
  return add(COL, {
    ...problem,
    method: "quadratic",
    createdAt: serverTimestamp(),
  });
}

export async function deleteQuadraticProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getQuadraticProblems;
export const save = saveQuadraticProblem;
export const remove = deleteQuadraticProblem;
export const del = deleteQuadraticProblem;
