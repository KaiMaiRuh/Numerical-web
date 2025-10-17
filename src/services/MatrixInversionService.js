// src/services/MatrixInversionService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_matrixinversion";

export async function getMatrixInversionProblems() {
  return list(COL);
}

export async function saveMatrixInversionProblem(problem) {
  return add(COL, {
    ...problem,
    method: "matrix_inversion",
    createdAt: serverTimestamp(),
  });
}

export async function deleteMatrixInversionProblem(id) {
  return dbRemove(COL, id);
}

// ✅ generic aliases for useProblems
export const getProblems = getMatrixInversionProblems;
export const save = saveMatrixInversionProblem;
export const remove = deleteMatrixInversionProblem;
export const del = deleteMatrixInversionProblem;
