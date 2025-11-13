/**
 * StepNavigation.tsx - Property Form Step Navigation
 * ===================================================
 * 
 * Step navigation component with progress indicators.
 * Single responsibility: Handle step navigation UI.
 */

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Home, Building, Phone, Camera, CheckCircle, LucideIcon } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
}

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  steps: Step[];
  isStepValid: (step: number) => boolean;
  onStepClick: (step: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  progress,
  steps,
  isStepValid,
  onStepClick,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Desktop step navigation */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep || (step.id <= currentStep && isStepValid(step.id));
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg scale-110' 
                    : isCompleted 
                    ? 'bg-green-500 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                {isCompleted && step.id < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 transition-colors duration-200 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepNavigation;
