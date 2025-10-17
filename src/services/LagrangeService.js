// src/services/LagrangeService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_lagrange";

export async function getLagrangeProblems() {
  return list(COL);
}

export async function saveLagrangeProblem(problem) {
  return add(COL, {
    ...problem,
    method: "lagrange",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLagrangeProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getLagrangeProblems;
export const save = saveLagrangeProblem;
export const remove = deleteLagrangeProblem;
export const del = deleteLagrangeProblem;
