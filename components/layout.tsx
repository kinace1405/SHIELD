// components/layout.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Shield, 
  FileText, 
  GraduationCap, 
  Settings,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Calendar,
  BarChart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: {
    username: string;
    subscriptionTier: string;
  } | null;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Navigation items with proper routing
  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/training', label: 'Training', icon: GraduationCap },
    { href: '/shield', label: 'SHIELD', icon: Shield },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/reports', label: 'Reports', icon: BarChart },
  ];

  // Admin only navigation items
  const adminItems = [
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/modules', label: 'Modules', icon: BookOpen },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-custom-purple">
      <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  {/* Your existing Logo SVG */}
                  <svg viewBox="0 0 400 300" className="w-12 h-12">
                    {/* ... keep your existing SVG paths ... */}
                  </svg>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Senator Safety</h1>
                    <p className="text-sm text-gray-400">QHSE Management Solutions</p>
                  </div>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-4">
                {navigationItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isActive(href)
                        ? 'bg-custom-purple text-white'
                        : 'text-gray-300 hover:bg-custom-purple/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}

                {user?.subscriptionTier === 'emperor' && adminItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isActive(href)
                        ? 'bg-custom-purple text-white'
                        : 'text-gray-300 hover:bg-custom-purple/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-custom-purple rounded-full" />
                )}
              </button>

              {/* Settings */}
              <Link 
                href="/settings"
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-custom-purple/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="hidden md:inline">{user?.username}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 hidden group-hover:block">
                  <Link 
                    href="/profile"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    href="/subscription"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Subscription
                  </Link>
                  <hr className="my-2 border-gray-700" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700">
            <nav className="px-4 py-2 space-y-1">
              {navigationItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(href)
                      ? 'bg-custom-purple text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              {user?.subscriptionTier === 'emperor' && adminItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(href)
                      ? 'bg-custom-purple text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="fixed bottom-4 right-4 text-gray-400 text-sm">
        <div className="flex items-center gap-2">
          Powered by Senator Safety SHIELD
          <div className="w-4 h-4 rounded-full bg-custom-green animate-pulse" />
        </div>
      </footer>
    </div>
  );
};

export default Layout;