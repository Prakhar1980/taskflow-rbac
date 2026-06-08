import { LogOut, Plus, ShieldCheck } from 'lucide-react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <ShieldCheck size={24} />
          <span>RBAC Tasks</span>
        </Link>
        <nav className="nav-actions">
          <NavLink to="/" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/tasks/new" className="button button-primary">
            <Plus size={18} />
            New Task
          </NavLink>
          <span className="role-chip">{user?.role}</span>
          <button className="icon-button" onClick={handleLogout} title="Logout" aria-label="Logout">
            <LogOut size={18} />
          </button>
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
