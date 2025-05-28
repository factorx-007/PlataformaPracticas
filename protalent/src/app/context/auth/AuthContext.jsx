'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar axios para enviar el token si existe
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }

    const loadUser = async () => {
      try {
        const { data } = await api.get('/api/auth/perfil');
        setUser(data.user); 
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setUser(data.user);
    if (data.token) {
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    }
    window.location.href = '/dashboard';
  };

  const register = async (userData) => {
    const { data } = await api.post('/api/auth/register', userData);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);