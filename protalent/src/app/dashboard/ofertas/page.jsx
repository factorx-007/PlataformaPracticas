'use client';
import Sidebar from '../../components/views/Sidebar';
import DashboardNavbar from '../../components/views/DashboardNavbar';

export default function OfertasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Ofertas de Prácticas</h1>
          <p className="text-gray-700 mb-4">Explora y postúlate a las mejores ofertas de prácticas preprofesionales.</p>
          {/* Aquí se listarán las ofertas disponibles */}
        </main>
      </div>
    </div>
  );
} 