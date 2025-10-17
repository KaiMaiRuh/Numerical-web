import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_nonlinearreg";

export async function getNonlinearRegProblems() {
  return list(COL);
}

export async function saveNonlinearRegProblem(problem) {
  return add(COL, {
    ...problem,
    method: "nonlinear_reg",
    createdAt: serverTimestamp(),
  });
}

export async function deleteNonlinearRegProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getNonlinearRegProblems;
export const save = saveNonlinearRegProblem;
export const remove = deleteNonlinearRegProblem;
export const del = deleteNonlinearRegProblem;
