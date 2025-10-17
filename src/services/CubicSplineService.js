import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_cubicspline";

export async function getCubicSplineProblems() {
  return list(COL);
}

export async function saveCubicSplineProblem(problem) {
  return add(COL, {
    ...problem,
    method: "cubic_spline",
    createdAt: serverTimestamp(),
  });
}

export async function deleteCubicSplineProblem(id) {
  return dbRemove(COL, id);
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getCubicSplineProblems;
export const save = saveCubicSplineProblem;
export const remove = deleteCubicSplineProblem;
export const del = deleteCubicSplineProblem;
