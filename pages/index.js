import { useContext } from "react";
import { TaskContext } from "./_app";

export default function Home() {
  const { tasks, isLoaded } = useContext(TaskContext);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>タスク一覧</h1>

      {tasks.length === 0 && <p>タスクがありません</p>}

      {tasks.map(task => (
        <div key={task.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>案件: {task.project}</p>
          <p>担当: {task.assignee}</p>
          <p>期限: {task.dueDate}</p>
          <p>ステータス: {task.status}</p>
        </div>
      ))}
    </div>
  );
}
