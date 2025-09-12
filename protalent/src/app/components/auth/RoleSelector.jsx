'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiHome } from 'react-icons/fi';

export default function RoleSelector({ onClose }) {
  const [selectedRole, setSelectedRole] = useState('');

  const handleGoogleSignIn = () => {
    if (!selectedRole) {
      alert('Por favor selecciona un rol antes de continuar');
      return;
    }

    // Store the selected role in localStorage to use after OAuth callback
    localStorage.setItem('selectedRole', selectedRole);
    
    signIn('google', {
      callbackUrl: '/dashboard',
      redirect: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl border border-[#38bdf8]/20 rounded-3xl p-8 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold text-white text-center mb-6">
          Selecciona tu rol
        </h3>
        
        <div className="space-y-4 mb-6">
          <label className="flex items-center p-4 rounded-lg border-2 border-[#38bdf8]/30 cursor-pointer hover:border-[#38bdf8] transition-colors">
            <input
              type="radio"
              name="role"
              value="postulante"
              checked={selectedRole === 'postulante'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
              selectedRole === 'postulante' ? 'bg-[#38bdf8] border-[#38bdf8]' : 'border-gray-400'
            }`}></div>
            <FiUser className="text-[#38bdf8] mr-3" />
            <div>
              <div className="text-white font-medium">Postulante</div>
              <div className="text-gray-300 text-sm">Busco oportunidades laborales</div>
            </div>
          </label>

          <label className="flex items-center p-4 rounded-lg border-2 border-[#38bdf8]/30 cursor-pointer hover:border-[#38bdf8] transition-colors">
            <input
              type="radio"
              name="role"
              value="empresa"
              checked={selectedRole === 'empresa'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
              selectedRole === 'empresa' ? 'bg-[#38bdf8] border-[#38bdf8]' : 'border-gray-400'
            }`}></div>
            <FiHome className="text-[#38bdf8] mr-3" />
            <div>
              <div className="text-white font-medium">Empresa</div>
              <div className="text-gray-300 text-sm">Publico ofertas de trabajo</div>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-400 text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGoogleSignIn}
            disabled={!selectedRole}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              selectedRole 
                ? 'bg-white text-gray-700 hover:shadow-lg' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FcGoogle className="text-lg" />
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
