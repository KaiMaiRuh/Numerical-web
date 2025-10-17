// src/services/LinearSplineService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_linearspline";

export async function getLinearSplineProblems() {
  return list(COL);
}

export async function saveLinearSplineProblem(problem) {
  return add(COL, {
    ...problem,
    method: "linear_spline",
    createdAt: serverTimestamp(),
  });
}

export async function deleteLinearSplineProblem(id) {
  return dbRemove(COL, id);
}

// Generic aliases for useProblems hook compatibility
export const getProblems = getLinearSplineProblems;
export const save = saveLinearSplineProblem;
export const remove = deleteLinearSplineProblem;
export const del = deleteLinearSplineProblem;
