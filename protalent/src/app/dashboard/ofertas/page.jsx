'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OfertasNav from './OfertasNav';
import api from '../../lib/api';

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const { data } = await api.get('/api/ofertas');
      setOfertas(data);
    } catch (error) {
      // Manejo de error
    } finally {
      setLoading(false);
    }
  };

  const handlePostular = async (ofertaId) => {
    try {
      await api.post('/api/postulaciones', { ofertaId });
      alert('¡Postulación exitosa!');
    } catch (error) {
      alert('Error al postular');
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
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <OfertasNav />
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Ofertas de Prácticas</h1>
            <button
              onClick={() => router.push('/dashboard/ofertas/crear')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Nueva Oferta
            </button>
          </div>
          {ofertas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay ofertas registradas aún</p>
              <button
                onClick={() => router.push('/dashboard/ofertas/crear')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Crear mi primera oferta
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ofertas.map((oferta) => (
                    <tr key={oferta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{oferta.titulo}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {oferta.descripcion || 'Sin descripción'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/postulaciones/crear/${oferta.id}`)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          Postular
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/ofertas/editar/${oferta.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 