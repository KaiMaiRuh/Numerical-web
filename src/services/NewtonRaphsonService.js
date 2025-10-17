import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_newtonraphson";

export async function getNewtonProblems() {
  return list(COL);
}

export async function saveNewtonProblem(problem) {
  return add(COL, {
    ...problem,
    method: "newton",
    createdAt: serverTimestamp(),
  });
}

export async function deleteNewtonProblem(id) {
  return dbRemove(COL, id);
}

// compatibility aliases for useProblems hook (generic names)
export async function getProblems() {
  return getNewtonProblems();
}

export async function save(problem) {
  return saveNewtonProblem(problem);
}

export async function remove(id) {
  return deleteNewtonProblem(id);
}

// single default export including both specific and generic names
export default {
  getNewtonProblems,
  saveNewtonProblem,
  deleteNewtonProblem,
  getProblems,
  save,
  remove,
};
