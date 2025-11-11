/**
 * PROPERTYFORM.TSX - ENHANCED INTERACTIVE PROPERTY FORM
 * ====================================================
 * 
 * Kipengele cha fomu ya nyumba iliyoboreshwa - Enhanced property form component
 * 
 * ENHANCED FEATURES / VIPENGELE VILIVYOBORESHWA:
 * - Multi-step wizard with progress indicator (Mchakato wa hatua nyingi na kiashiria cha maendeleo)
 * - Interactive animations and transitions (Michoro na mabadiliko ya mwingiliano)
 * - Enhanced visual feedback and validation (Majibu ya kuona na uthibitisho ulioboboreshwa)
 * - Smart form sections with icons (Sehemu za fomu zenye akili na ikoni)
 * - Beautiful UI with gradients and shadows (UI nzuri na mivuto na vivuli)
 * - Real-time preview and feedback (Muhtasari wa wakati halisi na majibu)
 */

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/forms/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, Save, RefreshCw, Home, MapPin, Phone, Camera, 
  Building, Bed, Bath, Ruler, Zap, Droplets, Car, 
  Shield, Sofa, ChevronRight, ChevronLeft, CheckCircle,
  Star, Info, Heart, Users, Award, Briefcase
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';
import { validateInput, rateLimiters } from '@/utils/security';

type Property = Tables<'properties'>;
type Profile = Tables<'profiles'>;

/**
 * PROPERTY FORM DATA INTERFACE
 * ===========================
 * 
 * Defines the structure for property form data.
 */
interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  full_address: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  square_meters: string;
  contact_phone: string;
  contact_whatsapp_phone: string;
  amenities: string[];
  nearby_services: string[];
  images: string[];
}

interface PropertyFormProps {
  isOpen: boolean;
  editingProperty: Property | null;
  formData: PropertyFormData;
  profile: Profile | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof PropertyFormData, value: any) => void;
  onServiceToggle: (service: string) => void;
  onAmenityToggle: (amenity: string) => void;
}

/**
 * ENHANCED PROPERTY FORM COMPONENT
 * ===============================
 * 
 * Interactive multi-step form with beautiful UI and animations.
 * Features progress tracking, validation feedback, and enhanced UX.
 * 
 * Fomu ya mwingiliano ya hatua nyingi na UI nzuri na michoro.
 * Inajumuisha ufuatiliaji wa maendeleo, majibu ya uthibitisho, na UX iliyoboreshwa.
 */
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
  const [currentStep, setCurrentStep] = useState(1);

  // Form persistence constants
  const FORM_STORAGE_KEY = 'nyumba_link_property_form_data';
  const STEP_STORAGE_KEY = 'nyumba_link_property_form_step';

  // Load saved form data and step from localStorage on component mount
  useEffect(() => {
    if (isOpen && !editingProperty) {
      // Only restore data for new properties, not when editing existing ones
      try {
        const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
        const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
        
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          // Restore form data by calling onInputChange for each field
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
        // Clear corrupted data
        localStorage.removeItem(FORM_STORAGE_KEY);
        localStorage.removeItem(STEP_STORAGE_KEY);
      }
    }
  }, [isOpen, editingProperty]);

  // Save form data to localStorage whenever formData changes
  useEffect(() => {
    if (isOpen && !editingProperty) {
      // Only save data for new properties, not when editing existing ones
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  }, [formData, isOpen, editingProperty]);

  // Save current step to localStorage whenever step changes
  useEffect(() => {
    if (isOpen && !editingProperty) {
      // Only save step for new properties, not when editing existing ones
      try {
        localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
      } catch (error) {
        console.error('Error saving form step:', error);
      }
    }
  }, [currentStep, isOpen, editingProperty]);

  // Clear saved data when form is successfully submitted or closed
  const clearSavedData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };
  
  // PropertyForm component rendered
  const totalSteps = 4;

  if (!isOpen) return null;

  // Calculate form completion progress
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

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title?.trim() && formData.price?.trim() && formData.location?.trim());
      case 2:
        return !!(formData.description?.trim() && formData.property_type?.trim());
      case 3:
        return !!formData.contact_phone?.trim();
      case 4:
        return formData.images && formData.images.length >= 3; // At least 3 images required
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

  const steps = [
    { id: 1, title: t('dashboard.basicInfo'), icon: Home, description: 'Jina, bei na eneo' },
    { id: 2, title: t('dashboard.details'), icon: Building, description: 'Maelezo na aina ya nyumba' },
    { id: 3, title: t('dashboard.contact'), icon: Phone, description: 'Maelezo ya mawasiliano' },
    { id: 4, title: t('dashboard.photos'), icon: Camera, description: 'Picha za nyumba (za lazima)' }
  ];

  /**
   * STEP 1: BASIC INFORMATION
   * ========================
   * 
   * Enhanced basic information step with icons and validation feedback.
   */
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header with icon */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Maelezo ya Msingi</h3>
        <p className="text-gray-600">Jaza maelezo muhimu ya nyumba yako</p>
      </div>

      {/* Property Name */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
          <Building className="h-4 w-4 text-primary" />
          {t('dashboard.propertyName')} *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder={t('dashboard.propertyNameExample')}
          className={`transition-all duration-200 ${formData.title ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.title && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Sawa! Jina limejazwa
          </div>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="flex items-center gap-2 text-sm font-medium">
          <Star className="h-4 w-4 text-primary" />
          {t('dashboard.rentPrice')} *
        </Label>
        <div className="relative">
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          placeholder="800000"
            className={`pl-12 transition-all duration-200 ${formData.price ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            TZS
          </div>
        </div>
        {formData.price && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Bei: TZS {parseInt(formData.price || '0').toLocaleString()}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          {t('dashboard.area')} *
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder={t('dashboard.areaExample')}
          className={`transition-all duration-200 ${formData.location ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.location && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Eneo limejazwa
          </div>
        )}
      </div>

      {/* Progress indicator for this step */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 1: Maelezo ya Msingi</span>
          <Badge variant={isStepValid(1) ? "default" : "secondary"} className="ml-2">
            {isStepValid(1) ? "Kamili" : "Inahitajika"}
          </Badge>
        </div>
      </div>
    </div>
  );

  /**
   * STEP 2: PROPERTY DETAILS
   * =======================
   * 
   * Enhanced property details step with interactive elements.
   */
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-serengeti-500 to-kilimanjaro-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Maelezo ya Nyumba</h3>
        <p className="text-gray-600">Eleza nyumba yako kwa undani</p>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4 text-primary" />
          {t('dashboard.propertyType')} *
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'Apartment', label: t('dashboard.apartment'), icon: Building },
            { value: 'House', label: t('dashboard.house'), icon: Home },
            { value: 'Shared Room', label: t('dashboard.room'), icon: Bed },
            { value: 'Studio', label: t('dashboard.studio'), icon: Users },
            { value: 'Bedsitter', label: 'Bedsitter', icon: Briefcase }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onInputChange('property_type', value)}
              className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                formData.property_type === value 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${formData.property_type === value ? 'text-primary' : 'text-gray-400'}`} />
                <span className={`font-medium ${formData.property_type === value ? 'text-primary' : 'text-gray-700'}`}>
                  {label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Bed className="h-4 w-4 text-primary" />
            {t('dashboard.bedrooms')}
          </Label>
          <Input
            type="number"
            value={formData.bedrooms}
            onChange={(e) => onInputChange('bedrooms', e.target.value)}
            placeholder="2"
            className="text-center"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Bath className="h-4 w-4 text-primary" />
            {t('dashboard.bathrooms')}
          </Label>
          <Input
            type="number"
            value={formData.bathrooms}
            onChange={(e) => onInputChange('bathrooms', e.target.value)}
            placeholder="1"
            className="text-center"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Ruler className="h-4 w-4 text-primary" />
            Eneo (m²)
          </Label>
        <Input
          type="number"
          value={formData.square_meters}
          onChange={(e) => onInputChange('square_meters', e.target.value)}
          placeholder="100"
            className="text-center"
        />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
          <Info className="h-4 w-4 text-primary" />
          {t('dashboard.description')} *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('dashboard.describeProperty')}
          rows={6}
          className={`transition-all duration-200 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${formData.description ? 'border-green-400 bg-green-50' : 'hover:border-gray-400'}`}
          required
        />
        <div className="text-xs text-gray-500 text-right">
          {formData.description.length}/500 herufi
        </div>
      </div>

      {/* Amenities - Interactive Toggle Cards */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Award className="h-4 w-4 text-primary" />
          {t('dashboard.basicServices')}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'electricity', label: t('dashboard.electricity'), icon: Zap, colorClass: 'border-yellow-300 bg-yellow-50 text-yellow-600' },
            { key: 'water', label: t('dashboard.water'), icon: Droplets, colorClass: 'border-blue-300 bg-blue-50 text-blue-600' },
            { key: 'furnished', label: t('dashboard.furniture'), icon: Sofa, colorClass: 'border-purple-300 bg-purple-50 text-purple-600' },
            { key: 'parking', label: t('dashboard.parking'), icon: Car, colorClass: 'border-green-300 bg-green-50 text-green-600' },
            { key: 'security', label: t('dashboard.security'), icon: Shield, colorClass: 'border-red-300 bg-red-50 text-red-600' }
          ].map(({ key, label, icon: Icon, colorClass }) => {
            const isSelected = formData.amenities.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onAmenityToggle(key)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                  isSelected ? colorClass + ' shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isSelected ? colorClass.split(' ')[2] : 'text-gray-400'}`} />
                    <span className={`font-medium ${isSelected ? 'text-gray-700' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle className={`h-5 w-5 ${colorClass.split(' ')[2]}`} />
                  )}
            </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearby Services */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          {t('dashboard.nearbyServices')}
        </Label>
        <div className="flex flex-wrap gap-2">
          {['school', 'hospital', 'market', 'bank', 'transport'].map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => onServiceToggle(service)}
              className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                formData.nearby_services.includes(service)
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
                {service === 'school' ? t('dashboard.school') :
                 service === 'hospital' ? t('dashboard.hospital') :
                 service === 'market' ? t('dashboard.market') :
                 service === 'bank' ? t('dashboard.bank') : t('dashboard.transport')}
            </button>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 2: Maelezo ya Nyumba</span>
          <Badge variant={isStepValid(2) ? "default" : "secondary"}>
            {isStepValid(2) ? "Kamili" : "Inahitajika"}
          </Badge>
        </div>
      </div>
    </div>
  );

  /**
   * STEP 3: CONTACT INFORMATION
   * ==========================
   * 
   * Enhanced contact information step with validation.
   */
  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-kilimanjaro-500 to-safari-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Maelezo ya Mawasiliano</h3>
        <p className="text-gray-600">Weka maelezo ya mawasiliano ili wapangaji waweze kuwasiliana nawe</p>
      </div>

      {/* Contact Phone */}
      <div className="space-y-2">
        <Label htmlFor="contact_phone" className="flex items-center gap-2 text-sm font-medium">
          <Phone className="h-4 w-4 text-primary" />
          {t('dashboard.contactPhone')} *
        </Label>
        <Input
          id="contact_phone"
          type="tel"
          value={formData.contact_phone}
          onChange={(e) => onInputChange('contact_phone', e.target.value)}
          placeholder="+255712345678"
          className={`transition-all duration-200 ${formData.contact_phone ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        <p className="text-xs text-gray-500">
          {t('dashboard.contactPhoneDescription')}
        </p>
        {formData.contact_phone && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Nambari ya simu imejazwa
          </div>
        )}
      </div>

      {/* WhatsApp Phone */}
      <div className="space-y-2">
        <Label htmlFor="contact_whatsapp_phone" className="flex items-center gap-2 text-sm font-medium">
          <Heart className="h-4 w-4 text-green-500" />
          {t('dashboard.whatsappNumber')}
          <Badge variant="secondary" className="ml-2 text-xs">Si lazima</Badge>
        </Label>
        <Input
          id="contact_whatsapp_phone"
          type="tel"
          value={formData.contact_whatsapp_phone}
          onChange={(e) => onInputChange('contact_whatsapp_phone', e.target.value)}
          placeholder="+255712345678"
          className={`transition-all duration-200 ${formData.contact_whatsapp_phone ? 'border-green-300 bg-green-50' : ''}`}
        />
        <p className="text-xs text-gray-500">
          {t('dashboard.whatsappOptional')}
        </p>
      </div>



      {/* Full Address (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="full_address" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          Anwani Kamili
          <Badge variant="secondary" className="ml-2 text-xs">Si lazima</Badge>
        </Label>
        <Input
          id="full_address"
          value={formData.full_address}
          onChange={(e) => onInputChange('full_address', e.target.value)}
          placeholder="Mfano: Barabara ya Uhuru, Jengo la ABC, Ghorofa ya 3"
          className="transition-all duration-200"
        />
        <p className="text-xs text-gray-500">
          Weka anwani kamili ili kuwa rahisi kwa wapangaji kukupata
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 3: Maelezo ya Mawasiliano</span>
          <Badge variant={isStepValid(3) ? "default" : "secondary"}>
            {isStepValid(3) ? "Kamili" : "Inahitajika"}
          </Badge>
        </div>
      </div>
    </div>
  );

  /**
   * STEP 4: PHOTO UPLOAD
   * ===================
   * 
   * Enhanced photo upload step with preview.
   */
  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-safari-500 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Picha za Nyumba *</h3>
        <p className="text-gray-600">Ongeza picha nzuri za nyumba yako ili kuvutia wapangaji</p>
        <p className="text-sm text-red-600 font-medium">⚠️ Picha ni za lazima - ongeza angalau picha 3</p>
      </div>

      {/* Photo Upload Component */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => onInputChange('images', images)}
        />
      </div>

      {/* Photo Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Vidokezo vya Picha Nzuri
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Piga picha za sebule, chumba cha kulala, na jiko</li>
          <li>• Hakikisha mwanga wa kutosha</li>
          <li>• Onyesha mazingira ya nje ya nyumba</li>
          <li>• Tumia picha za quality nzuri</li>
        </ul>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 4: Picha za Nyumba</span>
          <div className="flex items-center gap-2">
            <Badge variant={formData.images.length >= 3 ? "default" : "destructive"}>
              {formData.images.length} picha
            </Badge>
            {formData.images.length >= 3 ? (
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <CheckCircle className="h-3 w-3" />
                Picha zimeongezwa
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <X className="h-3 w-3" />
                Ongeza picha 3 za lazima
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * STEP NAVIGATION COMPONENT - MOBILE RESPONSIVE
   * ============================================
   * 
   * Renders interactive step navigation with progress indicators.
   * Optimized for mobile with smaller sizes and proper spacing.
   */
  const renderStepNavigation = () => (
    <div className="mb-6 sm:mb-8">
      {/* Mobile step indicator */}
      <div className="block sm:hidden mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua {currentStep} ya {totalSteps}</span>
          <span>{Math.round(progress)}% kamili</span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>
      
      {/* Desktop step navigation */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep || (step.id <= currentStep && isStepValid(step.id));
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg scale-110' 
                    : isCompleted 
                    ? 'bg-green-500 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                {isCompleted && step.id < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 transition-colors duration-200 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /**
   * STEP CONTENT RENDERER
   * ====================
   * 
   * Renders the current step content with smooth transitions.
   */
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

    /**
   * FORM NAVIGATION BUTTONS
   * ======================
   * 
   * Enhanced navigation buttons with step validation.
   */
  const renderNavigationButtons = () => {
    // Handle form submission for the last step
    const handleSubmitClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      console.log('Submit button clicked, current step:', currentStep, 'total steps:', totalSteps);
      
      if (currentStep === totalSteps) {
        console.log('Attempting to submit form with data:', formData);
        
        // Validate all required fields before submission
        const requiredFieldsValid = !!(
          formData.title?.trim() && 
          formData.price?.trim() && 
          formData.location?.trim() && 
          formData.description?.trim() && 
          formData.contact_phone?.trim() &&
          formData.property_type?.trim() &&
          formData.images && formData.images.length >= 3
        );
        
        console.log('Validation check:', {
          title: !!formData.title?.trim(),
          price: !!formData.price?.trim(),
          location: !!formData.location?.trim(),
          description: !!formData.description?.trim(),
          contact_phone: !!formData.contact_phone?.trim(),
          property_type: !!formData.property_type?.trim(),
          images: formData.images && formData.images.length >= 3,
          imagesLength: formData.images?.length || 0
        });
        
        if (!requiredFieldsValid) {
          console.error('Required fields missing:', {
            title: !!formData.title?.trim(),
            price: !!formData.price?.trim(),
            location: !!formData.location?.trim(),
            description: !!formData.description?.trim(),
            contact_phone: !!formData.contact_phone?.trim(),
            property_type: !!formData.property_type?.trim(),
            images: formData.images && formData.images.length >= 3
          });
          
          // Show alert to user about missing fields
          alert('Tafadhali jaza sehemu zote za lazima kabla ya kuongeza nyumba:\n\n' +
            `• Jina la nyumba: ${formData.title?.trim() ? '✓' : '✗'}\n` +
            `• Bei ya kodi: ${formData.price?.trim() ? '✓' : '✗'}\n` +
            `• Eneo: ${formData.location?.trim() ? '✓' : '✗'}\n` +
            `• Maelezo ya nyumba: ${formData.description?.trim() ? '✓' : '✗'}\n` +
            `• Aina ya nyumba: ${formData.property_type?.trim() ? '✓' : '✗'}\n` +
            `• Nambari ya simu: ${formData.contact_phone?.trim() ? '✓' : '✗'}\n` +
            `• Picha za nyumba: ${formData.images && formData.images.length >= 3 ? '✓' : '✗'} (${formData.images?.length || 0} picha, lazima 3)`
          );
          return;
        }
        
        console.log('All validations passed, calling onSubmit...');
        
        // Create a synthetic form event and call onSubmit
        const syntheticEvent = {
          preventDefault: () => {},
          currentTarget: null
        } as React.FormEvent;
        
        try {
          console.log('Calling onSubmit function...');
          await onSubmit(syntheticEvent);
          console.log('Form submitted successfully');
          // Clear saved data after successful submission
          clearSavedData();
        } catch (error) {
          console.error('Form submission error:', error);
          alert('Kuna tatizo la kuongeza nyumba. Tafadhali jaribu tena.');
        }
      } else {
        console.log('Not on final step, cannot submit yet');
      }
    };

    return (
      <div className="pt-6 border-t bg-gray-50 -mx-6 px-4 sm:px-6 -mb-6 pb-6">
        {/* Mobile Layout - Stack vertically */}
        <div className="block sm:hidden space-y-4">
          {/* Progress indicator - Mobile */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>{currentStep} ya {totalSteps}</span>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <span>{Math.round(progress)}% kamili</span>
          </div>
          
          {/* Buttons - Mobile */}
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={currentStep === 1 ? () => { clearSavedData(); onClose(); } : prevStep}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {currentStep === 1 ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="hidden xs:inline">{t('dashboard.cancel')}</span>
                  <span className="inline xs:hidden">Funga</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden xs:inline">Rudi Nyuma</span>
                  <span className="inline xs:hidden">Rudi</span>
                </>
              )}
            </Button>

            {/* Next/Submit button - Mobile */}
            {currentStep < totalSteps ? (
              <Button 
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex-1 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Endelea</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmitClick}
                className="flex-1 bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px]"
                disabled={submitting}
                title={`Submit button - Current step: ${currentStep}, Total steps: ${totalSteps}, Submitting: ${submitting}`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="hidden xs:inline">{editingProperty ? t('dashboard.updating') : t('dashboard.adding')}</span>
                    <span className="inline xs:hidden">{editingProperty ? 'Sasisha' : 'Ongeza'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="hidden xs:inline">{editingProperty ? 'Sasisha Nyumba' : 'Ongeza Nyumba'}</span>
                    <span className="inline xs:hidden">{editingProperty ? 'Sasisha' : 'Ongeza'}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Layout - Original horizontal */}
        <div className="hidden sm:flex justify-between items-center">
          <Button 
            type="button" 
            variant="outline"
            onClick={currentStep === 1 ? () => { clearSavedData(); onClose(); } : prevStep}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            {currentStep === 1 ? (
              <>
                <X className="h-4 w-4" />
                {t('dashboard.cancel')}
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                Rudi Nyuma
              </>
            )}
          </Button>

          <div className="flex items-center gap-3">
            {/* Progress indicator - Desktop */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentStep} ya {totalSteps}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span>{Math.round(progress)}% kamili</span>
            </div>

            {/* Next/Submit button - Desktop */}
            {currentStep < totalSteps ? (
              <Button 
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                Endelea
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmitClick}
                className="bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                disabled={submitting}
                title={`Submit button - Current step: ${currentStep}, Total steps: ${totalSteps}, Submitting: ${submitting}`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    {editingProperty ? t('dashboard.updating') : t('dashboard.adding')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingProperty ? 'Sasisha Nyumba' : 'Ongeza Nyumba'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl border-0">
        {/* Enhanced Header */}
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
              onClick={() => { clearSavedData(); onClose(); }}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(progress)}% ya fomu imejazwa
            </p>
          </div>
          

        </CardHeader>

        <CardContent className="p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Step Navigation */}
          {renderStepNavigation()}
          
          {/* Current Step Content */}
          <div className="min-h-[400px]">
            {renderCurrentStep()}
            </div>
          
          {/* Navigation Buttons */}
          {renderNavigationButtons()}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;