/**
 * ADMIN HEADER (SIMPLIFIED VERSION)
 * ==================================
 * 
 * Admin header with search and notifications
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Settings, 
  Activity, 
  LogOut, 
  Home,
  ChevronDown,
  Search,
  Building2,
  Users as UsersIcon,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'property' | 'user' | 'booking';
  title: string;
  subtitle: string;
  href: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

function AdminHeaderSimple() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    avatar_url?: string;
    role?: string;
  } | null>(null);

  // Fetch user profile
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setUserProfile(data));
    }
  }, [user]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Mock notifications - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Property Submission',
        message: 'A new property requires approval',
        type: 'info',
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'User Report',
        message: 'User reported inappropriate content',
        type: 'warning',
        read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  // Global search function
  const performSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    try {
      // Search properties
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, location, status')
        .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(5);

      if (properties) {
        properties.forEach(prop => {
          results.push({
            id: prop.id,
            type: 'property',
            title: prop.title,
            subtitle: `${prop.location} • ${prop.status}`,
            href: `/admin/properties?id=${prop.id}`,
          });
        });
      }

      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, name, role')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (users) {
        users.forEach(user => {
          results.push({
            id: user.id,
            type: 'user',
            title: user.name || 'Unnamed User',
            subtitle: `Role: ${user.role || 'user'}`,
            href: `/admin/users?id=${user.id}`,
          });
        });
      }

      // Search bookings by ID
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, status, properties(title)')
        .limit(5);

      if (bookings) {
        bookings.forEach(booking => {
          if (booking.id.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              id: booking.id,
              type: 'booking',
              title: `Booking #${booking.id.slice(0, 8)}`,
              subtitle: `${booking.properties?.title || 'Property'} • ${booking.status}`,
              href: `/admin/bookings?id=${booking.id}`,
            });
          }
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getSearchIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'property':
        return <Building2 className="h-4 w-4 text-blue-500" />;
      case 'user':
        return <UsersIcon className="h-4 w-4 text-green-500" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-purple-500" />;
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      navigate('/signin');
      toast.success('Signed out successfully');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Global Search */}
        <div className="max-w-xl">
          <Button
            variant="outline"
            className="w-full justify-start text-sm text-muted-foreground hover:bg-gray-50"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Search properties, users, bookings...</span>
            <span className="sm:hidden">Search...</span>
          </Button>
        </div>

        {/* Spacer to push notification and profile to the right */}
        <div className="flex-1" />

        {/* Right side group: Notification Bell + Profile */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex flex-col items-start gap-1 p-3 cursor-pointer',
                      !notification.read && 'bg-blue-50/50'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          notification.type === 'info' && 'bg-blue-500',
                          notification.type === 'warning' && 'bg-yellow-500',
                          notification.type === 'success' && 'bg-green-500',
                          notification.type === 'error' && 'bg-red-500'
                        )}
                      />
                      <span className="font-medium text-sm flex-1">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground ml-4">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground ml-4">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center justify-center text-sm text-primary cursor-pointer"
                  onClick={() => navigate('/admin/notifications')}
                >
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Profile Dropdown */}
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm">
                  {userProfile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {userProfile?.name || 'Admin User'}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userProfile?.role || 'admin'}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userProfile?.name || 'Admin User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/admin/activity-log')}
            >
              <Activity className="mr-2 h-4 w-4" />
              <span>Activity Log</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Exit Admin Panel</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Global Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties, users, bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isSearching ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Start typing to search...
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Properties */}
                  {searchResults.filter(r => r.type === 'property').length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
                        Properties
                      </h3>
                      {searchResults
                        .filter(r => r.type === 'property')
                        .map(result => (
                          <button
                            key={result.id}
                            onClick={() => {
                              navigate(result.href);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            {getSearchIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Users */}
                  {searchResults.filter(r => r.type === 'user').length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
                        Users
                      </h3>
                      {searchResults
                        .filter(r => r.type === 'user')
                        .map(result => (
                          <button
                            key={result.id}
                            onClick={() => {
                              navigate(result.href);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            {getSearchIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {/* Bookings */}
                  {searchResults.filter(r => r.type === 'booking').length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
                        Bookings
                      </h3>
                      {searchResults
                        .filter(r => r.type === 'booking')
                        .map(result => (
                          <button
                            key={result.id}
                            onClick={() => {
                              navigate(result.href);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                          >
                            {getSearchIcon(result.type)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {result.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {result.subtitle}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

// Export as AdminHeader for cleaner imports
export { AdminHeaderSimple as AdminHeader };
