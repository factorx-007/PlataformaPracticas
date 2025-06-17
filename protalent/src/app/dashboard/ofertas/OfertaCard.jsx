import React from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CalendarIcon, 
  DollarSignIcon 
} from 'lucide-react';

export default function OfertaCard({ oferta, onPostular, onEditar }) {
  // Función para generar un color de fondo basado en el título
  const generateBackgroundColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  };

  // Renderizar imagen o placeholder de color
  const renderImageOrPlaceholder = () => {
    if (oferta.imagen) {
      return (
        <img 
          src={oferta.imagen} 
          alt={oferta.titulo} 
          className="w-full h-full object-cover absolute inset-0"
        />
      );
    }
    
    const bgColor = generateBackgroundColor(oferta.titulo);
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-3xl font-bold text-white opacity-70">
          {oferta.titulo.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl overflow-hidden h-[400px] w-[300px] flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {renderImageOrPlaceholder()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold line-clamp-2">{oferta.titulo}</h3>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          {oferta.empresa && (
            <div className="flex items-center text-sm text-gray-600">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-blue-500" />
              <span className="line-clamp-1">{oferta.empresa}</span>
            </div>
          )}
          {oferta.ubicacion && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2 text-green-500" />
              <span className="line-clamp-1">{oferta.ubicacion}</span>
            </div>
          )}
          {oferta.fechaInicio && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
              <span>
                Inicio: {new Date(oferta.fechaInicio).toLocaleDateString()}
              </span>
            </div>
          )}
          {oferta.salario && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSignIcon className="h-4 w-4 mr-2 text-green-600" />
              <span>{oferta.salario}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2 w-full">
            <button
              onClick={() => onPostular(oferta.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Postular
            </button>
            <button
              onClick={() => onEditar(oferta.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 