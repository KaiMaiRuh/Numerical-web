import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_polynomialreg";

export async function getPolynomialRegProblems() {
  return list(COL);
}

export async function savePolynomialRegProblem(problem) {
  return add(COL, {
    ...problem,
    method: "polynomial_reg",
    createdAt: serverTimestamp(),
  });
}

export async function deletePolynomialRegProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getPolynomialRegProblems;
export const save = savePolynomialRegProblem;
export const remove = deletePolynomialRegProblem;
export const del = deletePolynomialRegProblem;
