// src/services/DifferentiationService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_differentiation";

// Generic names used by useProblems when present
export async function get() {
  return list(COL);
}

export async function save(problem) {
  return add(COL, {
    ...problem,
    method: "differentiation",
    createdAt: serverTimestamp(),
  });
}

export async function deleteProblem(id) {
  return dbRemove(COL, id);
}

// Also export explicit names if needed elsewhere
export const getDifferentiationProblems = get;
export const saveDifferentiationProblem = save;
export const deleteDifferentiationProblem = deleteProblem;
