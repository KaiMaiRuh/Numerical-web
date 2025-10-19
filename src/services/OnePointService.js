// src/services/OnePointService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_onepoint";

export async function getOnePointProblems() {
  return list(COL);
}

export async function saveOnePointProblem(problem) {
  return add(COL, {
    ...problem,
    method: "onepoint",
    createdAt: serverTimestamp(),
  });
}

export async function deleteOnePointProblem(id) {
  return dbRemove(COL, id);
}
