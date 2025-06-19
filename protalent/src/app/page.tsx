'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  LightBulbIcon, 
  ChartBarIcon, 
  ClockIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

// Renderizado dinámico del componente World
const World = dynamic(() => import('./components/ui/globe').then((mod) => mod.World), {
  ssr: false
});

export default function Home() {
  // Datos de ejemplo para el globo
  const globeData = [
    {
      order: 1,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.3,
      color: '#3B82F6'
    },
    {
      order: 2,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 40.7128,
      endLng: -74.0060,
      arcAlt: 0.4,
      color: '#10B981'
    }
  ];

  const globeConfig = {
    pointSize: 4,
    globeColor: "#1d072e",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38BDF8",
    directionalLeftLight: "#FFFFFF",
    directionalTopLight: "#FFFFFF",
    pointLight: "#FFFFFF",
    autoRotate: true,
    autoRotateSpeed: 0.5
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center overflow-hidden">
      {/* Hero Section with Globe */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center">
        {/* Globe Background */}
        <div className="absolute inset-0 z-10 opacity-50">
          <World 
            globeConfig={globeConfig} 
            data={globeData} 
          />
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-20 text-center py-20 px-4 max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
            Bienvenido a <span className="text-blue-400">ProTalent</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            La plataforma que conecta el talento de TECSUP con las mejores oportunidades de prácticas profesionales
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard/ofertas" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <BuildingOfficeIcon className="h-5 w-5" />
              Explorar Ofertas
            </Link>
            <Link 
              href="/dashboard/empresas" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <UserGroupIcon className="h-5 w-5" />
              Ver Empresas
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tu Futuro Profesional Comienza Aquí</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              ProTalent es la plataforma que conecta a los estudiantes y egresados de TECSUP con las mejores oportunidades de prácticas y empleo en empresas líderes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />,
                title: 'Para Empresas',
                description: 'Publica ofertas de prácticas, encuentra talento calificado y gestiona postulaciones en una sola plataforma.'
              },
              {
                icon: <UserGroupIcon className="h-8 w-8 text-green-600" />,
                title: 'Para Estudiantes',
                description: 'Encuentra prácticas profesionales que se ajusten a tu perfil y da el primer paso en tu carrera profesional.'
              },
              {
                icon: <LightBulbIcon className="h-8 w-8 text-purple-600" />,
                title: 'IA Asistida',
                description: 'Nuestro sistema de IA te ayuda a encontrar las mejores coincidencias entre ofertas y candidatos.'
              },
              {
                icon: <ChartBarIcon className="h-8 w-8 text-yellow-600" />,
                title: 'Métricas en Tiempo Real',
                description: 'Accede a estadísticas y seguimiento de tus postulaciones o procesos de selección.'
              },
              {
                icon: <ClockIcon className="h-8 w-8 text-red-600" />,
                title: 'Ahorra Tiempo',
                description: 'Automatizamos los procesos para que te centres en lo que realmente importa: encontrar el talento o la oportunidad perfecta.'
              },
              {
                icon: <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />,
                title: 'Seguro y Confiable',
                description: 'Tus datos están protegidos con los más altos estándares de seguridad y privacidad.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="w-12 h-12 rounded-lg bg-opacity-10 flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.icon.props.className.includes('blue') ? 'rgba(37, 99, 235, 0.1)' : feature.icon.props.className.includes('green') ? 'rgba(22, 163, 74, 0.1)' : feature.icon.props.className.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : feature.icon.props.className.includes('yellow') ? 'rgba(234, 179, 8, 0.1)' : feature.icon.props.className.includes('red') ? 'rgba(220, 38, 38, 0.1)' : 'rgba(79, 70, 229, 0.1)'}` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para impulsar tu carrera profesional?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a miles de estudiantes que ya están dando el primer paso hacia su futuro profesional con ProTalent.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard/postulaciones/nueva" 
              className="px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-full font-medium transition-colors flex items-center gap-2"
        >
              <BuildingOfficeIcon className="h-5 w-5" />
              Crear Postulación
            </Link>
            <Link 
              href="/dashboard/perfil/editar" 
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:bg-opacity-10 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <UserGroupIcon className="h-5 w-5" />
              Completar Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
