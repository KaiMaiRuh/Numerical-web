// src/Home.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [topics, setTopics] = useState([
    { id: 1, name: "Bisection Method", path: "/bisection" },
    { id: 2, name: "Newton-Raphson", path: "/newton" },
  ]);

  const [newTopic, setNewTopic] = useState("");

  const addTopic = () => {
    if (!newTopic.trim()) return;
    const id = Date.now();
    setTopics([...topics, { id, name: newTopic, path: `/custom-${id}` }]);
    setNewTopic("");
  };

  const removeTopic = (id) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-cyan-400 mb-4">
        Numerical Methods
      </h1>
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg mb-3">เลือกหัวข้อ</h2>
        <ul className="space-y-2">
          {topics.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-slate-700 p-3 rounded-md"
            >
              <Link
                to={t.path}
                className="hover:text-cyan-300 transition-colors"
              >
                {t.name}
              </Link>
              <button
                onClick={() => removeTopic(t.id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                ลบ
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          <input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="เพิ่มหัวข้อใหม่..."
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-md"
          />
          <button
            onClick={addTopic}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-md font-semibold"
          >
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
