// src/services/GaussianService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_gaussian";

export async function getGaussianProblems() {
  return list(COL);
}

export async function saveGaussianProblem(problem) {
  return add(COL, {
    ...problem,
    method: "gaussian",
    createdAt: serverTimestamp(),
  });
}

export async function deleteGaussianProblem(id) {
  return dbRemove(COL, id);
}

// ✅ Generic aliases for useProblems hook compatibility
export const getProblems = getGaussianProblems;
export const save = saveGaussianProblem;
export const remove = deleteGaussianProblem;
export const del = deleteGaussianProblem;
