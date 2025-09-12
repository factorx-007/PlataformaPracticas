'use client';
import { FiUsers, FiBriefcase, FiFileText, FiActivity, FiTrendingUp, FiBarChart2, FiPieChart, FiMessageSquare, FiEdit3, FiTag } from 'react-icons/fi';

// Datos ficticios para las métricas y gráficas
const resumenData = {
  totalUsuarios: Math.floor(Math.random() * 2000) + 500, // Entre 500 y 2500
  nuevosUsuariosSemana: Math.floor(Math.random() * 100) + 10, // Entre 10 y 110
  totalEmpresas: Math.floor(Math.random() * 500) + 50, // Entre 50 y 550
  totalOfertasActivas: Math.floor(Math.random() * 1000) + 100, // Entre 100 y 1100
  postulacionesRecibidasHoy: Math.floor(Math.random() * 50) + 5, // Entre 5 y 55
  tasaConversionGeneral: (Math.random() * (20 - 5) + 5).toFixed(1), // Entre 5.0 y 20.0
};

const MetricCard = ({ title, value, icon, color, trend, unit = '' }) => {
  const IconComponent = icon;
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 ${color || 'border-sky-500'}`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <IconComponent className={`w-8 h-8 ${color ? color.replace('border-', 'text-') : 'text-sky-500'}`} />
      </div>
      <p className="text-4xl font-bold text-gray-800">{value}{unit}</p>
      {trend && (
        <p className={`text-sm mt-1 flex items-center ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          <FiTrendingUp className={`w-4 h-4 mr-1 ${trend.startsWith('-') ? 'transform rotate-180' : ''}`} /> {trend}
        </p>
      )}
    </div>
  );
};

const PlaceholderChart = ({ title, type }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
      {type === 'bar' && <FiBarChart2 className="w-16 h-16 text-gray-400" />}
      {type === 'pie' && <FiPieChart className="w-16 h-16 text-gray-400" />}
      <p className="ml-4 text-gray-500">Placeholder para gráfica de {type === 'bar' ? 'barras' : 'pastel'}</p>
    </div>
    <p className="text-xs text-gray-400 mt-2 text-center">Los datos reales se mostrarán aquí.</p>
  </div>
);

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resumen General del Sistema</h1>
      
      {/* Sección de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        <MetricCard title="Total Usuarios" value={resumenData.totalUsuarios} icon={FiUsers} color="border-sky-500" trend={`+${resumenData.nuevosUsuariosSemana} esta semana`} />
        <MetricCard title="Empresas Registradas" value={resumenData.totalEmpresas} icon={FiBriefcase} color="border-teal-500" trend="+5 nuevas" />
        <MetricCard title="Ofertas Activas" value={resumenData.totalOfertasActivas} icon={FiFileText} color="border-indigo-500" trend="+20 hoy" />
        <MetricCard title="Tasa de Conversión" value={resumenData.tasaConversionGeneral} unit="%" icon={FiActivity} color="border-amber-500" trend="+1.2% vs mes anterior"/>
      </div>

      {/* Sección de Gráficas Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <PlaceholderChart title="Crecimiento de Usuarios (Últimos 6 Meses)" type="bar" />
        <PlaceholderChart title="Distribución de Ofertas por Categoría" type="pie" />
      </div>

      {/* Atajos Rápidos o Actividad Reciente (Ejemplos) */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Atajos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Nuevos Usuarios', icon: FiUsers, count: resumenData.nuevosUsuariosSemana, color: 'text-sky-600' },
            { title: 'Postulaciones Hoy', icon: FiActivity, count: resumenData.postulacionesRecibidasHoy, color: 'text-purple-600' },
            { title: 'Comentarios Pendientes', icon: FiMessageSquare, count: Math.floor(Math.random()*10), color: 'text-orange-600' },
            { title: 'Nuevos Blog Posts', icon: FiEdit3, count: Math.floor(Math.random()*5), color: 'text-green-600' },
            { title: 'Categorías por Revisar', icon: FiTag, count: Math.floor(Math.random()*3), color: 'text-red-600' },
          ].map(item => (
            <div key={item.title} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center cursor-pointer">
              <item.icon className={`w-10 h-10 mb-2 ${item.color}`} />
              <h3 className="text-md font-semibold text-gray-700">{item.title}</h3>
              <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder para una tabla de Actividad Reciente */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Actividad Reciente del Sistema</h2>
        <ul className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <li key={i} className="py-3 flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500`}>
                {i % 3 === 0 ? <FiUsers/> : i % 3 === 1 ? <FiFileText/> : <FiBriefcase/>}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Acción ficticia #{i + 1} en el sistema.</p>
                <p className="text-xs text-gray-500">Hace {Math.floor(Math.random() * 59) + 1} minutos</p>
              </div>
            </li>
          ))}
        </ul>
        <button className="mt-4 text-sm text-sky-600 hover:text-sky-800 font-medium">Ver toda la actividad</button>
      </div>

    </div>
  );
} 