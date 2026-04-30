import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon"></div>
        <h2>TaskFlow</h2>
      </div>

      <div className="user-profile">
        <div className="avatar">{user?.name.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <h4>{user?.name}</h4>
          <span className={`badge ${user?.role === 'ADMIN' ? 'badge-admin' : 'badge-pending'}`}>
            {user?.role}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Briefcase size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckSquare size={20} />
          <span>Tasks</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="nav-item btn-logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
