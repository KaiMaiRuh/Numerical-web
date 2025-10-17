// src/services/BisectionService.js
import { list, add, remove as dbRemove, serverTimestamp } from "./LocalDb";

const COL = "problems_bisection";

// ดึงโจทย์ทั้งหมด (ใหม่สุดก่อน)
export async function getBisectionProblems() {
  return list(COL);
}

// บันทึกโจทย์ใหม่
export async function saveBisectionProblem(problem) {
  return add(COL, {
    ...problem,
    method: "bisection",
    createdAt: serverTimestamp(),
  });
}

// ลบโจทย์ตาม id
export async function deleteBisectionProblem(id) {
  return dbRemove(COL, id);
}
