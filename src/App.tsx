
/**
 * APP.TSX - MAIN APPLICATION COMPONENT
 * ===================================
 * 
 * Mfumo mkuu wa programu ya Nyumba Link - Tanzania Housing Platform
 * Main application component for Nyumba Link - Tanzania Housing Platform
 * 
 * FUNCTIONALITY / KAZI:
 * - Sets up routing for all pages (Inaweka mipangilio ya kurasa zote)
 * - Provides global context providers (Inatoa huduma za kimsingi)
 * - Manages application-wide state (Inasimamia hali ya programu nzima)
 * 
 * ARCHITECTURE OVERVIEW / MUHTASARI WA MUUNDO:
 * This is the root component that orchestrates the entire application.
 * It follows a provider pattern to inject dependencies and manages
 * global application state through context providers.
 * 
 * SCALABILITY CONSIDERATIONS / MAMBO YA UKUAJI:
 * - Error boundaries prevent app crashes from component failures
 * - Query client enables efficient data caching and synchronization
 * - Modular routing allows easy addition of new pages
 * - Context providers can be extended for additional global state
 * 
 * PERFORMANCE OPTIMIZATIONS / MABORESHO YA UTENDAJI:
 * - React Query handles automatic caching and background updates
 * - Tooltip provider reduces re-renders through context optimization
 * - Error boundaries isolate failures to prevent cascade effects
 * 
 * COMPONENTS INCLUDED / VIPENGELE VILIVYOMO:
 * - QueryClient: For API data management (Kwa usimamizi wa data ya API)
 * - TooltipProvider: For tooltips across the app (Kwa vidokezo vyote)
 * - Toaster: For notifications (Kwa arifa)
 * - BrowserRouter: For navigation (Kwa uongozaji)
 * 
 * ROUTES / NJIA:
 * - / : Homepage with search (Ukurasa wa kwanza na utafutaji)
 * - /browse : Property listings (Orodha ya nyumba)
 * - /property/:id : Individual property details (Maelezo ya nyumba moja)
 * - /dashboard : User dashboard (Dashibodi ya mtumiaji)
 * - /favorites : Saved properties (Nyumba zilizookwa)
 * - /signin : Login page (Ukurasa wa kuingia)
 * - /signup : Registration page (Ukurasa wa kusajili)
 * - /* : 404 page for unknown routes (Ukurasa wa makosa kwa njia zisizojulikana)
 * 
 * FUTURE EXTENSIBILITY / UWEZEKANO WA KUONGEZA:
 * - Additional routes can be added easily to the Routes component
 * - New context providers can be wrapped around existing ones
 * - Error boundaries can be made more granular for specific features
 * - Query client configuration can be extended for advanced caching strategies
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { createOptimizedQueryClient } from "@/utils/cache";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ModeProvider } from "@/contexts/ModeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ErrorBoundary from "@/components/ui/error-boundary";
import { lazy, Suspense } from "react";
import MobileBottomNav from "./components/layout/navbarLayout/MobileBottomNav";
import PerformanceDashboard from "./components/common/PerformanceDashboard";
import { ProtectedAdminRoute } from "@/components/auth/ProtectedAdminRoute";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Browse = lazy(() => import("./pages/Browse"));
const PropertyDetail = lazy(() => import("./pages/host/PropertyDetail"));
const Dashboard = lazy(() => import("./pages/host/Dashboard"));
const Properties = lazy(() => import("./pages/host/Properties"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileHub = lazy(() => import("./pages/ProfileHub"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Bookings = lazy(() => import("./pages/Bookings"));
const BookingDetail = lazy(() => import("./pages/BookingDetail"));
const Analytics = lazy(() => import("./pages/host/Analytics"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PropertyExample = lazy(() => import("./pages/host/PropertyExample"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ColorPalette = lazy(() => import("./components/common/ColorPalette"));
const Typography = lazy(() => import("./components/common/Typography"));
const LoadingStates = lazy(() => import("./components/common/LoadingStates"));
const ComponentLibrary = lazy(() => import("./components/ui/ComponentLibrary"));

// Notification pages
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));

// Review pages
const MyReviews = lazy(() => import("./pages/MyReviews"));
const HostReviews = lazy(() => import("./pages/host/Reviews"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProperties = lazy(() => import("./pages/admin/properties"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminPayments = lazy(() => import("./pages/admin/payments"));
const AdminSettings = lazy(() => import("./pages/admin/settings"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminActivityLog = lazy(() => import("./pages/admin/ActivityLog"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));

/**
 * REACT QUERY CLIENT CONFIGURATION
 * ================================
 * 
 * Initialize React Query client for API state management
 * Kuanzisha mteja wa React Query kwa usimamizi wa hali ya API
 * 
 * FEATURES / VIPENGELE:
 * - Automatic background refetching
 * - Intelligent caching with stale-while-revalidate
 * - Error retry logic with exponential backoff
 * - Optimistic updates for better UX
 * 
 * CONFIGURATION OPTIONS / CHAGUO ZA MIPANGILIO:
 * - staleTime: How long data stays fresh (default: 0)
 * - cacheTime: How long unused data stays in cache (default: 5 minutes)
 * - retry: Number of retry attempts on failure (default: 3)
 * - refetchOnWindowFocus: Refetch when window regains focus (default: true)
 * 
 * SCALABILITY / UKUAJI:
 * - Can be configured with custom defaults for different query types
 * - Supports query invalidation for real-time updates
 * - Enables offline-first architecture with proper configuration
 */
const queryClient = createOptimizedQueryClient();

/**
 * Main App Component
 * Kipengele kikuu cha programu
 * 
 * ARCHITECTURE / MUUNDO:
 * 1. QueryClientProvider: Manages server state and caching
 * 2. TooltipProvider: Enables tooltips throughout the application
 * 3. Toaster components: Handle success/error notifications
 * 4. BrowserRouter: Enables client-side routing
 * 5. Routes: Define all application pages
 */
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModeProvider>
          <ToastProvider>
            <TooltipProvider>
              {/* Notification systems - Mifumo ya arifa */}
              <Toaster />
              <Sonner />

          {/* Main routing configuration - Mipangilio ya uongozaji */}
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm">Inapakia...</p>
                </div>
              </div>
            }>
              <Routes>
                {/* Public routes - Njia za umma */}
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/color-palette" element={<ColorPalette />} />
                <Route path="/typography" element={<Typography />} />
                <Route path="/loading-states" element={<LoadingStates />} />
                <Route path="/component-library" element={<ComponentLibrary />} />

                {/* User-specific routes - Njia za mtumiaji */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/host/properties" element={<Properties />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account" element={<ProfileHub />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/bookings/:id" element={<BookingDetail />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/property-example" element={<PropertyExample />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
                <Route path="/reviews" element={<MyReviews />} />
                <Route path="/host/reviews" element={<HostReviews />} />

                {/* Authentication routes - Njia za uthibitisho */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Admin routes - Njia za msimamizi (Protected) */}
                <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                <Route path="/admin/properties" element={<ProtectedAdminRoute><AdminProperties /></ProtectedAdminRoute>} />
                <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
                <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminBookings /></ProtectedAdminRoute>} />
                <Route path="/admin/payments" element={<ProtectedAdminRoute><AdminPayments /></ProtectedAdminRoute>} />
                <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
                <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
                <Route path="/admin/activity-log" element={<ProtectedAdminRoute><AdminActivityLog /></ProtectedAdminRoute>} />
                <Route path="/admin/notifications" element={<ProtectedAdminRoute><AdminNotifications /></ProtectedAdminRoute>} />
                <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />

                {/* Catch-all route for 404 errors */}
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>

            {/* Mobile Bottom Navigation - Only visible on mobile screens */}
            <MobileBottomNav />
          </BrowserRouter>

          {/* Performance Dashboard - Development only */}
          <PerformanceDashboard />
            </TooltipProvider>
          </ToastProvider>
        </ModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
