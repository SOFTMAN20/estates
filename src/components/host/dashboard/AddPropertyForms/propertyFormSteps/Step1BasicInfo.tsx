/**
 * Step1BasicInfo.tsx - Property Form Step 1
 * ==========================================
 * 
 * Basic information step: Property name, price, and location.
 * Single responsibility: Handle basic property information input.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import PriceInput, { type PricePeriod } from '@/components/host/dashboard/AddPropertyForms/property_formInput/PriceInput';
import { Home, Building, MapPin, CheckCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step1BasicInfoProps {
  formData: {
    title: string;
    price: string;
    price_period: string;
    location: string;
    description: string;
    min_rental_months: string;
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('dashboard.step1Title')}</h3>
        <p className="text-gray-600">{t('dashboard.step1Description')}</p>
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
            {t('dashboard.nameFilled')}
          </div>
        )}
      </div>

      {/* Price Input - Using Modular Component */}
      <PriceInput
        value={formData.price}
        period={(formData.price_period || 'per_month') as PricePeriod}
        onPriceChange={(value) => onInputChange('price', value)}
        onPeriodChange={(period) => onInputChange('price_period', period)}
        minRentalMonths={formData.min_rental_months || '1'}
        onMinRentalMonthsChange={(value) => onInputChange('min_rental_months', value)}
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
            {t('dashboard.locationFilled')}
          </div>
        )}
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
          placeholder={t('dashboard.descriptionPlaceholder')}
          rows={6}
          className={`transition-all duration-200 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${formData.description ? 'border-green-300 bg-green-50' : 'hover:border-gray-400'}`}
          required
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {formData.description.length}/500 herufi
          </div>
          {formData.description && formData.description.length >= 10 && (
            <div className="flex items-center gap-1 text-green-600 text-xs">
              <CheckCircle className="h-3 w-3" />
              {t('dashboard.descriptionFilled')}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Step1BasicInfo;
