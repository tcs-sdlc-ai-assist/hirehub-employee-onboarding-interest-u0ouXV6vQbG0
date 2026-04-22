import { useState, useCallback } from 'react';

const AUTH_KEY = 'hirehub_admin_auth';
const HARDCODED_USERNAME = 'admin';
const HARDCODED_PASSWORD = 'admin';

/**
 * Custom hook for admin authentication state management.
 * Checks sessionStorage key 'hirehub_admin_auth' for authentication status.
 * @returns {{ isAuthenticated: boolean, login: (username: string, password: string) => { success: boolean, error?: string }, logout: () => void }}
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  /**
   * Validates credentials against hardcoded admin/admin.
   * Sets sessionStorage on success.
   * @param {string} username
   * @param {string} password
   * @returns {{ success: boolean, error?: string }}
   */
  const login = useCallback((username, password) => {
    if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, 'true');
      } catch {
        return { success: false, error: 'Unable to save session. Please check browser settings.' };
      }
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  /**
   * Clears sessionStorage auth key and sets auth state to false.
   */
  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // Silently handle storage errors on logout
    }
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}