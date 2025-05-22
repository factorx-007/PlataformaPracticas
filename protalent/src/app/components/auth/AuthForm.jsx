'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/auth/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});

const registerSchema = loginSchema.extend({
  nombre: z.string().min(3, 'Mínimo 3 caracteres'),
  rol: z.enum(['postulante', 'empresa'])
});

export default function AuthForm({ type }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(type === 'login' ? loginSchema : registerSchema)
  });

  const { login, register: registerUser } = useAuth();

  const onSubmit = async (data) => {
    if (type === 'login') {
      await login(data.email, data.password);
    } else {
      await registerUser(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {type === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </h2>
        
        {type === 'register' && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre completo</label>
            <input 
              {...register('nombre')} 
              className={`w-full px-4 py-3 rounded-lg border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.nombre.message}</p>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
          <input 
            {...register('email')} 
            type="email"
            className={`w-full px-4 py-3 rounded-lg border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
          <input 
            {...register('password')} 
            type="password"
            className={`w-full px-4 py-3 rounded-lg border-2 focus:border-indigo-500 focus:outline-none transition-colors ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 animate-pulse">{errors.password.message}</p>
          )}
        </div>

        {type === 'register' && (
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2">Rol</label>
            <select 
              {...register('rol')} 
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors"
            >
              <option value="postulante">Postulante</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          {type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {type === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <a 
              href={type === 'login' ? '/auth/register' : '/auth/login'} 
              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              {type === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}