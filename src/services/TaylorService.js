import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_taylor";

export async function getTaylorProblems() {
  return list(COL);
}

export async function saveTaylorProblem(problem) {
  return add(COL, {
    ...problem,
    method: "taylor",
    createdAt: serverTimestamp(),
  });
}

export async function deleteTaylorProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases
export const getProblems = getTaylorProblems;
export const save = saveTaylorProblem;
export const remove = deleteTaylorProblem;
export const del = deleteTaylorProblem;
