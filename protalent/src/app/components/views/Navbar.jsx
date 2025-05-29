'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/auth/AuthContext';

export default function AuthNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center text-white text-xl font-bold">
          <Image src="/logo.jpg" alt="Logo de ProTalent" width={80} height={100} priority className="mr-2" />
          ProTalent
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link href="/dashboard/perfil" className="text-white">Perfil</Link>
              <button onClick={logout} className="text-red-400">Cerrar Sesión</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white">Login</Link>
              <Link href="/auth/register" className="text-white">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}