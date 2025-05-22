import { useAuth } from '../../context/auth/AuthContext';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-blue-200">ProTalent</span>
        <span className="text-xs bg-blue-800 text-blue-100 px-2 py-1 rounded ml-2">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-slate-200 text-sm">Hola, <span className="font-semibold">{user.nombre}</span></span>
        )}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
} 