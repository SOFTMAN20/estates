/**
 * MOBILE BOTTOM NAVIGATION - AIRBNB STYLE
 * =======================================
 * 
 * Mobile bottom navigation bar similar to Airbnb's design
 * Provides easy access to main app sections on mobile devices
 * 
 * FEATURES:
 * - 5 main navigation items (Explore, Wishlists, Log in, Profile)
 * - Active state highlighting
 * - Smooth animations and transitions
 * - Responsive design optimized for mobile
 * - Icons with labels
 * - Authentication-aware navigation
 * - Auto-hide on scroll down, show on scroll up
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  requiresAuth?: boolean;
  guestPath?: string; // Alternative path for non-authenticated users
}

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Handle scroll to show/hide navigation - Airbnb style with auto-show on stop
  useEffect(() => {
    let lastScroll = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Always show when at top (within 10px)
      if (currentScroll <= 10) {
        setIsVisible(true);
        lastScroll = currentScroll;
        return;
      }
      
      // Hide when scrolling down past 60px
      if (currentScroll > lastScroll && currentScroll > 60) {
        setIsVisible(false);
      }
      // Show when scrolling up
      else if (currentScroll < lastScroll) {
        setIsVisible(true);
      }
      
      lastScroll = currentScroll;
      
      // Show navigation after user stops scrolling for 1 second
      scrollTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Define navigation items similar to Airbnb
  const navItems: NavItem[] = [
    {
      id: 'home',
      icon: <Home className="h-5 w-5" />,
      label: 'Home',
      path: '/'
    },
    {
      id: 'explore',
      icon: <Search className="h-5 w-5" />,
      label: 'Explore',
      path: '/browse'
    },
    {
      id: 'wishlists',
      icon: <Heart className="h-5 w-5" />,
      label: 'Wishlists',
      path: '/favorites'
    },
    {
      id: 'host',
      icon: <Building2 className="h-5 w-5" />,
      label: user ? 'Host' : 'Host',
      path: user ? '/dashboard' : '/signup?type=landlord'
    },
    {
      id: 'profile',
      icon: <User className="h-5 w-5" />,
      label: user ? 'Profile' : 'Log in',
      path: user ? '/profile' : '/signin'
    }
  ];

  // Check if current path matches nav item
  const isActive = (path: string) => {
    // Exact match for home
    if (path === '/') {
      return location.pathname === '/';
    }
    // Exact match for browse
    if (path === '/browse') {
      return location.pathname === '/browse';
    }
    // Exact match for favorites
    if (path === '/favorites') {
      return location.pathname === '/favorites';
    }
    // Dashboard or signup for host tab
    if (path === '/dashboard' || path === '/signup?type=landlord') {
      return location.pathname === '/dashboard' || location.pathname.startsWith('/signup');
    }
    // Profile or signin for profile tab
    if (path === '/profile' || path === '/signin') {
      return location.pathname === '/profile' || location.pathname === '/signin' || location.pathname === '/signup';
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Bottom Navigation Bar - Only visible on mobile, hides on scroll down */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg" 
        style={{ 
          width: '100%', 
          maxWidth: '100vw', 
          overflow: 'hidden',
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div 
          className="flex items-stretch w-full" 
          style={{ display: 'flex', width: '100%', padding: '0', margin: '0' }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 min-w-0"
                style={{ 
                  color: active ? '#D97706' : '#6B7280',
                  flex: '1 1 0%',
                  minWidth: '0',
                  padding: '8px 2px',
                  textDecoration: 'none'
                }}
              >
                <div style={{ 
                  transform: active ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.2s'
                }}>
                  <div style={{ 
                    height: '20px', 
                    width: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {item.icon}
                  </div>
                </div>
                <span 
                  style={{ 
                    fontSize: '9px',
                    marginTop: '2px',
                    fontWeight: '500',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}
                >
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                {active && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#D97706',
                    borderRadius: '50%'
                  }} />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Bottom padding spacer for content - Only on mobile */}
      <div className="md:hidden w-full" style={{ height: '56px' }} />
    </>
  );
};

export default MobileBottomNav;
