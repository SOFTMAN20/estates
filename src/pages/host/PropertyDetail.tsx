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

import React, { useState } from 'react';
import { useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ArrowLeft,
  Heart,
  School,
  Building2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Home,
  AlertCircle,
  Images
} from 'lucide-react';
import { useProperties, type Property } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from 'react-i18next';
import { BookingForm } from '@/components/bookings/BookingForm';
import { toast } from 'sonner';

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

  // Favorites functionality - Utendakazi wa vipendwa
  const { isFavorited, toggleFavorite } = useFavorites();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
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
   * Handles booking submission from the BookingForm component.
   * Kushughulikia kuwasilisha hifadhi kutoka kipengele cha BookingForm.
   */
  const handleBooking = (bookingData: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
    months: number;
    subtotal: number;
    serviceFee: number;
    totalAmount: number;
  }) => {
    // TODO: Implement booking creation logic with Supabase
    console.log('Booking data:', bookingData);
    toast.success(
      t('propertyDetail.bookingSuccess', 'Booking request submitted successfully!')
    );
    // Navigate to booking confirmation or payment page
    // navigate(`/bookings/confirm/${bookingData.propertyId}`);
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
        {/* Back Navigation Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-3 sm:mb-4 lg:mb-2 hover:bg-transparent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('propertyDetail.goBack')}
        </Button>

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
                  <DialogContent className="max-w-6xl w-full">
                    <DialogHeader>
                      <DialogTitle>{property.title} — Photos</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(property.images && property.images.length > 0
                        ? property.images
                        : ['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1200&h=900&fit=crop']
                      ).map((src, idx) => (
                        <img key={idx} src={src} alt={`Photo ${idx + 1}`} className="w-full h-64 object-cover rounded-md" />
                      ))}
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
                    fullAddress={property.full_address}
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
          </div>

          {/* Sidebar Section - Sehemu ya upande */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Booking Form */}
            <BookingForm
              propertyId={property.id}
              pricePerMonth={Number(property.price)}
              onBookNow={handleBooking}
            />

            {/* Host Information Card */}
            <HostInformationCard
              hostName={property.profiles?.name}
              hostAvatar={property.profiles?.avatar_url}
              memberSince={property.profiles?.created_at}
              totalProperties={hostPropertyCount}
              contactPhone={property.contact_phone}
              whatsappPhone={property.contact_whatsapp_phone}
              propertyTitle={property.title}
              isVerified={true}
            />

            {/* Location Map */}
            <PropertyLocation
              location={property.location}
              fullAddress={property.full_address}
              title={property.title}
            />

            {/* Safety Tips */}
            <SafetyTips />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;