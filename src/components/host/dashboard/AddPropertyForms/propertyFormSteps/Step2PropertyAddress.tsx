/**
 * Step2PropertyAddress.tsx - Property Form Step 2
 * ================================================
 * 
 * Property address step: Detailed address information.
 * Single responsibility: Handle property address input.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Home, Building2, CheckCircle, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Step2PropertyAddressProps {
  formData: {
    full_address: string;
  };
  onInputChange: (field: string, value: unknown) => void;
  isValid: boolean;
}

export const Step2PropertyAddress: React.FC<Step2PropertyAddressProps> = ({
  formData,
  onInputChange,
  isValid,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with icon */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-serengeti-500 to-kilimanjaro-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Anwani ya Nyumba</h3>
        <p className="text-gray-600">Weka anwani kamili ya nyumba yako</p>
      </div>

      {/* Country/Region - Fixed for Tanzania */}
      <div className="space-y-2">
        <Label htmlFor="country" className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="h-4 w-4 text-primary" />
          Country / Nchi
        </Label>
        <Input
          id="country"
          value="Tanzania - TZ"
          disabled
          className="bg-gray-50 text-gray-600"
        />
      </div>

      {/* Street Address */}
      <div className="space-y-2">
        <Label htmlFor="street_address" className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4 text-primary" />
          Street Address / Barabara *
        </Label>
        <Input
          id="street_address"
          value={formData.full_address.split('\n')[0] || ''}
          onChange={(e) => {
            const lines = formData.full_address.split('\n');
            lines[0] = e.target.value;
            onInputChange('full_address', lines.join('\n'));
          }}
          placeholder="Mfano: Mikocheni B, Off Sam Nujoma Road"
          className={`transition-all duration-200 ${formData.full_address.split('\n')[0] ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.full_address.split('\n')[0] && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Barabara imejazwa
          </div>
        )}
      </div>

      {/* Apartment/Floor/Building */}
      <div className="space-y-2">
        <Label htmlFor="apt_floor" className="flex items-center gap-2 text-sm font-medium">
          <Building2 className="h-4 w-4 text-primary" />
          Apt, Floor, Building (if applicable) / Ghorofa, Jengo
        </Label>
        <Input
          id="apt_floor"
          value={formData.full_address.split('\n')[1] || ''}
          onChange={(e) => {
            const lines = formData.full_address.split('\n');
            lines[1] = e.target.value;
            onInputChange('full_address', lines.join('\n'));
          }}
          placeholder="Mfano: House No. 45, Ghorofa ya 3, Flat 5B"
        />
      </div>

      {/* City/Town/Village */}
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          City / Town / Village / Mji *
        </Label>
        <Input
          id="city"
          value={formData.full_address.split('\n')[2] || ''}
          onChange={(e) => {
            const lines = formData.full_address.split('\n');
            lines[2] = e.target.value;
            onInputChange('full_address', lines.join('\n'));
          }}
          placeholder="Mfano: Dar es Salaam"
          className={`transition-all duration-200 ${formData.full_address.split('\n')[2] ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.full_address.split('\n')[2] && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Mji umejazwa
          </div>
        )}
      </div>

      {/* Province/State/Region */}
      <div className="space-y-2">
        <Label htmlFor="region" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          Province / State / Region / Mkoa *
        </Label>
        <Input
          id="region"
          value={formData.full_address.split('\n')[3] || ''}
          onChange={(e) => {
            const lines = formData.full_address.split('\n');
            lines[3] = e.target.value;
            onInputChange('full_address', lines.join('\n'));
          }}
          placeholder="Mfano: Dar es Salaam"
          className={`transition-all duration-200 ${formData.full_address.split('\n')[3] ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.full_address.split('\n')[3] && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Mkoa umejazwa
          </div>
        )}
      </div>

      {/* Postal Code */}
      <div className="space-y-2">
        <Label htmlFor="postal_code" className="flex items-center gap-2 text-sm font-medium">
          <Hash className="h-4 w-4 text-primary" />
          Postal Code / Nambari ya Posta
          <span className="text-xs text-gray-500 font-normal">(Si lazima)</span>
        </Label>
        <Input
          id="postal_code"
          value={formData.full_address.split('\n')[4] || ''}
          onChange={(e) => {
            const lines = formData.full_address.split('\n');
            lines[4] = e.target.value;
            onInputChange('full_address', lines.join('\n'));
          }}
          placeholder="Mfano: 14111"
          className="transition-all duration-200"
        />
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Kwa nini anwani kamili ni muhimu?</p>
            <p className="text-blue-700">
              Anwani kamili inasaidia wapangaji kukupata kwa urahisi na kuongeza imani katika matangazo yako.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2PropertyAddress;
