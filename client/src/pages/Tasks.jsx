import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', projectId: '', assigneeId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/projects'),
        axios.get('/api/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tasks', newTask);
      fetchData(); // Refresh to get relations
      setShowModal(false);
      setNewTask({ title: '', description: '', dueDate: '', projectId: '', assigneeId: '' });
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Error updating task status', error);
      alert('Not authorized or error updating task');
    }
  };

  if (loading) return <div className="loading-state">Loading tasks...</div>;

  return (
    <div className="tasks-page animate-fade-in">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Task Board</h1>
          <p>Track progress and update task statuses.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            <span>New Task</span>
          </button>
        )}
      </header>

      <div className="task-columns">
        {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
          <div key={status} className="task-column glass-panel">
            <div className="column-header">
              <h3>{status.replace('_', ' ')}</h3>
              <span className="task-count">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="task-cards">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="task-card">
                  <h4>{task.title}</h4>
                  <p className="task-desc">{task.description}</p>
                  
                  <div className="task-meta">
                    <span className="task-project">{task.project?.name}</span>
                    {task.dueDate && (
                      <span className={`task-date ${new Date(task.dueDate) < new Date() && status !== 'COMPLETED' ? 'overdue' : ''}`}>
                        <Clock size={14} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="task-footer">
                    <div className="task-assignee">
                      {task.assignee?.name ? (
                        <div className="avatar-micro" title={task.assignee.name}>
                          {task.assignee.name.charAt(0)}
                        </div>
                      ) : (
                        <span className="unassigned">Unassigned</span>
                      )}
                    </div>
                    
                    <select 
                      className="status-select"
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      disabled={user.role !== 'ADMIN' && task.assigneeId !== user.id}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  rows="2"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Project</label>
                  <select
                    className="form-input"
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                    required
                  >
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Assign To</label>
                  <select
                    className="form-input"
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
