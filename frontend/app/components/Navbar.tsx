'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '../lib/auth';
import { 
  PencilSquareIcon, 
  MoonIcon, 
  SunIcon, 
  Bars3Icon, 
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';

export default function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After component mounts, we can safely show the UI that depends on theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check authentication status on client side
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
    };
    
    if (mounted) {
      checkAuth(); // Check immediately once mounted
      
      // Set an interval to check auth status regularly
      const interval = setInterval(checkAuth, 2000);
      
      // Re-check auth status when localStorage changes
      const handleStorageChange = () => {
        checkAuth();
      };
  
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [mounted]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    router.push('/');
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href} 
      className="text-foreground/90 hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-foreground/10"
      onClick={() => setMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  // Only render actual UI content after mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/40 dark:bg-background/30 border-b border-foreground/10 shadow-sm">
        <div className="mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Empty skeleton when not mounted */}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/40 dark:bg-background/30 border-b border-foreground/10 shadow-sm">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image 
              src="/file.svg"
              width={28}
              height={28}
              alt="Xnote Logo"
              className="group-hover:scale-110 transition-transform"
              style={{ filter: "brightness(0) saturate(100%) invert(33%) sepia(93%) saturate(1352%) hue-rotate(222deg) brightness(99%) contrast(96%)" }}
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Xnote</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-2">
            {authenticated && (
              <button
                onClick={handleLogout}
                className="ml-4 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-md px-4 py-2 rounded-md transition-all hover:scale-105"
              >
                Logout
              </button>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Show logout button in mobile header too */}
            {authenticated && (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-3 py-1.5 rounded-md"
              >
                Logout
              </button>
            )}
            
            {/* Theme Toggle Button (Mobile) */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-foreground/10 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 
                <SunIcon className="w-5 h-5 text-yellow-300" /> : 
                <MoonIcon className="w-5 h-5 text-indigo-500" />
              }
            </button>
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-foreground/10 transition-colors"
            >
              {mobileMenuOpen ? 
                <XMarkIcon className="w-6 h-6" /> : 
                <Bars3Icon className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "md:hidden absolute w-full backdrop-blur-lg bg-background/50 dark:bg-background/40 border-b border-foreground/10 shadow-lg transform transition-transform duration-200 ease-in-out", 
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="mx-auto px-4 py-4 space-y-3">
          {authenticated && (
            <button
              onClick={handleLogout}
              className="w-full text-left bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-md px-4 py-2 rounded-md transition-all"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
} 