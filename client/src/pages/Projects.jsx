import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Users, Folder } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/projects', newProject);
      setProjects([...projects, { ...res.data, owner: { name: user.name }, _count: { tasks: 0 } }]);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project', error);
    }
  };

  if (loading) return <div className="loading-state">Loading projects...</div>;

  return (
    <div className="projects-page animate-fade-in">
      <header className="page-header flex-between">
        <div>
          <h1 className="gradient-text">Projects</h1>
          <p>Manage your team's initiatives and workspaces.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </header>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state glass-panel w-100">
            <Folder size={48} className="text-muted mb-3" />
            <h3>No Projects Found</h3>
            <p>Create a project to start organizing tasks.</p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card glass-panel">
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <div className="project-options">...</div>
              </div>
              <p className="project-desc">{project.description || 'No description provided.'}</p>
              
              <div className="project-meta">
                <div className="meta-item">
                  <Users size={16} />
                  <span>Owner: {project.owner?.name}</span>
                </div>
                <div className="meta-item">
                  <Folder size={16} />
                  <span>{project._count?.tasks || 0} Tasks</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
