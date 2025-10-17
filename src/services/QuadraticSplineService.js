import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_quadraticspline";

export async function getQuadraticSplineProblems() {
  return list(COL);
}

export async function saveQuadraticSplineProblem(problem) {
  return add(COL, {
    ...problem,
    method: "quadratic_spline",
    createdAt: serverTimestamp(),
  });
}

export async function deleteQuadraticSplineProblem(id) {
  return dbRemove(COL, id);
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getQuadraticSplineProblems;
export const save = saveQuadraticSplineProblem;
export const remove = deleteQuadraticSplineProblem;
export const del = deleteQuadraticSplineProblem;
