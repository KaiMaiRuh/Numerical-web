// src/services/PolynomialService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_polynomial";

export async function getPolynomialProblems() {
  return list(COL);
}

export async function savePolynomialProblem(problem) {
  return add(COL, {
    ...problem,
    method: "polynomial",
    createdAt: serverTimestamp(),
  });
}

export async function deletePolynomialProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getPolynomialProblems;
export const save = savePolynomialProblem;
export const remove = deletePolynomialProblem;
export const del = deletePolynomialProblem;
