/**
 * PROFILEHUB.TSX - UNIFIED ACCOUNT HUB PAGE
 * =========================================
 * 
 * Comprehensive account management page with tabs for:
 * - Overview: Profile summary and quick stats
 * - Notifications: Recent notifications
 * - Bookings: User bookings
 * - Favorites: Saved properties
 * - Settings: Account settings
 * 
 * Similar to e-commerce account pages for better UX
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Calendar, 
  Heart, 
  Settings, 
  ChevronRight,
  Star,
  Shield,
  Home,
  Search,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useFavorites } from '@/hooks/useFavorites';
import { useProfileData } from '@/hooks/profileHooks';
import { NotificationItem } from '@/components/Notifications/NotificationItem';
import { BookingCard } from '@/components/bookings/BookingCard';
import PropertyCard from '@/components/properties/propertyCommon/PropertyCard';
import { useBookings } from '@/hooks/useBookings';
import { useProperties } from '@/hooks/useProperties';
import { useModeToggle } from '@/hooks/useModeToggle';

export default function ProfileHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { profile, fetchProfile } = useProfileData();
  const { notifications, unreadCount } = useNotifications();
  const { getFavoritesCount, favorites, loading: favoritesLoading } = useFavorites();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings({ guest_id: user?.id });
  const { data: properties = [], isLoading: propertiesLoading } = useProperties();
  const { currentMode } = useModeToggle();

  // Fetch profile data on mount
  useEffect(() => {
    if (user) {
      fetchProfile(user);
    }
  }, [fetchProfile, user]);

  // Get recent items (limit to 3 for preview)
  const recentNotifications = notifications.slice(0, 3);
  const recentBookings = bookings.slice(0, 3);
  
  // Filter properties to show only favorited ones (same as Favorites page)
  const favoriteProperties = properties.filter(property => 
    favorites.some(fav => fav.property_id === property.id)
  ).slice(0, 3);

  // Calculate stats
  const totalBookings = bookings?.length || 0;
  const favoritesCount = getFavoritesCount();
  const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Manage your account, bookings, and preferences
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('bookings')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                  <p className="text-xs text-gray-600">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('notifications')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg relative">
                  <Bell className="w-5 h-5 text-red-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  <p className="text-xs text-gray-600">Notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('favorites')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{favoritesCount}</p>
                  <p className="text-xs text-gray-600">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('overview')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-white border border-gray-200 p-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
              {totalBookings > 0 && (
                <Badge className="ml-1 bg-primary text-white text-xs px-1.5 py-0">
                  {totalBookings}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <Badge className="ml-1 bg-pink-500 text-white text-xs px-1.5 py-0">
                  {favoritesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Profile Section */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name || 'User'}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-serengeti-500 flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-white text-3xl font-bold">
                          {profile?.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {profile?.name || user.email?.split('@')[0]}
                    </h2>
                    <p className="text-gray-600 mb-3">{user.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-sm">
                        {currentMode === 'guest' ? '👤 Guest Mode' : '🏠 Host Mode'}
                      </Badge>
                      {profile?.role === 'admin' && (
                        <Badge className="bg-purple-100 text-purple-800 text-sm">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      {completedBookings > 0 && (
                        <Badge className="bg-green-100 text-green-800 text-sm">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {completedBookings} Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button onClick={() => navigate('/profile')} className="w-full sm:w-auto">
                    Edit Profile
                  </Button>
                </div>

                {/* Additional Info */}
                {(profile?.bio || profile?.phone || profile?.location) && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    {profile?.bio && (
                      <div className="mb-4">
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile?.phone && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                          <p className="font-medium text-gray-900">{profile.phone}</p>
                        </div>
                      )}
                      {profile?.location && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                          <p className="font-medium text-gray-900">{profile.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* List Property Action */}
                <Card className="border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate('/dashboard', { state: { openAddForm: true } })}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                        <Home className="w-7 h-7 text-primary" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">List Your Property</h4>
                      <p className="text-sm text-gray-600 mb-4">Start earning by listing your property</p>
                      <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>

                {/* Browse Properties Action */}
                <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate('/browse')}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                        <Search className="w-7 h-7 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Browse Properties</h4>
                      <p className="text-sm text-gray-600 mb-4">Find your perfect rental home</p>
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>

                {/* View Bookings Action */}
                <Card className="border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all cursor-pointer group" onClick={() => setActiveTab('bookings')}>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-4 transition-colors">
                        <Calendar className="w-7 h-7 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">My Bookings</h4>
                      <p className="text-sm text-gray-600 mb-4">{totalBookings} active bookings</p>
                      <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity Section */}
            {recentBookings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Bookings
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('bookings')} className="text-primary hover:text-primary">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {recentBookings.slice(0, 2).map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}

            {/* Activity Summary Cards */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('bookings')}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('favorites')}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <Heart className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Saved Properties</p>
                        <p className="text-2xl font-bold text-gray-900">{favoritesCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Notifications</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
                View All
              </Button>
            </div>

            {recentNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0 divide-y">
                  {recentNotifications.map(notification => (
                    <div key={notification.id} className="p-4">
                      <NotificationItem notification={notification} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">My Bookings</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/bookings')}>
                View All
              </Button>
            </div>

            {bookingsLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </CardContent>
              </Card>
            ) : recentBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No bookings yet</p>
                  <Button onClick={() => navigate('/browse')}>
                    Browse Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {recentBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Saved Properties</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/favorites')}>
                View All
              </Button>
            </div>

            {favoritesLoading || propertiesLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading favorites...</p>
                </CardContent>
              </Card>
            ) : favoriteProperties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No favorites yet</p>
                  <Button onClick={() => navigate('/browse')}>
                    Browse Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProperties.map(property => (
                  <PropertyCard 
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    price={property.price}
                    location={property.location}
                    images={property.images || []}
                    bedrooms={property.bedrooms}
                    electricity={property.amenities?.includes('electricity')}
                    water={property.amenities?.includes('water')}
                    averageRating={property.average_rating || 0}
                    totalReviews={property.total_reviews || 0}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>

            <div className="grid grid-cols-1 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/profile')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold">Profile Information</p>
                        <p className="text-sm text-gray-600">Update your personal details</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/settings/notifications')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold">Notification Preferences</p>
                        <p className="text-sm text-gray-600">Manage notification settings</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/settings')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold">General Settings</p>
                        <p className="text-sm text-gray-600">Language, privacy, and more</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
