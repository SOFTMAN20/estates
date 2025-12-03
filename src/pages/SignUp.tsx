/**
 * SIGNUP.TSX - USER REGISTRATION PAGE
 * ===================================
 * 
 * Ukurasa wa kujisajili - User registration page
 * 
 * ARCHITECTURE / MUUNDO:
 * This page handles new user registration with email and password.
 * All users are registered as regular users (role='user', is_host=false).
 * A database trigger automatically creates a profile entry when a user signs up.
 * 
 * FEATURES / VIPENGELE:
 * - Email and password registration
 * - Full name collection
 * - Password confirmation validation
 * - Password visibility toggles
 * - Automatic profile creation via database trigger
 * - Role-based redirect after signup
 * - Animated UI with Framer Motion
 * - Internationalization support
 * 
 * DATABASE INTEGRATION / MUUNGANISHO WA DATABASE:
 * - User created in auth.users table
 * - Profile automatically created in public.profiles table via trigger
 * - Default role: 'user'
 * - Default is_host: false
 * 
 * SECURITY / USALAMA:
 * - Password strength validation
 * - Email format validation
 * - Rate limiting on signup attempts
 * - Input sanitization
 * - CSRF protection
 * 
 * USER FLOW / MTIRIRIKO WA MTUMIAJI:
 * 1. User fills in registration form
 * 2. Password confirmation is validated
 * 3. Account is created in Supabase Auth
 * 4. Database trigger creates profile entry
 * 5. User is redirected to home page
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RegisterForm } from '@/components/auth';
import type { RegisterFormData } from '@/types/auth';

/**
 * SIGNUP COMPONENT
 * ===============
 * 
 * Main registration component that handles new user signup.
 * Integrates with Supabase Auth and database triggers.
 */
const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, user, loading, checkUserTypeAndRedirect } = useAuth();
  const { t } = useTranslation();

  // Auto-redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      checkUserTypeAndRedirect(navigate);
    }
  }, [user, loading, navigate, checkUserTypeAndRedirect]);

  // Handle form submission
  const handleSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    // Sign up with default user role
    const { error } = await signUp(data.email, data.password, {
      full_name: data.full_name,
      role: 'user' // All new users are regular users by default
    });

    if (!error) {
      setTimeout(() => {
        checkUserTypeAndRedirect(navigate);
      }, 1000);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-serengeti-500/20 to-transparent rounded-full blur-3xl"></div>
      
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
              Jisajili / Sign Up
            </h2>
            <p className="mt-2 text-gray-600">
              Unda akaunti yako ili kuanza kutumia huduma zetu
            </p>
          </motion.div>

          {/* Sign up form */}
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
                  {t('auth.signUp')}
                </CardTitle>
                <p className="text-center text-sm text-gray-600 mt-2">Jisajili ili kuanza safari yako</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <RegisterForm 
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  showSignInLink={true}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="bg-gradient-to-r from-primary/10 via-serengeti-50 to-kilimanjaro-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
          >
            {/* Benefits card overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-primary/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-serengeti-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <Check className="h-4 w-4 text-white" />
                </div>
                {t('auth.landlordBenefits')}
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {t('auth.freeListings')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-serengeti-500 rounded-full mr-3"></div>
                  {t('auth.findTenants')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-kilimanjaro-600 rounded-full mr-3"></div>
                  {t('auth.manageListings')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {t('auth.directContact')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-serengeti-500 rounded-full mr-3"></div>
                  {t('auth.getAnalytics')}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
