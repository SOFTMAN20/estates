/**
 * LoginForm.tsx - Reusable Login Form Component
 * ==============================================
 * 
 * Modular, maintainable login form component
 * Can be used in SignIn page or modal dialogs
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { LoginFormData } from '@/types/auth';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  showSignUpLink?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  showRememberMe = true,
  showForgotPassword = true,
  showSignUpLink = true
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder={t('auth.passwordPlaceholder')}
            required
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

      {(showRememberMe || showForgotPassword) && (
        <div className="flex items-center justify-between">
          {showRememberMe && (
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">{t('auth.rememberMe')}</span>
            </label>
          )}
          {showForgotPassword && (
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          )}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 hover:from-primary/90 hover:via-serengeti-400 hover:to-kilimanjaro-500 text-white font-bold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        disabled={isLoading}
      >
        {isLoading ? t('auth.signing') : t('auth.signIn')}
      </Button>

      {showSignUpLink && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              {t('auth.signUpHere')}
            </Link>
          </p>
        </div>
      )}
    </form>
  );
};
