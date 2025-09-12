'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiUser, FiTag, FiHome, FiPhone, FiMapPin, FiFileText } from 'react-icons/fi';
import AuthNavbar from '../../components/views/Navbar';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const DotGrid = dynamic(
  () => import('../../components/ui/DotGrid'),
  { ssr: false }
);

const profileSchema = z.object({
  rol: z.enum(['postulante', 'empresa']),
  // Campos para postulante
  carrera: z.string().optional(),
  tipo: z.enum(['estudiante', 'egresado']).optional(),
  // Campos para empresa
  ruc: z.string().optional(),
  nombre_empresa: z.string().optional(),
  rubro: z.string().optional(),
  descripcion: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
}).refine((data) => {
  if (data.rol === 'postulante') {
    return data.carrera && data.tipo;
  }
  if (data.rol === 'empresa') {
    return data.ruc && data.nombre_empresa && data.rubro;
  }
  return true;
}, {
  message: "Todos los campos requeridos deben estar completos",
});

export default function CompleteProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  const selectedRole = watch('rol');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.googleData) {
      router.push('/auth/register');
      return;
    }
  }, [session, status, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: session.user.googleData.credential,
          rol: data.rol,
          // Datos adicionales según el rol
          ...(data.rol === 'postulante' && {
            carrera: data.carrera,
            tipo: data.tipo,
          }),
          ...(data.rol === 'empresa' && {
            ruc: data.ruc,
            nombre_empresa: data.nombre_empresa,
            rubro: data.rubro,
            descripcion: data.descripcion,
            direccion: data.direccion,
            telefono: data.telefono,
          }),
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Redirigir según el resultado
        if (userData.necesitaCompletarPerfil) {
          router.push(userData.redirectTo);
        } else {
          router.push('/dashboard');
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error al completar perfil:', error);
      alert('Error al completar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062056] to-black">
      <div className="text-white">Cargando...</div>
    </div>;
  }

  if (!session?.user?.googleData) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#062056] to-black">
      <AuthNavbar />
      <DotGrid
        dotSize={4}
        gap={16}
        baseColor="#062056"
        activeColor="#38bdf8"
        proximity={200}
        shockRadius={250}
        shockStrength={20}
        resistance={1200}
        returnDuration={2}
        className="fixed inset-0 z-0 opacity-30"
      />
      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/10 border border-[#38bdf8]/20 shadow-2xl rounded-3xl p-8 md:p-10 w-full max-w-2xl mx-2"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Completa tu perfil</h2>
            <p className="text-gray-300">Hola {session.user.googleData.name}, completa tu información para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selector de rol */}
            <div>
              <label className="block text-sm font-medium mb-4 text-gray-300">¿Qué tipo de cuenta necesitas?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center p-4 rounded-lg border-2 border-[#38bdf8]/30 cursor-pointer hover:border-[#38bdf8] transition-colors">
                  <input
                    {...register('rol')}
                    type="radio"
                    value="postulante"
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedRole === 'postulante' ? 'bg-[#38bdf8] border-[#38bdf8]' : 'border-gray-400'
                  }`}></div>
                  <FiUser className="text-[#38bdf8] mr-3" />
                  <div>
                    <div className="text-white font-medium">Postulante</div>
                    <div className="text-gray-300 text-sm">Busco oportunidades</div>
                  </div>
                </label>

                <label className="flex items-center p-4 rounded-lg border-2 border-[#38bdf8]/30 cursor-pointer hover:border-[#38bdf8] transition-colors">
                  <input
                    {...register('rol')}
                    type="radio"
                    value="empresa"
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedRole === 'empresa' ? 'bg-[#38bdf8] border-[#38bdf8]' : 'border-gray-400'
                  }`}></div>
                  <FiHome className="text-[#38bdf8] mr-3" />
                  <div>
                    <div className="text-white font-medium">Empresa</div>
                    <div className="text-gray-300 text-sm">Publico ofertas</div>
                  </div>
                </label>
              </div>
              {errors.rol && (
                <p className="mt-1 text-sm text-red-400">{errors.rol.message}</p>
              )}
            </div>

            {/* Campos para postulante */}
            {selectedRole === 'postulante' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Carrera</label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('carrera')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      placeholder="Ej: Ingeniería de Sistemas"
                    />
                  </div>
                  {errors.carrera && (
                    <p className="mt-1 text-sm text-red-400">{errors.carrera.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Estado</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      {...register('tipo')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white focus:outline-none focus:border-[#38bdf8] transition-colors"
                    >
                      <option value="" className="bg-[#062056]">Selecciona tu estado</option>
                      <option value="estudiante" className="bg-[#062056]">Estudiante</option>
                      <option value="egresado" className="bg-[#062056]">Egresado</option>
                    </select>
                  </div>
                  {errors.tipo && (
                    <p className="mt-1 text-sm text-red-400">{errors.tipo.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Campos para empresa */}
            {selectedRole === 'empresa' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">RUC</label>
                    <div className="relative">
                      <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('ruc')}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
                        placeholder="20123456789"
                        maxLength={11}
                      />
                    </div>
                    {errors.ruc && (
                      <p className="mt-1 text-sm text-red-400">{errors.ruc.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Nombre de la empresa</label>
                    <div className="relative">
                      <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('nombre_empresa')}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
                        placeholder="Mi Empresa S.A.C."
                      />
                    </div>
                    {errors.nombre_empresa && (
                      <p className="mt-1 text-sm text-red-400">{errors.nombre_empresa.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Rubro</label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('rubro')}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      placeholder="Ej: Tecnología, Retail, Construcción"
                    />
                  </div>
                  {errors.rubro && (
                    <p className="mt-1 text-sm text-red-400">{errors.rubro.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Descripción (opcional)</label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      {...register('descripcion')}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors resize-none"
                      placeholder="Describe brevemente tu empresa..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Teléfono (opcional)</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('telefono')}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
                        placeholder="999 999 999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Dirección (opcional)</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        {...register('direccion')}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#38bdf8]/30 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#38bdf8] transition-colors"
                        placeholder="Av. Principal 123"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#38bdf8] text-[#062056] py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-[#0ea5e9] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Completando perfil...' : 'Completar perfil'}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
