'use client';
import AdminSectionPage from '../../components/admin/AdminSectionPage';
import { FiTag, FiGrid, FiLink, FiArchive } from 'react-icons/fi';

export default function AdminCategoriasPage() {
  const categoriaMetrics = [
    { title: 'Categorías Totales', value: Math.floor(Math.random() * 100) + 20, icon: FiTag, color: 'border-lime-500', trend: '+2 nuevas' },
    { title: 'Categorías Principales', value: Math.floor(Math.random() * 15) + 5, icon: FiGrid, color: 'border-emerald-500', trend: '70% activas' },
    { title: 'Subcategorías Existentes', value: Math.floor(Math.random() * 50) + 10, icon: FiLink, color: 'border-cyan-400' },
    { title: 'Categorías Archivadas', value: Math.floor(Math.random() * 10) + 1, icon: FiArchive, color: 'border-gray-400' },
  ];

  const categoriaCharts = [
    { title: 'Ofertas por Categoría (Top 10)', type: 'bar' },
    // Podría ser útil una gráfica de árbol o un treemap para jerarquía de categorías
  ];

  return (
    <AdminSectionPage
      title="Gestión de Categorías"
      metrics={categoriaMetrics}
      charts={categoriaCharts}
      mainTableTitle="Listado de Categorías"
      mainTableColumns={["ID", "Nombre Categoría", "Slug", "Categoría Padre", "Nº Ofertas", "Nº Blog Posts", "Acciones"]}
      newButtonText="Añadir Categoría"
      onNewButtonClick={() => alert('Funcionalidad Añadir Categoría Próximamente')}
    />
  );
} 