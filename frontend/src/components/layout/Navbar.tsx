import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '../ui/Button';

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">SENA Management</span>
            </Link>
          </div>

          <div className="flex items-center">
            {children}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 