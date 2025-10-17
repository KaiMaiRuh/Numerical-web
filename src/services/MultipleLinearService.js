import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_multiplelinear";

export async function getMultipleLinearProblems() {
  return list(COL);
}

export async function saveMultipleLinearProblem(problem) {
  return add(COL, {
    ...problem,
    method: "multiple_linear",
    createdAt: serverTimestamp(),
  });
}

export async function deleteMultipleLinearProblem(id) {
  return dbRemove(COL, id);
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getMultipleLinearProblems;
export const save = saveMultipleLinearProblem;
export const remove = deleteMultipleLinearProblem;
export const del = deleteMultipleLinearProblem;
