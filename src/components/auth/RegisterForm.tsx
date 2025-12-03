/**
 * RegisterForm.tsx - Reusable Registration Form Component
 * =======================================================
 * 
 * Modular, maintainable registration form component
 * Can be used in SignUp page or modal dialogs
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RegisterFormData } from '@/types/auth';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
  showSignInLink?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  showSignInLink = true
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert('Nywila hazifanani');
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="fullName">{t('auth.fullName')}</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.full_name}
          onChange={(e) => handleInputChange('full_name', e.target.value)}
          placeholder={t('auth.fullNamePlaceholder')}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="password">{t('auth.password')}</Label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder={t('auth.passwordRequirement')}
            required
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
        <div className="relative mt-1">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 hover:from-primary/90 hover:via-serengeti-400 hover:to-kilimanjaro-500 text-white font-bold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        disabled={isLoading}
      >
        {isLoading ? t('auth.registering') : t('auth.signUp')}
      </Button>

      {showSignInLink && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              {t('auth.signInHere')}
            </Link>
          </p>
        </div>
      )}
    </form>
  );
};
