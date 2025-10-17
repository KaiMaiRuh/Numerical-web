// src/services/FalsePositionService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_falseposition";

// ดึงโจทย์ทั้งหมด (ใหม่สุดก่อน)
export async function getFalsePositionProblems() {
  return list(COL);
}

// บันทึกโจทย์ใหม่
export async function saveFalsePositionProblem(problem) {
  return add(COL, {
    ...problem,
    method: "falseposition",
    createdAt: serverTimestamp(),
  });
}

// ลบโจทย์ตาม id
export async function deleteFalsePositionProblem(id) {
  return dbRemove(COL, id);
}

export default {
  getFalsePositionProblems,
  saveFalsePositionProblem,
  deleteFalsePositionProblem,
};
