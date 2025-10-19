// src/services/GraphicalMethodService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_graphical";

export async function get() {
  return list(COL);
}

export async function save(problem) {
  return add(COL, { ...problem, method: "graphical", createdAt: serverTimestamp() });
}

export async function deleteProblem(id) {
  return dbRemove(COL, id);
}

// Aliases
export const getGraphicalProblems = get;
export const saveGraphicalProblem = save;
export const deleteGraphicalProblem = deleteProblem;
