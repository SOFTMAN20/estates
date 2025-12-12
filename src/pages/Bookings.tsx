/**
 * MY BOOKINGS PAGE
 * ================
 * 
 * Displays user's bookings with tabs for:
 * - Upcoming (confirmed, check-in in future)
 * - Past (completed)
 * - Cancelled
 * 
 * Only accessible in GUEST MODE
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isBefore, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import { BookingCard } from '@/components/bookings/BookingCard';
import { useAuth } from '@/hooks/useAuth';
import { useBookings, useCancelBooking } from '@/hooks/useBookings';
import { useModeToggle } from '@/contexts/ModeContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Calendar, Home, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Define booking type based on current database schema
interface BookingWithProperty {
  id: string;
  property_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  properties?: {
    id: string;
    title: string;
    location: string;
    images: string[];
    property_type: string;
  };
  host_name?: string;
}

export default function Bookings() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentMode } = useModeToggle();
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  // Fetch user's bookings
  const { data: bookings = [], isLoading, error } = useBookings({
    guest_id: user?.id
  });

  // Cancel booking mutation
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  // Filter bookings by status - MUST be before any conditional returns
  const { upcoming, past, cancelled } = useMemo(() => {
    const today = startOfDay(new Date());

    const upcoming = (bookings as BookingWithProperty[]).filter((booking) => {
      const checkInDate = new Date(booking.start_date);
      return (
        (booking.status === 'confirmed' || booking.status === 'pending') &&
        !isBefore(checkInDate, today)
      );
    });

    const past = (bookings as BookingWithProperty[]).filter((booking) => {
      return booking.status === 'completed';
    });

    const cancelled = (bookings as BookingWithProperty[]).filter((booking) => {
      return booking.status === 'cancelled';
    });

    return { upcoming, past, cancelled };
  }, [bookings]);

  // Redirect if not in guest mode
  if (currentMode !== 'guest') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {i18n.language === 'en' ? 'Guest Mode Required' : 'Hali ya Mgeni Inahitajika'}
            </h2>
            <p className="text-gray-600 mb-6">
              {i18n.language === 'en'
                ? 'Please switch to Guest mode to view your bookings.'
                : 'Tafadhali badili hadi hali ya Mgeni kuona hifadhi zako.'
              }
            </p>
            <Button onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              {i18n.language === 'en' ? 'Go Home' : 'Rudi Nyumbani'}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle cancel booking
  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
  };

  const confirmCancelBooking = () => {
    if (!cancelBookingId) return;

    cancelBooking(
      { bookingId: cancelBookingId, reason: 'Cancelled by guest' },
      {
        onSuccess: () => {
          toast.success(
            i18n.language === 'en'
              ? 'Booking cancelled successfully'
              : 'Hifadhi imeghairiwa'
          );
          setCancelBookingId(null);
        },
        onError: () => {
          toast.error(
            i18n.language === 'en'
              ? 'Failed to cancel booking'
              : 'Imeshindwa kughairi hifadhi'
          );
        }
      }
    );
  };

  // Handle contact host
  const handleContactHost = () => {
    // TODO: Implement contact host functionality
    toast.info(
      i18n.language === 'en'
        ? 'Contact host feature coming soon'
        : 'Kipengele cha kuwasiliana kinakuja hivi karibuni'
    );
  };

  // Handle leave review
  const handleLeaveReview = (bookingId: string) => {
    // TODO: Implement review functionality
    navigate(`/bookings/${bookingId}/review`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">
              {i18n.language === 'en' ? 'Loading bookings...' : 'Inapakia hifadhi...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {i18n.language === 'en' ? 'Error Loading Bookings' : 'Hitilafu ya Kupakia'}
            </h2>
            <p className="text-gray-600 mb-6">
              {i18n.language === 'en'
                ? 'Failed to load your bookings. Please try again.'
                : 'Imeshindwa kupakia hifadhi zako. Tafadhali jaribu tena.'
              }
            </p>
            <Button onClick={() => window.location.reload()}>
              {i18n.language === 'en' ? 'Retry' : 'Jaribu Tena'}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {i18n.language === 'en' ? 'My Bookings' : 'Hifadhi Zangu'}
          </h1>
          <p className="text-gray-600">
            {i18n.language === 'en'
              ? 'Manage your property bookings'
              : 'Simamia hifadhi zako za nyumba'
            }
          </p>
        </div>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="upcoming" className="relative">
              {i18n.language === 'en' ? 'Upcoming' : 'Zijazo'}
              {upcoming.length > 0 && (
                <span className="ml-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                  {upcoming.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">
              {i18n.language === 'en' ? 'Past' : 'Zilizopita'}
              {past.length > 0 && (
                <span className="ml-2 bg-gray-500 text-white text-xs rounded-full px-2 py-0.5">
                  {past.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              {i18n.language === 'en' ? 'Cancelled' : 'Zimeghairiwa'}
              {cancelled.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cancelled.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {i18n.language === 'en' ? 'No Upcoming Bookings' : 'Hakuna Hifadhi Zijazo'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {i18n.language === 'en'
                    ? 'Start exploring properties and make your first booking!'
                    : 'Anza kutafuta nyumba na fanya hifadhi yako ya kwanza!'
                  }
                </p>
                <Button onClick={() => navigate('/browse')}>
                  <Home className="h-4 w-4 mr-2" />
                  {i18n.language === 'en' ? 'Browse Properties' : 'Tazama Nyumba'}
                </Button>
              </div>
            ) : (
              upcoming.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  hostName={booking.host_name}
                  onCancel={handleCancelBooking}
                  onContactHost={handleContactHost}
                />
              ))
            )}
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past" className="space-y-4">
            {past.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {i18n.language === 'en' ? 'No Past Bookings' : 'Hakuna Hifadhi Zilizopita'}
                </h3>
                <p className="text-gray-600">
                  {i18n.language === 'en'
                    ? 'Your completed bookings will appear here.'
                    : 'Hifadhi zako zilizokamilika zitaonekana hapa.'
                  }
                </p>
              </div>
            ) : (
              past.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  hostName={booking.host_name}
                  onContactHost={handleContactHost}
                  onLeaveReview={handleLeaveReview}
                />
              ))
            )}
          </TabsContent>

          {/* Cancelled Bookings */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelled.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {i18n.language === 'en' ? 'No Cancelled Bookings' : 'Hakuna Hifadhi Zilizoghairiwa'}
                </h3>
                <p className="text-gray-600">
                  {i18n.language === 'en'
                    ? 'Your cancelled bookings will appear here.'
                    : 'Hifadhi zako zilizoghairiwa zitaonekana hapa.'
                  }
                </p>
              </div>
            ) : (
              cancelled.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  hostName={booking.host_name}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Booking Confirmation Dialog */}
      <AlertDialog open={!!cancelBookingId} onOpenChange={() => setCancelBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.language === 'en' ? 'Cancel Booking?' : 'Ghairi Hifadhi?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {i18n.language === 'en'
                ? 'Are you sure you want to cancel this booking? This action cannot be undone.'
                : 'Una uhakika unataka kughairi hifadhi hii? Hatua hii haiwezi kutenduliwa.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              {i18n.language === 'en' ? 'Keep Booking' : 'Endelea na Hifadhi'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelBooking}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {i18n.language === 'en' ? 'Cancelling...' : 'Inaghairi...'}
                </>
              ) : (
                i18n.language === 'en' ? 'Yes, Cancel Booking' : 'Ndio, Ghairi Hifadhi'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
