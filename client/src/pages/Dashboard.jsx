import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('/api/tasks'),
        axios.get('/api/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'COMPLETED' || !t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  if (loading) return <div className="loading-state">Loading dashboard...</div>;

  return (
    <div className="dashboard animate-fade-in">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Dashboard Overview</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <h3>{inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <BarChart3 size={24} />
          </div>
          <div className="stat-info">
            <h3>{overdueTasks}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-tasks glass-panel">
          <h2>Recent Tasks</h2>
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks available.</p>
          ) : (
            <div className="task-list">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <span className="task-project">{task.project?.name}</span>
                  </div>
                  <div className="task-meta">
                    <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="project-summary glass-panel">
          <h2>Active Projects</h2>
          {projects.length === 0 ? (
            <p className="empty-state">No active projects.</p>
          ) : (
            <div className="project-list">
              {projects.slice(0, 5).map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p>{project._count?.tasks || 0} tasks</p>
                  </div>
                  <div className="project-owner">
                    <div className="avatar-small">{project.owner?.name?.charAt(0)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
