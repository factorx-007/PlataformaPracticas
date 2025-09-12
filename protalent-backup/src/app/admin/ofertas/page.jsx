'use client';
import { useState, useEffect } from 'react';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiFileText, FiTrendingUp, FiEye, FiArchive, FiEdit, FiTrash2, FiDollarSign, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
// Asegúrate de que los estilos del toast estén importados en un layout global o aquí si es necesario
// import 'react-toastify/dist/ReactToastify.css';

// Componente para la fila de la tabla de ofertas
const OfertaTableRow = ({ oferta, onDelete, onViewDetails, onEdit }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" title={oferta.titulo}>{oferta.titulo}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{oferta.empresa?.nombre || oferta.empresaId || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{oferta.categoria?.nombre || oferta.categoriaId || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(oferta.fechaPublicacion || oferta.createdAt || Date.now()).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {oferta.estado === 'activa' ? 
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activa</span> : 
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{oferta.estado || 'Cerrada'}</span>}
      </td>
       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{oferta.postulacionesCount || 0}</td> {/* Asumiendo que el backend puede enviar este count */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onViewDetails(oferta)} className="text-sky-600 hover:text-sky-900 mr-3 p-1" title="Ver Detalles">
          <FiEye className="w-5 h-5"/>
        </button>
        <button onClick={() => onEdit(oferta)} className="text-indigo-600 hover:text-indigo-900 mr-3 p-1" title="Editar">
          <FiEdit className="w-5 h-5"/>
        </button>
        <button onClick={() => onDelete(oferta._id || oferta.id)} className="text-red-600 hover:text-red-900 p-1" title="Eliminar">
          <FiTrash2 className="w-5 h-5"/>
        </button>
      </td>
    </tr>
  );
};

export default function AdminOfertasPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOfertas: 0,
    ofertasActivas: 0,
    ofertasCerradas: 0,
    nuevasHoy: 0, // Lógica para calcular esto sería necesaria
  });

  const fetchOfertas = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ofertas'); // Asumiendo este endpoint
      if (!response.ok) throw new Error('Error al cargar las ofertas');
      const data = await response.json();
      setOfertas(data);
      
      const total = data.length;
      const activas = data.filter(o => o.estado === 'activa').length;
      // const nuevasHoyCount = data.filter(o => new Date(o.fechaPublicacion || o.createdAt).toDateString() === new Date().toDateString()).length;
      setStats({
        totalOfertas: total,
        ofertasActivas: activas,
        ofertasCerradas: total - activas, // Simplificación, idealmente el backend daría el estado exacto
        nuevasHoy: Math.floor(Math.random() * 10), // Placeholder
      });
    } catch (error) {
      console.error('Error fetching ofertas para admin:', error);
      toast.error('Error al cargar ofertas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  const handleDeleteOferta = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta oferta? Esta acción es irreversible.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/ofertas/${id}`, { // Asumiendo este endpoint
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al eliminar la oferta');
        }
        toast.success('Oferta eliminada correctamente.');
        fetchOfertas(); 
      } catch (error) {
        console.error('Error deleting oferta:', error);
        toast.error(error.message || 'Error al eliminar la oferta');
      }
    }
  };

  const handleViewDetailsOferta = (oferta) => {
    alert(`Detalles de la Oferta: ${oferta.titulo}\nEmpresa: ${oferta.empresa?.nombre || oferta.empresaId}\nEstado: ${oferta.estado}`);
  };

  const handleEditOferta = (oferta) => {
    alert(`Editar oferta: ${oferta.titulo} (funcionalidad próximamente)`);
    // router.push(`/admin/ofertas/editar/${oferta._id || oferta.id}`);
  };
  
  const ofertaMetrics = [
    { title: 'Total Ofertas', value: stats.totalOfertas, icon: FiFileText, color: 'border-indigo-500', trend: `+${stats.nuevasHoy} hoy` },
    { title: 'Ofertas Activas', value: stats.ofertasActivas, icon: FiEye, color: 'border-green-500' }, // FiEye usado como placeholder
    { title: 'Ofertas Cerradas', value: stats.ofertasCerradas, icon: FiArchive, color: 'border-red-500' },
    { title: 'Prom. Salario (USD)', value: (Math.floor(Math.random() * 3000) + 1000), icon: FiDollarSign, color: 'border-amber-500' }, // Placeholder
  ];

  const ofertaCharts = [
    { title: 'Ofertas por Estado (Activa/Cerrada)', type: 'pie' },
    { title: 'Nuevas Ofertas Publicadas (Mensual)', type: 'bar' },
  ];

  if (loading && ofertas.length === 0) {
    return (
      <AdminSectionPage title="Gestión de Ofertas" metrics={[]} charts={[]}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          <p className="ml-4 text-gray-600">Cargando ofertas...</p>
        </div>
      </AdminSectionPage>
    );
  }

  return (
    <AdminSectionPage
      title="Gestión de Ofertas de Empleo"
      metrics={ofertaMetrics}
      charts={ofertaCharts}
      newButtonText="Publicar Nueva Oferta"
      onNewButtonClick={() => alert('Funcionalidad Publicar Oferta Próximamente')}
    >
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Listado Detallado de Ofertas</h2>
        </div>
        {loading && ofertas.length > 0 && (
            <p className="text-sm text-sky-600">Actualizando lista...</p>
        )}
        {ofertas.length === 0 && !loading ? (
          <div className="text-center py-10">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">No hay ofertas publicadas en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pub.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postul.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ofertas.map((oferta) => (
                  <OfertaTableRow 
                    key={oferta._id || oferta.id} 
                    oferta={oferta} 
                    onDelete={handleDeleteOferta} 
                    onViewDetails={handleViewDetailsOferta}
                    onEdit={handleEditOferta}
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