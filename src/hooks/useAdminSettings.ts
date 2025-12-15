/**
 * Admin Settings Hook
 * Manages platform settings for admin settings page
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';

export interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  data_type: 'string' | 'number' | 'boolean' | 'json';
  updated_by: string | null;
  updated_at: string;
  created_at: string;
}

export interface SettingsFormData {
  // General Settings
  platform_name: string;
  support_email: string;
  commission_rate: number;
  
  // Payment Settings
  mpesa_enabled: boolean;
  card_payments_enabled: boolean;
  bank_transfer_enabled: boolean;
  
  // Property Settings
  auto_approve_properties: boolean;
  require_property_verification: boolean;
  max_images_per_property: number;
  
  // Notification Settings
  email_notifications_enabled: boolean;
  admin_alerts_enabled: boolean;
  
  // Maintenance Mode
  maintenance_mode_enabled: boolean;
  maintenance_message: string;
}

/**
 * Fetch all platform settings
 */
export function usePlatformSettings() {
  return useQuery({
    queryKey: ['admin', 'platform-settings'],
    queryFn: async (): Promise<Record<string, PlatformSetting>> => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*');

      if (error) {
        console.error('Error fetching platform settings:', error);
        throw error;
      }

      // Convert array to key-value map for easier access
      const settingsMap: Record<string, PlatformSetting> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting;
      });

      return settingsMap;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get parsed settings values with defaults
 */
export function useSettingsValues() {
  const { data: settings = {}, isLoading } = usePlatformSettings();

  const values: SettingsFormData = {
    // General Settings
    platform_name: settings.platform_name?.value || 'NyumbaLink',
    support_email: settings.support_email?.value || 'support@nyumbalink.com',
    commission_rate: Number(settings.commission_rate?.value || settings.service_fee_percentage?.value || 10),
    
    // Payment Settings
    mpesa_enabled: settings.mpesa_enabled?.value === 'true',
    card_payments_enabled: settings.card_payments_enabled?.value === 'true',
    bank_transfer_enabled: settings.bank_transfer_enabled?.value === 'true',
    
    // Property Settings
    auto_approve_properties: settings.auto_approve_properties?.value === 'true',
    require_property_verification: settings.require_property_verification?.value === 'true',
    max_images_per_property: Number(settings.max_images_per_property?.value || 10),
    
    // Notification Settings
    email_notifications_enabled: settings.email_notifications_enabled?.value === 'true',
    admin_alerts_enabled: settings.admin_alerts_enabled?.value === 'true',
    
    // Maintenance Mode
    maintenance_mode_enabled: settings.maintenance_mode_enabled?.value === 'true',
    maintenance_message: settings.maintenance_message?.value || "We're currently performing maintenance. Please check back soon.",
  };

  return { values, isLoading };
}

/**
 * Update platform settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<SettingsFormData>) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Convert settings to array of updates
      const updates: Array<{
        key: string;
        value: string;
        data_type: 'string' | 'number' | 'boolean';
      }> = [];

      // General Settings
      if (settings.platform_name !== undefined) {
        updates.push({ key: 'platform_name', value: settings.platform_name, data_type: 'string' });
      }
      if (settings.support_email !== undefined) {
        updates.push({ key: 'support_email', value: settings.support_email, data_type: 'string' });
      }
      if (settings.commission_rate !== undefined) {
        updates.push({ key: 'commission_rate', value: String(settings.commission_rate), data_type: 'number' });
        updates.push({ key: 'service_fee_percentage', value: String(settings.commission_rate), data_type: 'number' });
      }

      // Payment Settings
      if (settings.mpesa_enabled !== undefined) {
        updates.push({ key: 'mpesa_enabled', value: String(settings.mpesa_enabled), data_type: 'boolean' });
      }
      if (settings.card_payments_enabled !== undefined) {
        updates.push({ key: 'card_payments_enabled', value: String(settings.card_payments_enabled), data_type: 'boolean' });
      }
      if (settings.bank_transfer_enabled !== undefined) {
        updates.push({ key: 'bank_transfer_enabled', value: String(settings.bank_transfer_enabled), data_type: 'boolean' });
      }

      // Property Settings
      if (settings.auto_approve_properties !== undefined) {
        updates.push({ key: 'auto_approve_properties', value: String(settings.auto_approve_properties), data_type: 'boolean' });
      }
      if (settings.require_property_verification !== undefined) {
        updates.push({ key: 'require_property_verification', value: String(settings.require_property_verification), data_type: 'boolean' });
      }
      if (settings.max_images_per_property !== undefined) {
        updates.push({ key: 'max_images_per_property', value: String(settings.max_images_per_property), data_type: 'number' });
      }

      // Notification Settings
      if (settings.email_notifications_enabled !== undefined) {
        updates.push({ key: 'email_notifications_enabled', value: String(settings.email_notifications_enabled), data_type: 'boolean' });
      }
      if (settings.admin_alerts_enabled !== undefined) {
        updates.push({ key: 'admin_alerts_enabled', value: String(settings.admin_alerts_enabled), data_type: 'boolean' });
      }

      // Maintenance Mode
      if (settings.maintenance_mode_enabled !== undefined) {
        updates.push({ key: 'maintenance_mode_enabled', value: String(settings.maintenance_mode_enabled), data_type: 'boolean' });
      }
      if (settings.maintenance_message !== undefined) {
        updates.push({ key: 'maintenance_message', value: settings.maintenance_message, data_type: 'string' });
      }

      // Perform upserts for each setting
      const promises = updates.map(async ({ key, value, data_type }) => {
        const { error } = await supabase
          .from('platform_settings')
          .upsert(
            {
              key,
              value,
              data_type,
              updated_by: user.id,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'key',
            }
          );

        if (error) throw error;

        // Log admin action
        await supabase.from('admin_actions').insert({
          admin_id: user.id,
          action_type: 'update_settings',
          target_type: 'settings',
          target_id: null,
          details: {
            setting_key: key,
            new_value: value,
          },
        });
      });

      await Promise.all(promises);

      return { success: true };
    },
    onSuccess: () => {
      // Invalidate settings queries to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'platform-settings'] });
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] }); // Also invalidate public settings cache
    },
  });
}
