'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../../components/views/Sidebar';
import DashboardNavbar from '../../../components/views/DashboardNavbar';
import api from '../../../lib/api';

export default function VerPostulacionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [postulacion, setPostulacion] = useState(null);
  const [oferta, setOferta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // Obtener la postulación
    api.get(`/api/postulaciones/${id}`)
      .then(res => {
        setPostulacion(res.data);
        // Luego obtener la oferta asociada
        return api.get(`/api/ofertas/${res.data.ofertaId}`);
      })
      .then(res => {
        setOferta(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!postulacion) {
    return <div className="text-center py-12">No se encontró la postulación.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-gray-50 flex justify-center items-start">
          <div className="max-w-xl w-full bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detalle de Postulación</h2>
            <div className="mb-6">
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Oferta:</span>{' '}
                <span className="text-blue-700 font-medium">{oferta ? oferta.titulo : 'Cargando...'}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Mensaje:</span>{' '}
                <span>{postulacion.mensaje || 'Sin mensaje'}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Estado:</span>{' '}
                <span>{postulacion.estado}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">ID de la Oferta:</span>{' '}
                <span>{postulacion.ofertaId}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">ID de la Postulación:</span>{' '}
                <span>{postulacion.id}</span>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Volver
            </button>
          </div>
        </main>
      </div>
    </div>
  );
} 