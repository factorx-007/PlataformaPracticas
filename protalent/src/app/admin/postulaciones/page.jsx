'use client';
import { useState, useEffect } from 'react';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiActivity, FiCheckCircle, FiXCircle, FiClock, FiUser, FiFileText, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Componente para la fila de la tabla de postulaciones
const PostulacionTableRow = ({ postulacion, onViewDetails, onUpdateStatus }) => {
  // Idealmente, ofertaId y usuarioId vendrían populados desde el backend
  const ofertaTitulo = postulacion.oferta?.titulo || postulacion.ofertaId?.titulo || postulacion.ofertaId || 'N/A';
  const candidatoNombre = postulacion.usuario?.nombre || postulacion.usuarioId?.nombre || postulacion.usuarioId || 'N/A';

  let estadoColor = 'bg-yellow-100 text-yellow-800';
  if (postulacion.estado === 'aceptada') estadoColor = 'bg-green-100 text-green-800';
  if (postulacion.estado === 'rechazada') estadoColor = 'bg-red-100 text-red-800';
  if (postulacion.estado === 'revisada') estadoColor = 'bg-blue-100 text-blue-800';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={ofertaTitulo}>{ofertaTitulo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidatoNombre}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(postulacion.fechaPostulacion || postulacion.createdAt || Date.now()).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColor}`}>
          {postulacion.estado || 'pendiente'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onViewDetails(postulacion)} className="text-sky-600 hover:text-sky-900 mr-3 p-1" title="Ver Detalles">
          <FiEye className="w-5 h-5"/>
        </button>
        <button onClick={() => onUpdateStatus(postulacion)} className="text-indigo-600 hover:text-indigo-900 p-1" title="Actualizar Estado">
          <FiEdit className="w-5 h-5"/>
        </button>
        {/* Considerar si la eliminación directa es adecuada o si se debe archivar */}
        {/* <button onClick={() => onDelete(postulacion._id || postulacion.id)} className="text-red-600 hover:text-red-900 ml-3 p-1" title="Eliminar">
          <FiTrash2 className="w-5 h-5"/>
        </button> */}
      </td>
    </tr>
  );
};

export default function AdminPostulacionesPage() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPostulaciones: 0,
    pendientes: 0,
    aceptadas: 0,
    rechazadas: 0,
  });

  const fetchPostulaciones = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/postulaciones'); // Asumiendo este endpoint
      if (!response.ok) throw new Error('Error al cargar las postulaciones');
      const data = await response.json();
      setPostulaciones(data);
      
      setStats({
        totalPostulaciones: data.length,
        pendientes: data.filter(p => p.estado === 'pendiente' || !p.estado).length,
        aceptadas: data.filter(p => p.estado === 'aceptada').length,
        rechazadas: data.filter(p => p.estado === 'rechazada').length,
      });
    } catch (error) {
      console.error('Error fetching postulaciones para admin:', error);
      toast.error('Error al cargar postulaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostulaciones();
  }, []);

  const handleViewDetailsPostulacion = (postulacion) => {
    const ofertaTitulo = postulacion.oferta?.titulo || postulacion.ofertaId?.titulo || postulacion.ofertaId || 'N/A';
    const candidatoNombre = postulacion.usuario?.nombre || postulacion.usuarioId?.nombre || postulacion.usuarioId || 'N/A';
    alert(`Detalles de Postulación:\nOferta: ${ofertaTitulo}\nCandidato: ${candidatoNombre}\nEstado: ${postulacion.estado}\nCV: ${postulacion.cvUrl || 'No adjunto'}`);
  };

  const handleUpdateStatusPostulacion = async (postulacion) => {
    const nuevoEstado = prompt(`Actualizar estado para ${postulacion._id || postulacion.id}: (pendiente, revisada, aceptada, rechazada)`, postulacion.estado);
    if (nuevoEstado && nuevoEstado !== postulacion.estado) {
      try {
        const response = await fetch(`http://localhost:5000/api/postulaciones/${postulacion._id || postulacion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al actualizar estado');
        }
        toast.success('Estado de postulación actualizado.');
        fetchPostulaciones();
      } catch (error) {
        toast.error(error.message || 'Error al actualizar estado.');
      }
    }
  };
  
  const postulacionMetrics = [
    { title: 'Total Postulaciones', value: stats.totalPostulaciones, icon: FiActivity, color: 'border-purple-500', trend: `+${Math.floor(Math.random() * 20)} hoy` },
    { title: 'Pendientes', value: stats.pendientes, icon: FiClock, color: 'border-yellow-500' },
    { title: 'Aceptadas', value: stats.aceptadas, icon: FiCheckCircle, color: 'border-green-600' },
    { title: 'Rechazadas', value: stats.rechazadas, icon: FiXCircle, color: 'border-red-600' },
  ];

  const postulacionCharts = [
    { title: 'Distribución de Estado de Postulaciones', type: 'pie' },
    { title: 'Postulaciones Recibidas (Últimos 30 días)', type: 'bar' },
  ];

  if (loading && postulaciones.length === 0) {
    return (
      <AdminSectionPage title="Gestión de Postulaciones" metrics={[]} charts={[]}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          <p className="ml-4 text-gray-600">Cargando postulaciones...</p>
        </div>
      </AdminSectionPage>
    );
  }

  return (
    <AdminSectionPage
      title="Gestión de Postulaciones"
      metrics={postulacionMetrics}
      charts={postulacionCharts}
      showNewButton={false} // No se crean postulaciones manualmente desde admin
    >
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Listado Detallado de Postulaciones</h2>
        </div>
         {loading && postulaciones.length > 0 && (
            <p className="text-sm text-sky-600">Actualizando lista...</p>
        )}
        {postulaciones.length === 0 && !loading ? (
          <div className="text-center py-10">
            <FiActivity className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">No hay postulaciones registradas en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oferta Aplicada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Post.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {postulaciones.map((postulacion) => (
                  <PostulacionTableRow 
                    key={postulacion._id || postulacion.id} 
                    postulacion={postulacion} 
                    onViewDetails={handleViewDetailsPostulacion}
                    onUpdateStatus={handleUpdateStatusPostulacion}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminSectionPage>
  );
} 