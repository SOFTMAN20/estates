import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  User, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  X,
  Home,
  BarChart3,
  Search,
  Plus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface WelcomeBannerProps {
  profile: Profile | null;
  user: any;
  isNewUser: boolean;
  onProfileEdit: () => void;
  onDismissWelcome: () => void;
  propertiesCount: number;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  profile,
  user,
  isNewUser,
  onProfileEdit,
  onDismissWelcome,
  propertiesCount
}) => {
  const { t } = useTranslation();
  const [showGuide, setShowGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Guided tour steps
  const guideSteps = [
    {
      title: "Karibu Dashboard yako!",
      description: "Hii ni dashibodi yako ya kusimamia nyumba zako. Hapa unaweza kuongeza, kuhariri, na kuona nyumba zako zote.",
      icon: <Home className="h-8 w-8" />,
      highlight: "dashboard-overview"
    },
    {
      title: "Ongeza Nyumba Mpya",
      description: "Bonyeza hapa kuongeza nyumba mpya. Jaza maelezo ya nyumba, picha, na bei ili kuanza kupata wapangaji.",
      icon: <Plus className="h-8 w-8" />,
      highlight: "add-property-button"
    },
    {
      title: "Angalia Takwimu Zako",
      description: "Hapa unaweza kuona jumla ya nyumba zako, wapangaji, na mapato yako ya kila mwezi.",
      icon: <BarChart3 className="h-8 w-8" />,
      highlight: "stats-section"
    },
    {
      title: "Simamia Nyumba Zako",
      description: "Hii ni sehemu ya kusimamia nyumba zako zote. Unaweza kutafuta, kuhariri, au kufuta nyumba.",
      icon: <Search className="h-8 w-8" />,
      highlight: "property-management"
    },
    {
      title: "Kamilisha Profile Yako",
      description: "Jaza maelezo yako kamili ili wapangaji waweze kukufikia kwa urahisi.",
      icon: <User className="h-8 w-8" />,
      highlight: "profile-section"
    }
  ];

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeGuide = () => {
    setShowGuide(false);
    setCurrentStep(0);
  };

  const getProfileCompletion = () => {
    if (!profile) return 0;
    let completion = 0;
    if (profile.full_name) completion += 50;
    if (profile.phone) completion += 50;
    return completion;
  };

  const profileCompletion = getProfileCompletion();
  const isProfileComplete = profileCompletion === 100;

  if (isNewUser) {
    return (
      <>
        <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-r from-primary via-serengeti-500 to-primary text-white mb-4 sm:mb-6 lg:mb-8">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                    🎉 {t('dashboard.welcome')}
                  </h2>
                </div>
                <p className="text-sm sm:text-base lg:text-xl text-white/95 font-medium max-w-2xl drop-shadow-md leading-relaxed">
                  {t('dashboard.welcomeMessage')}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button 
                    variant="secondary" 
                    className="bg-white text-primary hover:bg-gray-100 text-sm sm:text-base"
                  >
                    <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {t('dashboard.completeAccount')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-primary text-sm sm:text-base"
                    onClick={() => setShowGuide(true)}
                  >
                    {t('dashboard.viewGuide')}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onDismissWelcome}
                className="text-white hover:bg-white/20 h-6 w-6 sm:h-8 sm:w-8 p-0 self-start sm:self-center"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
        
        <GuidedTourDialog
          showGuide={showGuide}
          currentStep={currentStep}
          guideSteps={guideSteps}
          nextStep={nextStep}
          prevStep={prevStep}
          closeGuide={closeGuide}
        />
      </>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 mb-4 sm:mb-6 lg:mb-8">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                {isProfileComplete && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-1 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-1">
                  {t('dashboard.welcomeUser', { name: profile?.full_name || 'Mwenye Nyumba' })}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base line-clamp-1">
                  {user?.email}
                </p>
                {profile?.phone && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    📞 {profile.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Profile Status */}
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{propertiesCount}</div>
                  <div className="text-xs text-gray-600">{t('dashboard.properties')}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold text-gray-900">{profileCompletion}%</span>
                    {isProfileComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">{t('dashboard.account')}</div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={onProfileEdit}
                variant={isProfileComplete ? "outline" : "default"}
                className={!isProfileComplete ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isProfileComplete ? t('dashboard.updateAccount') : t('dashboard.completeAccountAction')}
              </Button>
            </div>
          </div>

          {/* Profile Completion Progress */}
          {!isProfileComplete && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{t('dashboard.accountProgress')}</span>
                <span className="text-sm text-gray-600">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {t('dashboard.completeInfo')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <GuidedTourDialog
        showGuide={showGuide}
        currentStep={currentStep}
        guideSteps={guideSteps}
        nextStep={nextStep}
        prevStep={prevStep}
        closeGuide={closeGuide}
      />
    </>
  );
};

// Guided Tour Dialog Component
const GuidedTourDialog = ({ showGuide, currentStep, guideSteps, nextStep, prevStep, closeGuide }: {
  showGuide: boolean;
  currentStep: number;
  guideSteps: any[];
  nextStep: () => void;
  prevStep: () => void;
  closeGuide: () => void;
}) => {
  const currentStepData = guideSteps[currentStep];
  
  return (
    <Dialog open={showGuide} onOpenChange={closeGuide}>
      <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Dialog Header with gradient */}
        <div className="bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 text-white p-6 -m-6 mb-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  {currentStepData?.icon}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">
                    {currentStepData?.title}
                  </DialogTitle>
                  <p className="text-white/90 text-sm">
                    Hatua {currentStep + 1} ya {guideSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeGuide}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Dialog Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            {currentStepData?.description}
          </p>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Maendeleo</span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentStep + 1) / guideSteps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-serengeti-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nyuma
            </Button>

            <div className="flex space-x-1">
              {guideSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-primary w-8' 
                      : index < currentStep 
                        ? 'bg-primary/60' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === guideSteps.length - 1 ? (
              <Button
                onClick={closeGuide}
                className="bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400"
              >
                Maliza
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 flex items-center"
              >
                Endelea
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeBanner;