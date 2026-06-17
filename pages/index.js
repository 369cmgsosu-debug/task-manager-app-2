import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { TaskContext } from './_app';

const statusClassMap = {
  '未着手': 'not-started',
  '進行中': 'in-progress',
  '完了': 'completed'
};

export default function Home() {
  const { tasks, assignees, addTask, updateTaskStatus, deleteTask, addAssignee, isLoaded } = useContext(TaskContext);
  const [newAssignee, setNewAssignee] = useState("");
  const [today, setToday] = useState("");
  
  const [formData, setFormData] = useState({
    projectName: "",
    taskName: "",
    assignee: "",
    dueDate: "",
    status: "未着手"
  });

  useEffect(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setToday(todayStr);
  }, []);

  useEffect(() => {
    if (assignees.length > 0 && !formData.assignee) {
      setFormData(prev => ({ ...prev, assignee: assignees[0] }));
    }
  }, [assignees, formData.assignee]);

  if (!isLoaded) return <div>読み込み中...</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAssignee = () => {
    if (newAssignee) {
      addAssignee(newAssignee);
      setFormData(prev => ({ ...prev, assignee: newAssignee }));
      setNewAssignee("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectName || !formData.taskName || !formData.dueDate) {
      alert("必須項目を入力してください");
      return;
    }
    addTask(formData);
    setFormData(prev => ({ ...prev, projectName: "", taskName: "", dueDate: "" }));
  };

  // Dashboard logic
  const userStats = assignees.map(name => {
    const userTasks = tasks.filter(t => t.assignee === name);
    const total = userTasks.length;
    if (total === 0) return null;
    const completed = userTasks.filter(t => t.status === '完了').length;
    const overdue = userTasks.filter(t => t.status !== '完了' && t.dueDate < today).length;
    const rate = Math.round((completed / total) * 100);
    return { name, total, completed, overdue, rate };
  }).filter(Boolean);

  return (
    <div className="container">
      <h1>現場是正・タスク管理ダッシュボード</h1>

      {/* Dashboard Section */}
      <section className="no-print">
        <h2>担当者別状況</h2>
        <div className="dashboard-grid">
          {userStats.length === 0 ? <p>データがありません</p> : userStats.map(stat => (
            <div key={stat.name} className="user-card">
              <h3>{stat.name}</h3>
              <div className="stat-row">
                <span>タスク数:</span>
                <span className="stat-value">{stat.total}</span>
              </div>
              <div className="stat-row">
                <span>完了率:</span>
                <span className="stat-value">{stat.rate}%</span>
              </div>
              <div className="stat-row">
                <span>遅延数:</span>
                <span className={`stat-value ${stat.overdue > 0 ? 'overdue-text' : ''}`}>{stat.overdue}</span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Link href={`/users/${encodeURIComponent(stat.name)}`} className="btn btn-sm" style={{ width: '100%' }}>
                  詳細を表示
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="no-print" />

      {/* Creation Form */}
      <section className="form-section no-print">
        <h2>新規タスク作成</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>案件名</label>
              <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>タスク名</label>
              <input type="text" name="taskName" value={formData.taskName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>担当者</label>
              <select name="assignee" value={formData.assignee} onChange={handleInputChange}>
                {assignees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <div className="inline-group">
                <input type="text" value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} placeholder="新規追加" />
                <button type="button" onClick={handleAddAssignee} className="btn btn-secondary btn-sm">追加</button>
              </div>
            </div>
            <div className="form-group">
              <label>期限</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>状態</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="未着手">未着手</option>
                <option value="進行中">進行中</option>
                <option value="完了">完了</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn" style={{ marginTop: '15px', width: '100%' }}>タスクを追加</button>
        </form>
      </section>

      {/* Global Task List */}
      <section>
        <h2>全タスク一覧</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>案件名</th>
                <th>タスク名</th>
                <th>担当者</th>
                <th>期限</th>
                <th>状態</th>
                <th className="no-print">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center' }}>タスクがありません</td></tr> : tasks.map(task => {
                const isOverdue = task.status !== '完了' && task.dueDate < today;
                return (
                  <tr key={task.id} className={isOverdue ? 'overdue-row' : ''}>
                    <td>{task.projectName}</td>
                    <td>{task.taskName}</td>
                    <td>{task.assignee}</td>
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
      </section>
    </div>
  );
}
