/**
 * Platform Settings Hook
 * Provides access to platform-wide settings for use throughout the application
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

export interface PlatformSettings {
  platform_name: string;
  support_email: string;
  commission_rate: number;
  min_booking_months: number;
  max_advance_booking_months: number;
  currency: string;
  mpesa_enabled: boolean;
  card_payments_enabled: boolean;
  bank_transfer_enabled: boolean;
  maintenance_mode_enabled: boolean;
  maintenance_message: string;
  auto_approve_properties: boolean;
  require_property_verification: boolean;
  max_images_per_property: number;
}

/**
 * Fetch platform settings with caching
 * This hook can be used anywhere in the app to access platform settings
 */
export function usePlatformSettings() {
  return useQuery({
    queryKey: ['platform-settings'],
    queryFn: async (): Promise<PlatformSettings> => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('key, value, data_type');

      if (error) {
        console.error('Error fetching platform settings:', error);
        // Return defaults if error
        return getDefaultSettings();
      }

      // Convert array to settings object
      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });

      return {
        platform_name: settingsMap.platform_name || 'NyumbaLink',
        support_email: settingsMap.support_email || 'support@nyumbalink.com',
        commission_rate: Number(settingsMap.commission_rate || settingsMap.service_fee_percentage || 10),
        min_booking_months: Number(settingsMap.min_booking_months || 1),
        max_advance_booking_months: Number(settingsMap.max_advance_booking_months || 12),
        currency: settingsMap.currency || 'TZS',
        mpesa_enabled: settingsMap.mpesa_enabled === 'true',
        card_payments_enabled: settingsMap.card_payments_enabled === 'true',
        bank_transfer_enabled: settingsMap.bank_transfer_enabled === 'true',
        maintenance_mode_enabled: settingsMap.maintenance_mode_enabled === 'true',
        maintenance_message: settingsMap.maintenance_message || "We're currently performing maintenance. Please check back soon.",
        auto_approve_properties: settingsMap.auto_approve_properties === 'true',
        require_property_verification: settingsMap.require_property_verification === 'true',
        max_images_per_property: Number(settingsMap.max_images_per_property || 10),
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
}

/**
 * Get default settings (fallback)
 */
function getDefaultSettings(): PlatformSettings {
  return {
    platform_name: 'NyumbaLink',
    support_email: 'support@nyumbalink.com',
    commission_rate: 10,
    min_booking_months: 1,
    max_advance_booking_months: 12,
    currency: 'TZS',
    mpesa_enabled: false,
    card_payments_enabled: false,
    bank_transfer_enabled: false,
    maintenance_mode_enabled: false,
    maintenance_message: "We're currently performing maintenance. Please check back soon.",
    auto_approve_properties: false,
    require_property_verification: true,
    max_images_per_property: 10,
  };
}

/**
 * Hook to get just the commission rate
 * Useful for components that only need the commission rate
 */
export function useCommissionRate() {
  const { data: settings } = usePlatformSettings();
  return settings?.commission_rate || 10;
}

/**
 * Hook to calculate service fee based on amount
 */
export function useCalculateServiceFee(amount: number) {
  const commissionRate = useCommissionRate();
  const serviceFee = (amount * commissionRate) / 100;
  const totalAmount = amount + serviceFee;
  
  return {
    serviceFee,
    totalAmount,
    commissionRate,
  };
}
