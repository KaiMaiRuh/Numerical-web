import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_forwarddivided";

export async function getForwardDividedProblems() {
  return list(COL);
}

export async function saveForwardDividedProblem(problem) {
  return add(COL, {
    ...problem,
    method: "forward_divided",
    createdAt: serverTimestamp(),
  });
}

export async function deleteForwardDividedProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getForwardDividedProblems;
export const save = saveForwardDividedProblem;
export const remove = deleteForwardDividedProblem;
export const del = deleteForwardDividedProblem;
