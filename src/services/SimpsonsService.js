import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_simpsons";

export async function getSimpsonsProblems() {
  return list(COL);
}

export async function saveSimpsonsProblem(problem) {
  return add(COL, {
    ...problem,
    method: "simpsons",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSimpsonsProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook
export const getProblems = getSimpsonsProblems;
export const save = saveSimpsonsProblem;
export const remove = deleteSimpsonsProblem;
export const del = deleteSimpsonsProblem;
