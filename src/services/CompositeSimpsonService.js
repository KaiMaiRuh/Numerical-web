import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_composite_simpson";

export async function getCompositeSimpsonProblems() {
  return list(COL);
}

export async function saveCompositeSimpsonProblem(problem) {
  return add(COL, {
    ...problem,
    method: "composite_simpson",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCompositeSimpsonProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getCompositeSimpsonProblems;
export const save = saveCompositeSimpsonProblem;
export const remove = deleteCompositeSimpsonProblem;
export const del = deleteCompositeSimpsonProblem;
