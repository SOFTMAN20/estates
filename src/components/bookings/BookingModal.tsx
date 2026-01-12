/**
 * BOOKING MODAL COMPONENT
 * =======================
 * 
 * Modal dialog for confirming property bookings with:
 * - Property summary
 * - Booking dates and total amount
 * - Special requests textarea
 * - Guest information (pre-filled from user profile)
 * - Terms and conditions checkbox
 * - Confirm Booking button
 */

import { useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Home,
  Clock,
  Receipt,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCommissionRate } from '@/hooks/usePlatformSettings';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
    property_type: string;
    price: number;
  };
  bookingData: {
    checkIn: Date;
    checkOut: Date;
    months: number;
    subtotal: number;
    serviceFee: number;
    totalAmount: number;
  };
  guestInfo: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  onConfirm: (specialRequests: string) => void;
  isLoading?: boolean;
}

export function BookingModal({
  open,
  onOpenChange,
  property,
  bookingData,
  guestInfo,
  onConfirm,
  isLoading = false
}: BookingModalProps) {
  const { i18n } = useTranslation();
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Get dynamic commission rate from platform settings
  const commissionRate = useCommissionRate();

  // Safety check - don't render if property is undefined
  if (!property) {
    return null;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString('en-US')}`;
  };

  // Handle confirm booking
  const handleConfirm = () => {
    if (!agreedToTerms) return;
    onConfirm(specialRequests);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {i18n.language === 'en' ? 'Confirm Your Booking' : 'Thibitisha Hifadhi Yako'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {i18n.language === 'en' 
              ? 'Review your booking details before confirming'
              : 'Kagua maelezo ya hifadhi yako kabla ya kuthibitisha'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
          {/* Property Summary */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {i18n.language === 'en' ? 'Property Details' : 'Maelezo ya Nyumba'}
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-purple-50/50 rounded-lg border border-primary/20">
              {/* Property Image */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 space-y-1 sm:space-y-2 text-center sm:text-left">
                <h4 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">{property.title}</h4>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-600">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {property.property_type}
                </Badge>
              </div>

              {/* Price */}
              <div className="text-center sm:text-right mt-2 sm:mt-0">
                <div className="text-xs sm:text-sm text-gray-600">
                  {i18n.language === 'en' ? 'Monthly Rent' : 'Kodi ya Mwezi'}
                </div>
                <div className="text-base sm:text-lg font-bold text-primary">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Dates */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {i18n.language === 'en' ? 'Booking Period' : 'Muda wa Kukodi'}
            </h3>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {/* Check-in */}
              <div className="p-2 sm:p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">
                  {i18n.language === 'en' ? 'Check-in' : 'Kuingia'}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-gray-900">
                  {format(bookingData.checkIn, 'PP')}
                </div>
              </div>

              {/* Check-out */}
              <div className="p-2 sm:p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-xs text-gray-600 mb-1">
                  {i18n.language === 'en' ? 'Check-out' : 'Kutoka'}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-gray-900">
                  {format(bookingData.checkOut, 'PP')}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                {i18n.language === 'en' ? 'Duration:' : 'Muda:'} {bookingData.months} {
                  bookingData.months === 1 
                    ? (i18n.language === 'en' ? 'month' : 'mwezi')
                    : (i18n.language === 'en' ? 'months' : 'miezi')
                }
              </span>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {i18n.language === 'en' ? 'Payment Summary' : 'Muhtasari wa Malipo'}
            </h3>

            <div className="space-y-2 p-3 sm:p-4 bg-gray-50 rounded-lg">
              {/* Subtotal */}
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  {formatCurrency(property.price)} × {bookingData.months} {
                    bookingData.months === 1 
                      ? (i18n.language === 'en' ? 'month' : 'mwezi')
                      : (i18n.language === 'en' ? 'months' : 'miezi')
                  }
                </span>
                <span className="font-medium">{formatCurrency(bookingData.subtotal)}</span>
              </div>

              {/* Service Fee */}
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? `Service Fee (${commissionRate}%)` : `Ada ya Huduma (${commissionRate}%)`}
                </span>
                <span className="font-medium">{formatCurrency(bookingData.serviceFee)}</span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-sm sm:text-lg">
                  {i18n.language === 'en' ? 'Total Amount' : 'Jumla ya Malipo'}
                </span>
                <span className="font-bold text-lg sm:text-xl text-primary">
                  {formatCurrency(bookingData.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Guest Information */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              {i18n.language === 'en' ? 'Guest Information' : 'Maelezo ya Mgeni'}
            </h3>

            <div className="space-y-2 p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
              {/* Name */}
              <div className="flex items-center gap-2 sm:gap-3">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">
                    {i18n.language === 'en' ? 'Name' : 'Jina'}
                  </div>
                  <div className="font-medium text-sm">{guestInfo.name || 'N/A'}</div>
                </div>
              </div>

              {/* Email */}
              {guestInfo.email && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-gray-500">
                      {i18n.language === 'en' ? 'Email' : 'Barua Pepe'}
                    </div>
                    <div className="font-medium text-sm truncate">{guestInfo.email}</div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {guestInfo.phone && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">
                      {i18n.language === 'en' ? 'Phone' : 'Simu'}
                    </div>
                    <div className="font-medium text-sm">{guestInfo.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Special Requests */}
          <div className="space-y-2 sm:space-y-3">
            <label className="font-semibold text-xs sm:text-sm">
              {i18n.language === 'en' ? 'Special Requests (Optional)' : 'Mahitaji Maalum (Si Lazima)'}
            </label>
            <Textarea
              placeholder={
                i18n.language === 'en' 
                  ? 'Any special requests or requirements?'
                  : 'Una mahitaji maalum?'
              }
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <Separator />

          {/* Terms and Conditions */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm leading-relaxed cursor-pointer"
              >
                {i18n.language === 'en' ? (
                  <>
                    I agree to the{' '}
                    <a href="/terms" className="text-primary font-medium hover:underline" target="_blank">
                      Terms and Conditions
                    </a>{' '}
                    and understand that this booking is subject to host approval.
                  </>
                ) : (
                  <>
                    Ninakubali{' '}
                    <a href="/terms" className="text-primary font-medium hover:underline" target="_blank">
                      Sheria na Masharti
                    </a>{' '}
                    na naelewa kwamba hifadhi hii inahitaji idhini ya mwenye nyumba.
                  </>
                )}
              </label>
            </div>

            {/* Warning Message */}
            {!agreedToTerms && (
              <div className="flex items-start gap-2 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-red-900">
                  {i18n.language === 'en' 
                    ? 'Please agree to the terms to continue'
                    : 'Tafadhali kubali masharti ili kuendelea'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-10 sm:h-11 text-sm"
          >
            {i18n.language === 'en' ? 'Cancel' : 'Ghairi'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!agreedToTerms || isLoading}
            className={cn(
              "flex-1 h-10 sm:h-11 text-sm bg-gradient-to-r from-primary to-primary/90",
              "hover:from-primary/90 hover:to-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {i18n.language === 'en' ? 'Processing...' : 'Inachakata...'}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {i18n.language === 'en' ? 'Confirm Booking' : 'Thibitisha Hifadhi'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
