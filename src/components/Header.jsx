import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AUTH_KEY = 'hirehub_admin_auth';

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdminAuth();

  const [authState, setAuthState] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setAuthState(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    function handleStorageChange() {
      try {
        setAuthState(sessionStorage.getItem(AUTH_KEY) === 'true');
      } catch {
        setAuthState(false);
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  function handleLoginLogout() {
    if (authState) {
      logout();
      setAuthState(false);
      navigate('/admin');
    } else {
      navigate('/admin');
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="header-logo">
          HireHub
        </NavLink>
        <nav className="header-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
          <NavLink
            to="/apply"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Apply
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Admin
          </NavLink>
          <button
            className={authState ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
            onClick={handleLoginLogout}
            type="button"
          >
            {authState ? 'Logout' : 'Login'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;