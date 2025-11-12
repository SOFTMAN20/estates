/**
 * ABOUT.TSX - ENHANCED ABOUT US PAGE
 * ==================================
 * 
 * Ukurasa wa kuhusu Nyumba Link ulioboreshwa - Enhanced About Us page for Nyumba Link
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays company information and mission (Kuonyesha maelezo ya kampuni na dhamira)
 * - Shows team information and values (Kuonyesha maelezo ya timu na maadili)
 * - Provides contact information (Kutoa maelezo ya mawasiliano)
 * - Explains platform benefits and features (Kuelezea faida na vipengele vya jukwaa)
 * 
 * ENHANCED DESIGN FEATURES / VIPENGELE VYA MUUNDO VILIVYOBORESHWA:
 * - Modern gradient backgrounds (Mandhari ya kisasa ya gradient)
 * - Smooth animations and transitions (Mchoro laini na mabadiliko)
 * - Interactive hover effects (Athari za mwingiliano za hover)
 * - Responsive grid layouts (Mipangilio ya gridi inayojibu)
 * - Professional card designs (Muundo wa kitaalamu wa kadi)
 * - Enhanced typography and spacing (Maandishi na nafasi zilizoboreswa)
 */

import React from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Target, 
  Heart, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Building2,
  Globe,
  Eye,
  Search,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Play,
  Lightbulb,
  Rocket,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * ENHANCED ABOUT US PAGE COMPONENT
 * ===============================
 * 
 * Main component that displays comprehensive information about Nyumba Link,
 * with enhanced visual design, animations, and modern UI elements.
 * 
 * Kipengele kikuu kinachoonyesha maelezo makamilifu kuhusu Nyumba Link,
 * na muundo wa kuona ulioboreshwa, mchoro, na vipengele vya kisasa vya UI.
 */
const About = () => {
  const { t } = useTranslation();

  /**
   * ENHANCED COMPANY STATISTICS
   * ==========================
   * 
   * Key metrics with enhanced visual presentation and animations.
   */
  const stats = [
    { 
      icon: Building2, 
      number: '1000+', 
      label: t('about.registeredProperties'),
      gradient: 'from-blue-500 to-blue-600',
      delay: 'delay-0',
      bgGlow: 'bg-blue-500/20'
    },
    { 
      icon: Users, 
      number: '500+', 
      label: t('about.landlords'),
      gradient: 'from-green-500 to-green-600',
      delay: 'delay-100',
      bgGlow: 'bg-green-500/20'
    },
    { 
      icon: Globe, 
      number: '50+', 
      label: t('about.cities'),
      gradient: 'from-purple-500 to-purple-600',
      delay: 'delay-200',
      bgGlow: 'bg-purple-500/20'
    },
    { 
      icon: Star, 
      number: '5000+', 
      label: t('about.happyUsers'),
      gradient: 'from-orange-500 to-orange-600',
      delay: 'delay-300',
      bgGlow: 'bg-orange-500/20'
    }
  ];

  /**
   * ENHANCED CORE VALUES
   * ===================
   * 
   * Company values with improved visual design and hover effects.
   */
  const values = [
    {
      icon: Shield,
      title: t('about.security'),
      description: t('about.securityText'),
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-100'
    },
    {
      icon: Zap,
      title: t('about.simplicity'),
      description: t('about.simplicityText'),
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      hoverBg: 'hover:bg-yellow-100'
    },
    {
      icon: Heart,
      title: t('about.trust'),
      description: t('about.trustText'),
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      hoverBg: 'hover:bg-red-100'
    },
    {
      icon: Award,
      title: t('about.excellence'),
      description: t('about.excellenceText'),
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      hoverBg: 'hover:bg-green-100'
    }
  ];

  /**
   * ENHANCED TEAM MEMBERS
   * ====================
   * 
   * Team showcase with improved visual presentation.
   */
  const team = [
    {
      name: 'StarLabs AI',
      role: t('about.leadDeveloper'),
      description: t('about.aiTeamDescription'),
      image: '/images/starlabs.jpg',
      gradient: 'from-primary to-serengeti-500',
      skills: ['AI Development', 'System Architecture', 'Innovation']
    },
    {
      name: t('about.developmentTeam'),
      role: t('about.systemCreators'),
      description: t('about.developersDescription'),
      image: '/images/starlabs.jpg',
      gradient: 'from-blue-500 to-purple-500',
      skills: ['React Development', 'UI/UX Design', 'Database Management']
    },
    {
      name: t('about.serviceTeam'),
      role: t('about.customerSupport'),
      description: t('about.supportDescription'),
      image: '/images/services.jpg',
      gradient: 'from-green-500 to-teal-500',
      skills: ['Customer Support', 'Problem Solving', '24/7 Service']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Enhanced Hero Section with Floating Elements - Mobile First */}
      <section className="relative bg-gradient-to-br from-primary/5 via-serengeti-50 to-blue-50 py-16 sm:py-24 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 h-32 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-serengeti-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-blue-200/30 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-16 sm:top-32 right-10 sm:right-20 animate-bounce delay-1000">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
              <Home className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
          <div className="absolute bottom-16 sm:bottom-32 left-10 sm:left-20 animate-bounce delay-2000">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-serengeti-500" />
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Enhanced Logo Section with Glow Effect */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12 animate-fade-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-serengeti-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary to-serengeti-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                  <Home className="h-8 w-8 sm:h-14 sm:w-14 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent">
                    Nyumba
                  </span>
                  <span className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-serengeti-600 to-primary bg-clip-text text-transparent">
                    Link
                  </span>
                </div>
                <Badge className="mt-2 sm:mt-3 bg-gradient-to-r from-primary to-serengeti-500 text-white border-0 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Tanzania's #1 Housing Platform
                </Badge>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight animate-fade-in delay-200">
              <span className="bg-gradient-to-r from-gray-900 via-primary to-serengeti-600 bg-clip-text text-transparent">
                {t('about.title')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed animate-fade-in delay-300 mb-8 sm:mb-12 px-4">
              {t('about.subtitle')}
            </p>
            
            {/* Enhanced CTA Buttons with Glow Effects */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center animate-fade-in delay-500 px-4">
              <Link to="/browse">
                <Button size="lg" className="relative group bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-600 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-serengeti-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                    {t('about.searchHouses')}
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
              <Link to="/signup?type=landlord">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 sm:border-3 border-primary text-primary hover:bg-primary hover:text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg group w-full sm:w-auto"
                >
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                  {t('about.registerAsLandlord')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision Section with Parallax Effect */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 sm:top-20 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-bl from-serengeti-300/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20 px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Our Purpose
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
              Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Enhanced Mission Card */}
            <Card className="group border-0 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-3 sm:hover:-translate-y-6 hover:rotate-1 bg-gradient-to-br from-white via-blue-50 to-white relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <CardContent className="p-6 sm:p-8 lg:p-12 relative">
                <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8 lg:mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-serengeti-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-serengeti-500 rounded-3xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 lg:mr-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                      <Target className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent text-center sm:text-left">
                    {t('about.mission')}
                  </h2>
                </div>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8">
                  {t('about.missionText')}
                </p>
                <div className="flex items-center justify-center sm:justify-start text-primary font-semibold text-base sm:text-lg group-hover:text-serengeti-600 transition-colors duration-300">
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Learn More About Our Mission
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Vision Card */}
            <Card className="group border-0 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-3 sm:hover:-translate-y-6 hover:-rotate-1 bg-gradient-to-br from-white via-purple-50 to-white relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <CardContent className="p-6 sm:p-8 lg:p-12 relative">
                <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8 lg:mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 lg:mr-8 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-2xl">
                      <Eye className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center sm:text-left">
                    {t('about.vision')}
                  </h2>
                </div>
                <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 sm:mb-8">
                  {t('about.visionText')}
                </p>
                <div className="flex items-center justify-center sm:justify-start text-purple-600 font-semibold text-base sm:text-lg group-hover:text-blue-600 transition-colors duration-300">
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                  Discover Our Vision
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section with Dark Theme */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px sm:50px 50px'
          }}></div>
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-serengeti-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <Badge className="mb-6 sm:mb-8 bg-white/10 text-white border-white/20 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Our Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight px-4">
              {t('about.achievements')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              {t('about.achievementsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className={`group border-0 bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all duration-700 transform hover:-translate-y-3 sm:hover:-translate-y-6 hover:scale-105 sm:hover:scale-110 ${stat.delay} animate-fade-in relative overflow-hidden`}>
                {/* Glow Effect */}
                <div className={`absolute inset-0 ${stat.bgGlow} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl`}></div>
                
                <CardContent className="p-4 sm:p-6 lg:p-10 text-center relative">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gradient-to-br ${stat.gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl`}>
                    <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-medium text-xs sm:text-sm lg:text-lg">
                    {stat.label}
                  </div>
                  
                  {/* Hover Effect Indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Values Section with Interactive Cards */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <Badge className="mb-6 sm:mb-8 bg-primary/10 text-primary border-primary/20 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              What Drives Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
              {t('about.values')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              {t('about.valuesSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <Card key={index} className={`group border-0 shadow-lg sm:shadow-xl hover:shadow-2xl sm:hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 sm:hover:-translate-y-8 hover:rotate-1 sm:hover:rotate-2 ${value.bgColor} ${value.hoverBg} relative overflow-hidden`}>
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                
                {/* Floating Particles Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping delay-100"></div>
                  <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
                  <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-500"></div>
                </div>
                
                <CardContent className="p-6 sm:p-8 lg:p-10 text-center relative">
                  <div className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${value.bgColor} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 lg:mb-10 group-hover:scale-125 sm:group-hover:scale-150 group-hover:rotate-12 transition-all duration-500 shadow-xl`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    <value.icon className={`relative h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${value.iconColor} group-hover:text-white transition-colors duration-500 z-10`} />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-primary transition-colors duration-500">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-500">
                    {value.description}
                  </p>
                  
                  {/* Hover Effect Arrow */}
                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${value.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section with 3D Cards */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-purple-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 h-20 sm:w-40 sm:h-40 bg-primary/10 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-16 h-16 sm:w-32 sm:h-32 bg-serengeti-300/20 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-blue-300/20 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <Badge className="mb-6 sm:mb-8 bg-purple-100 text-purple-600 border-purple-200 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Meet Our Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
              {t('about.team')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              {t('about.teamSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {team.map((member, index) => (
              <Card key={index} className="group border-0 shadow-xl sm:shadow-2xl hover:shadow-3xl sm:hover:shadow-4xl transition-all duration-700 transform hover:-translate-y-4 sm:hover:-translate-y-10 hover:scale-105 bg-white overflow-hidden relative">
                {/* 3D Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                <CardContent className="p-0 relative">
                  {/* Enhanced Image Section with Overlay */}
                  <div className="relative overflow-hidden">
                    <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-700`}></div>
                    
                    {/* Hover Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">{member.name}</h3>
                      <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-4">{member.role}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs sm:text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm text-xs sm:text-sm">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Expert
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-500">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                      {member.description}
                    </p>
                    
                    {/* Social Links with Hover Effects */}
                    <div className="flex justify-center space-x-3 sm:space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                        <span className="text-white font-bold text-sm sm:text-base">in</span>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                        <span className="text-white font-bold text-sm sm:text-base">@</span>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section with Interactive Elements */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-ping"></div>
            <div className="absolute top-20 sm:top-40 right-20 sm:right-40 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-serengeti-500 rounded-full animate-ping delay-1000"></div>
            <div className="absolute bottom-20 sm:bottom-40 left-20 sm:left-40 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full animate-ping delay-2000"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <Badge className="mb-6 sm:mb-8 bg-green-100 text-green-600 border-green-200 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Get In Touch
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
              {t('about.contact')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
              {t('about.contactSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Enhanced Phone Contact */}
            <Card className="group border-0 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 sm:hover:-translate-y-8 hover:rotate-1 sm:hover:rotate-2 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
              
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center relative">
                <div className="relative mb-6 sm:mb-8 lg:mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <Phone className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-blue-600 transition-colors duration-500">
                  {t('about.callUs')}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {t('about.callDescription')}
                </p>
                <a 
                  href="tel:+255750929317"
                  className="inline-flex items-center text-blue-600 font-bold text-lg sm:text-xl hover:text-blue-700 transition-colors duration-300 group-hover:scale-110 transform"
                >
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  +255 750 929 317
                </a>
                
                {/* Pulse Effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Email Contact */}
            <Card className="group border-0 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 sm:hover:-translate-y-8 hover:-rotate-1 sm:hover:-rotate-2 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
              
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center relative">
                <div className="relative mb-6 sm:mb-8 lg:mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 shadow-2xl">
                    <Mail className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-green-600 transition-colors duration-500">
                  {t('about.email')}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {t('about.emailDescription')}
                </p>
                <a 
                  href="mailto:info@nyumbalink.co.tz"
                  className="inline-flex items-center text-green-600 font-bold text-base sm:text-lg lg:text-xl hover:text-green-700 transition-colors duration-300 group-hover:scale-110 transform break-all"
                >
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 flex-shrink-0" />
                  info@nyumbalink.co.tz
                </a>
                
                {/* Pulse Effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Location */}
            <Card className="group border-0 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-4 sm:hover:-translate-y-8 hover:rotate-1 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden md:col-span-3 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
              
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center relative">
                <div className="relative mb-6 sm:mb-8 lg:mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 group-hover:text-purple-600 transition-colors duration-500">
                  {t('about.location')}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {t('about.locationDescription')}
                </p>
                <p className="text-purple-600 font-bold text-lg sm:text-xl group-hover:scale-110 transform transition-all duration-300">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 inline mr-2 sm:mr-3" />
                  Dar es Salaam, Tanzania
                </p>
                
                {/* Pulse Effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action with Particle Effects */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-r from-primary via-serengeti-500 to-primary relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-16 h-16 sm:w-32 sm:h-32 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-12 h-12 sm:w-24 sm:h-24 bg-white/10 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-16 sm:h-16 bg-white/10 rounded-full animate-bounce delay-500"></div>
          <div className="absolute top-10 sm:top-20 right-1/3 w-10 h-10 sm:w-20 sm:h-20 bg-white/10 rounded-full animate-bounce delay-1500"></div>
          
          {/* Floating Particles */}
          <div className="absolute top-16 sm:top-32 right-10 sm:right-20 animate-bounce delay-1000">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
              <Home className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
          
          {/* Particle System */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto px-4">
            {/* Enhanced Heading with Glow */}
            <div className="relative mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight relative z-10">
                {t('about.readyToStart')}
              </h2>
              <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-white/20 blur-sm">
                {t('about.readyToStart')}
              </div>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 sm:mb-16 leading-relaxed">
              {t('about.joinThousands')}
            </p>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center mb-12 sm:mb-16">
              <Link to="/signup?type=landlord">
                <Button size="lg" className="relative group bg-white text-primary hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-105 transition-all duration-500 text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 overflow-hidden w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center">
                    <Home className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300" />
                    {t('about.registerAsLandlord')}
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 ml-3 sm:ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Button>
              </Link>
              <Link to="/browse">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="relative group border-2 sm:border-3 border-white text-white hover:bg-white hover:text-primary shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 sm:hover:-translate-y-3 hover:scale-105 transition-all duration-500 text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center">
                    <Search className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300" />
                    {t('about.searchHouses')}
                  </div>
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 text-white/80">
              <div className="flex items-center group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-semibold">100% Secure</span>
              </div>
              <div className="flex items-center group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-semibold">Verified Landlords</span>
              </div>
              <div className="flex items-center group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-semibold">5-Star Support</span>
              </div>
              <div className="flex items-center group hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-semibold">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;