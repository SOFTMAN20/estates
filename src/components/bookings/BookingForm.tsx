/**
 * BOOKING FORM COMPONENT
 * ======================
 * 
 * A comprehensive booking form for property rentals with:
 * - Check-in and check-out date pickers
 * - Automatic price calculation (monthly rent × months)
 * - Service fee calculation (dynamic platform commission from settings)
 * - Total amount display
 * - Prominent "Book Now" button
 * 
 * Fomu ya kuhifadhi nyumba na:
 * - Chaguo la tarehe ya kuingia na kutoka
 * - Hesabu ya bei otomatiki
 * - Ada ya huduma (kutoka mipangilio ya jukwaa)
 * - Jumla ya kiasi
 */

import { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Receipt, TrendingUp, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { format, differenceInMonths, addDays, isBefore, startOfDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BookingModal } from './BookingModal';
import { useCommissionRate } from '@/hooks/usePlatformSettings';

interface BookingFormProps {
  propertyId: string;
  pricePerMonth: number;
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
    property_type: string;
    price: number;
  };
  guestInfo: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  onConfirmBooking?: (bookingData: BookingData, specialRequests: string) => void;
  className?: string;
  isLoading?: boolean;
}

export interface BookingData {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  months: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
}

export function BookingForm({
  propertyId,
  pricePerMonth,
  property,
  guestInfo,
  onConfirmBooking,
  className,
  isLoading = false
}: BookingFormProps) {
  const { i18n } = useTranslation();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get dynamic commission rate from platform settings
  const commissionRate = useCommissionRate();
  const platformCommission = commissionRate / 100; // Convert percentage to decimal

  // Calculate booking details
  const bookingDetails = useMemo(() => {
    if (!checkIn || !checkOut) {
      return null;
    }

    // Calculate number of months (minimum 1 month)
    const months = Math.max(1, differenceInMonths(checkOut, checkIn));
    
    // Calculate amounts using dynamic commission rate
    const subtotal = pricePerMonth * months;
    const serviceFee = subtotal * platformCommission;
    const totalAmount = subtotal + serviceFee;

    return {
      months,
      subtotal,
      serviceFee,
      totalAmount,
      commissionRate, // Include commission rate in details
    };
  }, [checkIn, checkOut, pricePerMonth, platformCommission, commissionRate]);

  // Handle check-in date selection
  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckIn(date);
    
    // If check-out is before new check-in, reset check-out
    if (date && checkOut && isBefore(checkOut, date)) {
      setCheckOut(undefined);
    }
  };

  // Handle "Book Now" button click - opens modal
  const handleBookNow = () => {
    if (!checkIn || !checkOut || !bookingDetails) return;
    setIsModalOpen(true);
  };

  // Handle booking confirmation from modal
  const handleConfirmBooking = (specialRequests: string) => {
    if (!checkIn || !checkOut || !bookingDetails) return;

    const bookingData: BookingData = {
      propertyId,
      checkIn,
      checkOut,
      months: bookingDetails.months,
      subtotal: bookingDetails.subtotal,
      serviceFee: bookingDetails.serviceFee,
      totalAmount: bookingDetails.totalAmount
    };

    onConfirmBooking?.(bookingData, specialRequests);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString('en-US')}`;
  };

  // Get minimum date (today)
  const minDate = startOfDay(new Date());

  // Get minimum check-out date (day after check-in)
  const minCheckOutDate = checkIn ? addDays(checkIn, 1) : minDate;

  const isBookingValid = checkIn && checkOut && bookingDetails;

  return (
    <Card className={cn('relative overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300', className)}>
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-50/50 to-blue-50/50 opacity-60"></div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>

      <CardContent className="relative p-5 sm:p-6">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                {i18n.language === 'en' ? 'Book This Property' : 'Hifadhi Nyumba Hii'}
                <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {formatCurrency(pricePerMonth)}{i18n.language === 'en' ? '/month' : '/mwezi'}
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 shadow-md">
            10% Fee
          </Badge>
        </div>

        {/* Date Selection */}
        <div className="space-y-3 mb-5">
          {/* Check-in Date */}
          <div className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              {i18n.language === 'en' ? 'Check-in Date' : 'Tarehe ya Kuingia'}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-left font-normal p-0 h-auto hover:bg-transparent',
                    !checkIn && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {checkIn ? (
                    <span className="font-semibold text-gray-900">{format(checkIn, 'PPP')}</span>
                  ) : (
                    <span>{i18n.language === 'en' ? 'Select date' : 'Chagua tarehe'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={handleCheckInSelect}
                  disabled={(date) => isBefore(date, minDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              {i18n.language === 'en' ? 'Check-out Date' : 'Tarehe ya Kutoka'}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-left font-normal p-0 h-auto hover:bg-transparent',
                    !checkOut && 'text-muted-foreground'
                  )}
                  disabled={!checkIn}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {checkOut ? (
                    <span className="font-semibold text-gray-900">{format(checkOut, 'PPP')}</span>
                  ) : (
                    <span>{i18n.language === 'en' ? 'Select date' : 'Chagua tarehe'}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(date) => isBefore(date, minCheckOutDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Price Breakdown */}
        {bookingDetails ? (
          <div className="space-y-4 mb-5">
            {/* Duration */}
            <div className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {i18n.language === 'en' ? 'Duration' : 'Muda'}
                  <span className="block text-xs text-gray-500">
                    {i18n.language === 'en' ? 'Rental Period' : 'Muda wa Kukodi'}
                  </span>
                </span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                {bookingDetails.months} {bookingDetails.months === 1 
                  ? (i18n.language === 'en' ? 'month' : 'mwezi')
                  : (i18n.language === 'en' ? 'months' : 'miezi')
                }
              </span>
            </div>

            {/* Monthly Rent */}
            <div className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  {i18n.language === 'en' ? 'Monthly Rent' : 'Kodi ya Mwezi'}
                  <span className="block text-xs text-gray-500">
                    {formatCurrency(pricePerMonth)} × {bookingDetails.months}
                  </span>
                </span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                {formatCurrency(bookingDetails.subtotal)}
              </span>
            </div>

            {/* Service Fee */}
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/5 to-purple-50/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">
                  {i18n.language === 'en' ? `Service Fee (${commissionRate}%)` : `Ada ya Huduma (${commissionRate}%)`}
                  <span className="block text-xs text-gray-500">
                    {i18n.language === 'en' ? 'Platform Fee' : 'Ada ya Jukwaa'}
                  </span>
                </span>
              </div>
              <span className="font-bold text-primary text-lg">
                {formatCurrency(bookingDetails.serviceFee)}
              </span>
            </div>

            <Separator className="my-3" />

            {/* Total Amount - Highlighted */}
            <div className="relative p-4 bg-gradient-to-r from-primary to-primary/90 rounded-xl shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span className="text-base sm:text-lg font-bold text-white">
                    {i18n.language === 'en' ? 'Total Amount' : 'Jumla ya Malipo'}
                    <span className="block text-xs text-white/90 font-normal">
                      {i18n.language === 'en' ? 'Total Payment' : 'Malipo Yote'}
                    </span>
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {formatCurrency(bookingDetails.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm mb-5">
            <div className="flex items-start space-x-3">
              <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                  <strong className="font-semibold">📅 {i18n.language === 'en' ? 'Select Dates' : 'Chagua Tarehe'}:</strong> {i18n.language === 'en' 
                    ? 'Choose your check-in and check-out dates to see the total price.'
                    : 'Chagua tarehe za kuingia na kutoka kuona bei kamili.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <Button
          onClick={handleBookNow}
          disabled={!isBookingValid}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
          size="lg"
        >
          {i18n.language === 'en' ? 'Book Now' : 'Hifadhi Sasa'}
        </Button>

        {/* Info note */}
        <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm mt-4">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
              <Receipt className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                <strong className="font-semibold">💡 {i18n.language === 'en' ? 'Note' : 'Kumbuka'}:</strong> {i18n.language === 'en'
                  ? 'Service fee is a one-time payment when booking the property.'
                  : 'Ada ya huduma ni malipo ya mara moja tu wakati wa kupanga nyumba.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full"></div>
      </CardContent>

      {/* Booking Modal - Only render when modal is open and all data is available */}
      {isModalOpen && checkIn && checkOut && bookingDetails && (
        <BookingModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          property={property}
          bookingData={{
            checkIn,
            checkOut,
            months: bookingDetails.months,
            subtotal: bookingDetails.subtotal,
            serviceFee: bookingDetails.serviceFee,
            totalAmount: bookingDetails.totalAmount
          }}
          guestInfo={guestInfo}
          onConfirm={handleConfirmBooking}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
}
