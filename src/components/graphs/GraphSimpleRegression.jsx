import React from "react";

export default function GraphSimpleRegression({ xs = [], ys = [], fitFunc = null, className = "", width = 800, height = 320 }) {
  return (
    <div className={className} style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#94a3b8" }}>
      <div>Simple Regression Graph (placeholder)</div>
    </div>
  );
}
