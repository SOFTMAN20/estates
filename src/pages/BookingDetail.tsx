/**
 * BOOKING DETAIL PAGE
 * ===================
 * 
 * Displays detailed information about a specific booking
 * Shows booking status, property details, dates, payment info, and actions
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import { useBooking, useCancelBooking } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Home,
  User,
  Mail,
  Phone,
  Clock,
  Receipt,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useAuth();

  // Fetch booking details
  const { data: booking, isLoading, error } = useBooking(id || '');

  // Cancel booking mutation
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle cancel booking
  const handleCancelBooking = () => {
    if (!id) return;

    cancelBooking(
      { bookingId: id, reason: 'Cancelled by guest' },
      {
        onSuccess: () => {
          toast.success(
            i18n.language === 'en'
              ? 'Booking cancelled successfully'
              : 'Hifadhi imeghairiwa'
          );
        },
        onError: () => {
          toast.error(
            i18n.language === 'en'
              ? 'Failed to cancel booking'
              : 'Imeshindwa kughairi hifadhi'
          );
        },
      }
    );
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString('en-US')}`;
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {i18n.language === 'en' ? 'Pending' : 'Inasubiri'}
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {i18n.language === 'en' ? 'Confirmed' : 'Imethibitishwa'}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            {i18n.language === 'en' ? 'Cancelled' : 'Imeghairiwa'}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {i18n.language === 'en' ? 'Completed' : 'Imekamilika'}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
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
              {i18n.language === 'en' ? 'Loading booking details...' : 'Inapakia maelezo ya hifadhi...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {i18n.language === 'en' ? 'Booking Not Found' : 'Hifadhi Haijapatikana'}
            </h2>
            <p className="text-gray-600 mb-6">
              {i18n.language === 'en'
                ? 'The booking you are looking for does not exist or you do not have permission to view it.'
                : 'Hifadhi unayoitafuta haipo au huna ruhusa ya kuiona.'
              }
            </p>
            <Button onClick={() => navigate('/bookings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {i18n.language === 'en' ? 'Back to Bookings' : 'Rudi kwa Hifadhi'}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/bookings')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {i18n.language === 'en' ? 'Back to Bookings' : 'Rudi kwa Hifadhi'}
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {i18n.language === 'en' ? 'Booking Details' : 'Maelezo ya Hifadhi'}
            </h1>
            {getStatusBadge(booking.status)}
          </div>
          <p className="text-gray-600">
            {i18n.language === 'en' ? 'Booking ID:' : 'Nambari ya Hifadhi:'} {booking.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  {i18n.language === 'en' ? 'Property Information' : 'Maelezo ya Nyumba'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {/* Property Image */}
                  {booking.properties?.images?.[0] && (
                    <img
                      src={booking.properties.images[0]}
                      alt={booking.properties.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}

                  {/* Property Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.properties?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.properties?.location}</span>
                    </div>
                    <Badge variant="secondary">{booking.properties?.property_type}</Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  onClick={() => navigate(`/property/${booking.property_id}`)}
                  className="w-full"
                >
                  {i18n.language === 'en' ? 'View Property' : 'Angalia Nyumba'}
                </Button>
              </CardContent>
            </Card>

            {/* Booking Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {i18n.language === 'en' ? 'Booking Period' : 'Muda wa Kukodi'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Check-in */}
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      {i18n.language === 'en' ? 'Check-in' : 'Tarehe ya Kuingia'}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {format(new Date(booking.check_in), 'PPP')}
                    </div>
                  </div>

                  {/* Check-out */}
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      {i18n.language === 'en' ? 'Check-out' : 'Tarehe ya Kutoka'}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {format(new Date(booking.check_out), 'PPP')}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Duration */}
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-4 w-4" />
                  <span>
                    {i18n.language === 'en' ? 'Duration:' : 'Muda:'} {booking.total_months}{' '}
                    {booking.total_months === 1
                      ? i18n.language === 'en' ? 'month' : 'mwezi'
                      : i18n.language === 'en' ? 'months' : 'miezi'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Special Requests */}
            {booking.special_requests && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    {i18n.language === 'en' ? 'Special Requests' : 'Mahitaji Maalum'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{booking.special_requests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  {i18n.language === 'en' ? 'Payment Summary' : 'Muhtasari wa Malipo'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Monthly Rent */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {i18n.language === 'en' ? 'Monthly Rent' : 'Kodi ya Mwezi'}
                  </span>
                  <span className="font-medium">{formatCurrency(booking.monthly_rent)}</span>
                </div>

                {/* Total Months */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {i18n.language === 'en' ? 'Number of Months' : 'Idadi ya Miezi'}
                  </span>
                  <span className="font-medium">{booking.total_months}</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {i18n.language === 'en' ? 'Subtotal' : 'Jumla Ndogo'}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(booking.monthly_rent * booking.total_months)}
                  </span>
                </div>

                {/* Service Fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {i18n.language === 'en' ? 'Service Fee (10%)' : 'Ada ya Huduma (10%)'}
                  </span>
                  <span className="font-medium">{formatCurrency(booking.service_fee)}</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">
                    {i18n.language === 'en' ? 'Total Amount' : 'Jumla ya Malipo'}
                  </span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(booking.total_amount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {canCancel && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {i18n.language === 'en' ? 'Actions' : 'Vitendo'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full" disabled={isCancelling}>
                        <XCircle className="h-4 w-4 mr-2" />
                        {i18n.language === 'en' ? 'Cancel Booking' : 'Ghairi Hifadhi'}
                      </Button>
                    </AlertDialogTrigger>
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
                        <AlertDialogCancel>
                          {i18n.language === 'en' ? 'Keep Booking' : 'Endelea na Hifadhi'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelBooking}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {i18n.language === 'en' ? 'Yes, Cancel' : 'Ndio, Ghairi'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            )}

            {/* Booking Info */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {i18n.language === 'en' ? 'Booking Information' : 'Maelezo ya Hifadhi'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">
                    {i18n.language === 'en' ? 'Booked on' : 'Imehifadhiwa tarehe'}
                  </div>
                  <div className="font-medium">
                    {format(new Date(booking.created_at), 'PPP')}
                  </div>
                </div>

                {booking.cancellation_date && (
                  <div>
                    <div className="text-gray-600 mb-1">
                      {i18n.language === 'en' ? 'Cancelled on' : 'Imeghairiwa tarehe'}
                    </div>
                    <div className="font-medium">
                      {format(new Date(booking.cancellation_date), 'PPP')}
                    </div>
                  </div>
                )}

                {booking.cancellation_reason && (
                  <div>
                    <div className="text-gray-600 mb-1">
                      {i18n.language === 'en' ? 'Cancellation Reason' : 'Sababu ya Kughairi'}
                    </div>
                    <div className="font-medium">{booking.cancellation_reason}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
