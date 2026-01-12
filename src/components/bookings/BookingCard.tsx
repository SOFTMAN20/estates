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
 * - Contact host dropdown (in-app messaging, WhatsApp, phone)
 */

import { useState } from 'react';
import { format, differenceInDays, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  MapPin,
  User,
  Eye,
  X,
  MessageCircle,
  Star,
  Phone,
  Send,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { ChatModal } from '@/components/messaging/ChatModal';
import { toast } from 'sonner';

interface BookingCardProps {
  booking: {
    id: string;
    property_id: string;
    guest_id?: string;
    host_id?: string;
    check_in: string;
    check_out: string;
    total_amount: number | string; // Supabase returns NUMERIC as string
    monthly_rent?: number | string;
    service_fee?: number | string;
    total_months?: number;
    status: string;
    special_requests?: string | null;
    created_at: string;
    updated_at?: string;
    cancellation_reason?: string | null;
    cancellation_date?: string | null;
    properties?: {
      id: string;
      title: string;
      location: string;
      images: string[];
      property_type: string;
    };
    host_profile?: {
      id: string;
      name: string;
      phone?: string | null;
      avatar_url?: string | null;
    };
  };
  hostName?: string;
  hasReviewed?: boolean;
  onCancel?: (bookingId: string) => void;
  onLeaveReview?: (bookingId: string) => void;
}

export function BookingCard({
  booking,
  hostName,
  hasReviewed = false,
  onCancel,
  onLeaveReview
}: BookingCardProps) {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Get host info from booking
  const hostId = booking.host_id;
  const hostProfile = booking.host_profile;
  const hostPhone = hostProfile?.phone;
  const propertyId = booking.property_id;
  const propertyTitle = booking.properties?.title || 'Property';

  // Format currency
  const formatCurrency = (amount: number | string) => {
    if (amount === undefined || amount === null) {
      return 'TZS 0';
    }
    // Convert string to number if needed (Supabase returns NUMERIC as string)
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
      return 'TZS 0';
    }
    return `TZS ${numAmount.toLocaleString('en-US')}`;
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
    const checkInDate = new Date(booking.check_in);
    const today = startOfDay(new Date());
    const daysUntilCheckIn = differenceInDays(checkInDate, today);
    return daysUntilCheckIn > 7;
  };

  // Check if can leave review (completed bookings that haven't been reviewed)
  const canReview = booking.status === 'completed' && !hasReviewed;

  // Check if can contact host (has host_id and not cancelled)
  const canContactHost = hostId && booking.status !== 'cancelled';

  /**
   * Handle in-app message click
   */
  const handleInAppMessage = async () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (!hostId) {
      toast.error(i18n.language === 'en' ? 'Host information not available' : 'Taarifa za mwenyeji hazipatikani');
      return;
    }

    // Simply open the modal - the ChatModal will handle conversation creation
    setIsChatModalOpen(true);
  };

  /**
   * Get WhatsApp link with pre-filled message
   */
  const getWhatsAppLink = () => {
    if (!hostPhone) return '#';
    const cleanPhone = hostPhone.replace(/[^0-9]/g, '');
    const message = `Hello, I'm contacting you about my booking for: ${propertyTitle}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  /**
   * Handle phone call
   */
  const handlePhoneCall = () => {
    if (hostPhone) {
      window.open(`tel:${hostPhone}`, '_self');
    }
  };

  /**
   * Handle WhatsApp click
   */
  const handleWhatsApp = () => {
    window.open(getWhatsAppLink(), '_blank');
  };

  const statusInfo = getStatusInfo(booking.status);
  const property = booking.properties;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Property Image */}
          <div className="w-full sm:w-40 md:w-48 h-40 sm:h-auto flex-shrink-0">
            <img
              src={property?.images?.[0] || '/placeholder.svg'}
              alt={property?.title || 'Property'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Booking Details */}
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {property?.title || 'Property'}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="line-clamp-1">{property?.location || 'Location'}</span>
                  </div>
                  {property?.property_type && (
                    <Badge variant="secondary" className="mt-1 sm:mt-2 text-xs">
                      {property.property_type}
                    </Badge>
                  )}
                </div>
                <Badge className={cn('border text-xs whitespace-nowrap', statusInfo.color)}>
                  {statusInfo.label}
                </Badge>
              </div>

              {/* Host Info */}
              {hostName && (
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">
                    {i18n.language === 'en' ? 'Host:' : 'Mwenyeji:'} {hostName}
                  </span>
                </div>
              )}

              <Separator className="my-2 sm:my-3" />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">
                    {i18n.language === 'en' ? 'Check-in' : 'Kuingia'}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span>{format(new Date(booking.check_in), 'PP')}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">
                    {i18n.language === 'en' ? 'Check-out' : 'Kutoka'}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    <span>{format(new Date(booking.check_out), 'PP')}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-3 sm:mb-4">
                <div className="text-xs text-gray-500 mb-0.5 sm:mb-1">
                  {i18n.language === 'en' ? 'Total Amount' : 'Jumla ya Malipo'}
                </div>
                <div className="text-lg sm:text-xl font-bold text-primary">
                  {formatCurrency(booking.total_amount)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                  className="flex-1 min-w-[100px] h-8 sm:h-9 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {i18n.language === 'en' ? 'View' : 'Angalia'}
                </Button>

                {onCancel && canCancel() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancel(booking.id)}
                    className="flex-1 min-w-[80px] h-8 sm:h-9 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {i18n.language === 'en' ? 'Cancel' : 'Ghairi'}
                  </Button>
                )}

                {canContactHost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 min-w-[80px] h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">{i18n.language === 'en' ? 'Contact' : 'Wasiliana'}</span>
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {/* In-App Message - Primary Option */}
                      <DropdownMenuItem 
                        onSelect={(e) => {
                          e.preventDefault();
                          handleInAppMessage();
                        }}
                        className="cursor-pointer"
                      >
                        <Send className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">
                          {user 
                            ? (i18n.language === 'en' ? 'Send Message' : 'Tuma Ujumbe')
                            : (i18n.language === 'en' ? 'Login to Message' : 'Ingia Kutuma Ujumbe')
                          }
                        </span>
                      </DropdownMenuItem>
                      
                      {hostPhone && (
                        <>
                          <DropdownMenuSeparator />
                          {/* Phone Call */}
                          <DropdownMenuItem 
                            onSelect={handlePhoneCall}
                            className="cursor-pointer"
                          >
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            <span>{i18n.language === 'en' ? 'Call Host' : 'Piga Simu'}</span>
                          </DropdownMenuItem>
                          
                          {/* WhatsApp */}
                          <DropdownMenuItem 
                            onSelect={handleWhatsApp}
                            className="cursor-pointer"
                          >
                            <svg className="h-4 w-4 mr-2 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
                            <span>WhatsApp</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {canReview && onLeaveReview && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onLeaveReview(booking.id)}
                    className="flex-1 min-w-[80px] h-8 sm:h-9 text-xs sm:text-sm bg-primary hover:bg-primary/90"
                  >
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {i18n.language === 'en' ? 'Review' : 'Maoni'}
                  </Button>
                )}

                {booking.status === 'completed' && hasReviewed && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="flex-1 min-w-[80px] h-8 sm:h-9 text-xs sm:text-sm text-green-600 border-green-200 bg-green-50"
                  >
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 fill-green-600" />
                    {i18n.language === 'en' ? 'Reviewed' : 'Imepitiwa'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Chat Modal for in-app messaging */}
      {hostId && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          hostId={hostId}
          hostName={hostProfile?.name || hostName || 'Host'}
          hostAvatar={hostProfile?.avatar_url || undefined}
          propertyId={propertyId}
          propertyTitle={propertyTitle}
        />
      )}
    </Card>
  );
}
