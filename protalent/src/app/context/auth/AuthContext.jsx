'use client';
import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // No se usará si window.location.href es la estrategia
import api from '../../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const router = useRouter(); // No se usará si window.location.href es la estrategia

  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones de estado en un componente desmontado
    // console.log("[AuthContext] useEffect ejecutándose");

    const initializeAuth = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      // console.log("[AuthContext] Token obtenido de localStorage:", token);

      if (token && token !== 'null' && token !== 'undefined') {
        // console.log("[AuthContext] Configurando token en Axios headers:", token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // console.log("[AuthContext] No hay token válido en localStorage, eliminando header de Axios.");
      delete api.defaults.headers.common['Authorization'];
    }

      if (!api.defaults.headers.common['Authorization']) {
        // console.log("[AuthContext] No hay cabecera de autorización, estableciendo user a null.");
        if (isMounted) {
            setUser(null);
            setLoading(false);
        }
        return;
      }

      // console.log("[AuthContext] Hay cabecera de autorización, intentando cargar perfil.");
      try {
        const { data } = await api.get('/api/auth/perfil');
        // console.log("[AuthContext] Perfil recibido:", data);
        if (isMounted) setUser(data.user);
      } catch (error) {
        // console.error("[AuthContext] Error al cargar perfil:", error.response?.status, error.message);
        if (isMounted) setUser(null); // Importante: si falla la carga del perfil, el usuario es null
        // Si el error es 401 o 403, podría ser útil limpiar el token de localStorage aquí también por si acaso
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
        isMounted = false;
    };
  }, []); // Se ejecuta solo una vez cuando AuthProvider se monta

  const login = async (email, password) => {
    setLoading(true);
    try {
    const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      // Después de configurar el token y header, el user se cargará mediante el efecto de un nuevo AuthProvider o una recarga
      // O podemos setearlo directamente aquí y luego redirigir
      setUser(data.user); 
      setLoading(false); // Establecer loading false después de un login exitoso y antes de redirigir
    window.location.href = '/dashboard';
    } catch (error) {
      console.error("[AuthContext] Error en login:", error.response?.data || error.message);
      localStorage.removeItem('token'); // Limpiar token si el login falla
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    // ... (similar a login si el registro también loguea al usuario)
    // Por ahora, asumamos que después de registrar, el usuario debe loguearse por separado
    setLoading(true);
    try {
      await api.post('/api/auth/register', userData);
      // No se establece usuario ni token, se espera que el usuario haga login
      setUser(null); 
      setLoading(false);
      // podrías redirigir a login o mostrar un mensaje de éxito
      // window.location.href = '/auth/login?status=registered';
    } catch (error) {
      console.error("[AuthContext] Error en register:", error.response?.data || error.message);
      setUser(null);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    // console.log("[AuthContext] Ejecutando logout...");
    try {
      // La llamada al backend es opcional y para invalidar el token del lado del servidor si existe tal lógica
    await api.post('/api/auth/logout');
    } catch (error) {
      // console.error("[AuthContext] Error en llamada a /api/auth/logout (no crítico):");
    }
    
    // Limpieza del lado del cliente (esto es lo crucial)
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null); 
    setLoading(false); // Asegurar que loading sea false para que AuthNavbar reaccione correctamente
    
    // console.log("[AuthContext] Token eliminado, usuario seteado a null. Redirigiendo...");
    window.location.href = '/auth/login'; // Forzar recarga de página a login
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);