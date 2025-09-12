'use client';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleSignInButton({ type = 'register' }) {
  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    signIn('google', {
      callbackUrl: type === 'register' ? '/auth/complete-profile' : '/dashboard',
      redirect: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 border border-gray-200"
    >
      <FcGoogle className="text-xl" />
      {type === 'register' ? 'Registrarse con Google' : 'Iniciar sesión con Google'}
    </button>
  );
}
