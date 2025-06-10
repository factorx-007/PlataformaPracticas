'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import api from '../../../app/lib/api';
import PostCard from '../../../app/components/blog/PostCard';
import CategoryFilter from '../../../app/components/blog/CategoryFilter';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comentariosAbiertos, setComentariosAbiertos] = useState({});
  const [nuevosComentarios, setNuevosComentarios] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener publicaciones con sus relaciones
        const [postsResponse, categoriasResponse] = await Promise.all([
          api.get('/api/posts?include=autor,categoria,comentarios'),
          api.get('/api/categorias')
        ]);
        
        setPosts(postsResponse.data);
        setCategorias(categoriasResponse.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar el blog. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
      try {
        await api.delete(`/api/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        console.error('Error al eliminar:', err);
        setError('No se pudo eliminar la publicación');
      }
    }
  };

  const toggleComentarios = (postId) => {
    setComentariosAbiertos(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleNuevoComentario = (postId, e) => {
    e.preventDefault();
    const contenido = nuevosComentarios[postId]?.trim();
    if (!contenido) return;

    // Aquí iría la lógica para enviar el comentario
    console.log('Nuevo comentario para el post', postId, ':', contenido);
    
    // Limpiar el campo de comentario
    setNuevosComentarios(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const postsFiltrados = categoriaSeleccionada === 'todas' 
    ? posts 
    : posts.filter(post => post.categoria?.nombre === categoriaSeleccionada);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
            <Link
              href="/dashboard/blog/nuevo"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Nueva publicación
            </Link>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <CategoryFilter 
            categories={categorias}
            selectedCategory={categoriaSeleccionada}
            onSelectCategory={setCategoriaSeleccionada}
          />
        </div>

        {/* Lista de publicaciones */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {postsFiltrados.length > 0 ? (
            postsFiltrados.map((post) => (
              <PostCard 
                key={post.id}
                post={post}
                onDelete={handleDelete}
                showActions={true}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No hay publicaciones
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {categoriaSeleccionada === 'todas'
                  ? 'Aún no hay publicaciones en el blog.'
                  : `No hay publicaciones en la categoría "${categoriaSeleccionada}".`}
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/blog/nuevo"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                  Crear publicación
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}