// src/services/MatrixInversionService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_matrixinversion";
const METHOD = "matrix_inversion";

export const get = () => list(COL);
export const save = (p) => add(COL, { ...p, method: METHOD, createdAt: serverTimestamp() });
export const remove = (id) => dbRemove(COL, id);

export const getProblems = get;
export const del = remove;
export { remove as delete };

export default { get, getProblems, save, remove, del, delete: remove };
