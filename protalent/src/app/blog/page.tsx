'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  FiImage, 
  FiSmile, 
  FiSend, 
  FiMoreHorizontal 
} from 'react-icons/fi';

// Importaciones de componentes
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PostComponent from './components/Post';
import StoryComponent from './components/Story';
import BaseCard from './components/BaseCard';

// Importaciones de datos
import { stories, posts, friendSuggestions } from './data';

export default function BlogPage() {
  const [postContent, setPostContent] = useState('');

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      console.log('Publicando:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar izquierdo */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 max-w-4xl mx-auto py-8 px-4">
        {/* Crear publicación */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src="/images/avatar.jpg" 
                alt="Tu avatar" 
                width={40} 
                height={40} 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <textarea 
                placeholder="What's on your mind?" 
                className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex space-x-3">
                  <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                    <FiImage className="mr-2 text-green-500" /> Image/Video
                  </button>
                  <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm">
                    <FiSmile className="mr-2 text-yellow-500" /> Feeling
                  </button>
                </div>
                <button 
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                  onClick={handlePostSubmit}
                >
                  <FiSend className="mr-2" /> Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Historias */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {stories.map((story) => (
              <StoryComponent key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Publicaciones */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostComponent key={post.id} post={post} />
          ))}
        </div>
      </main>

      {/* Sidebar derecho */}
      <aside className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
        {/* Contactos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Contacts</h3>
            <button className="text-blue-500 text-xs">See all</button>
          </div>
          <div className="space-y-3">
            {friendSuggestions.map((friend) => (
              <div 
                key={friend.id} 
                className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src={friend.avatar} 
                      alt={friend.name} 
                      width={40} 
                      height={40} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{friend.name}</p>
                    <p className="text-xs text-gray-500">{friend.mutualFriends} mutual friends</p>
                  </div>
                </div>
                <button className="text-blue-500 text-xs hover:text-blue-600">Add</button>
              </div>
            ))}
          </div>
        </div>

        {/* Grupos */}
        <BaseCard 
          title="Design Enthusiasts" 
          description="A community for passionate designers to share ideas and grow together."
          image="/images/group-design.jpg"
          actions={
            <>
              <button className="flex-1 text-gray-600 hover:text-blue-600 text-sm">
                256 Members
              </button>
              <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
                Join
              </button>
            </>
          }
        />

        {/* Eventos */}
        <BaseCard 
          title="Design Conference 2024" 
          description="Join us for the most anticipated design event of the year!"
          image="/images/design-conference.jpg"
          actions={
            <>
              <div className="flex-1 text-gray-600 text-sm">
                June 15-16, 2024
              </div>
              <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm">
                Attend
              </button>
            </>
          }
        />
      </aside>
    </div>
  );
}
