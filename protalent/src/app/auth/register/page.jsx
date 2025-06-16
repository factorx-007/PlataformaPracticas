'use client';
import AuthNavbar from '../../components/views/Navbar';
import AuthForm from '../../components/auth/AuthForm';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const DotGrid = dynamic(
  () => import('../../components/ui/DotGrid'),
  { ssr: false }
);

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <AuthNavbar />
      <DotGrid
        dotSize={4}
        gap={16}
        baseColor="#6366f1"
        activeColor="#4f46e5"
        proximity={200}
        shockRadius={250}
        shockStrength={20}
        resistance={1200}
        returnDuration={2}
        className="fixed inset-0 z-0 opacity-50"
      />
      <main className="relative z-10 flex flex-col items-center justify-center w-full min-h-[calc(100vh-4rem)] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/80 border border-indigo-100 shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-xl mx-2"
        >
          <AuthForm type="register" />
        </motion.div>
      </main>
    </div>
  );
}