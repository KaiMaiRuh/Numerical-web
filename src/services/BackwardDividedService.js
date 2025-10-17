import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_backwarddivided";

export async function getBackwardDividedProblems() {
  return list(COL);
}

export async function saveBackwardDividedProblem(problem) {
  return add(COL, {
    ...problem,
    method: "backward_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteBackwardDividedProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getBackwardDividedProblems;
export const save = saveBackwardDividedProblem;
export const remove = deleteBackwardDividedProblem;
export const del = deleteBackwardDividedProblem;
