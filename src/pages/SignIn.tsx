
/**
 * SIGNIN.TSX - USER AUTHENTICATION PAGE
 * =====================================
 * 
 * Ukurasa wa kuingia - User sign in page
 * 
 * ARCHITECTURE / MUUNDO:
 * This page handles user authentication with email and password.
 * After successful login, users are redirected based on their role:
 * - Admins/Super Admins → /admin
 * - Hosts (landlords) → /dashboard
 * - Regular users → /
 * 
 * FEATURES / VIPENGELE:
 * - Email and password authentication
 * - Password visibility toggle
 * - Remember me functionality
 * - Forgot password link
 * - Role-based redirect after login
 * - Animated UI with Framer Motion
 * - Internationalization support
 * - Loading states and error handling
 * 
 * SECURITY / USALAMA:
 * - Input validation through useAuth hook
 * - Rate limiting on login attempts
 * - Secure password handling (never stored locally)
 * - CSRF protection
 * 
 * USER EXPERIENCE / TAJRIBA YA MTUMIAJI:
 * - Responsive design for all devices
 * - Clear error messages in Swahili
 * - Smooth animations and transitions
 * - Accessible form controls
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * SIGNIN COMPONENT
 * ===============
 * 
 * Main authentication component that handles user login.
 * Integrates with Supabase Auth for secure authentication.
 */
const SignIn = () => {
  // Password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data state - stores email and password
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Loading state for submit button
  const [isLoading, setIsLoading] = useState(false);
  
  // Navigation and authentication hooks
  const navigate = useNavigate();
  const { signIn, user, loading, checkUserTypeAndRedirect } = useAuth();
  const { t } = useTranslation();

  /**
   * AUTO-REDIRECT EFFECT
   * ===================
   * 
   * Redirects already authenticated users to their appropriate page.
   * Prevents logged-in users from seeing the login page.
   */
  useEffect(() => {
    if (!loading && user) {
      checkUserTypeAndRedirect(navigate);
    }
  }, [user, loading, navigate, checkUserTypeAndRedirect]);

  /**
   * FORM SUBMIT HANDLER
   * ==================
   * 
   * Handles the login form submission:
   * 1. Prevents default form behavior
   * 2. Sets loading state
   * 3. Calls signIn from useAuth hook
   * 4. On success, redirects based on user role
   * 5. On error, displays error message via toast
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      // Wait for user state to update, then redirect based on role
      setTimeout(() => {
        checkUserTypeAndRedirect(navigate);
      }, 500);
    }
    
    setIsLoading(false);
  };

  /**
   * INPUT CHANGE HANDLER
   * ===================
   * 
   * Updates form data state when user types in input fields.
   * Uses functional update to ensure latest state.
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-serengeti-500/20 to-transparent rounded-full blur-3xl"></div>
      
      <Navigation />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Nyumba Link</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('auth.welcomeBack')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('auth.signInSubtitle')}
            </p>
          </motion.div>

          {/* Sign in form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          >
            <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/95 relative overflow-hidden rounded-2xl">
              {/* Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-primary/5 pointer-events-none"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-serengeti-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                  {t('auth.signIn')}
                </CardTitle>
                <p className="text-center text-sm text-gray-600 mt-2">Ingia katika akaunti yako</p>
              </CardHeader>
              <CardContent className="relative z-10">
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">{t('auth.rememberMe')}</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 hover:from-primary/90 hover:via-serengeti-400 hover:to-kilimanjaro-500 text-white font-bold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.signing') : t('auth.signIn')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('auth.noAccount')}{' '}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    {t('auth.signUpHere')}
                  </Link>
                </p>
              </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="bg-gradient-to-r from-primary/10 via-serengeti-50 to-kilimanjaro-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
          >
            {/* Info card overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-primary/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-serengeti-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <Home className="h-4 w-4 text-white" />
                </div>
                {t('auth.whyRegister')}
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {t('auth.saveProperties')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-serengeti-500 rounded-full mr-3"></div>
                  {t('auth.getNotifications')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-kilimanjaro-600 rounded-full mr-3"></div>
                  {t('auth.contactLandlords')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {t('auth.listProperty')}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
