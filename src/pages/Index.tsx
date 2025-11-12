
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

// Lazy load below-the-fold components
const PopularDestinations = lazy(() => import("@/components/common/propertyCommon/PopularDestinations"));
const FeaturedProperties = lazy(() => import("@/components/common/propertyCommon/FeaturedProperties"));
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      {/* Global navigation - Uongozaji wa kimataifa */}
      <Navigation />
      
      {/* Main hero section with search - Sehemu ya utafutaji mkuu */}
      <HeroSection />
      
      {/* Highlighted property listings - Nyumba zilizoangaziwa */}
      <Suspense fallback={
        <div className="py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <FeaturedProperties />
      </Suspense>
      
      {/* Popular cities and destinations - Miji na maeneo maarufu */}
      <Suspense fallback={
        <div className="py-16 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <PopularDestinations />
      </Suspense>
      
      {/* Call to Action Section - Sehemu ya Wito wa Kitendo */}
      <section className="py-16 bg-gradient-to-b from-white to-safari-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
              {/* Background pattern for visual interest */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent drop-shadow-lg">
                  Tayari Kuanza? Jisajili Sasa!
                </h3>
                <p className="text-xl md:text-2xl mb-8 text-white/95 font-medium leading-relaxed max-w-3xl mx-auto">
                  Jiunge na elfu za Watanzania wanaotumia Nyumba Link kupata nyumba zao za ndoto.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link
                    to="/signup?type=landlord"
                    className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-50 hover:scale-105 transition-all duration-300 inline-block text-center shadow-lg hover:shadow-xl transform"
                  >
                    Jisajili Kama Mwenye Nyumba
                  </Link>
                  <Link 
                    to="/browse" 
                    className="border-3 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 inline-block text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Tafuta Nyumba
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer with additional information - Kichapo na maelezo ya ziada */}
      <Suspense fallback={
        <div className="py-8 flex justify-center bg-gray-50">
          <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
