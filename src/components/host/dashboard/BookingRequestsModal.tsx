/**
 * BOOKING REQUESTS MODAL
 * ======================
 * 
 * Modal for hosts to manage incoming booking requests
 * Features tabs for Pending requests and Upcoming confirmed bookings
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Check,
  X,
  Home,
  MessageSquare,
  Loader2,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { HostBooking } from '@/hooks/dashboardHooks/useHostBookings';

interface BookingRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingBookings: HostBooking[];
  upcomingBookings: HostBooking[];
  onApprove: (bookingId: string) => void;
  onReject: (params: { bookingId: string; reason?: string }) => void;
  isApproving: boolean;
  isRejecting: boolean;
  isLoading: boolean;
}

const BookingRequestsModal: React.FC<BookingRequestsModalProps> = ({
  isOpen,
  onClose,
  pendingBookings,
  upcomingBookings,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (bookingId: string) => {
    onApprove(bookingId);
  };

  const handleRejectClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedBookingId) {
      onReject({ bookingId: selectedBookingId, reason: rejectReason || undefined });
      setRejectDialogOpen(false);
      setSelectedBookingId(null);
      setRejectReason('');
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'G';
  };

  const renderBookingCard = (booking: HostBooking, showActions: boolean = false) => {
    const property = booking.properties;
    const guest = booking.guest_profile;
    const propertyImage = property?.images?.[0] || '/placeholder-property.jpg';

    return (
      <Card key={booking.id} className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Property Image */}
            <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
              <img
                src={propertyImage}
                alt={property?.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Booking Details */}
            <div className="flex-1 p-4">
              {/* Header: Guest Info & Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={guest?.avatar_url} alt={guest?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(guest?.name || 'Guest')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{guest?.name || t('bookingRequests.unknownGuest')}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={booking.status === 'pending' ? 'secondary' : 'default'}
                  className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                >
                  {booking.status === 'pending' ? t('bookingRequests.pending') : t('bookingRequests.confirmed')}
                </Badge>
              </div>

              {/* Property Info */}
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-medium">{property?.title}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{property?.location}</span>
                </div>
              </div>

              {/* Dates & Amount */}
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">{t('bookingRequests.checkIn')}:</span>
                    <span className="ml-1 font-medium">{format(new Date(booking.check_in), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500">{t('bookingRequests.checkOut')}:</span>
                    <span className="ml-1 font-medium">{format(new Date(booking.check_out), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>

              {/* Amount & Duration */}
              <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-xs text-gray-500">{t('bookingRequests.duration')}</span>
                  <p className="font-semibold text-gray-900">
                    {booking.total_months} {booking.total_months === 1 ? t('bookingRequests.month') : t('bookingRequests.months')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{t('bookingRequests.totalAmount')}</span>
                  <p className="font-bold text-primary">{formatCurrency(booking.total_amount)}</p>
                </div>
              </div>

              {/* Special Requests */}
              {booking.special_requests && (
                <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-yellow-700">{t('bookingRequests.specialRequests')}:</span>
                      <p className="text-sm text-yellow-800">{booking.special_requests}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact & Actions */}
              <div className="flex items-center justify-between">
                {guest?.phone && (
                  <a 
                    href={`tel:${guest.phone}`}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {guest.phone}
                  </a>
                )}

                {showActions && (
                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleRejectClick(booking.id)}
                      disabled={isRejecting}
                    >
                      {isRejecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          {t('bookingRequests.reject')}
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(booking.id)}
                      disabled={isApproving}
                    >
                      {isApproving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          {t('bookingRequests.approve')}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = (type: 'pending' | 'upcoming') => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {type === 'pending' ? (
          <AlertCircle className="h-8 w-8 text-gray-400" />
        ) : (
          <CalendarCheck className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">
        {type === 'pending' 
          ? t('bookingRequests.noPendingRequests') 
          : t('bookingRequests.noUpcomingBookings')}
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {type === 'pending'
          ? t('bookingRequests.noPendingDescription')
          : t('bookingRequests.noUpcomingDescription')}
      </p>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {t('bookingRequests.title')}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending" className="relative">
                {t('bookingRequests.pendingTab')}
                {pendingBookings.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                    {pendingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                {t('bookingRequests.upcomingTab')}
                {upcomingBookings.length > 0 && (
                  <Badge className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5">
                    {upcomingBookings.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <TabsContent value="pending" className="mt-0">
                    {pendingBookings.length > 0 ? (
                      pendingBookings.map(booking => renderBookingCard(booking, true))
                    ) : (
                      renderEmptyState('pending')
                    )}
                  </TabsContent>

                  <TabsContent value="upcoming" className="mt-0">
                    {upcomingBookings.length > 0 ? (
                      upcomingBookings.map(booking => renderBookingCard(booking, false))
                    ) : (
                      renderEmptyState('upcoming')
                    )}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('bookingRequests.rejectTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('bookingRequests.rejectDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              placeholder={t('bookingRequests.rejectReasonPlaceholder')}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('bookingRequests.confirmReject')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingRequestsModal;
