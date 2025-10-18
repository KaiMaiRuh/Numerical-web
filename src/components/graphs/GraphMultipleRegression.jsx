import React from "react";

export default function GraphMultipleRegression({ data = [], model = null, className = "", width = 800, height = 320 }) {
  return (
    <div className={className} style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#94a3b8" }}>
      <div>Multiple Regression Graph (placeholder)</div>
    </div>
  );
}
