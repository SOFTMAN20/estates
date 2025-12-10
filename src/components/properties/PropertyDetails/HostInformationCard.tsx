/**
 * HOSTINFORMATIONCARD.TSX - HOST INFORMATION COMPONENT
 * ====================================================
 * 
 * Modern host information card with avatar, stats, and contact modal
 * Displays host profile, member since date, property count, and contact options
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, MessageCircle, Shield, Home, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HostInformationCardProps {
  hostName?: string;
  hostAvatar?: string | null;
  memberSince?: string;
  totalProperties?: number;
  contactPhone?: string | null;
  whatsappPhone?: string | null;
  propertyTitle: string;
  isVerified?: boolean;
}

const HostInformationCard: React.FC<HostInformationCardProps> = ({
  hostName,
  hostAvatar,
  memberSince,
  totalProperties = 1,
  contactPhone,
  whatsappPhone,
  propertyTitle,
  isVerified = true,
}) => {
  const { t } = useTranslation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const displayName = hostName || t('propertyDetail.hostCard.propertyHost');

  /**
   * Get host initials for avatar fallback
   */
  const getHostInitials = (): string => {
    if (!displayName) return 'H';
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Format member since date with translations
   */
  const formatMemberSince = (): string => {
    if (!memberSince) return t('propertyDetail.hostCard.newMember');
    
    const date = new Date(memberSince);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    
    if (diffYears > 0) {
      const unit = diffYears > 1 ? t('propertyDetail.hostCard.years') : t('propertyDetail.hostCard.year');
      return t('propertyDetail.hostCard.memberFor', { count: diffYears, unit });
    }
    
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    if (diffMonths > 0) {
      const unit = diffMonths > 1 ? t('propertyDetail.hostCard.months') : t('propertyDetail.hostCard.month');
      return t('propertyDetail.hostCard.memberFor', { count: diffMonths, unit });
    }
    
    return t('propertyDetail.hostCard.newMember');
  };

  /**
   * Get WhatsApp link with pre-filled message
   */
  const getWhatsAppLink = () => {
    if (!whatsappPhone && !contactPhone) return '#';
    const phoneNumber = whatsappPhone || contactPhone;
    const cleanPhone = phoneNumber!.replace(/[^0-9]/g, '');
    const message = `Hello, I'm interested in your property: ${propertyTitle}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <>
      <Card className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          {/* Host Header */}
          <div className="flex items-start space-x-4 mb-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/20">
              <AvatarImage src={hostAvatar || undefined} alt={hostName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-serengeti-500 text-white text-lg sm:text-xl font-bold">
                {getHostInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {hostName}
                </h3>
                {isVerified && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex-shrink-0">
                    <Shield className="h-3 w-3 mr-1" />
                    {t('propertyDetail.hostCard.verified')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{t('propertyDetail.hostCard.propertyHost')}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Host Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">{t('propertyDetail.hostCard.memberSince')}</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatMemberSince()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Home className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-gray-600 mb-1">{t('propertyDetail.hostCard.properties')}</p>
              <p className="text-sm font-semibold text-gray-900">
                {totalProperties} {totalProperties === 1 ? t('propertyDetail.hostCard.listing') : t('propertyDetail.hostCard.listings')}
              </p>
            </div>
          </div>

          {/* Contact Button */}
          <Button
            onClick={() => setIsContactModalOpen(true)}
            className="w-full bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            {t('propertyDetail.hostCard.contactHost')}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-3">
            {t('propertyDetail.hostCard.responseTime')}
          </p>
        </CardContent>
      </Card>

      {/* Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t('propertyDetail.hostCard.contactHost')} {displayName}</DialogTitle>
            <DialogDescription>
              {t('propertyDetail.hostCard.chooseContact')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {/* Host Info in Modal */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={hostAvatar || undefined} alt={hostName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-serengeti-500 text-white font-bold">
                  {getHostInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">{hostName}</p>
                <p className="text-sm text-gray-600">{formatMemberSince()}</p>
              </div>
            </div>

            <Separator />

            {/* Contact Options */}
            {contactPhone ? (
              <div className="space-y-3">
                {/* Phone Call */}
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base"
                  onClick={() => {
                    window.open(`tel:${contactPhone}`, '_self');
                    setIsContactModalOpen(false);
                  }}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {t('propertyDetail.hostCard.call')}: {contactPhone}
                </Button>

                {/* WhatsApp */}
                {(whatsappPhone || contactPhone) && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base"
                    onClick={() => {
                      window.open(getWhatsAppLink(), '_blank');
                      setIsContactModalOpen(false);
                    }}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    {t('propertyDetail.hostCard.whatsapp')}: {whatsappPhone || contactPhone}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Phone className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">{t('propertyDetail.hostCard.noContact')}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {t('propertyDetail.hostCard.checkLater')}
                </p>
              </div>
            )}

            {/* Safety Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-semibold mb-1">{t('propertyDetail.hostCard.safetyReminder')}</p>
                  <p>{t('propertyDetail.hostCard.neverSendMoney')}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HostInformationCard;
