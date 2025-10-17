import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_composite_trapezoidal";

export async function getCompositeTrapezoidalProblems() {
  return list(COL);
}

export async function saveCompositeTrapezoidalProblem(problem) {
  return add(COL, {
    ...problem,
    method: "composite_trapezoidal",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCompositeTrapezoidalProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getCompositeTrapezoidalProblems;
export const save = saveCompositeTrapezoidalProblem;
export const remove = deleteCompositeTrapezoidalProblem;
export const del = deleteCompositeTrapezoidalProblem;
