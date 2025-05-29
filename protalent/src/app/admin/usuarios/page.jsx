'use client';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiUsers, FiUserCheck, FiUserX, FiTrendingUp } from 'react-icons/fi';

export default function AdminUsuariosPage() {
  const userMetrics = [
    { title: 'Total Usuarios', value: Math.floor(Math.random() * 1500) + 500, icon: FiUsers, color: 'border-sky-500', trend: '+25 hoy' },
    { title: 'Usuarios Activos', value: Math.floor(Math.random() * 1200) + 400, icon: FiUserCheck, color: 'border-green-500', trend: '+10 últ. hora' },
    { title: 'Usuarios Inactivos', value: Math.floor(Math.random() * 300) + 50, icon: FiUserX, color: 'border-red-500', trend: '-2 ayer' },
    { title: 'Nuevos Registros (Mes)', value: Math.floor(Math.random() * 200) + 30, icon: FiTrendingUp, color: 'border-amber-500', trend: '+5% vs mes ant.' },
  ];

  const userCharts = [
    { title: 'Distribución de Usuarios por Rol', type: 'pie' },
    { title: 'Actividad de Usuarios (Últimos 7 días)', type: 'bar' },
  ];

  return (
    <AdminSectionPage
      title="Gestión de Usuarios"
      metrics={userMetrics}
      charts={userCharts}
      mainTableTitle="Listado de Usuarios"
      mainTableColumns={["ID", "Nombre Completo", "Email", "Rol", "Fecha Registro", "Últ. Conexión", "Estado", "Acciones"]}
      newButtonText="Añadir Usuario"
      onNewButtonClick={() => alert('Funcionalidad Añadir Usuario Próximamente')}
    />
  );
} 