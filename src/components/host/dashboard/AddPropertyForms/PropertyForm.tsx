/**
 * PROPERTYFORM.TSX - REFACTORED MODULAR PROPERTY FORM
 * ====================================================
 * 
 * Refactored to use modular step components for better maintainability.
 * Each step is now a separate, reusable component with single responsibility.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Home, Building, Phone, Camera, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/lib/integrations/supabase/types';

// Import modular step components
import {
  Step1BasicInfo,
  Step2PropertyAddress, // Exported from Step3PropertyAddress.tsx
  Step3PropertyDetails, // Exported from Step2PropertyDetails.tsx
  Step4PhotoUpload,
  Step5ContactInfo,
  StepNavigation,
  FormNavigationButtons
} from '@/components/host/dashboard/AddPropertyForms/propertyFormSteps';

type Property = Tables<'properties'>;
import type { PropertyFormData as BasePropertyFormData } from '@/types/property';

type Profile = Tables<'profiles'>;

interface PropertyFormData extends BasePropertyFormData {
  price_period: string;
  square_meters: string;
}

interface PropertyFormProps {
  isOpen: boolean;
  editingProperty: Property | null;
  formData: PropertyFormData;
  profile: Profile | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof PropertyFormData, value: unknown) => void;
  onServiceToggle: (service: string) => void;
  onAmenityToggle: (amenity: string) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  isOpen,
  editingProperty,
  formData,
  profile,
  submitting,
  onClose,
  onSubmit,
  onInputChange,
  onServiceToggle,
  onAmenityToggle
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  const FORM_STORAGE_KEY = 'nyumba_link_property_form_data';
  const STEP_STORAGE_KEY = 'nyumba_link_property_form_step';

  useEffect(() => {
    if (isOpen && !editingProperty) {
      try {
        const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
        const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
        
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          Object.keys(parsedData).forEach((key) => {
            if (parsedData[key] !== undefined && parsedData[key] !== null) {
              onInputChange(key as keyof PropertyFormData, parsedData[key]);
            }
          });
        }
        
        if (savedStep) {
          const stepNumber = parseInt(savedStep, 10);
          if (stepNumber >= 1 && stepNumber <= 4) {
            setCurrentStep(stepNumber);
          }
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        localStorage.removeItem(FORM_STORAGE_KEY);
        localStorage.removeItem(STEP_STORAGE_KEY);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingProperty]);

  useEffect(() => {
    if (isOpen && !editingProperty) {
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  }, [formData, isOpen, editingProperty]);

  useEffect(() => {
    if (isOpen && !editingProperty) {
      try {
        localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
      } catch (error) {
        console.error('Error saving form step:', error);
      }
    }
  }, [currentStep, isOpen, editingProperty]);

  const totalSteps = 5;

  if (!isOpen) return null;

  const calculateProgress = () => {
    let completedFields = 0;
    const totalFields = 7;
    
    if (formData.title) completedFields++;
    if (formData.price) completedFields++;
    if (formData.location) completedFields++;
    if (formData.description) completedFields++;
    if (formData.contact_phone) completedFields++;
    if (formData.property_type) completedFields++;
    if (formData.images.length > 0) completedFields++;
    
    return (completedFields / totalFields) * 100;
  };

  const progress = calculateProgress();

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title?.trim() && formData.price?.trim() && formData.location?.trim() && formData.description?.trim() && formData.description.length >= 10);
      case 2:
        return !!(formData.property_type?.trim());
      case 3:
        return !!(formData.full_address?.trim());
      case 4:
        return formData.images && formData.images.length >= 3;
      case 5:
        return !!formData.contact_phone?.trim();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const clearSavedData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };

  const handleSubmit = async () => {
    if (currentStep === totalSteps) {
      const requiredFieldsValid = !!(
        formData.title?.trim() && 
        formData.price?.trim() && 
        formData.location?.trim() && 
        formData.description?.trim() && 
        formData.contact_phone?.trim() &&
        formData.property_type?.trim() &&
        formData.images && formData.images.length >= 3
      );
      
      if (!requiredFieldsValid) {
        toast({
          variant: "destructive",
          title: "Taarifa hazikamiliki",
          description: "Tafadhali jaza sehemu zote za lazima kabla ya kuongeza nyumba"
        });
        return;
      }
      
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: null
      } as React.FormEvent;
      
      try {
        await onSubmit(syntheticEvent);
        clearSavedData();
      } catch (error) {
        console.error('Form submission error:', error);
        toast({
          variant: "destructive",
          title: "Hitilafu",
          description: "Kuna tatizo la kuongeza nyumba. Tafadhali jaribu tena."
        });
      }
    }
  };

  const handleCancel = () => {
    clearSavedData();
    onClose();
  };

  const steps = [
    { id: 1, title: t('dashboard.basicInfo'), icon: Home, description: 'Jina, bei na eneo' },
    { id: 2, title: t('dashboard.details'), icon: Building, description: 'Maelezo na aina ya nyumba' },
    { id: 3, title: 'Anwani', icon: MapPin, description: 'Anwani kamili ya nyumba' },
    { id: 4, title: t('dashboard.photos'), icon: Camera, description: 'Picha za nyumba (za lazima)' },
    { id: 5, title: t('dashboard.contact'), icon: Phone, description: 'Maelezo ya mawasiliano' }
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={{
              title: formData.title,
              price: formData.price,
              price_period: formData.price_period,
              location: formData.location,
              description: formData.description
            }}
            onInputChange={onInputChange}
            isValid={isStepValid(1)}
          />
        );
      case 2:
        return (
          <Step3PropertyDetails
            formData={{
              property_type: formData.property_type,
              bedrooms: formData.bedrooms,
              bathrooms: formData.bathrooms,
              square_meters: formData.square_meters,
              description: formData.description,
              amenities: formData.amenities,
              nearby_services: formData.nearby_services
            }}
            onInputChange={onInputChange}
            onAmenityToggle={onAmenityToggle}
            onServiceToggle={onServiceToggle}
            isValid={isStepValid(2)}
          />
        );
      case 3:
        return (
          <Step2PropertyAddress
            formData={{
              full_address: formData.full_address
            }}
            onInputChange={onInputChange}
            isValid={isStepValid(3)}
          />
        );
      case 4:
        return (
          <Step4PhotoUpload
            images={formData.images}
            onImagesChange={(images) => onInputChange('images', images)}
            isValid={isStepValid(4)}
          />
        );
      case 5:
        return (
          <Step5ContactInfo
            formData={{
              contact_phone: formData.contact_phone,
              contact_whatsapp_phone: formData.contact_whatsapp_phone
            }}
            onInputChange={onInputChange}
            isValid={isStepValid(5)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 z-50">
      <Card className="w-full h-full sm:h-[96vh] sm:max-w-5xl lg:max-w-6xl sm:rounded-lg overflow-hidden shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-serengeti-50 border-b">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent line-clamp-1">
                {editingProperty ? t('dashboard.updateProperty') : t('dashboard.addNewPropertyTitle')}
              </CardTitle>
              <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 lg:p-6 overflow-y-auto h-[calc(100vh-120px)] sm:h-[calc(96vh-120px)]">
          <div className="max-w-4xl mx-auto">
            <StepNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              progress={progress}
              steps={steps}
              isStepValid={isStepValid}
              onStepClick={setCurrentStep}
            />
            
            <div className="min-h-[400px] mb-8">
              {renderCurrentStep()}
            </div>
            
            <FormNavigationButtons
              currentStep={currentStep}
              totalSteps={totalSteps}
              progress={progress}
              submitting={submitting}
              editingProperty={!!editingProperty}
              isStepValid={isStepValid(currentStep)}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;
