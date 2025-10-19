// src/services/GraphicalMethodService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_graphical";
const METHOD = "graphical";

export const get = () => list(COL);
export const save = (problem) => add(COL, { ...problem, method: METHOD, createdAt: serverTimestamp() });
export const remove = (id) => dbRemove(COL, id);

export const getProblems = get;
export const del = remove;
export { remove as delete };

export default { get, getProblems, save, remove, del, delete: remove };
