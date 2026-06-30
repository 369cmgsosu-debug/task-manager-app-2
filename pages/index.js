import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "案件A",
      person: "野口祐児",
      deadline: "2026-06-25",
      status: "進行中",
    },
    {
      id: 2,
      name: "案件B",
      person: "森本学",
      deadline: "2026-06-12",
      status: "進行中",
    },
  ]);

  const today = new Date();

  const getDelayDays = (deadline) => {
    const d = new Date(deadline);
    const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const sortedTasks = [...tasks].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>タスク一覧</h1>

      {sortedTasks.map((task) => {
        const delay = getDelayDays(task.deadline);

        return (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              background: delay > 0 ? "#ffe6e6" : "white",
            }}
          >
            <p>案件: {task.name}</p>
            <p>担当: {task.person}</p>
            <p>期限: {task.deadline}</p>
            <p>ステータス: {task.status}</p>

            {delay > 0 && (
              <p style={{ color: "red" }}>
                ⚠ {delay}日遅延
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
