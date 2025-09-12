import AdminNavbar from '../components/admin/AdminNavbar';
import AdminSidebar from '../components/admin/AdminSidebar';
// Importaremos el AuthContext para proteger rutas más adelante
// import { useAuth } from '../context/auth/AuthContext'; 
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function AdminLayout({ children }) {
  // Lógica de protección de ruta (se implementará después)
  // const { user, loading, isAdmin } = useAuth();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !isAdmin) {
  //     router.push('/auth/login'); // O a una página de no autorizado
  //   }
  // }, [user, loading, isAdmin, router]);

  // if (loading || !isAdmin) {
  //   // Puedes mostrar un spinner de carga o null mientras se verifica
  //   return <div>Verificando acceso...</div>; // O un componente de carga más elaborado
  // }

  const sidebarWidth = 'w-64'; // Debe coincidir con el ancho del AdminSidebar
  const navHeight = '68px'; // Altura del AdminNavbar, para el padding del contenido principal

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main 
          className="flex-1 bg-gray-100 text-gray-800"
          style={{ 
            marginLeft: sidebarWidth.includes('w-') ? `${parseInt(sidebarWidth.split('-')[1]) * 0.25}rem` : sidebarWidth,
            paddingTop: navHeight, // Para evitar que el contenido quede debajo del navbar fijo
            // Podríamos añadir un padding general al contenido si se desea
            // padding: '1.5rem' 
          }}
        >
          <div className="p-6"> {/* Contenedor para el padding interno del contenido */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 