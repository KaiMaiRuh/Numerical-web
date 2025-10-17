// src/services/GaussSeidelService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_gaussseidel";

export async function getGaussSeidelProblems() {
  return list(COL);
}

export async function saveGaussSeidelProblem(problem) {
  return add(COL, {
    ...problem,
    method: "gaussseidel",
    createdAt: serverTimestamp(),
  });
}

export async function deleteGaussSeidelProblem(id) {
  return dbRemove(COL, id);
}

// ✅ generic aliases
export const getProblems = getGaussSeidelProblems;
export const save = saveGaussSeidelProblem;
export const remove = deleteGaussSeidelProblem;
export const del = deleteGaussSeidelProblem;
