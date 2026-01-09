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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            {i18n.language === 'en' ? 'Confirm Your Booking' : 'Thibitisha Hifadhi Yako'}
          </DialogTitle>
          <DialogDescription>
            {i18n.language === 'en' 
              ? 'Review your booking details before confirming'
              : 'Kagua maelezo ya hifadhi yako kabla ya kuthibitisha'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Property Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              {i18n.language === 'en' ? 'Property Details' : 'Maelezo ya Nyumba'}
            </h3>
            
            <div className="flex gap-4 p-4 bg-gradient-to-r from-primary/5 to-purple-50/50 rounded-lg border border-primary/20">
              {/* Property Image */}
              <div className="flex-shrink-0">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-gray-900">{property.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {property.property_type}
                </Badge>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {i18n.language === 'en' ? 'Monthly Rent' : 'Kodi ya Mwezi'}
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Dates */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {i18n.language === 'en' ? 'Booking Period' : 'Muda wa Kukodi'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Check-in */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">
                  {i18n.language === 'en' ? 'Check-in' : 'Tarehe ya Kuingia'}
                </div>
                <div className="font-semibold text-gray-900">
                  {format(bookingData.checkIn, 'PPP')}
                </div>
              </div>

              {/* Check-out */}
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">
                  {i18n.language === 'en' ? 'Check-out' : 'Tarehe ya Kutoka'}
                </div>
                <div className="font-semibold text-gray-900">
                  {format(bookingData.checkOut, 'PPP')}
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
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
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              {i18n.language === 'en' ? 'Payment Summary' : 'Muhtasari wa Malipo'}
            </h3>

            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
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
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i18n.language === 'en' ? `Service Fee (${commissionRate}%)` : `Ada ya Huduma (${commissionRate}%)`}
                </span>
                <span className="font-medium">{formatCurrency(bookingData.serviceFee)}</span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-lg">
                  {i18n.language === 'en' ? 'Total Amount' : 'Jumla ya Malipo'}
                </span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(bookingData.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Guest Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {i18n.language === 'en' ? 'Guest Information' : 'Maelezo ya Mgeni'}
            </h3>

            <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200">
              {/* Name */}
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">
                    {i18n.language === 'en' ? 'Name' : 'Jina'}
                  </div>
                  <div className="font-medium">{guestInfo.name || 'N/A'}</div>
                </div>
              </div>

              {/* Email */}
              {guestInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">
                      {i18n.language === 'en' ? 'Email' : 'Barua Pepe'}
                    </div>
                    <div className="font-medium">{guestInfo.email}</div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {guestInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">
                      {i18n.language === 'en' ? 'Phone' : 'Simu'}
                    </div>
                    <div className="font-medium">{guestInfo.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Special Requests */}
          <div className="space-y-3">
            <label className="font-semibold text-sm">
              {i18n.language === 'en' ? 'Special Requests (Optional)' : 'Mahitaji Maalum (Si Lazima)'}
            </label>
            <Textarea
              placeholder={
                i18n.language === 'en' 
                  ? 'Any special requests or requirements? (e.g., early check-in, parking space, etc.)'
                  : 'Una mahitaji maalum? (mfano: kuingia mapema, nafasi ya gari, n.k.)'
              }
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Separator />

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                {i18n.language === 'en' ? (
                  <>
                    I agree to the{' '}
                    <a href="/terms" className="text-primary font-medium hover:underline" target="_blank">
                      Terms and Conditions
                    </a>{' '}
                    and understand that this booking is subject to host approval. Payment will be required after confirmation.
                  </>
                ) : (
                  <>
                    Ninakubali{' '}
                    <a href="/terms" className="text-primary font-medium hover:underline" target="_blank">
                      Sheria na Masharti
                    </a>{' '}
                    na naelewa kwamba hifadhi hii inahitaji idhini ya mwenye nyumba. Malipo yatahitajika baada ya uthibitisho.
                  </>
                )}
              </label>
            </div>

            {/* Warning Message */}
            {!agreedToTerms && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">
                  {i18n.language === 'en' 
                    ? 'Please agree to the terms and conditions to continue'
                    : 'Tafadhali kubali sheria na masharti ili kuendelea'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            {i18n.language === 'en' ? 'Cancel' : 'Ghairi'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!agreedToTerms || isLoading}
            className={cn(
              "flex-1 bg-gradient-to-r from-primary to-primary/90",
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
