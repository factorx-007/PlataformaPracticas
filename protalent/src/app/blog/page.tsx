'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiImage, FiMapPin, FiSmile, FiEdit2, FiMoreHorizontal } from 'react-icons/fi';

// Importar todos los componentes
import PostComponent from './components/Post';
import StoryComponent from './components/Story';
import FriendSuggestionComponent from './components/FriendSuggestion';
import EventCardComponent from './components/EventCard';
import GroupCardComponent from './components/GroupCard';
import ActivityCardComponent from './components/ActivityCard';
import ArticleCardComponent from './components/ArticleCard';
import TopBarComponent from './components/TopBar';
import SidebarComponent from './components/Sidebar';
import ProfileCardComponent from './components/ProfileCard';

// Importar datos
import { stories, posts, friendSuggestions } from './data';

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [postContent, setPostContent] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim()) {
      console.log('Publicando:', postContent);
      setPostContent('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBarComponent />
      
      <div className="flex">
        {/* Sidebar izquierdo */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image 
                src="/images/avatar.jpg" 
                alt="Angela Lee" 
                width={48} 
                height={48} 
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">Angela Lee</h2>
              <p className="text-xs text-gray-500">@angelee</p>
            </div>
            <button className="ml-auto text-gray-500 hover:text-blue-600">
              <FiEdit2 />
            </button>
          </div>

          {/* Estadísticas de perfil */}
          <div className="grid grid-cols-3 text-center">
            <div>
              <p className="font-bold text-blue-600">683</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div>
              <p className="font-bold text-blue-600">5.7K</p>
              <p className="text-xs text-gray-500">Friends</p>
            </div>
            <div>
              <p className="font-bold text-blue-600">296</p>
              <p className="text-xs text-gray-500">Photos</p>
            </div>
          </div>

          {/* Menú lateral */}
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer">
              <FiImage className="text-blue-500" />
              <span>Timeline</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer">
              <FiSmile className="text-green-500" />
              <span>Friends</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer">
              <FiMapPin className="text-red-500" />
              <span>Groups</span>
            </div>
          </nav>

          {/* Grupos */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Groups</h3>
            <div className="space-y-3">
              <GroupCardComponent />
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 p-6 space-y-6">
          {/* Crear publicación */}
          <div className="bg-white rounded-xl shadow-md p-4">
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                    onClick={handlePostSubmit}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Historias */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex overflow-x-auto space-x-4 pb-2">
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
        </div>

        {/* Sidebar derecho */}
        <div className="w-80 bg-white border-l border-gray-200 p-4 space-y-6">
          {/* Completar perfil */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Complete Your Profile</h3>
              <span className="text-xs text-blue-600">80%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>

          {/* Contactos */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Contacts</h3>
              <button className="text-blue-500 text-xs">See all</button>
            </div>
            <div className="space-y-3">
              {friendSuggestions.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between">
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
                  <button className="text-blue-500 text-xs">Add</button>
                </div>
              ))}
            </div>
          </div>

          {/* Grupos */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Groups</h3>
              <button className="text-blue-500 text-xs">See all</button>
            </div>
            <div className="space-y-3">
              <GroupCardComponent />
              <GroupCardComponent />
            </div>
          </div>

          {/* Eventos */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Upcoming Events</h3>
              <button className="text-blue-500 text-xs">See all</button>
            </div>
            <EventCardComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
