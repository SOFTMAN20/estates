/**
 * GET HELP SECTION COMPONENT
 * =========================
 * 
 * Kipengele cha msaada kwa wenye nyumba - Help section for landlords
 * 
 * FUNCTIONALITY / KAZI:
 * - Provides instant access to support channels (Kutoa ufikiaji wa haraka wa njia za msaada)
 * - Phone and WhatsApp contact options (Chaguo za mawasiliano ya simu na WhatsApp)
 * - Clear instructions in Swahili (Maelekezo wazi kwa Kiswahili)
 * - Professional styling matching dashboard theme (Muundo wa kitaalamu unaofanana na dashibodi)
 * - Modal/Dialog interface that shows only when triggered (Kiolesura cha modal kinachoonyeshwa tu kinapohitajika)
 * 
 * DESIGN FEATURES / VIPENGELE VYA MUUNDO:
 * - Responsive design for all devices (Muundo unaojibu kwa vifaa vyote)
 * - Clear visual hierarchy with icons (Mpangilio wa kuona ulio wazi na ikoni)
 * - Hover effects and animations (Athari za hover na mchoro)
 * - Accessible and user-friendly interface (Kiolesura cha ufikivu na urafiki wa mtumiaji)
 * - Modal overlay with backdrop blur (Uwazi wa modal na blur ya nyuma)
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  Clock, 
  CheckCircle,
  Users,
  Headphones,
  Star,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Interface for component props
 * Defines the structure for GetHelpSection modal component properties
 */
interface GetHelpSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SUPPORT CONTACT INFORMATION
 * ===========================
 * 
 * Centralized contact information for easy maintenance
 * All support channels use the same phone number for consistency
 */
const SUPPORT_PHONE = '+255750939217';
const SUPPORT_HOURS = '24/7';

/**
 * GET HELP MODAL COMPONENT
 * ========================
 * 
 * Main component that renders the help section as a modal dialog
 * Provides multiple ways for landlords to get assistance
 * 
 * @param isOpen - Controls whether the modal is visible
 * @param onClose - Function to call when modal should be closed
 */
const GetHelpSection: React.FC<GetHelpSectionProps> = ({ 
  isOpen,
  onClose 
}) => {
  const { t } = useTranslation();

  /**
   * PHONE CALL HANDLER
   * ==================
   * 
   * Initiates a phone call to support number
   * Uses tel: protocol for direct dialing
   */
  const handlePhoneCall = (): void => {
    window.open(`tel:${SUPPORT_PHONE}`, '_self');
  };

  /**
   * WHATSAPP CHAT HANDLER
   * ====================
   * 
   * Opens WhatsApp with pre-filled message in Swahili
   * Includes context about being a landlord for better support
   */
  const handleWhatsAppChat = (): void => {
    const message = encodeURIComponent(
      'Hello! I am a landlord on Nyumba Link and I need help. Please assist me.'
    );
    const whatsappUrl = `https://wa.me/${SUPPORT_PHONE.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  /**
   * RENDERS HELP STATISTICS
   * ======================
   * 
   * Shows support statistics to build confidence
   * Displays response time and satisfaction metrics
   */
  const renderHelpStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
          <Clock className="h-6 w-6 text-green-600" />
        </div>
        <div className="text-sm font-semibold text-gray-900">5 {t('dashboard.minutes')}</div>
        <div className="text-xs text-gray-600">{t('dashboard.responseTime')}</div>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-sm font-semibold text-gray-900">1000+</div>
        <div className="text-xs text-gray-600">{t('dashboard.landlords')}</div>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
          <Star className="h-6 w-6 text-yellow-600" />
        </div>
        <div className="text-sm font-semibold text-gray-900">4.9/5</div>
        <div className="text-xs text-gray-600">{t('dashboard.rating')}</div>
      </div>
    </div>
  );

  /**
   * RENDERS PRIMARY CONTACT BUTTONS
   * ==============================
   * 
   * Main call-to-action buttons for phone and WhatsApp
   * Styled prominently to encourage usage
   */
  const renderContactButtons = () => (
    <div className="space-y-3 mb-6">
      {/* Phone Call Button */}
      <Button
        onClick={handlePhoneCall}
        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <Phone className="h-6 w-6 mr-3" />
        {t('dashboard.callNow')}
        <Badge className="ml-3 bg-blue-500 text-white border-0">
          {SUPPORT_HOURS}
        </Badge>
      </Button>

      {/* WhatsApp Chat Button */}
      <Button
        onClick={handleWhatsAppChat}
        className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <MessageCircle className="h-6 w-6 mr-3" />
        {t('dashboard.chatWhatsApp')}
        <Badge className="ml-3 bg-green-500 text-white border-0">
          {t('dashboard.fast')}
        </Badge>
      </Button>
    </div>
  );

  /**
   * RENDERS SUPPORT INSTRUCTIONS
   * ===========================
   * 
   * Clear instructions in Swahili explaining how to get help
   * Includes what information to prepare before contacting support
   */
  const renderSupportInstructions = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <Headphones className="h-4 w-4 mr-2" />
          {t('dashboard.howToGetHelp')}
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {t('dashboard.callOrMessage')}</li>
          <li>• {t('dashboard.explainProblem')}</li>
          <li>• {t('dashboard.provideAccountInfo')}</li>
          <li>• {t('dashboard.waitForHelp')}</li>
        </ul>
      </div>

      <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
        <h4 className="font-semibold text-green-900 mb-2 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          {t('dashboard.weHelpWith')}
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• {t('dashboard.addUpdateProperties')}</li>
          <li>• {t('dashboard.accountIssues')}</li>
          <li>• {t('dashboard.pricingQuestions')}</li>
          <li>• {t('dashboard.systemTraining')}</li>
          <li>• {t('dashboard.feedbackSuggestions')}</li>
        </ul>
      </div>
    </div>
  );

  /**
   * MAIN MODAL RENDER
   * ================
   * 
   * Renders the complete help section as a modal dialog
   * Only shows when isOpen is true
   */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            {t('dashboard.expertHelp')}
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            {t('dashboard.helpDescription')}
          </p>
        </DialogHeader>
      
      <div className="space-y-6">
        {/* Help Statistics */}
        {renderHelpStats()}
        
        {/* Primary Contact Buttons */}
        {renderContactButtons()}
        
        {/* Support Instructions */}
        {renderSupportInstructions()}
        
        {/* Contact Information Display */}
        <div className="pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {t('dashboard.supportNumber')}
            </p>
            <p className="text-lg font-bold text-primary">
              {SUPPORT_PHONE}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('dashboard.availableLanguages')}
            </p>
          </div>
        </div>
        
        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700 font-medium">
            {t('dashboard.noQuestionTooSmall')} <strong>{t('dashboard.encouragementMessage')}</strong>
          </p>
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetHelpSection;