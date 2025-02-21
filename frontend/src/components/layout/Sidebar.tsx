import { cn } from '@/lib/cn';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Definir la interfaz para las props del Sidebar
interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Instructores', href: '/instructores', icon: UserGroupIcon },
  { name: 'Actividades', href: '/actividades', icon: ClipboardDocumentListIcon },
  { name: 'Eventos', href: '/eventos', icon: CalendarIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-6 w-6 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;