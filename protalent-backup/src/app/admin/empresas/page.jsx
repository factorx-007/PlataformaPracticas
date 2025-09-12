'use client';
import { useState, useEffect } from 'react';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiBriefcase, FiCheckSquare, FiAward, FiMapPin, FiUsers, FiClock, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Asegúrate de que los estilos del toast estén importados

// Componente para la fila de la tabla, incluyendo acciones
const EmpresaTableRow = ({ empresa, onDelete, onViewDetails, onEdit }) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{empresa.nombre}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.rubro || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{empresa.descripcion || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {empresa.verificada ? 
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verificada</span> : 
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No Verificada</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(empresa.fechaCreacion || empresa.createdAt || Date.now()).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onClick={() => onViewDetails(empresa)} className="text-sky-600 hover:text-sky-900 mr-3 p-1" title="Ver Detalles">
          <FiEye className="w-5 h-5"/>
        </button>
        <button onClick={() => onEdit(empresa)} className="text-indigo-600 hover:text-indigo-900 mr-3 p-1" title="Editar">
          <FiEdit className="w-5 h-5"/>
        </button>
        <button onClick={() => onDelete(empresa._id || empresa.id)} className="text-red-600 hover:text-red-900 p-1" title="Eliminar">
          <FiTrash2 className="w-5 h-5"/>
        </button>
      </td>
    </tr>
  );
};

export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmpresas: 0,
    empresasVerificadas: 0,
    empresasNoVerificadas: 0,
    nuevasEstaSemana: 0, // Lógica para calcular esto sería necesaria
  });

  const fetchEmpresas = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/empresas');
      if (!response.ok) throw new Error('Error al cargar las empresas del dashboard de admin');
      const data = await response.json();
      setEmpresas(data);
      // Calcular estadísticas básicas
      const total = data.length;
      const verificadas = data.filter(e => e.verificada).length;
      // const nuevasSemana = data.filter(e => new Date(e.fechaCreacion || e.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      setStats({
        totalEmpresas: total,
        empresasVerificadas: verificadas,
        empresasNoVerificadas: total - verificadas,
        nuevasEstaSemana: Math.floor(Math.random() * 10), // Placeholder, calcular correctamente
      });
    } catch (error) {
      console.error('Error fetching empresas para admin:', error);
      toast.error('Error al cargar empresas para el panel de admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleDeleteEmpresa = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa? Esta acción es irreversible.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/empresas/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al eliminar la empresa');
        }
        toast.success('Empresa eliminada correctamente del sistema.');
        fetchEmpresas(); // Recargar la lista
      } catch (error) {
        console.error('Error deleting empresa:', error);
        toast.error(error.message || 'Error al eliminar la empresa');
      }
    }
  };

  const handleViewDetails = (empresa) => {
    // Aquí podrías abrir un modal con más detalles de la empresa
    alert(`Detalles de ${empresa.nombre}:\nRubro: ${empresa.rubro}\nDescripción: ${empresa.descripcion}\nVerificada: ${empresa.verificada}`);
  };

  const handleEditEmpresa = (empresa) => {
    // Lógica para redirigir a una página de edición o abrir un modal de edición
    alert(`Editar empresa: ${empresa.nombre} (funcionalidad próximamente)`);
    // router.push(`/admin/empresas/editar/${empresa._id || empresa.id}`);
  };
  
  const empresaMetrics = [
    { title: 'Total Empresas', value: stats.totalEmpresas, icon: FiBriefcase, color: 'border-teal-500', trend: `+${stats.nuevasEstaSemana} esta sem.` },
    { title: 'Verificadas', value: stats.empresasVerificadas, icon: FiCheckSquare, color: 'border-green-500' },
    { title: 'No Verificadas', value: stats.empresasNoVerificadas, icon: FiAward, color: 'border-red-500' }, // FiAward usado como placeholder
    { title: 'Prom. Ofertas / Empresa', value: (Math.random() * 5 + 1).toFixed(1), icon: FiMapPin, color: 'border-purple-500' }, // Placeholder
  ];

  const empresaCharts = [
    { title: 'Empresas por Estado de Verificación', type: 'pie' },
    { title: 'Nuevas Empresas Registradas (Mensual)', type: 'bar' },
  ];

  if (loading && empresas.length === 0) { // Mostrar loader solo si no hay datos previos
    return (
      <AdminSectionPage title="Gestión de Empresas" metrics={[]} charts={[]}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          <p className="ml-4 text-gray-600">Cargando empresas...</p>
        </div>
      </AdminSectionPage>
    );
  }

  return (
    <AdminSectionPage
      title="Gestión de Empresas"
      metrics={empresaMetrics}
      charts={empresaCharts}
      newButtonText="Registrar Nueva Empresa"
      onNewButtonClick={() => alert('Funcionalidad Registrar Empresa Próximamente')}
    >
      {/* Tabla de Empresas Reales */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Listado Detallado de Empresas</h2>
          {/* Aquí podrían ir filtros más avanzados */}
        </div>
        {loading && empresas.length > 0 && (
            <p className="text-sm text-sky-600">Actualizando lista...</p>
        )}
        {empresas.length === 0 && !loading ? (
          <div className="text-center py-10">
            <FiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
            <p className="text-gray-500">No hay empresas registradas en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rubro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado Verif.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empresas.map((empresa) => (
                  <EmpresaTableRow 
                    key={empresa._id || empresa.id} 
                    empresa={empresa} 
                    onDelete={handleDeleteEmpresa} 
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditEmpresa}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Aquí podría ir la paginación si hay muchas empresas */}
      </div>
    </AdminSectionPage>
  );
} 