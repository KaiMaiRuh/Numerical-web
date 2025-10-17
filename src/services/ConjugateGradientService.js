// src/services/ConjugateGradientService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_conjugategradient";

export async function getConjugateGradientProblems() {
  return list(COL);
}

export async function saveConjugateGradientProblem(problem) {
  return add(COL, {
    ...problem,
    method: "conjugate_gradient",
    createdAt: serverTimestamp(),
  });
}

export async function deleteConjugateGradientProblem(id) {
  return dbRemove(COL, id);
}

// ✅ generic aliases
export const getProblems = getConjugateGradientProblems;
export const save = saveConjugateGradientProblem;
export const remove = deleteConjugateGradientProblem;
export const del = deleteConjugateGradientProblem;
