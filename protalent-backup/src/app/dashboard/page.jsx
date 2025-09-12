'use client';
import Sidebar from '../components/views/Sidebar';
import DashboardNavbar from '../components/views/DashboardNavbar';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex flex-col md:flex-row w-full flex-1">
        <div className="w-full md:w-64">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 md:p-10 bg-gray-50 min-h-screen">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Bienvenido a tu Dashboard</h1>
          <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8">Aquí puedes gestionar tus postulaciones, ver ofertas, actualizar tu perfil y mucho más para tus prácticas preprofesionales.</p>
          {/* Puedes agregar widgets, estadísticas, etc. aquí */}
        </main>
      </div>
    </div>
  );
} 