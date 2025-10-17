// src/services/GaussJordanService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_gaussjordan";

export async function getGaussJordanProblems() {
  return list(COL);
}

export async function saveGaussJordanProblem(problem) {
  return add(COL, {
    ...problem,
    method: "gaussjordan",
    createdAt: serverTimestamp(),
  });
}

export async function deleteGaussJordanProblem(id) {
  return dbRemove(COL, id);
}

// ✅ generic aliases
export const getProblems = getGaussJordanProblems;
export const save = saveGaussJordanProblem;
export const remove = deleteGaussJordanProblem;
export const del = deleteGaussJordanProblem;
