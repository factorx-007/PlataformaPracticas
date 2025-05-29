'use client';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiEdit3, FiEye, FiThumbsUp, FiShare2 } from 'react-icons/fi';

export default function AdminBlogPostsPage() {
  const blogMetrics = [
    { title: 'Blog Posts Totales', value: Math.floor(Math.random() * 200) + 30, icon: FiEdit3, color: 'border-fuchsia-500', trend: '+3 esta semana' },
    { title: 'Posts Publicados', value: Math.floor(Math.random() * 180) + 25, icon: FiEye, color: 'border-violet-500' },
    { title: 'Total Visualizaciones', value: Math.floor(Math.random() * 15000) + 2000, icon: FiThumbsUp, color: 'border-rose-500', unit: 'k' },
    { title: 'Prom. Compartidos', value: Math.floor(Math.random() * 50) + 5, icon: FiShare2, color: 'border-cyan-500' },
  ];

  const blogCharts = [
    { title: 'Posts Más Vistos (Top 5)', type: 'bar' },
    { title: 'Publicaciones por Categoría', type: 'pie' },
  ];

  return (
    <AdminSectionPage
      title="Gestión de Blog Posts"
      metrics={blogMetrics}
      charts={blogCharts}
      mainTableTitle="Listado de Blog Posts"
      mainTableColumns={["ID", "Título", "Autor", "Categoría", "Fecha Pub.", "Estado", "Vistas", "Comentarios", "Acciones"]}
      newButtonText="Crear Nuevo Post"
      onNewButtonClick={() => alert('Funcionalidad Crear Post Próximamente')}
    />
  );
} 