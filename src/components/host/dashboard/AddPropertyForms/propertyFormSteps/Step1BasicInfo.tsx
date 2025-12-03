/**
 * Step1BasicInfo.tsx - Property Form Step 1
 * ==========================================
 * 
 * Basic information step: Property name, price, and location.
 * Single responsibility: Handle basic property information input.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import PriceInput, { type PricePeriod } from '@/components/host/dashboard/AddPropertyForms/property_formInput/PriceInput';
import { Home, Building, MapPin, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step1BasicInfoProps {
  formData: {
    title: string;
    price: string;
    price_period: string;
    location: string;
  };
  onInputChange: (field: string, value: unknown) => void;
  isValid: boolean;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  formData,
  onInputChange,
  isValid,
}) => {
  const { t } = useTranslation();

  return (
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

      {/* Price Input - Using Modular Component */}
      <PriceInput
        value={formData.price}
        period={(formData.price_period || 'per_month') as PricePeriod}
        onPriceChange={(value) => onInputChange('price', value)}
        onPeriodChange={(period) => onInputChange('price_period', period)}
        label={t('dashboard.rentPrice')}
        required
        showFeedback
      />

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

    </div>
  );
};

export default Step1BasicInfo;
