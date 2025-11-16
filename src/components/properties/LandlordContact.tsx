/**
 * LANDLORDCONTACT.TSX - LANDLORD CONTACT COMPONENT
 * ================================================
 * 
 * Displays landlord contact information and action buttons
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, User } from 'lucide-react';

interface LandlordContactProps {
  landlordName?: string;
  contactPhone?: string | null;
  whatsappPhone?: string | null;
  propertyTitle: string;
}

const LandlordContact: React.FC<LandlordContactProps> = ({
  landlordName = 'Mwenye Nyumba',
  contactPhone,
  whatsappPhone,
  propertyTitle,
}) => {
  const getWhatsAppLink = () => {
    if (!whatsappPhone && !contactPhone) return '#';
    const phoneNumber = whatsappPhone || contactPhone;
    const cleanPhone = phoneNumber!.replace(/[^0-9]/g, '');
    const message = `Hujambo, ninapenda kujua zaidi kuhusu nyumba hii: ${propertyTitle}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Card>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">
          Contact Landlord
        </h3>

        <div className="space-y-3 sm:space-y-4">
          {/* Landlord Information */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                {landlordName}
                <Badge className="ml-1 sm:ml-2 bg-green-100 text-green-800 text-xs">
                  Verified
                </Badge>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Landlord</div>
            </div>
          </div>

          <Separator />

          {/* Contact Options */}
          <div className="space-y-3">
            {contactPhone && (
              <>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-3"
                  onClick={() => window.open(`tel:${contactPhone}`, '_self')}
                >
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Call: {contactPhone}</span>
                </Button>
                {(whatsappPhone || contactPhone) && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3"
                    onClick={() => window.open(getWhatsAppLink(), '_blank')}
                  >
                    <svg className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                    <span className="truncate">WhatsApp: {whatsappPhone || contactPhone}</span>
                  </Button>
                )}
              </>
            )}

            {!contactPhone && (
              <div className="text-center text-gray-500 py-3 sm:py-4">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs sm:text-sm">No contact information available</p>
              </div>
            )}
          </div>

          <div className="text-xs sm:text-sm text-gray-600 text-center">
            Contact the landlord directly for inquiries
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordContact;
