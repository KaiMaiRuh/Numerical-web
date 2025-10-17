import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_singlelinear";

export async function getSingleLinearProblems() {
  return list(COL);
}

export async function saveSingleLinearProblem(problem) {
  return add(COL, {
    ...problem,
    method: "single_linear",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSingleLinearProblem(id) {
  return dbRemove(COL, id);
}

// สำหรับใช้กับ useProblems hook
export const getProblems = getSingleLinearProblems;
export const save = saveSingleLinearProblem;
export const remove = deleteSingleLinearProblem;
export const del = deleteSingleLinearProblem;
