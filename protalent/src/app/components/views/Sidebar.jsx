import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Inicio', icon: '🏠' },
  { href: '/dashboard/postulaciones', label: 'Mis Postulaciones', icon: '📄' },
  { href: '/dashboard/perfil', label: 'Perfil', icon: '👤' },
  { href: '/dashboard/ofertas', label: 'Ofertas', icon: '💼' },
  { href: '/dashboard/empresas', label: 'Empresas', icon: '🏢' },
  // Puedes agregar más enlaces aquí
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-800">
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {links.map(link => {
            const icons = {
              '/dashboard': '<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
              '/dashboard/postulaciones': '<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
              '/dashboard/perfil': '<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
              '/dashboard/ofertas': '<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
              '/dashboard/empresas': '<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
            };
            
            return (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 
                    ${pathname === link.href 
                      ? 'bg-blue-900/40 text-blue-100 shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-blue-200'
                    }`}
                >
                  <span className="mr-3" dangerouslySetInnerHTML={{__html: icons[link.href]}}></span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">ProTalent Enterprise</p>
            <p className="text-xs text-slate-500">© 1995-2024</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">PT</span>
          </div>
        </div>
      </div>
    </aside>
  );
} 