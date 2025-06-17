'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesCore } from '../../components/ui/sparkles';
import { ImageSwiper } from '../../components/ui/image-swiper';
import { 
  LayoutGridIcon, 
  ListIcon 
} from 'lucide-react';
import OfertaCard from './OfertaCard';
import api from '../../lib/api';

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const router = useRouter();

  useEffect(() => {
    fetchOfertas();
  }, []);

  const fetchOfertas = async () => {
    try {
      const { data } = await api.get('/api/ofertas');
      // Enriquecer los datos de la oferta si es necesario
      const enrichedOfertas = data.map(oferta => ({
        ...oferta,
        imagen: oferta.imagen || null,
        empresa: oferta.empresa || 'Empresa no especificada',
        ubicacion: oferta.ubicacion || 'Ubicación no especificada',
        fechaInicio: oferta.fechaInicio || null,
        salario: oferta.salario ? `$${oferta.salario}` : 'Salario no especificado'
      }));
      setOfertas(enrichedOfertas);
    } catch (error) {
      console.error('Error cargando ofertas:', error);
      // Manejar el error de manera amigable
      alert('No se pudieron cargar las ofertas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostular = async (ofertaId) => {
    try {
      // Navegar al formulario de postulación
      router.push(`/dashboard/postulaciones/crear/${ofertaId}`);
    } catch (error) {
      console.error('Error al postular:', error);
      alert('No se pudo procesar la postulación. Por favor, intenta de nuevo.');
    }
  };

  const handleEditar = (ofertaId) => {
    // Navegar al formulario de edición de oferta
    router.push(`/dashboard/ofertas/editar/${ofertaId}`);
  };

  const getOfertaImages = () => {
    return ofertas.map(oferta => 
      oferta.imagen || `https://via.placeholder.com/300x400.png?text=${encodeURIComponent(oferta.titulo)}`
    ).join(',');
  };

  const renderOfertaSwiper = () => {
    return (
      <div className="flex justify-center items-center w-full">
        <ImageSwiper 
          images={getOfertaImages()} 
          cardWidth={300} 
          cardHeight={400} 
          className="mb-8"
        >
          {(currentIndex) => (
            <div className="w-full h-full">
              <OfertaCard 
                oferta={ofertas[currentIndex]} 
                onPostular={handlePostular}
                onEditar={handleEditar}
              />
            </div>
          )}
        </ImageSwiper>
      </div>
    );
  };

  const renderOfertaGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ofertas.map((oferta) => (
          <motion.div
            key={oferta.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <OfertaCard 
              oferta={oferta} 
              onPostular={handlePostular}
              onEditar={handleEditar}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const renderOfertaList = () => {
    return (
      <div className="space-y-4">
        <AnimatePresence>
          {ofertas.map((oferta, index) => (
            <motion.div
              key={oferta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 
              }}
              className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{oferta.titulo}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {oferta.empresa || 'Sin empresa especificada'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handlePostular(oferta.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Postular
                  </button>
                  <button
                    onClick={() => handleEditar(oferta.id)}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative flex justify-center items-center h-screen bg-black">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="absolute inset-0 w-full h-full"
          particleColor="#FFFFFF"
        />
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 z-10"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Fondo de partículas */}
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

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Ofertas de Prácticas</h1>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2 bg-white/10 rounded-full p-1 mr-4">
                <button 
                  onClick={() => router.push('/dashboard/ofertas/crear')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  + Nueva Oferta
                </button>
              </div>
              <div className="flex space-x-2 bg-white/10 rounded-full p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white/50 hover:bg-white/20'
                  }`}
                >
                  <LayoutGridIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white/50 hover:bg-white/20'
                  }`}
                >
                  <ListIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {ofertas.length === 0 ? (
            <div className="text-center py-16 text-white">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/50">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">No hay ofertas disponibles</h3>
              <p className="mt-1 text-gray-400">Crea tu primera oferta de prácticas.</p>
            </div>
          ) : viewMode === 'grid' ? (
            renderOfertaSwiper()
          ) : viewMode === 'masonry' ? (
            renderOfertaGrid()
          ) : (
            renderOfertaList()
          )}
        </motion.div>
      </div>
    </div>
  );
} 