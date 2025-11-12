/**
 * PROPERTYEXAMPLE.TSX - PROPERTY LISTING EXAMPLE PAGE
 * ==================================================
 * 
 * Ukurasa wa mfano wa kuongeza nyumba - Example page for adding properties
 * 
 * FUNCTIONALITY / KAZI:
 * - Shows step-by-step guide for adding properties (Kuonyesha mwongozo wa hatua kwa hatua)
 * - Provides visual examples of good property listings (Kutoa mifano ya matangazo mazuri)
 * - Explains best practices for property descriptions (Kuelezea mbinu bora za maelezo)
 * - Demonstrates image upload process (Kuonyesha mchakato wa kupakia picha)
 * 
 * DESIGN FEATURES / VIPENGELE VYA MUUNDO:
 * - Step-by-step tutorial layout (Mpangilio wa mafunzo ya hatua kwa hatua)
 * - Visual examples with screenshots (Mifano ya kuona na picha)
 * - Interactive elements and tips (Vipengele vya mwingiliano na vidokezo)
 * - Call-to-action to start adding property (Wito wa kitendo wa kuanza kuongeza nyumba)
 */

import React from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Home, 
  Camera, 
  MapPin, 
  DollarSign,
  FileText,
  Phone,
  CheckCircle,
  Star,
  Users,
  Eye,
  MessageCircle,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * PROPERTY EXAMPLE PAGE COMPONENT
 * ==============================
 * 
 * Main component that provides a comprehensive guide for landlords
 * on how to create effective property listings.
 * 
 * Kipengele kikuu kinachotoa mwongozo mkamilifu kwa wenye nyumba
 * juu ya jinsi ya kutengeneza matangazo mazuri ya nyumba.
 */
const PropertyExample = () => {
  const navigate = useNavigate();

  /**
   * EXAMPLE PROPERTY DATA
   * ====================
   * 
   * Sample property data used to demonstrate best practices
   * in property listing creation.
   * 
   * Data ya mfano ya nyumba inayotumiwa kuonyesha mbinu bora
   * za kutengeneza tangazo la nyumba.
   */
  const exampleProperty = {
    title: "Nyumba ya Kisasa Mikocheni - Vyumba 3",
    description: "Nyumba nzuri ya kisasa yenye vyumba 3 vya kulala, jiko la kisasa, na bustani ndogo. Iko katika eneo tulivu na salama la Mikocheni, karibu na shule, hospitali, na maduka. Nyumba ina umeme wa kudumu, maji safi, na mahali pa kuegesha gari. Inafaa kwa familia au watu wazima wanaofanya kazi.",
    price: "800,000",
    location: "Mikocheni, Dar es Salaam",
    features: ["3 vyumba vya kulala", "2 vyumba vya kuogea", "Jiko la kisasa", "Bustani", "Parking", "Usalama 24/7"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
    ]
  };

  /**
   * STEP-BY-STEP GUIDE DATA
   * ======================
   * 
   * Structured guide showing the process of creating a property listing.
   * Each step includes title, description, and tips.
   * 
   * Mwongozo uliopangwa unaonyesha mchakato wa kutengeneza tangazo la nyumba.
   * Kila hatua ina kichwa, maelezo, na vidokezo.
   */
  const steps = [
    {
      number: 1,
      title: "Weka Jina la Nyumba",
      description: "Chagua jina la kuvutia na la kuelezea nyumba yako",
      icon: FileText,
      tips: [
        "Tumia maneno ya kuvutia kama 'kisasa', 'nzuri', 'tulivu'",
        "Ongeza eneo na idadi ya vyumba",
        "Epuka maneno mengi sana - weka kwa ufupi"
      ],
      example: "Nyumba ya Kisasa Mikocheni - Vyumba 3"
    },
    {
      number: 2,
      title: "Andika Maelezo Mazuri",
      description: "Elezea nyumba yako kwa undani na kwa uwazi",
      icon: MessageCircle,
      tips: [
        "Elezea vyumba vyote vilivyomo",
        "Taja huduma za karibu (shule, hospitali, maduka)",
        "Ongeza maelezo ya usalama na mazingira"
      ],
      example: "Nyumba nzuri ya kisasa yenye vyumba 3 vya kulala, jiko la kisasa..."
    },
    {
      number: 3,
      title: "Weka Bei ya Haki",
      description: "Chagua bei inayofaa na ya ushindani",
      icon: DollarSign,
      tips: [
        "Linganisha na nyumba zingine za aina hiyo",
        "Fikiria huduma na vifaa vilivyomo",
        "Weka bei ya kweli - usidanganye"
      ],
      example: "TZS 800,000 kwa mwezi"
    },
    {
      number: 4,
      title: "Ongeza Picha Nzuri",
      description: "Pakia picha za ubora wa juu za nyumba yako",
      icon: Camera,
      tips: [
        "Piga picha wakati wa mchana kwa mwanga mzuri",
        "Onyesha vyumba vyote muhimu",
        "Hakikisha picha ni wazi na za ubora"
      ],
      example: "Angalau picha 3-5 za vyumba tofauti"
    },
    {
      number: 5,
      title: "Weka Maelezo ya Mawasiliano",
      description: "Ongeza nambari za simu za kufikika",
      icon: Phone,
      tips: [
        "Weka nambari za simu za kweli",
        "Ongeza WhatsApp kwa mawasiliano ya haraka",
        "Hakikisha unaweza kujibu simu"
      ],
      example: "+255 712 345 678"
    }
  ];

  /**
   * SUCCESS TIPS DATA
   * ================
   * 
   * Additional tips for creating successful property listings
   * that attract more tenants and inquiries.
   * 
   * Vidokezo vya ziada vya kutengeneza matangazo ya mafanikio
   * yanayovutia wapangaji wengi na maswali.
   */
  const successTips = [
    {
      icon: Star,
      title: "Kuwa wa Kweli",
      description: "Elezea nyumba kama ilivyo - usidanganye kuhusu hali yake"
    },
    {
      icon: Users,
      title: "Jibu Haraka",
      description: "Jibu maswali ya wapangaji kwa haraka ili usipoteze fursa"
    },
    {
      icon: Eye,
      title: "Sasisha Mara kwa Mara",
      description: "Sasisha tangazo lako ili liwe juu ya orodha"
    },
    {
      icon: TrendingUp,
      title: "Angalia Takwimu",
      description: "Tumia takwimu za tangazo lako kuboresha uongozaji"
    }
  ];

  /**
   * RENDER STEP CARD COMPONENT
   * =========================
   * 
   * Renders individual step cards in the guide.
   * Each card shows step number, title, description, and tips.
   * 
   * Kuonyesha kadi za hatua moja moja katika mwongozo.
   * Kila kadi inaonyesha nambari ya hatua, kichwa, maelezo, na vidokezo.
   */
  const renderStepCard = (step: typeof steps[0]) => (
    <Card key={step.number} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
            {step.number}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <step.icon className="h-5 w-5 mr-2 text-primary" />
              {step.title}
            </CardTitle>
            <p className="text-gray-600 mt-1">{step.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Vidokezo:
            </h4>
            <ul className="space-y-1">
              {step.tips.map((tip, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Mfano:
            </h4>
            <p className="text-sm text-green-800 font-mono bg-white p-2 rounded border">
              {step.example}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * MAIN COMPONENT RENDER
   * ====================
   * 
   * Renders the complete property example page with navigation,
   * step-by-step guide, example property, and call-to-action.
   * 
   * Kuonyesha ukurasa kamili wa mfano wa nyumba na uongozaji,
   * mwongozo wa hatua kwa hatua, mfano wa nyumba, na wito wa kitendo.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation - Uongozaji wa kurudi */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Rudi Dashboard
        </Button>

        {/* Page Header - Kichwa cha ukurasa */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Jinsi ya Kuongeza Nyumba Yako
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fuata mwongozo huu wa hatua kwa hatua ili utengeneze tangazo la nyumba 
            linalovutia na la mafanikio. Tutakuonyesha kila kitu unachohitaji kujua.
          </p>
        </div>

        {/* Step-by-Step Guide - Mwongozo wa hatua kwa hatua */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mwongozo wa Hatua kwa Hatua
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {steps.map(renderStepCard)}
          </div>
        </div>

        {/* Example Property Display - Onyesho la mfano wa nyumba */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mfano wa Tangazo Zuri
          </h2>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Property Images - Picha za nyumba */}
              <div className="relative">
                <img
                  src={exampleProperty.images[0]}
                  alt="Mfano wa nyumba"
                  className="w-full h-80 lg:h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                  Mfano Mzuri
                </Badge>
              </div>
              
              {/* Property Details - Maelezo ya nyumba */}
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {exampleProperty.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {exampleProperty.location}
                    </div>
                    <div className="text-3xl font-bold text-primary mb-4">
                      TZS {exampleProperty.price}
                      <span className="text-lg text-gray-600 font-normal">/mwezi</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Maelezo:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {exampleProperty.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Vipengele:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exampleProperty.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">Tangazo Zuri!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Tangazo hili lina maelezo kamili, picha nzuri, na bei ya haki.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Success Tips - Vidokezo vya mafanikio */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Vidokezo vya Mafanikio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successTips.map((tip, index) => (
              <Card key={index} className="border-0 shadow-lg text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action - Wito wa kitendo */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-primary to-serengeti-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Tayari Kuanza?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Sasa unajua jinsi ya kutengeneza tangazo zuri. Anza kuongeza nyumba yako leo!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Home className="h-5 w-5 mr-2" />
                    Ongeza Nyumba Yako
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate(-1)}
                >
                  Rudi Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PropertyExample;