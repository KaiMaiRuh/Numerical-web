import React from "react";

export default function SavedProblems({ problems = [], onLoad = () => {}, onDelete = () => {}, removingIds = new Set() }) {
  if (!problems || problems.length === 0) return null;
  return (
    <div className="mt-2">
      <h2 className="text-sm text-gray-400 mb-2">📘 โจทย์ที่บันทึกไว้:</h2>
      <ul className="text-xs text-gray-300 bg-slate-900 rounded p-2 max-h-48 overflow-auto">
        {problems.map((p) => (
          <li key={p.id} className={`flex items-center justify-between gap-2 border-b border-slate-700 py-1 ${removingIds.has(p.id) ? 'fade-out' : ''}`}>
            <span className="truncate">{p.expr}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onLoad(p)} className="text-slate-900 btn-primary px-2 py-0.5 rounded">โหลด</button>
              <button onClick={() => onDelete(p)} className="text-slate-900 btn-danger px-2 py-0.5 rounded glow-btn">ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
