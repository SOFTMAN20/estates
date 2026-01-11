/**
 * NEWSLETTER.TSX - EMAIL SIGNUP SECTION
 * =====================================
 * 
 * Sehemu ya kujisajili kwa barua pepe - Email newsletter signup section
 * 
 * FUNCTIONALITY / KAZI:
 * - Captures user email for newsletter/updates
 * - Simple, clean design with validation
 * - Success/error feedback states
 * - Full i18n support
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Bell, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: t('newsletter.invalidEmail'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - in production, this would call your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail('');
    
    toast({
      title: t('newsletter.successTitle'),
      description: t('newsletter.successMessage'),
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-serengeti-50/50 to-kilimanjaro-50/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-serengeti-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-kilimanjaro-100/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xl border border-white/50">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-serengeti-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-kilimanjaro-500 rounded-full flex items-center justify-center">
                <Bell className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('newsletter.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('newsletter.subtitle')}
            </p>
          </div>

          {/* Form or Success State */}
          {isSubscribed ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-700">
                {t('newsletter.thankYou')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsSubscribed(false)}
                className="mt-2"
              >
                {t('newsletter.subscribeAnother')}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder={t('newsletter.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 text-base border-2 border-gray-200 focus:border-primary 
                               rounded-xl bg-white/80 focus-visible:ring-0 focus-visible:ring-offset-0"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-14 px-8 bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 
                             hover:to-serengeti-500/90 text-white font-semibold rounded-xl shadow-lg 
                             hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('newsletter.subscribe')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
              
              {/* Privacy note */}
              <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
                {t('newsletter.privacy')}
              </p>
            </form>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">{t('newsletter.benefit1')}</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 bg-serengeti-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-serengeti-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">{t('newsletter.benefit2')}</span>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <div className="w-10 h-10 bg-kilimanjaro-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-kilimanjaro-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">{t('newsletter.benefit3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
