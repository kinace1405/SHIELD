import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  GraduationCap, 
  Settings,
  Bell,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  user: {
    username: string;
    subscriptionTier: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const Logo = () => (
    <div className="flex items-center gap-4">
      <img 
        src="/SenSafe-AI-Logo-2024-header.png"  // Make sure this matches your exact filename
        alt="Senator Safety Logo"
        className="w-12 h-12 object-contain"
        onError={(e) => {
          console.error('Image failed to load');
          console.log('Image path:', e.currentTarget.src);
        }}
      />
      <div>
        <h1 className="text-2xl font-bold text-white">Senator Safety</h1>
        <p className="text-sm text-gray-400">QHSE Management Solutions</p>
      </div>
    </div>
  );
  
        {/* Laurel Wreath */}
        <path 
          d="M35 150 L75 150 L55 120 Z M38 130 L72 130 L55 100 Z M40 110 L70 110 L55 80 Z" 
          fill="#16A34A"
          className="animate-pulse-slow"
        />
        <path 
          d="M0 180 L150 80 L300 180 M150 180 L280 100 L400 180" 
          fill="#C0C0C0"
        />

        {/* Shield at top */}
        <path 
          d="M180 20 L220 20 L220 60 L200 80 L180 60 Z" 
          fill="#7C3AED"
          className="animate-pulse-slow"
        />
      </svg>
      <div>
        <h1 className="text-2xl font-bold text-white">Senator Safety</h1>
        <p className="text-sm text-gray-400">QHSE Management Solutions</p>
      </div>
    </div>
  );

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Shield },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/training', label: 'Training', icon: GraduationCap }
  ];

  return (
    <header className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Logo />

            <nav className="hidden md:flex items-center gap-4">
              {navigationItems.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-gray-300 hover:bg-custom-purple/10 hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-custom-purple rounded-full" />
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {user && (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-custom-purple/20 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="hidden md:inline">{user.username}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 hidden group-hover:block">
                  <a 
                    href="/profile" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Profile Settings
                  </a>
                  <a 
                    href="/subscription" 
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Subscription
                  </a>
                  <hr className="my-2 border-gray-700" />
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                <Icon className="w-5 h-5" />
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;