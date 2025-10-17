import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_seconddivided";

export async function getSecondDividedProblems() {
  return list(COL);
}

export async function saveSecondDividedProblem(problem) {
  return add(COL, {
    ...problem,
    method: "second_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSecondDividedProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getSecondDividedProblems;
export const save = saveSecondDividedProblem;
export const remove = deleteSecondDividedProblem;
export const del = deleteSecondDividedProblem;
