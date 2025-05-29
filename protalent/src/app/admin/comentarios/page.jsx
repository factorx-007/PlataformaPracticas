'use client';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiMessageSquare, FiThumbsUp, FiThumbsDown, FiAlertOctagon } from 'react-icons/fi';

export default function AdminComentariosPage() {
  const comentarioMetrics = [
    { title: 'Comentarios Totales', value: Math.floor(Math.random() * 2000) + 300, icon: FiMessageSquare, color: 'border-orange-500', trend: '+50 hoy' },
    { title: 'Comentarios Aprobados', value: Math.floor(Math.random() * 1800) + 250, icon: FiThumbsUp, color: 'border-green-500' },
    { title: 'Pendientes Moderación', value: Math.floor(Math.random() * 100) + 10, icon: FiAlertOctagon, color: 'border-yellow-400', trend: '+5 nuevos' },
    { title: 'Comentarios Eliminados', value: Math.floor(Math.random() * 200) + 20, icon: FiThumbsDown, color: 'border-red-500' },
  ];

  const comentarioCharts = [
    { title: 'Comentarios por Estado', type: 'pie' },
    { title: 'Actividad de Comentarios (Últimos 7 días)', type: 'bar' },
  ];

  return (
    <AdminSectionPage
      title="Gestión de Comentarios"
      metrics={comentarioMetrics}
      charts={comentarioCharts}
      mainTableTitle="Listado de Comentarios"
      mainTableColumns={["ID", "Autor", "Contenido (Extracto)", "En Respuesta a", "Fecha", "Estado", "Acciones"]}
      newButtonText="Moderar Comentarios"
      // Podríamos llevar a una vista especial de moderación masiva
      onNewButtonClick={() => alert('Ir a Moderación Próximamente')}
    />
  );
} 