import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_singletrapezoidal";

export async function getSingleTrapezoidalProblems() {
  return list(COL);
}

export async function saveSingleTrapezoidalProblem(problem) {
  return add(COL, {
    ...problem,
    method: "single_trapezoidal",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSingleTrapezoidalProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems
export const getProblems = getSingleTrapezoidalProblems;
export const save = saveSingleTrapezoidalProblem;
export const remove = deleteSingleTrapezoidalProblem;
export const del = deleteSingleTrapezoidalProblem;
