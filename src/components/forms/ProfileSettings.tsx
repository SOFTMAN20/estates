/**
 * PROFILESETTINGS.TSX - PROFILE SETTINGS COMPONENT
 * ===============================================
 * 
 * Kipengele cha mipangilio ya profaili - Profile settings component
 * 
 * FUNCTIONALITY / KAZI:
 * - Handles user profile editing (Kushughulikia kuhariri profaili ya mtumiaji)
 * - Manages profile form state (Kusimamia hali ya fomu ya profaili)
 * - Provides profile update functionality (Kutoa utendakazi wa kusasisha profaili)
 * - Handles form validation and submission (Kushughulikia uthibitisho na uwasilishaji wa fomu)
 * 
 * FEATURES / VIPENGELE:
 * - Profile information editing (Kuhariri maelezo ya profaili)
 * - Form validation (Uthibitisho wa fomu)
 * - Loading states (Hali za kupakia)
 * - Error handling (Kushughulikia makosa)
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ProfileFormData } from '@/hooks/dashboardHooks';

interface ProfileSettingsProps {
  isOpen: boolean;
  profileForm: ProfileFormData;
  profileLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
}

/**
 * PROFILE SETTINGS COMPONENT
 * ==========================
 * 
 * Modal dialog component for editing user profile information.
 * Handles profile form interactions and validation.
 * 
 * Kipengele cha mazungumzo ya modal kwa kuhariri maelezo ya profaili ya mtumiaji.
 * Kinashughulikia mwingiliano wa fomu ya profaili na uthibitisho.
 */
const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  profileForm,
  profileLoading,
  onClose,
  onSubmit,
  onInputChange
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('dashboard.updateAccountDetails')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">{t('dashboard.fullName')}</Label>
            <Input
              id="name"
              value={profileForm.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              placeholder={t('dashboard.enterFullName')}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">{t('dashboard.phoneNumber')}</Label>
            <Input
              id="phone"
              type="tel"
              value={profileForm.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="+255712345678"
              required
            />
          </div>

          <div>
            <Label htmlFor="user_type">{t('dashboard.userType')}</Label>
            <Input
              value={t('dashboard.landlordAgent')}
              disabled
              className="bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('dashboard.accountTypeCannotChange')}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              disabled={profileLoading}
            >
              {t('dashboard.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={profileLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {profileLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {t('dashboard.saving')}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t('dashboard.save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;