import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_firstdivided";

export async function getFirstDividedProblems() {
  return list(COL);
}

export async function saveFirstDividedProblem(problem) {
  return add(COL, {
    ...problem,
    method: "first_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteFirstDividedProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems
export const getProblems = getFirstDividedProblems;
export const save = saveFirstDividedProblem;
export const remove = deleteFirstDividedProblem;
export const del = deleteFirstDividedProblem;
