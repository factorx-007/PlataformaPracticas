'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/views/Sidebar';
import DashboardNavbar from '../../components/views/DashboardNavbar';
import PostulacionesNav from './PostulacionesNav';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function PostulacionesPage() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      api.get('/api/postulaciones'),
      api.get('/api/ofertas')
    ]).then(([postulacionesRes, ofertasRes]) => {
      setPostulaciones(postulacionesRes.data);
      setOfertas(ofertasRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const getTituloOferta = (ofertaId) => {
    const oferta = ofertas.find(o => o.id === ofertaId);
    return oferta ? oferta.titulo : 'Sin oferta';
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
          <PostulacionesNav />
          <div className="container mx-auto p-6 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Mis Postulaciones</h1>
            </div>
            {postulaciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No tienes postulaciones aún</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oferta</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {postulaciones.map((postulacion) => (
                        <tr key={postulacion.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {getTituloOferta(postulacion.ofertaId)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {postulacion.mensaje || 'Sin mensaje'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {postulacion.estado}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                            <button
                              onClick={() => router.push(`/dashboard/postulaciones/${postulacion.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                              Ver
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