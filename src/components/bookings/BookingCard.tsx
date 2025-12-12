/**
 * BOOKING CARD COMPONENT
 * ======================
 * 
 * Displays a booking summary card with:
 * - Property image and name
 * - Host name
 * - Check-in and check-out dates
 * - Total amount
 * - Status badge
 * - Action buttons
 */

import { format, isBefore, differenceInDays, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  MapPin,
  User,
  Eye,
  X,
  MessageCircle,
  Star,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: {
    id: string;
    property_id: string;
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
  };
  hostName?: string;
  onCancel?: (bookingId: string) => void;
  onContactHost?: (bookingId: string) => void;
  onLeaveReview?: (bookingId: string) => void;
}

export function BookingCard({
  booking,
  hostName,
  onCancel,
  onContactHost,
  onLeaveReview
}: BookingCardProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString('en-US')}`;
  };

  // Get status color and label
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: i18n.language === 'en' ? 'Confirmed' : 'Imethibitishwa'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: i18n.language === 'en' ? 'Pending' : 'Inasubiri'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: i18n.language === 'en' ? 'Completed' : 'Imekamilika'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: i18n.language === 'en' ? 'Cancelled' : 'Imeghairiwa'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: status
        };
    }
  };

  // Check if booking can be cancelled (>7 days before check-in)
  const canCancel = () => {
    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      return false;
    }
    const checkInDate = new Date(booking.start_date);
    const today = startOfDay(new Date());
    const daysUntilCheckIn = differenceInDays(checkInDate, today);
    return daysUntilCheckIn > 7;
  };

  // Check if can leave review (completed bookings)
  const canReview = booking.status === 'completed';

  const statusInfo = getStatusInfo(booking.status);
  const property = booking.properties;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Property Image */}
          <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
            <img
              src={property?.images?.[0] || '/placeholder.svg'}
              alt={property?.title || 'Property'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {property?.title || 'Property'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{property?.location || 'Location'}</span>
                  </div>
                  {property?.property_type && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {property.property_type}
                    </Badge>
                  )}
                </div>
                <Badge className={cn('border', statusInfo.color)}>
                  {statusInfo.label}
                </Badge>
              </div>

              {/* Host Info */}
              {hostName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4" />
                  <span>
                    {i18n.language === 'en' ? 'Host:' : 'Mwenyeji:'} {hostName}
                  </span>
                </div>
              )}

              <Separator className="my-3" />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    {i18n.language === 'en' ? 'Check-in' : 'Kuingia'}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(new Date(booking.start_date), 'PP')}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    {i18n.language === 'en' ? 'Check-out' : 'Kutoka'}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(new Date(booking.end_date), 'PP')}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">
                  {i18n.language === 'en' ? 'Total Amount' : 'Jumla ya Malipo'}
                </div>
                <div className="text-xl font-bold text-primary">
                  {formatCurrency(booking.total_price)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  className="flex-1 sm:flex-none"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {i18n.language === 'en' ? 'View Details' : 'Angalia Maelezo'}
                </Button>

                {canCancel() && onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(booking.id)}
                    className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {i18n.language === 'en' ? 'Cancel' : 'Ghairi'}
                  </Button>
                )}

                {onContactHost && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onContactHost(booking.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {i18n.language === 'en' ? 'Contact Host' : 'Wasiliana'}
                  </Button>
                )}

                {canReview && onLeaveReview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLeaveReview(booking.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {i18n.language === 'en' ? 'Leave Review' : 'Acha Maoni'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
