import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckSquare, Plus, X, MessageSquare, Clock, User, ChevronDown } from 'lucide-react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'];

const STATUS_LABELS = {
  PENDING: 'To Do',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  COMPLETED: 'Completed',
};

const STATUS_COLORS = {
  PENDING: '#a78bfa',
  TODO: '#a78bfa',
  IN_PROGRESS: '#60a5fa',
  IN_REVIEW: '#fb923c',
  COMPLETED: '#34d399',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [tasksRes, projectsRes, usersRes, meRes] = await Promise.all([
        axios.get('/api/tasks', { headers }),
        axios.get('/api/projects', { headers }),
        axios.get('/api/users', { headers }),
        axios.get('/api/auth/me', { headers }),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      setUser(meRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', form, { headers });
      setTasks([res.data, ...tasks]);
      setShowModal(false);
      setForm({ title: '', description: '', projectId: '', assigneeId: '', dueDate: '' });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}/status`, { status: newStatus }, { headers });
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
      if (selectedTask?.id === taskId) setSelectedTask(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Not authorized to update this task');
    }
  };

  const handleAddComment = async (taskId) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/api/tasks/${taskId}/comments`, { content: newComment }, { headers });
      const updatedTask = {
        ...selectedTask,
        comments: [...(selectedTask.comments || []), res.data],
      };
      setSelectedTask(updatedTask);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      setNewComment('');
    } catch (err) {
      alert(err.response?.data?.error || 'Not authorized to comment on this task');
    }
  };

  const canInteract = (task) => user?.role === 'ADMIN' || task.assignee?.id === user?.id;

  const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1><CheckSquare size={28} /> Task Board</h1>
          <p>Track and manage your team's work across all stages.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STATUSES.map(status => (
          <div key={status} className="kanban-column glass-panel">
            <div className="kanban-col-header" style={{ borderColor: STATUS_COLORS[status] }}>
              <span className="col-dot" style={{ background: STATUS_COLORS[status] }} />
              <h3>{STATUS_LABELS[status]}</h3>
              <span className="col-count">{tasks.filter(t => t.status === status).length}</span>
            </div>
            <div className="kanban-cards">
              {tasks.filter(t => t.status === status || (status === 'TODO' && t.status === 'PENDING')).map(task => (
                <div
                  key={task.id}
                  className={`task-card ${isOverdue(task) ? 'overdue-card' : ''}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="task-card-top">
                    <span className="task-project-badge">{task.project?.name}</span>
                    {isOverdue(task) && <span className="overdue-pill">Overdue</span>}
                  </div>
                  <h4 className="task-card-title">{task.title}</h4>
                  {task.description && <p className="task-card-desc">{task.description}</p>}
                  <div className="task-card-footer">
                    <span className="task-assignee">
                      <User size={12} /> {task.assignee?.name || 'Unassigned'}
                    </span>
                    <div className="task-meta-right">
                      {task.dueDate && (
                        <span className="task-due">
                          <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="task-comments-count">
                        <MessageSquare size={12} /> {task.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                  {canInteract(task) && (
                    <div className="task-status-select-wrapper" onClick={e => e.stopPropagation()}>
                      <select
                        className="status-select"
                        value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} className="select-chevron" />
                    </div>
                  )}
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="empty-column">No tasks here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="task-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-project-badge">{selectedTask.project?.name}</span>
                <h2>{selectedTask.title}</h2>
              </div>
              <button className="modal-close" onClick={() => setSelectedTask(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-left">
                {selectedTask.description && (
                  <div className="detail-section">
                    <h4>Description</h4>
                    <p className="task-description-text">{selectedTask.description}</p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Comments</h4>
                  <div className="comments-feed">
                    {(selectedTask.comments || []).length === 0 && (
                      <p className="no-comments">No comments yet. Be the first to leave one!</p>
                    )}
                    {(selectedTask.comments || []).map(comment => (
                      <div key={comment.id} className="comment-bubble">
                        <div className="comment-meta">
                          <span className="comment-author">{comment.user?.name}</span>
                          <span className="comment-role">{comment.user?.role}</span>
                          <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  {canInteract(selectedTask) ? (
                    <div className="comment-input-wrapper">
                      <textarea
                        className="comment-textarea"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => handleAddComment(selectedTask.id)}
                        disabled={!newComment.trim()}
                      >
                        <MessageSquare size={14} /> Post Comment
                      </button>
                    </div>
                  ) : (
                    <p className="no-permission-note">Only the assigned user or an admin can comment on this task.</p>
                  )}
                </div>
              </div>

              <div className="modal-right">
                <div className="detail-section">
                  <h4>Status</h4>
                  {canInteract(selectedTask) ? (
                    <select
                      className="status-select full-width"
                      value={selectedTask.status}
                      onChange={e => handleStatusChange(selectedTask.id, e.target.value)}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className="status-badge"
                      style={{ background: STATUS_COLORS[selectedTask.status] + '33', color: STATUS_COLORS[selectedTask.status] }}
                    >
                      {STATUS_LABELS[selectedTask.status]}
                    </span>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Assigned To</h4>
                  <p className="detail-value">{selectedTask.assignee?.name || 'Unassigned'}</p>
                </div>

                {selectedTask.dueDate && (
                  <div className="detail-section">
                    <h4>Due Date</h4>
                    <p className={`detail-value ${isOverdue(selectedTask) ? 'overdue-text' : ''}`}>
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                      {isOverdue(selectedTask) && ' ⚠️ Overdue'}
                    </p>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Created</h4>
                  <p className="detail-value">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal (Admin only) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask} className="modal-form">
              <div className="form-group">
                <label>Task Title *</label>
                <input required placeholder="Enter task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="Describe the task..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Project *</label>
                <select required value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
                  <option value="">Select a project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={form.assigneeId} onChange={e => setForm({ ...form, assigneeId: e.target.value })}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
