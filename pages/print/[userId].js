import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../_app';

export default function PrintPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { tasks, isLoaded } = useContext(TaskContext);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setToday(todayStr);
  }, []);

  if (!isLoaded || !userId) return <div>読み込み中...</div>;

  const userName = decodeURIComponent(userId);
  const userTasks = tasks.filter(t => t.assignee === userName);

  return (
    <div className="container">
      <div className="no-print" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => window.print()} className="btn">
          印刷実行
        </button>
        <button onClick={() => router.back()} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
          戻る
        </button>
      </div>

      <h1 style={{ textAlign: 'center' }}>個人別タスクレポート</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <span><strong>担当者:</strong> {userName}</span>
        <span><strong>作成日:</strong> {today}</span>
      </div>

      <table style={{ border: '1px solid #333' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ border: '1px solid #333' }}>案件名</th>
            <th style={{ border: '1px solid #333' }}>タスク名</th>
            <th style={{ border: '1px solid #333' }}>期限</th>
            <th style={{ border: '1px solid #333' }}>状態</th>
          </tr>
        </thead>
        <tbody>
          {userTasks.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', border: '1px solid #333' }}>タスクがありません</td></tr> : userTasks.map(task => {
            const isOverdue = task.status !== '完了' && task.dueDate < today;
            return (
              <tr key={task.id}>
                <td style={{ border: '1px solid #333' }}>{task.projectName}</td>
                <td style={{ border: '1px solid #333' }}>{task.taskName}</td>
                <td style={{ border: '1px solid #333' }}>
                  {task.dueDate}
                  {isOverdue && <span style={{ color: 'red' }}>（遅延）</span>}
                </td>
                <td style={{ border: '1px solid #333' }}>{isOverdue ? '遅延' : task.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div style={{ marginTop: '30px', textAlign: 'right', fontSize: '0.8em' }}>
        現場是正・タスク管理システム
      </div>
    </div>
  );
}
