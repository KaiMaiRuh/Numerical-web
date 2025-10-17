// src/services/CramerService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_cramer";

export async function getCramerProblems() {
  return list(COL);
}

export async function saveCramerProblem(problem) {
  return add(COL, {
    ...problem,
    method: "cramer",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCramerProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getCramerProblems;
export const save = saveCramerProblem;
export const remove = deleteCramerProblem;
export const del = deleteCramerProblem;
