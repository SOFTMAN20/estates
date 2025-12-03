
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
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth';
import type { LoginFormData } from '@/types/auth';

/**
 * SIGNIN COMPONENT
 * ===============
 * 
 * Main authentication component that handles user login.
 * Integrates with Supabase Auth for secure authentication.
 */
const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, loading, checkUserTypeAndRedirect } = useAuth();
  const { t } = useTranslation();

  // Auto-redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      checkUserTypeAndRedirect(navigate);
    }
  }, [user, loading, navigate, checkUserTypeAndRedirect]);

  // Handle form submission
  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    const { error } = await signIn(data.email, data.password);
    
    if (!error) {
      setTimeout(() => {
        checkUserTypeAndRedirect(navigate);
      }, 500);
    }
    
    setIsLoading(false);
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
                <LoginForm 
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  showRememberMe={true}
                  showForgotPassword={true}
                  showSignUpLink={true}
                />
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
