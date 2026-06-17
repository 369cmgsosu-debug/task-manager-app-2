import '../styles/globals.css'
import { createContext, useState, useEffect, useContext } from 'react';

export const TaskContext = createContext();

const INITIAL_ASSIGNEES = [
  "森本学", "宮田大資", "牧俊栄", "野口祐児", "市毛潤", "菊地惠介", "白川大志"
];

function MyApp({ Component, pageProps }) {
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState(INITIAL_ASSIGNEES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedAssignees = localStorage.getItem('assignees');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedAssignees) setAssignees(JSON.parse(savedAssignees));
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('assignees', JSON.stringify(assignees));
    }
  }, [tasks, assignees, isLoaded]);

  const addTask = (task) => {
    setTasks(prev => [{ ...task, id: Date.now() }, ...prev]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id) => {
    if (window.confirm("このタスクを削除しますか？")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const addAssignee = (name) => {
    if (name && !assignees.includes(name)) {
      setAssignees(prev => [...prev, name]);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, assignees, addTask, updateTaskStatus, deleteTask, addAssignee, isLoaded }}>
      <Component {...pageProps} />
    </TaskContext.Provider>
  );
}

export default MyApp;
