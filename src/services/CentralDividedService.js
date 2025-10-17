import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_centraldivided";

export async function getCentralDividedProblems() {
  return list(COL);
}

export async function saveCentralDividedProblem(problem) {
  return add(COL, {
    ...problem,
    method: "central_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCentralDividedProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getCentralDividedProblems;
export const save = saveCentralDividedProblem;
export const remove = deleteCentralDividedProblem;
export const del = deleteCentralDividedProblem;
