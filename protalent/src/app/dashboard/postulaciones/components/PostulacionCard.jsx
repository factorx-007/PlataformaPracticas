'use client';
import React from 'react';
import { 
  BriefcaseIcon, 
  CalendarIcon, 
  MapPinIcon, 
  SignalIcon 
} from '@heroicons/react/24/outline';

const PostulacionCard = ({ postulacion, oferta }) => {
  const getStatusColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform transition-all hover:scale-105">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {oferta?.titulo || 'Oferta no disponible'}
            </h3>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(postulacion.estado)}`}>
              {postulacion.estado}
            </div>
          </div>
          <div className="text-gray-500">
            {new Date(postulacion.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="space-y-3 text-gray-600">
          <div className="flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span>{oferta?.empresa?.nombre || 'Empresa no especificada'}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-green-500" />
            <span>{oferta?.ubicacion || 'Ubicación no especificada'}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
            <span>Duración: {oferta?.duracion || 'No especificada'}</span>
          </div>
        </div>

        {postulacion.mensaje && (
          <div className="mt-4 border-t pt-4 text-sm text-gray-700">
            <p className="italic">{postulacion.mensaje}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SignalIcon className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">
            {postulacion.estado === 'PENDIENTE' 
              ? 'En revisión' 
              : postulacion.estado === 'ACEPTADA' 
                ? 'Aprobada' 
                : 'Finalizada'}
          </span>
        </div>
        <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default PostulacionCard;
