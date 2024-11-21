import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, FileText, BarChart2, Layout } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Layout },
    { path: '/instructors', label: 'Instructores', icon: Users },
    { path: '/activities', label: 'Actividades', icon: Calendar },
    { path: '/events', label: 'Eventos', icon: FileText },
    { path: '/reports', label: 'Reportes', icon: BarChart2 },
  ];

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">
            SENA Manager
          </Link>
          <div className="flex space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === path
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;