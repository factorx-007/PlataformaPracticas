'use client';

import Link from 'next/link';
import { SparklesCore } from "../components/ui/sparkles"
import { BuildingOfficeIcon, UserGroupIcon, LightBulbIcon, ChartBarIcon, ClockIcon, ShieldCheckIcon, ArrowsPointingOutIcon, DevicePhoneMobileIcon, ChatBubbleLeftRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center overflow-hidden">
      {/* Hero Section with Sparkles */}
      <div className="w-full relative pt-24">
        <div className="absolute inset-0 w-full h-full">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        
        <div className="relative z-20 text-center py-20 px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
            Bienvenido a <span className="text-blue-400">ProTalent</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
            La plataforma que conecta el talento de TECSUP con las mejores oportunidades de prácticas profesionales
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-10">
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
        </div>
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
              <div key={index} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-opacity-10 flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.icon.props.className.includes('blue') ? 'rgba(37, 99, 235, 0.1)' : feature.icon.props.className.includes('green') ? 'rgba(22, 163, 74, 0.1)' : feature.icon.props.className.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : feature.icon.props.className.includes('yellow') ? 'rgba(234, 179, 8, 0.1)' : feature.icon.props.className.includes('red') ? 'rgba(220, 38, 38, 0.1)' : 'rgba(79, 70, 229, 0.1)'}` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona ProTalent?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Sencillos pasos para conectar el talento con las mejores oportunidades
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Regístrate', description: 'Crea tu perfil en minutos' },
              { number: '2', title: 'Completa tu perfil', description: 'Añade tus habilidades y experiencia' },
              { number: '3', title: 'Explora ofertas', description: 'Encuentra prácticas que se ajusten a tu perfil' },
              { number: '4', title: 'Postúlate', description: 'Envía tu solicitud en un clic' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="w-full bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Beneficios de usar ProTalent</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              La plataforma que revoluciona la búsqueda de prácticas profesionales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Benefit 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ArrowsPointingOutIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Mayor Alcance</h3>
                <p className="text-gray-600">Conecta con cientos de empresas y oportunidades que no encontrarías de otra manera.</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Acceso Móvil</h3>
                <p className="text-gray-600">Gestiona tus postulaciones desde cualquier dispositivo, en cualquier momento.</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comunicación Directa</h3>
                <p className="text-gray-600">Chatea directamente con los reclutadores y resuelve tus dudas en tiempo real.</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Cog6ToothIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personalización</h3>
                <p className="text-gray-600">Recibe recomendaciones personalizadas basadas en tu perfil e intereses.</p>
              </div>
            </div>
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

      {/* Quick Stats */}
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600">Estudiantes activos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">200+</div>
              <p className="text-gray-600">Empresas asociadas</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">1,000+</div>
              <p className="text-gray-600">Oportunidades</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-600 mb-2">95%</div>
              <p className="text-gray-600">Tasa de satisfacción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}