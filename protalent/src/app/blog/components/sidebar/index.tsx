import Image from 'next/image';
import { FiEdit2 } from 'react-icons/fi';
import SidebarMenu, { defaultMenuItems } from './SidebarMenu';
import SidebarGroups, { defaultGroups } from './SidebarGroups';
import SidebarShortcuts, { defaultShortcuts } from './SidebarShortcuts';

export default function Sidebar() {
  const handleProfileEdit = () => {
    console.log('Editar perfil');
  };

  const handleAddGroup = () => {
    console.log('Añadir nuevo grupo');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Perfil */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-100">
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
          <button 
            className="ml-auto text-gray-500 hover:text-blue-600"
            onClick={handleProfileEdit}
          >
            <FiEdit2 />
          </button>
        </div>
      </div>

      {/* Menú de navegación */}
      <SidebarMenu 
        title="Menu" 
        items={defaultMenuItems} 
        className="mt-4" 
      />

      {/* Grupos */}
      <SidebarGroups 
        title="My Groups" 
        groups={defaultGroups} 
        onAddGroup={handleAddGroup}
        className="mt-4" 
      />

      {/* Atajos */}
      <SidebarShortcuts 
        title="Quick Access" 
        shortcuts={defaultShortcuts} 
        className="mt-4" 
      />
    </div>
  );
}
