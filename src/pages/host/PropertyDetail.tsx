/**
 * PROPERTYDETAIL.TSX - DYNAMIC PROPERTY DETAILS PAGE
 * =================================================
 * 
 * Ukurasa wa maelezo ya nyumba kutoka database - Property details page from database
 * 
 * FUNCTIONALITY / KAZI:
 * - Fetches real property data from Supabase database (Kupata data halisi kutoka database)
 * - Displays property images, details, and landlord contact info (Kuonyesha picha, maelezo, na mawasiliano)
 * - Provides WhatsApp and phone contact integration (Kuunganisha WhatsApp na simu)
 * - Handles loading and error states gracefully (Kushughulikia hali za kupakia na makosa)
 * 
 * DATA FLOW / MTIRIRIKO WA DATA:
 * URL Parameter (id) → useProperties Hook → Filter by ID → Display Real Data
 * 
 * FEATURES / VIPENGELE:
 * - Real property images from database (Picha halisi kutoka database)
 * - Actual landlord contact information (Maelezo halisi ya mwenye nyumba)
 * - Dynamic property details and amenities (Maelezo ya nyumba yanayobadilika)
 * - Error handling for missing properties (Kushughulikia nyumba zisizopo)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/loading-spinner';
import ShareDropdown from '@/components/properties/PropertyDetails/ShareDropdown';
import PropertyAmenities from '@/components/properties/PropertyDetails/PropertyAmenities';
import PropertyFeatures from '@/components/properties/PropertyDetails/PropertyFeatures';
import NearbyServices from '@/components/properties/PropertyDetails/NearbyServices';
import PropertyHeader from '@/components/properties/PropertyDetails/PropertyHeader';
import PropertyDescription from '@/components/properties/PropertyDetails/PropertyDescription';
import HostInformationCard from '@/components/properties/PropertyDetails/HostInformationCard';
import PropertyLocation from '@/components/properties/PropertyDetails/PropertyLocation';
import SafetyTips from '@/components/properties/PropertyDetails/SafetyTips';
import SimilarProperties from '@/components/properties/PropertyDetails/SimilarProperties';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  ArrowLeft,
  Heart,
  ChevronLeft,
  ChevronRight,
  Home,
  AlertCircle,
  Images,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { useProperties, type Property } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import { BookingForm } from '@/components/bookings/BookingForm';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useCreateBooking } from '@/hooks/useBookings';
import { format } from 'date-fns';
import { useReviews } from '@/hooks/useReviews';
import { RatingSummary } from '@/components/reviews/RatingSummary';
import { ReviewList } from '@/components/reviews/ReviewList';

/**
 * PROPERTY DETAIL COMPONENT
 * ========================
 * 
 * Main component that fetches and displays detailed property information
 * from the database based on the property ID from the URL.
 * 
 * Kipengele kikuu kinachopata na kuonyesha maelezo ya kina ya nyumba
 * kutoka database kulingana na ID ya nyumba kutoka URL.
 */
const PropertyDetail = () => {
  // URL parameter extraction - Kupata vigezo kutoka URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // UI state management - Usimamizi wa hali ya UI
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Mobile booking sheet state
  const [isMobileBookingOpen, setIsMobileBookingOpen] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [isBookingFormVisible, setIsBookingFormVisible] = useState(true);
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Favorites functionality - Utendakazi wa vipendwa
  const { isFavorited, toggleFavorite } = useFavorites();

  // Auth - Get current user
  const { user } = useAuth();

  // Booking mutation
  const createBookingMutation = useCreateBooking();

  // Reviews data
  const { reviews, statistics, isLoading: reviewsLoading } = useReviews(id);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle sticky button visibility on mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isDesktop = window.innerWidth >= 1024;
      
      if (isDesktop) {
        // On desktop: show sticky button when booking form is not visible
        if (bookingFormRef.current) {
          const rect = bookingFormRef.current.getBoundingClientRect();
          const isFormVisible = rect.top < window.innerHeight && rect.bottom > 0;
          setIsBookingFormVisible(isFormVisible);
          setShowStickyButton(!isFormVisible && scrollY > 300);
        } else {
          setShowStickyButton(scrollY > 300);
        }
      } else {
        // On mobile: show sticky button after scrolling past 300px
        setShowStickyButton(scrollY > 300);
      }
    };

    // Handle resize
    const handleResize = () => {
      handleScroll(); // Re-evaluate on resize
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Data fetching from database - Kupata data kutoka database
  const { data: properties = [], isLoading, error } = useProperties();

  // Type assertion to ensure properties is properly typed
  const typedProperties = properties as Property[];

  /**
   * PROPERTY DATA FILTERING
   * ======================
   * 
   * Find the specific property from the fetched properties array
   * using the ID from the URL parameters.
   * 
   * Kutafuta nyumba maalum kutoka orodha ya nyumba zilizochukuliwa
   * kwa kutumia ID kutoka vigezo vya URL.
   */
  const property = typedProperties.find(p => p.id === id);

  /**
   * HOST PROPERTY COUNT
   * ==================
   * 
   * Count total properties owned by this host
   */
  const hostPropertyCount = property?.host_id 
    ? typedProperties.filter(p => p.host_id === property.host_id).length 
    : 1;

  // Debug: Log property data to check profiles
  console.log('Property data:', property);
  console.log('Property profiles:', property?.profiles);
  console.log('Host name:', property?.profiles?.name);
  console.log('Host avatar:', property?.profiles?.avatar_url);

  /**
   * IMAGE NAVIGATION FUNCTIONS
   * =========================
   * 
   * Handle navigation through property images in the carousel.
   * Provides smooth cycling through available images.
   * 
   * Kushughulikia uongozaji kupitia picha za nyumba katika carousel.
   * Kutoa mzunguko laini kupitia picha zinazopatikana.
   */
  const nextImage = () => {
    if (!property?.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === property.images!.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property?.images || property.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images!.length - 1 : prev - 1
    );
  };

  /**
   * FAVORITE TOGGLE HANDLER
   * ======================
   * 
   * Handles favorite button clicks with proper event handling.
   * Kushughulikia kubonyeza kitufe cha vipendwa na kushughulikia matukio vizuri.
   */
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!property?.id) return;

    await toggleFavorite(property.id);
  };

  /**
   * BOOKING HANDLER
   * ==============
   * 
   * Handles booking confirmation from the BookingModal component.
   * Kushughulikia kuthibitisha hifadhi kutoka kipengele cha BookingModal.
   */
  const handleConfirmBooking = async (
    bookingData: {
      propertyId: string;
      checkIn: Date;
      checkOut: Date;
      months: number;
      subtotal: number;
      serviceFee: number;
      totalAmount: number;
    },
    specialRequests: string
  ) => {
    // Validate user is logged in
    if (!user) {
      toast.error(
        t('propertyDetail.loginRequired', 'Please login to make a booking')
      );
      navigate('/login');
      return;
    }

    // Validate property and host exist
    if (!property || !property.host_id) {
      toast.error(
        t('propertyDetail.propertyError', 'Property information is missing')
      );
      return;
    }

    try {
      // Create booking with updated schema
      const newBooking = await createBookingMutation.mutateAsync({
        property_id: bookingData.propertyId,
        guest_id: user.id,
        host_id: property.host_id,
        check_in: format(bookingData.checkIn, 'yyyy-MM-dd'),
        check_out: format(bookingData.checkOut, 'yyyy-MM-dd'),
        total_months: bookingData.months,
        monthly_rent: bookingData.subtotal / bookingData.months,
        service_fee: bookingData.serviceFee,
        total_amount: bookingData.totalAmount,
        special_requests: specialRequests || undefined,
        status: 'pending',
      });

      // Show success message
      toast.success(
        t('propertyDetail.bookingSuccess', 'Booking request submitted successfully!')
      );

      // Navigate to booking detail page
      navigate(`/bookings/${newBooking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(
        t('propertyDetail.bookingError', 'Failed to create booking. Please try again.')
      );
    }
  };

  /**
   * LOADING STATE RENDERING
   * ======================
   * 
   * Display loading spinner while data is being fetched from the database.
   * Provides user feedback during data loading process.
   * 
   * Kuonyesha spinner ya kupakia wakati data inapochukuliwa kutoka database.
   * Kutoa maoni ya mtumiaji wakati wa mchakato wa kupakia data.
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-lg text-gray-600">Inapakia maelezo ya nyumba...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /**
   * LOADING STATE RENDERING
   * =======================
   * 
   * Display loading spinner while fetching property data.
   * Kuonyesha spinner wakati wa kupakia data ya nyumba.
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Inapakia maelezo ya nyumba...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /**
   * ERROR STATE RENDERING
   * ====================
   * 
   * Display error message if data fetching fails or property is not found.
   * Provides clear feedback and navigation options for users.
   * 
   * Kuonyesha ujumbe wa hitilafu ikiwa kupata data kumeshindikana au nyumba haijapatikana.
   * Kutoa maoni wazi na chaguo za uongozaji kwa watumiaji.
   */
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? 'Hitilafu ya kupakia data' : 'Nyumba haijapatikana'}
            </h2>
            <p className="text-gray-600 mb-8">
              {error
                ? 'Imeshindikana kupata maelezo ya nyumba. Tafadhali jaribu tena.'
                : 'Nyumba uliyotafuta haijapatikana. Huenda imeondolewa au ID si sahihi.'
              }
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Rudi Nyuma
              </Button>
              <Button onClick={() => navigate('/browse')}>
                <Home className="h-4 w-4 mr-2" />
                Tazama Nyumba Zingine
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /**
   * MAIN COMPONENT RENDERING
   * =======================
   * 
   * Render the complete property details page with real data from database.
   * Includes image gallery, property information, and landlord contact details.
   * 
   * Kuonyesha ukurasa kamili wa maelezo ya nyumba na data halisi kutoka database.
   * Inajumuisha galeri ya picha, maelezo ya nyumba, na maelezo ya mawasiliano ya mwenye nyumba.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex flex-col">
      <Navigation />

      <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-1 pb-3 sm:pb-4 lg:pb-6 xl:pb-8">
        {/* Back Navigation Button - Hidden for now */}
        {/* <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-3 sm:mb-4 lg:mb-2 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('propertyDetail.goBack')}
        </Button> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Section - Sehemu ya maudhui makuu */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Property Title - Above Gallery */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {property.title}
              </h1>
            </div>
            {/* Image Gallery Section - Sehemu ya galeri ya picha */}
            <Card>
              <CardContent className="p-0">
                {/* Mobile/Tablet carousel - Onyesho la simu na tablet */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-t-lg lg:hidden">
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[currentImageIndex]
                        : 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'
                    }
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />

                  {property.images && property.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevImage}
                        className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={nextImage}
                        className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </>
                  )}

                  {property.images && property.images.length > 1 && (
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  )}

                  {/* Mobile Action Buttons - Share and Favorite */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(e);
                      }}
                      className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 ${isFavorited(property?.id || '') ? 'text-red-500 bg-white/95' : 'text-white bg-black/30'
                        } hover:text-red-500 hover:bg-white/95 transform hover:scale-110 h-8 w-8 sm:h-10 sm:w-10`}
                    >
                      <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isFavorited(property?.id || '') ? 'fill-current' : ''}`} />
                    </Button>
                    <ShareDropdown
                      title={property.title}
                      description={`Angalia nyumba hii nzuri: ${property.title} - TZS ${Number(property.price).toLocaleString()}/mwezi`}
                      url={window.location.href}
                      className="bg-black/30 hover:bg-white/95 text-white hover:text-gray-600 h-8 w-8 sm:h-10 sm:w-10 p-1.5 sm:p-2 rounded-full transition-all duration-300"
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </div>

                {/* Desktop grid - Muundo wa picha kama Airbnb kwa skrini kubwa */}
                <div className="hidden lg:block">
                  <div className="relative grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-t-lg overflow-hidden">
                    {/* Large left image */}
                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(true)}
                      className="col-span-2 row-span-2 w-full h-full"
                    >
                      <img
                        src={(property.images && property.images[0]) || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=900&fit=crop'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    {/* Four small images on the right */}
                    {[1, 2, 3, 4].map((i) => (
                      <button
                        type="button"
                        onClick={() => setIsGalleryOpen(true)}
                        key={i}
                        className="w-full h-full"
                      >
                        <img
                          src={(property.images && property.images[i]) || (property.images && property.images[0]) || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop'}
                          alt={`${property.title} ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}

                    {/* Show all photos button */}
                    <div className="absolute bottom-3 right-3">
                      <Button
                        variant="secondary"
                        onClick={() => setIsGalleryOpen(true)}
                        className="bg-white/90 hover:bg-white rounded-full shadow-sm text-sm"
                      >
                        <Images className="h-4 w-4 mr-2" />
                        Show all photos
                      </Button>
                    </div>

                    {/* Action Buttons - top-right */}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFavorite(e);
                        }}
                        className={`bg-white/80 hover:bg-white h-10 w-10 ${isFavorited(property?.id || '') ? 'text-red-500' : 'text-gray-600'
                          }`}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited(property?.id || '') ? 'fill-current' : ''}`} />
                      </Button>
                      <ShareDropdown
                        title={property.title}
                        description={`Angalia nyumba hii nzuri: ${property.title} - TZS ${Number(property.price).toLocaleString()}/mwezi`}
                        url={window.location.href}
                        className="bg-white/80 hover:bg-white text-gray-600 h-10 w-10"
                        variant="ghost"
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Thumbnails (mobile only) */}
                {property.images && property.images.length > 1 && (
                  <div className="p-3 sm:p-4 flex space-x-2 overflow-x-auto lg:hidden">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex
                          ? 'border-primary'
                          : 'border-transparent'
                          }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Full gallery dialog */}
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                  <DialogContent className="max-w-7xl w-[95vw] h-[92vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle>{property.title} — Photos</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 h-full auto-rows-[calc(50%-6px)]">
                        {(property.images && property.images.length > 0
                          ? property.images
                          : ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=900&fit=crop']
                        ).slice(0, 8).map((src, idx) => (
                          <div 
                            key={idx} 
                            className="relative group cursor-pointer h-full"
                            onClick={() => {
                              setZoomedImage(src);
                              setZoomLevel(1);
                            }}
                          >
                            <img 
                              src={src} 
                              alt={`Photo ${idx + 1}`} 
                              className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-[1.02]" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                  <line x1="11" y1="8" x2="11" y2="14"></line>
                                  <line x1="8" y1="11" x2="14" y2="11"></line>
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Zoom Image Modal */}
                <Dialog open={!!zoomedImage} onOpenChange={() => {
                  setZoomedImage(null);
                  setZoomLevel(1);
                  setPanPosition({ x: 0, y: 0 });
                }}>
                  <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
                    <div className="relative w-full h-full bg-black flex flex-col">
                      {/* Header with zoom controls */}
                      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-between">
                          <DialogTitle className="text-white">
                            {property.title}
                            {property.images && property.images.length > 1 && (
                              <span className="ml-2 text-sm text-white/70">
                                ({(property.images.indexOf(zoomedImage || '') + 1)} / {property.images.length})
                              </span>
                            )}
                          </DialogTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setZoomLevel(prev => Math.max(prev - 0.5, 1));
                                if (zoomLevel <= 1.5) setPanPosition({ x: 0, y: 0 });
                              }}
                              disabled={zoomLevel <= 1}
                              className="text-white hover:bg-white/20"
                              title="Zoom Out"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                              </svg>
                            </Button>
                            <span className="text-white text-sm min-w-[60px] text-center">
                              {Math.round(zoomLevel * 100)}%
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}
                              disabled={zoomLevel >= 4}
                              className="text-white hover:bg-white/20"
                              title="Zoom In"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                              </svg>
                            </Button>
                            {zoomLevel > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setZoomLevel(1);
                                  setPanPosition({ x: 0, y: 0 });
                                }}
                                className="text-white hover:bg-white/20 text-xs"
                                title="Reset Zoom"
                              >
                                Reset
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Previous Image Button */}
                      {property.images && property.images.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentIndex = property.images?.indexOf(zoomedImage || '') || 0;
                            const prevIndex = currentIndex === 0 ? (property.images?.length || 1) - 1 : currentIndex - 1;
                            setZoomedImage(property.images?.[prevIndex] || null);
                            setZoomLevel(1);
                            setPanPosition({ x: 0, y: 0 });
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                        >
                          <ChevronLeft className="h-8 w-8" />
                        </Button>
                      )}

                      {/* Next Image Button */}
                      {property.images && property.images.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentIndex = property.images?.indexOf(zoomedImage || '') || 0;
                            const nextIndex = currentIndex === (property.images?.length || 1) - 1 ? 0 : currentIndex + 1;
                            setZoomedImage(property.images?.[nextIndex] || null);
                            setZoomLevel(1);
                            setPanPosition({ x: 0, y: 0 });
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                        >
                          <ChevronRight className="h-8 w-8" />
                        </Button>
                      )}

                      {/* Image container with zoom and pan */}
                      <div 
                        ref={imageContainerRef}
                        className={`flex-1 overflow-hidden flex items-center justify-center p-4 ${zoomLevel > 1 ? 'cursor-grab' : 'cursor-zoom-in'} ${isDragging ? 'cursor-grabbing' : ''}`}
                        onWheel={(e) => {
                          e.preventDefault();
                          const rect = imageContainerRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          
                          const delta = e.deltaY;
                          const newZoom = delta < 0 
                            ? Math.min(zoomLevel + 0.2, 4) 
                            : Math.max(zoomLevel - 0.2, 1);
                          
                          // Reset pan when zooming out to 1
                          if (newZoom <= 1) {
                            setPanPosition({ x: 0, y: 0 });
                          }
                          
                          setZoomLevel(newZoom);
                        }}
                        onMouseDown={(e) => {
                          if (zoomLevel > 1) {
                            setIsDragging(true);
                            setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
                          }
                        }}
                        onMouseMove={(e) => {
                          if (isDragging && zoomLevel > 1) {
                            const newX = e.clientX - dragStart.x;
                            const newY = e.clientY - dragStart.y;
                            setPanPosition({ x: newX, y: newY });
                          }
                        }}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onDoubleClick={(e) => {
                          if (zoomLevel === 1) {
                            // Zoom in to clicked position
                            const rect = imageContainerRef.current?.getBoundingClientRect();
                            if (rect) {
                              const x = e.clientX - rect.left - rect.width / 2;
                              const y = e.clientY - rect.top - rect.height / 2;
                              setPanPosition({ x: -x, y: -y });
                              setZoomLevel(2.5);
                            }
                          } else {
                            // Reset zoom
                            setZoomLevel(1);
                            setPanPosition({ x: 0, y: 0 });
                          }
                        }}
                      >
                        {zoomedImage && (
                          <img
                            src={zoomedImage}
                            alt="Zoomed view"
                            className="select-none pointer-events-none"
                            style={{
                              transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                            }}
                            draggable={false}
                          />
                        )}
                      </div>

                      {/* Help text */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                        Double-click to zoom • Drag to pan • Mouse wheel to zoom • Arrows to navigate
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Property Details Card - Kadi ya maelezo ya nyumba */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6 overflow-hidden">
                  {/* Property Header */}
                  <PropertyHeader
                    title={property.title}
                    location={property.location}
                    fullAddress={property.location}
                    price={Number(property.price)}
                    amenities={property.amenities}
                    nearbyServices={property.nearby_services}
                  />

                  <Separator />

                  {/* Property Description */}
                  <PropertyDescription description={property.description} />

                  <Separator />

                  {/* Property Features - Vipengele vya nyumba */}
                  <PropertyFeatures
                    propertyType={property.property_type}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    areaSqm={property.square_meters}
                  />

                  {/* Amenities Section - Display all amenities from database */}
                  {property.amenities && property.amenities.length > 0 && (
                    <>
                      <Separator />
                      <PropertyAmenities amenities={property.amenities} />
                    </>
                  )}

                  {/* Nearby Services Section */}
                  {property.nearby_services && property.nearby_services.length > 0 && (
                    <>
                      <Separator />
                      <NearbyServices services={property.nearby_services} />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('propertyDetail.reviews.title', 'Guest Reviews')}
                  </h2>
                  
                  {reviewsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="md" />
                    </div>
                  ) : statistics && statistics.total_reviews > 0 ? (
                    <>
                      {/* Rating Summary */}
                      <RatingSummary statistics={statistics} />
                      
                      <Separator />
                      
                      {/* Review List */}
                      <ReviewList reviews={reviews} />
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {t('propertyDetail.reviews.noReviews', 'No reviews yet')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {t('propertyDetail.reviews.beFirst', 'Be the first to leave a review after booking!')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section - Sehemu ya upande */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Booking Form */}
            <div ref={bookingFormRef}>
              <BookingForm
                propertyId={property.id}
                pricePerMonth={Number(property.price)}
                property={{
                  id: property.id,
                  title: property.title,
                  location: property.location,
                  images: property.images || [],
                  property_type: property.property_type,
                  price: Number(property.price),
                  min_rental_months: (property as typeof property & { min_rental_months?: number }).min_rental_months
                }}
                guestInfo={{
                  id: user?.id || '',
                  name: user?.user_metadata?.full_name || user?.email || null,
                  email: user?.email || null,
                  phone: user?.user_metadata?.phone || null
                }}
                onConfirmBooking={handleConfirmBooking}
                isLoading={createBookingMutation.isPending}
              />
            </div>

            {/* Host Information Card */}
            <HostInformationCard
              hostName={property.profiles?.name ?? undefined}
              hostAvatar={property.profiles?.avatar_url ?? undefined}
              memberSince={property.profiles?.created_at ?? undefined}
              totalProperties={hostPropertyCount}
              contactPhone={property.contact_phone}
              whatsappPhone={property.contact_whatsapp_phone}
              propertyTitle={property.title}
              isVerified={true}
            />

            {/* Location Map */}
            <PropertyLocation
              location={property.location}
              fullAddress={property.location}
              title={property.title}
            />

            {/* Safety Tips */}
            <SafetyTips />
          </div>
        </div>

        {/* Similar Properties Section */}
        <SimilarProperties
          currentPropertyId={property.id}
          location={property.location}
          propertyType={property.property_type}
          price={Number(property.price)}
          allProperties={typedProperties}
        />
      </div>

      {/* Sticky Book Now Button - Mobile & Desktop */}
      {showStickyButton && (
        <>
          {/* Mobile Sticky Button */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-lg p-3 safe-area-inset-bottom">
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
              <div className="flex-1">
                <p className="text-xs text-gray-500">{t('propertyDetail.priceFrom', 'From')}</p>
                <p className="text-lg font-bold text-gray-900">
                  TZS {Number(property.price).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/{t('propertyDetail.perMonth', 'month')}</span>
                </p>
              </div>
              <Button
                onClick={() => setIsMobileBookingOpen(true)}
                className="flex-shrink-0 h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('propertyDetail.bookNow', 'Book Now')}
              </Button>
            </div>
          </div>

          {/* Desktop Sticky Button */}
          <div className="hidden lg:block fixed bottom-6 right-6 z-50 animate-slide-up">
            <Button
              onClick={() => {
                bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="h-14 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full"
              size="lg"
            >
              <Calendar className="h-5 w-5 mr-2" />
              <span className="font-semibold">{t('propertyDetail.bookNow', 'Book Now')}</span>
              <span className="ml-2 text-sm opacity-90">
                TZS {Number(property.price).toLocaleString()}/{t('propertyDetail.perMonth', 'mo')}
              </span>
            </Button>
          </div>
        </>
      )}

      {/* Mobile Booking Sheet */}
      <Sheet open={isMobileBookingOpen} onOpenChange={setIsMobileBookingOpen}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t('propertyDetail.bookProperty', 'Book This Property')}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <BookingForm
              propertyId={property.id}
              pricePerMonth={Number(property.price)}
              property={{
                id: property.id,
                title: property.title,
                location: property.location,
                images: property.images || [],
                property_type: property.property_type,
                price: Number(property.price),
                min_rental_months: (property as typeof property & { min_rental_months?: number }).min_rental_months
              }}
              guestInfo={{
                id: user?.id || '',
                name: user?.user_metadata?.full_name || user?.email || null,
                email: user?.email || null,
                phone: user?.user_metadata?.phone || null
              }}
              onConfirmBooking={(bookingData, specialRequests) => {
                setIsMobileBookingOpen(false);
                handleConfirmBooking(bookingData, specialRequests);
              }}
              isLoading={createBookingMutation.isPending}
              className="border-0 shadow-none"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Add bottom padding when sticky button is visible */}
      {showStickyButton && <div className="h-20 lg:h-0" />}

      <Footer />
    </div>
  );
};

export default PropertyDetail;