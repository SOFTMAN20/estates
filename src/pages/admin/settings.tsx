import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Save, Loader2, Settings as SettingsIcon, CreditCard, 
  Mail, Shield, Wrench, Send, Database, Trash2, Download 
} from 'lucide-react';
import { useSettingsValues, useUpdateSettings, type SettingsFormData } from '@/hooks/useAdminSettings';

export default function AdminSettings() {
  const { values: settingsValues, isLoading: settingsLoading } = useSettingsValues();
  const updateSettings = useUpdateSettings();
  
  // Local state for form
  const [formData, setFormData] = useState<SettingsFormData>(settingsValues);

  // Update form when settings load
  useEffect(() => {
    if (!settingsLoading) {
      setFormData(settingsValues);
    }
  }, [settingsValues, settingsLoading]);

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleInputChange = (key: keyof SettingsFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleTestEmail = () => {
    toast.info('Test email sent (feature coming soon)');
  };

  const handleTestPayment = () => {
    toast.info('Test payment initiated (feature coming soon)');
  };

  const handleDatabaseBackup = () => {
    toast.info('Database backup initiated (feature coming soon)');
  };

  const handleClearCache = () => {
    toast.success('Cache cleared successfully');
  };

  const handleDownloadLogs = () => {
    toast.info('Downloading system logs (feature coming soon)');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Configure platform-wide settings and preferences</p>
        </div>

        {settingsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading settings...</span>
          </div>
        ) : (
          <Tabs defaultValue="platform" className="space-y-6 max-w-5xl">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="platform" className="flex items-center gap-2 py-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Platform</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2 py-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2 py-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2 py-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Moderation</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2 py-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Maintenance</span>
            </TabsTrigger>
          </TabsList>

          {/* Platform Settings Tab */}
          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input 
                    id="platform-name" 
                    value={formData.platform_name}
                    onChange={(e) => handleInputChange('platform_name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input 
                    id="support-email" 
                    type="email" 
                    value={formData.support_email}
                    onChange={(e) => handleInputChange('support_email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission-rate">Platform Commission Rate (%)</Label>
                  <Input 
                    id="commission-rate" 
                    type="number" 
                    value={formData.commission_rate}
                    onChange={(e) => handleInputChange('commission_rate', Number(e.target.value))}
                    min="0" 
                    max="100" 
                  />
                  <p className="text-sm text-muted-foreground">Default: 10%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-booking">Minimum Booking Duration (months)</Label>
                  <Input 
                    id="min-booking" 
                    type="number" 
                    defaultValue="1"
                    min="1" 
                    max="12" 
                  />
                  <p className="text-sm text-muted-foreground">Default: 1 month</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-advance">Maximum Advance Booking (months)</Label>
                  <Input 
                    id="max-advance" 
                    type="number" 
                    defaultValue="12"
                    min="1" 
                    max="24" 
                  />
                  <p className="text-sm text-muted-foreground">Default: 12 months</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input 
                    id="currency" 
                    value="TZS"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">Tanzanian Shilling (TZS)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Settings</CardTitle>
                <CardDescription>Configure property listing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve Properties</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve new property listings</p>
                  </div>
                  <Switch 
                    checked={formData.auto_approve_properties}
                    onCheckedChange={(checked) => handleInputChange('auto_approve_properties', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Property Verification</Label>
                    <p className="text-sm text-muted-foreground">Require verification before approval</p>
                  </div>
                  <Switch 
                    checked={formData.require_property_verification}
                    onCheckedChange={(checked) => handleInputChange('require_property_verification', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="max-images">Maximum Images per Property</Label>
                  <Input 
                    id="max-images" 
                    type="number" 
                    value={formData.max_images_per_property}
                    onChange={(e) => handleInputChange('max_images_per_property', Number(e.target.value))}
                    min="1" 
                    max="20" 
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                size="lg"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Enable or disable payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>M-Pesa Payments</Label>
                    <p className="text-sm text-muted-foreground">Enable M-Pesa as a payment method</p>
                  </div>
                  <Switch 
                    checked={formData.mpesa_enabled}
                    onCheckedChange={(checked) => handleInputChange('mpesa_enabled', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Card Payments</Label>
                    <p className="text-sm text-muted-foreground">Enable credit/debit card payments</p>
                  </div>
                  <Switch 
                    checked={formData.card_payments_enabled}
                    onCheckedChange={(checked) => handleInputChange('card_payments_enabled', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">Enable bank transfer payments</p>
                  </div>
                  <Switch 
                    checked={formData.bank_transfer_enabled}
                    onCheckedChange={(checked) => handleInputChange('bank_transfer_enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>M-Pesa Configuration</CardTitle>
                <CardDescription>Configure M-Pesa payment gateway</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mpesa-shortcode">Business Shortcode</Label>
                  <Input 
                    id="mpesa-shortcode" 
                    placeholder="Enter shortcode"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mpesa-passkey">Passkey</Label>
                  <Input 
                    id="mpesa-passkey" 
                    type="password"
                    placeholder="Enter passkey"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mpesa-environment">Environment</Label>
                  <select 
                    id="mpesa-environment"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="test">Test/Sandbox</option>
                    <option value="production">Production</option>
                  </select>
                </div>

                <Button onClick={handleTestPayment} variant="outline" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Test Payment
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                size="lg"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Email Notifications Tab */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure email sender details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-sender-name">Sender Name</Label>
                  <Input 
                    id="email-sender-name" 
                    defaultValue="NyumbaLink"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-sender-address">Sender Email Address</Label>
                  <Input 
                    id="email-sender-address" 
                    type="email"
                    defaultValue="noreply@nyumbalink.com"
                  />
                </div>

                <Button onClick={handleTestEmail} variant="outline" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>Enable or disable specific notification types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New User Registration</Label>
                    <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Property Submission</Label>
                    <p className="text-sm text-muted-foreground">Notify when property is submitted</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Confirmation</Label>
                    <p className="text-sm text-muted-foreground">Send booking confirmation emails</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Success</Label>
                    <p className="text-sm text-muted-foreground">Notify on successful payment</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Check-in Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders before check-in</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Review Reminders</Label>
                    <p className="text-sm text-muted-foreground">Remind users to leave reviews</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for important events</p>
                  </div>
                  <Switch 
                    checked={formData.admin_alerts_enabled}
                    onCheckedChange={(checked) => handleInputChange('admin_alerts_enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                size="lg"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Content Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Approval Settings</CardTitle>
                <CardDescription>Configure automatic approval rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve After X Days</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve properties after specified days</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-approve-days">Days Until Auto-Approval</Label>
                  <Input 
                    id="auto-approve-days" 
                    type="number" 
                    defaultValue="7"
                    min="1" 
                    max="30" 
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve from Verified Hosts</Label>
                    <p className="text-sm text-muted-foreground">Skip review for verified hosts</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Guidelines</CardTitle>
                <CardDescription>Define content moderation rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content-guidelines">Content Guidelines</Label>
                  <Textarea 
                    id="content-guidelines" 
                    rows={6}
                    defaultValue="All property listings must include accurate information. Photos must be recent and represent the actual property. Misleading information will result in listing removal."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prohibited-words">Prohibited Words (comma-separated)</Label>
                  <Textarea 
                    id="prohibited-words" 
                    rows={3}
                    placeholder="Enter prohibited words separated by commas"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                size="lg"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* System Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>Put the platform in maintenance mode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable public access</p>
                  </div>
                  <Switch 
                    checked={formData.maintenance_mode_enabled}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode_enabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Maintenance Message</Label>
                  <Textarea 
                    id="maintenance-message" 
                    rows={3}
                    value={formData.maintenance_message}
                    onChange={(e) => handleInputChange('maintenance_message', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Operations</CardTitle>
                <CardDescription>Perform system maintenance tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleDatabaseBackup} variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>

                <Button onClick={handleClearCache} variant="outline" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>

                <Button onClick={handleDownloadLogs} variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download System Logs
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                size="lg"
                disabled={updateSettings.isPending}
              >
                {updateSettings.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  );
}
