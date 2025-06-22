import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiCalendar,
  FiImage,
  FiVideo,
  FiBookmark,
  FiClock,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';
import Image from 'next/image';

const navItems = [
  { icon: <FiHome size={20} />, label: 'Timeline', path: '/blog' },
  { icon: <FiUsers size={20} />, label: 'Friends', path: '/blog/friends' },
  { icon: <FiUser size={20} />, label: 'Profile', path: '/blog/profile' },
  { icon: <FiCalendar size={20} />, label: 'Events', path: '/blog/events' },
  { icon: <FiImage size={20} />, label: 'Photos', path: '/blog/photos' },
  { icon: <FiVideo size={20} />, label: 'Videos', path: '/blog/videos' },
  { icon: <FiBookmark size={20} />, label: 'Saved', path: '/blog/saved' },
  { icon: <FiClock size={20} />, label: 'Memories', path: '/blog/memories' },
  { icon: <FiSettings size={20} />, label: 'Settings', path: '/blog/settings' },
  { icon: <FiHelpCircle size={20} />, label: 'Help', path: '/blog/help' },
];

export default function Sidebar() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 space-y-4 sticky top-4 max-w-xs mx-auto">
      <div className="flex items-center space-x-3 border-b pb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100">
          <Image 
            src="/images/avatar.jpg" 
            alt="User Avatar" 
            width={48} 
            height={48} 
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Juan Pérez</h3>
          <p className="text-xs text-gray-500">Desarrollador Web</p>
        </div>
      </div>

      <nav className="space-y-2">
        <SidebarItem 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
          text="Inicio"
        />
        <SidebarItem 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          text="Perfil"
        />
        <SidebarItem 
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          text="Mensajes"
        />
      </nav>

      <div className="border-t pt-4">
        <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
          Crear Publicación
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-md cursor-pointer transition-colors">
      {icon}
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
