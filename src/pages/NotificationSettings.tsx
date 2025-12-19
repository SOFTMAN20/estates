import { useState, useEffect } from 'react';
import { Bell, Mail, Volume2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationPreferences } from '@/types/notification';

export default function NotificationSettings() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<Partial<NotificationPreferences>>({
    email_bookings: true,
    email_payments: true,
    email_properties: true,
    email_messages: true,
    email_marketing: false,
    inapp_bookings: true,
    inapp_payments: true,
    inapp_properties: true,
    inapp_messages: true,
    inapp_system: true,
    sound_enabled: true,
    daily_digest: false,
    weekly_summary: false,
  });

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      showError('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showSuccess('Notification preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      showError('Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-sm text-gray-500">
                Manage how you receive notifications
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle>Email Notifications</CardTitle>
              </div>
              <CardDescription>
                Receive notifications via email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email_bookings" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Bookings</p>
                    <p className="text-sm text-gray-500">New bookings, confirmations, and cancellations</p>
                  </div>
                </Label>
                <Switch
                  id="email_bookings"
                  checked={preferences.email_bookings}
                  onCheckedChange={(checked) => updatePreference('email_bookings', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email_payments" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Payments</p>
                    <p className="text-sm text-gray-500">Payment confirmations and receipts</p>
                  </div>
                </Label>
                <Switch
                  id="email_payments"
                  checked={preferences.email_payments}
                  onCheckedChange={(checked) => updatePreference('email_payments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email_properties" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Properties</p>
                    <p className="text-sm text-gray-500">Property approvals and updates</p>
                  </div>
                </Label>
                <Switch
                  id="email_properties"
                  checked={preferences.email_properties}
                  onCheckedChange={(checked) => updatePreference('email_properties', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email_messages" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-gray-500">New messages from guests or hosts</p>
                  </div>
                </Label>
                <Switch
                  id="email_messages"
                  checked={preferences.email_messages}
                  onCheckedChange={(checked) => updatePreference('email_messages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email_marketing" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Marketing</p>
                    <p className="text-sm text-gray-500">Newsletters and promotional offers</p>
                  </div>
                </Label>
                <Switch
                  id="email_marketing"
                  checked={preferences.email_marketing}
                  onCheckedChange={(checked) => updatePreference('email_marketing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>In-App Notifications</CardTitle>
              </div>
              <CardDescription>
                Receive notifications within the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="inapp_bookings" className="flex-1 cursor-pointer">
                  <p className="font-medium">Bookings</p>
                </Label>
                <Switch
                  id="inapp_bookings"
                  checked={preferences.inapp_bookings}
                  onCheckedChange={(checked) => updatePreference('inapp_bookings', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inapp_payments" className="flex-1 cursor-pointer">
                  <p className="font-medium">Payments</p>
                </Label>
                <Switch
                  id="inapp_payments"
                  checked={preferences.inapp_payments}
                  onCheckedChange={(checked) => updatePreference('inapp_payments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inapp_properties" className="flex-1 cursor-pointer">
                  <p className="font-medium">Properties</p>
                </Label>
                <Switch
                  id="inapp_properties"
                  checked={preferences.inapp_properties}
                  onCheckedChange={(checked) => updatePreference('inapp_properties', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inapp_messages" className="flex-1 cursor-pointer">
                  <p className="font-medium">Messages</p>
                </Label>
                <Switch
                  id="inapp_messages"
                  checked={preferences.inapp_messages}
                  onCheckedChange={(checked) => updatePreference('inapp_messages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inapp_system" className="flex-1 cursor-pointer">
                  <p className="font-medium">System</p>
                </Label>
                <Switch
                  id="inapp_system"
                  checked={preferences.inapp_system}
                  onCheckedChange={(checked) => updatePreference('inapp_system', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sound & Digest */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <CardTitle>Sound & Digest</CardTitle>
              </div>
              <CardDescription>
                Additional notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound_enabled" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Notification Sound</p>
                    <p className="text-sm text-gray-500">Play sound for new notifications</p>
                  </div>
                </Label>
                <Switch
                  id="sound_enabled"
                  checked={preferences.sound_enabled}
                  onCheckedChange={(checked) => updatePreference('sound_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="daily_digest" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-gray-500">Receive a daily summary email</p>
                  </div>
                </Label>
                <Switch
                  id="daily_digest"
                  checked={preferences.daily_digest}
                  onCheckedChange={(checked) => updatePreference('daily_digest', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weekly_summary" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Weekly Summary</p>
                    <p className="text-sm text-gray-500">Receive a weekly summary email</p>
                  </div>
                </Label>
                <Switch
                  id="weekly_summary"
                  checked={preferences.weekly_summary}
                  onCheckedChange={(checked) => updatePreference('weekly_summary', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
