
/**
 * INDEX.TSX - HOMEPAGE COMPONENT
 * ==============================
 * 
 * Ukurasa wa kwanza wa Nyumba Link - Homepage for Nyumba Link
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays the main landing page (Inaonyesha ukurasa wa kwanza)
 * - Contains search functionality (Ina utafutaji wa nyumba)
 * - Shows popular destinations (Inaonyesha miji maarufu)
 * - Features highlighted properties (Inaonyesha nyumba maalum)
 * - Displays platform benefits (Inaonyesha faida za mfumo)
 * 
 * COMPONENT STRUCTURE / MUUNDO WA VIPENGELE:
 * 1. Navigation - Top navigation bar (Mstari wa uongozaji juu)
 * 2. HeroSection - Main search and intro (Sehemu ya utafutaji mkuu)
 * 3. FeaturedProperties - Highlighted properties (Nyumba maalum)
 * 4. PopularDestinations - Featured cities (Miji maarufu)
 * 5. FeaturesSection - Platform benefits (Faida za mfumo)
 * 6. Footer - Bottom information (Maelezo ya chini)
 * 
 * USER FLOW / MTIRIRIKO WA MTUMIAJI:
 * Landing → Search → Browse/Details → Authentication/Favorites
 */

import { lazy, Suspense } from 'react';
import Navigation from "@/components/layout/navbarLayout/Navigation";
import HeroSection from "@/components/layout/HeroSection";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PropertyTypeFiltersSkeleton,
  FeaturedPropertiesSkeleton,
  PopularDestinationsSkeleton,
  HowItWorksSkeleton,
  TestimonialsSkeleton,
  NewsletterSkeleton,
  FooterSkeleton,
} from '@/components/common/HomepageSkeletons';

// Lazy load below-the-fold components
const PropertyTypeFilters = lazy(() => import("@/components/layout/PropertyTypeFilters"));
const PopularDestinations = lazy(() => import("@/components/properties/propertyCommon/PopularDestinations"));
const FeaturedProperties = lazy(() => import("@/components/properties/propertyCommon/FeaturedProperties"));
const HowItWorks = lazy(() => import("@/components/layout/HowItWorks"));
const Testimonials = lazy(() => import("@/components/layout/Testimonials"));
const Newsletter = lazy(() => import("@/components/layout/Newsletter"));
const Footer = lazy(() => import("@/components/layout/Footer"));

/**
 * Homepage Component
 * Kipengele cha ukurasa wa kwanza
 * 
 * This is the main landing page that users see when they visit the site.
 * It combines multiple sections to create a comprehensive overview of the platform.
 * 
 * Huu ni ukurasa wa kwanza ambao watumiaji wanaona wanapovisimu tovuti.
 * Unaunganisha sehemu nyingi kuunda muhtasari mkamilifu wa jukwaa.
 */
const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      {/* Global navigation - Uongozaji wa kimataifa */}
      <Navigation />
      
      {/* Main hero section with search - Sehemu ya utafutaji mkuu */}
      <HeroSection />
      
      {/* Property Type Quick Filters - Vichujio vya haraka vya aina ya nyumba */}
      <Suspense fallback={<PropertyTypeFiltersSkeleton />}>
        <PropertyTypeFilters />
      </Suspense>
      
      {/* Highlighted property listings - Nyumba zilizoangaziwa */}
      <Suspense fallback={<FeaturedPropertiesSkeleton />}>
        <FeaturedProperties />
      </Suspense>
      
      {/* Popular cities and destinations - Miji na maeneo maarufu */}
      <Suspense fallback={<PopularDestinationsSkeleton />}>
        <PopularDestinations />
      </Suspense>
      
      {/* How It Works Section - Jinsi Inavyofanya Kazi */}
      <Suspense fallback={<HowItWorksSkeleton />}>
        <HowItWorks />
      </Suspense>
      
      {/* Testimonials Section - Maoni ya Watumiaji */}
      <Suspense fallback={<TestimonialsSkeleton />}>
        <Testimonials />
      </Suspense>
      
      {/* Call to Action Section - Sehemu ya Wito wa Kitendo */}
      <section className="py-20 bg-gradient-to-b from-safari-50 via-white to-kilimanjaro-50/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-serengeti-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
              {/* Background pattern for visual interest */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-lg">
                  {t('cta.title')}
                </h3>
                <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/95 font-medium leading-relaxed max-w-3xl mx-auto">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                  <Link
                    to="/signup?type=landlord"
                    className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-50 hover:scale-105 transition-all duration-300 inline-block text-center shadow-lg hover:shadow-xl transform min-w-[280px]"
                  >
                    {t('cta.registerAsLandlord')}
                  </Link>
                  <Link 
                    to="/browse" 
                    className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 inline-block text-center shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[280px]"
                  >
                    {t('cta.searchHouses')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section - Sehemu ya Jarida */}
      <Suspense fallback={<NewsletterSkeleton />}>
        <Newsletter />
      </Suspense>
      
      {/* Footer with additional information - Kichapo na maelezo ya ziada */}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
