'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/views/Sidebar';
import DashboardNavbar from '../../components/views/DashboardNavbar';

const navItems = [
  { href: '/dashboard/empresas', label: 'Ver Empresas' },
  { href: '/dashboard/empresas/crear', label: 'Crear Empresa' },
];

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/empresas');
      if (!response.ok) throw new Error('Error al cargar las empresas');
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/empresas/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Error al eliminar la empresa');
        
        toast.success('Empresa eliminada correctamente');
        fetchEmpresas(); // Refresh the list
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error al eliminar la empresa');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-gray-50">
          {/* Navegación secundaria de empresas */}
          <nav className="flex space-x-4 mb-6">
            {navItems.map(item => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Empresas Registradas</h1>
              <button
                onClick={() => router.push('/dashboard/empresas/crear')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Nueva Empresa
              </button>
            </div>

            {empresas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No hay empresas registradas aún</p>
                <button
                  onClick={() => router.push('/dashboard/empresas/crear')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Crear mi primera empresa
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rubro</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {empresas.map((empresa) => (
                        <tr key={empresa._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {empresa.rubro || 'No especificado'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {empresa.descripcion || 'Sin descripción'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => router.push(`/dashboard/empresas/editar/${empresa._id}`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(empresa._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}