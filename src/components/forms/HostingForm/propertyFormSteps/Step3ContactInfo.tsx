/**
 * Step3ContactInfo.tsx - Property Form Step 3
 * ============================================
 * 
 * Contact information step: Phone numbers and address.
 * Single responsibility: Handle contact details input.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Phone, CheckCircle } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

interface Step3ContactInfoProps {
  formData: {
    contact_phone: string;
    contact_whatsapp_phone: string;
  };
  onInputChange: (field: string, value: unknown) => void;
  isValid: boolean;
}

export const Step3ContactInfo: React.FC<Step3ContactInfoProps> = ({
  formData,
  onInputChange,
  isValid,
}) => {
  const { t } = useTranslation();

  return (
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
        {formData.contact_phone && formData.contact_phone.startsWith('+') && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Nambari ya simu imejazwa
          </div>
        )}
        {formData.contact_phone && !formData.contact_phone.startsWith('+') && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <span>⚠️ Nambari lazima ianze na + na country code</span>
          </div>
        )}
      </div>

      {/* WhatsApp Phone */}
      <div className="space-y-2">
        <Label htmlFor="contact_whatsapp_phone" className="flex items-center gap-2 text-sm font-medium">
          <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-green-500" />
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
        {formData.contact_whatsapp_phone && !formData.contact_whatsapp_phone.startsWith('+') && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <span>⚠️ Nambari lazima ianze na + na country code</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default Step3ContactInfo;
