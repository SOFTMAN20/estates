/**
 * FormNavigationButtons.tsx - Property Form Navigation Buttons
 * =============================================================
 * 
 * Navigation buttons for form steps (Previous, Next, Submit).
 * Single responsibility: Handle form navigation actions.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Save, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  submitting: boolean;
  editingProperty: boolean;
  isStepValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const FormNavigationButtons: React.FC<FormNavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  progress,
  submitting,
  editingProperty,
  isStepValid,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="pt-6 border-t bg-gray-50 -mx-6 px-4 sm:px-6 -mb-6 pb-6">
      {/* Mobile Layout - Stack vertically */}
      <div className="block sm:hidden space-y-4">
        {/* Progress indicator - Mobile - Full Width */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{currentStep} ya {totalSteps}</span>
            <span>{Math.round(progress)}% kamili</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Buttons - Mobile */}
        <div className="flex justify-between items-center gap-3">
          <Button 
            type="button" 
            variant="outline"
            onClick={currentStep === 1 ? onCancel : onPrevious}
            disabled={submitting}
            className="flex items-center justify-center gap-2 min-h-[44px]"
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
              onClick={onNext}
              disabled={!isStepValid}
              className="flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Endelea</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={onSubmit}
              className="bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px]"
              disabled={submitting}
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

      {/* Desktop Layout - Full width progress bar */}
      <div className="hidden sm:block space-y-4">
        {/* Progress indicator - Desktop - Full Width */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{currentStep} ya {totalSteps}</span>
            <span>{Math.round(progress)}% kamili</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Buttons - Desktop */}
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="outline"
            onClick={currentStep === 1 ? onCancel : onPrevious}
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

          {/* Next/Submit button - Desktop */}
          {currentStep < totalSteps ? (
            <Button 
              type="button"
              onClick={onNext}
              disabled={!isStepValid}
              className="flex items-center gap-2"
            >
              Endelea
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={onSubmit}
              className="bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={submitting}
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

export default FormNavigationButtons;
