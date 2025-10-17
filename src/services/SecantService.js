import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_secant";

export async function getSecantProblems() {
  return list(COL);
}

export async function saveSecantProblem(problem) {
  return add(COL, {
    ...problem,
    method: "secant",
    createdAt: serverTimestamp(),
  });
}

export async function deleteSecantProblem(id) {
  return dbRemove(COL, id);
}

// compatibility aliases
export async function getProblems() {
  return getSecantProblems();
}

export async function save(problem) {
  return saveSecantProblem(problem);
}

export async function remove(id) {
  return deleteSecantProblem(id);
}

export default {
  getSecantProblems,
  saveSecantProblem,
  deleteSecantProblem,
  getProblems,
  save,
  remove,
};
