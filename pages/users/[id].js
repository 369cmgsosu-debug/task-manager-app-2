import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskContext } from '../_app';

const statusClassMap = {
  '未着手': 'not-started',
  '進行中': 'in-progress',
  '完了': 'completed'
};

export default function UserPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, updateTaskStatus, deleteTask, isLoaded } = useContext(TaskContext);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setToday(todayStr);
  }, []);

  if (!isLoaded || !id) return <div>読み込み中...</div>;

  const userName = decodeURIComponent(id);
  const userTasks = tasks.filter(t => t.assignee === userName);
  const projectCount = new Set(userTasks.map(t => t.projectName)).size;

  return (
    <div className="container">
      <Link href="/" className="btn btn-secondary no-print" style={{ marginBottom: '20px' }}>
        ← ダッシュボードに戻る
      </Link>
      
      <h1>{userName} のタスク一覧</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p>抱えている案件数: <strong>{projectCount}</strong></p>
        <Link href={`/print/${encodeURIComponent(userName)}`} className="btn">
          印刷用レポートを表示
        </Link>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>案件名</th>
              <th>タスク名</th>
              <th>期限</th>
              <th>状態</th>
              <th className="no-print">操作</th>
            </tr>
          </thead>
          <tbody>
            {userTasks.length === 0 ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>タスクがありません</td></tr> : userTasks.map(task => {
              const isOverdue = task.status !== '完了' && task.dueDate < today;
              return (
                <tr key={task.id} className={isOverdue ? 'overdue-row' : ''}>
                  <td>{task.projectName}</td>
                  <td>{task.taskName}</td>
                  <td>
                    {task.dueDate}
                    {isOverdue && <span className="overdue-text">（遅延）</span>}
                  </td>
                  <td>
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`status-label status-${statusClassMap[task.status]}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      <option value="未着手">未着手</option>
                      <option value="進行中">進行中</option>
                      <option value="完了">完了</option>
                    </select>
                  </td>
                  <td className="no-print">
                    <button onClick={() => deleteTask(task.id)} className="btn btn-danger btn-sm">削除</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
