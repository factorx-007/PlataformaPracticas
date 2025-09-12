'use client';
import AuthForm from '../../components/auth/AuthForm';
import ImageCarousel from '../../components/views/ImageCarousel';
import AuthNavbar from '../../components/views/Navbar';

const images = [
  { src: '/img1.webp', alt: 'Talento 1' },
  { src: '/img2.webp', alt: 'Talento 2' },
  { src: '/img3.jpg', alt: 'Talento 3' },
];

export default function LoginPage() {
  return (
    <>
      <AuthNavbar />
      <div className="flex min-h-screen">
        {/* Sección izquierda - Carrusel */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center p-5">
          <ImageCarousel images={images} />
        </div>
        {/* Sección derecha - Formulario */}
        <div className="w-1/2  items-center justify-center p--1">
          <AuthForm type="login" />
        </div>
      </div>
    </>
  );
}
