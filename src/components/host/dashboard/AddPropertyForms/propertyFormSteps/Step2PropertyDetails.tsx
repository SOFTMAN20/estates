/**
 * Step2PropertyDetails.tsx - Property Form Step 2
 * ================================================
 * 
 * Property details step: Type, rooms, description, amenities.
 * Single responsibility: Handle detailed property specifications.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Building, Home, Bed, Bath, Ruler, Users, Briefcase,
  Zap, Droplets, Sofa, Car, Shield, Wifi, CheckCircle, MapPin, Award, Info,
  Hotel, Building2, Landmark, Wind, Waves, UtensilsCrossed, WashingMachine, Tv, Fan
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step2PropertyDetailsProps {
  formData: {
    property_type: string;
    bedrooms: string;
    bathrooms: string;
    square_meters: string;
    description: string;
    amenities: string[];
    nearby_services: string[];
  };
  onInputChange: (field: string, value: unknown) => void;
  onAmenityToggle: (amenity: string) => void;
  onServiceToggle: (service: string) => void;
  isValid: boolean;
}

export const Step3PropertyDetails: React.FC<Step2PropertyDetailsProps> = ({
  formData,
  onInputChange,
  onAmenityToggle,
  onServiceToggle,
  isValid,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-serengeti-500 to-kilimanjaro-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('dashboard.step2Title')}</h3>
        <p className="text-gray-600">{t('dashboard.step2Description')}</p>
      </div>

      {/* Property Type */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4 text-primary" />
          {t('dashboard.propertyType')} *
        </Label>

        {/* All Property Types */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { value: 'Apartment', label: t('dashboard.apartment'), icon: Building },
            { value: 'House', label: t('dashboard.house'), icon: Home },
            { value: 'Shared Room', label: t('dashboard.room'), icon: Bed },
            { value: 'Studio', label: t('dashboard.studio'), icon: Users },
            { value: 'Bedsitter', label: t('dashboard.bedsitter'), icon: Briefcase },
            { value: 'Lodge', label: t('dashboard.lodge'), icon: Landmark },
            { value: 'Hotel', label: t('dashboard.hotel'), icon: Hotel },
            { value: 'Hostel', label: t('dashboard.hostel'), icon: Users },
            { value: 'Office', label: t('dashboard.office'), icon: Building2 }
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

      {/* Property Features */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Building className="h-4 w-4 text-primary" />
          Property Features
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <Bed className="h-4 w-4 text-primary" />
              {t('dashboard.bedrooms')}
            </Label>
            <Input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => onInputChange('bedrooms', e.target.value)}
              placeholder="2"
              className="text-center"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <Bath className="h-4 w-4 text-primary" />
              {t('dashboard.bathrooms')}
            </Label>
            <Input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => onInputChange('bathrooms', e.target.value)}
              placeholder="1"
              className="text-center"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <Ruler className="h-4 w-4 text-primary" />
              Eneo (m²)
            </Label>
            <Input
              type="number"
              value={formData.square_meters}
              onChange={(e) => onInputChange('square_meters', e.target.value)}
              placeholder="100"
              className="text-center"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Award className="h-4 w-4 text-primary" />
          {t('dashboard.basicServices')}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'electricity', label: t('dashboard.electricity'), icon: Zap, colorClass: 'border-yellow-300 bg-yellow-50 text-yellow-600' },
            { key: 'water', label: t('dashboard.water'), icon: Droplets, colorClass: 'border-blue-300 bg-blue-50 text-blue-600' },
            { key: 'wifi', label: 'WiFi', icon: Wifi, colorClass: 'border-indigo-300 bg-indigo-50 text-indigo-600' },
            { key: 'furnished', label: t('dashboard.furniture'), icon: Sofa, colorClass: 'border-purple-300 bg-purple-50 text-purple-600' },
            { key: 'parking', label: t('dashboard.parking'), icon: Car, colorClass: 'border-green-300 bg-green-50 text-green-600' },
            { key: 'security', label: t('dashboard.security'), icon: Shield, colorClass: 'border-red-300 bg-red-50 text-red-600' },
            { key: 'ac', label: 'AC / Air Conditioning', icon: Wind, colorClass: 'border-cyan-300 bg-cyan-50 text-cyan-600' },
            { key: 'balcony', label: 'Balcony / Balconi', icon: Waves, colorClass: 'border-teal-300 bg-teal-50 text-teal-600' },
            { key: 'kitchen', label: 'Kitchen / Jiko', icon: UtensilsCrossed, colorClass: 'border-orange-300 bg-orange-50 text-orange-600' },
            { key: 'laundry', label: 'Laundry / Dobi', icon: WashingMachine, colorClass: 'border-pink-300 bg-pink-50 text-pink-600' },
            { key: 'tv', label: 'TV / Televisheni', icon: Tv, colorClass: 'border-slate-300 bg-slate-50 text-slate-600' },
            { key: 'fan', label: 'Fan / Panka', icon: Fan, colorClass: 'border-sky-300 bg-sky-50 text-sky-600' }
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
                    <span className={`font-medium text-sm ${isSelected ? 'text-gray-700' : 'text-gray-700'}`}>
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

    </div>
  );
};

export default Step3PropertyDetails;
