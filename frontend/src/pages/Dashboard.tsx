import { Edit, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Task, TaskListResponse } from '../api/client';
import { taskApi } from '../api/tasks';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskListResponse | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const result = await taskApi.list({ page, limit: 8, search, status, priority });
      setTasks(result);
    } catch {
      toast.error('Could not load your tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [page, status, priority]);

  const handleSearch = () => {
    setPage(1);
    loadTasks();
  };

  const handleDelete = async (task: Task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await taskApi.delete(task._id);
      toast.success('Task removed');
      loadTasks();
    } catch {
      toast.error('Could not remove the task');
    }
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">{user?.role === 'admin' ? 'Admin view' : 'My tasks'}</p>
          <h1>Dashboard</h1>
        </div>
        <div className="stats">
          <strong>{tasks?.meta.total ?? 0}</strong>
          <span>Total tasks</span>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" onKeyDown={(event) => event.key === 'Enter' && handleSearch()} />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="button" onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <div className="empty-state">Loading your task list...</div>
      ) : tasks && tasks.items.length > 0 ? (
        <div className="task-grid">
          {tasks.items.map((task) => (
            <article className="task-card" key={task._id}>
              <div className="task-card-header">
                <span className={`badge ${task.priority}`}>{task.priority}</span>
                <span className="badge neutral">{task.status}</span>
              </div>
              <h2>{task.title}</h2>
              <p>{task.description || 'No description added.'}</p>
              <div className="task-meta">
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                <div className="row-actions">
                  <Link className="icon-button" to={`/tasks/${task._id}/edit`} title="Edit" aria-label="Edit task">
                    <Edit size={17} />
                  </Link>
                  <button className="icon-button danger" onClick={() => handleDelete(task)} title="Delete" aria-label="Delete task">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>No tasks to show</strong>
          <span>Add a task or adjust the filters.</span>
        </div>
      )}

      <div className="pagination">
        <button className="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
          Previous
        </button>
        <span>Page {tasks?.meta.page ?? page} of {tasks?.meta.totalPages || 1}</span>
        <button className="button" disabled={!tasks || page >= tasks.meta.totalPages} onClick={() => setPage((current) => current + 1)}>
          Next
        </button>
      </div>
    </section>
  );
};
