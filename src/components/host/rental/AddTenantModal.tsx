/**
 * ADD TENANT MODAL - Add a new tenant to a property/unit
 * Supports two modes:
 * 1. From Units page - unit is pre-selected
 * 2. From Tenants page - user selects property from list
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, addMonths } from 'date-fns';
import { CalendarIcon, Home, Loader2, Search, UserPlus, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

interface UnitInfo {
  id: string;
  name: string;
  unitNumber?: string;
  propertyId: string;
  propertyTitle: string;
  rent: number;
  isMultiUnit: boolean;
}

interface PropertyInfo {
  id: string;
  title: string;
  price_per_month?: number;
}

interface AddTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Mode 1: Pre-selected unit (from Units page)
  unit?: UnitInfo | null;
  onSuccess?: () => void;
  // Mode 2: Property selection (from Tenants page)
  properties?: PropertyInfo[];
}

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

export function AddTenantModal({ 
  open, 
  onOpenChange, 
  unit, 
  onSuccess,
  properties: externalProperties = []
}: AddTenantModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [createNewUser, setCreateNewUser] = useState(false);
  
  // Property selection (for Tenants page mode)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  
  // Fetch properties if not provided externally
  const [internalProperties, setInternalProperties] = useState<PropertyInfo[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  
  // Use external properties if provided, otherwise use internal
  const properties = externalProperties.length > 0 ? externalProperties : internalProperties;
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  // Fetch properties when modal opens and no external properties provided
  useEffect(() => {
    const fetchProperties = async () => {
      if (!open || unit || !user?.id) return;
      
      setLoadingProperties(true);
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, price')
          .eq('host_id', user.id)
          .eq('status', 'approved')
          .order('title');
        
        if (error) {
          // Error handled silently
        } else if (data) {
          // Map price to price_per_month for compatibility
          setInternalProperties(data.map(p => ({
            id: p.id,
            title: p.title,
            price_per_month: p.price
          })));
        }
      } catch (err) {
        // Exception handled silently
      } finally {
        setLoadingProperties(false);
      }
    };
    
    fetchProperties();
  }, [open, unit, user?.id]);
  
  // Form state
  const [formData, setFormData] = useState({
    // New user fields
    newUserName: '',
    newUserEmail: '',
    newUserPhone: '',
    // Lease fields
    leaseStartDate: new Date().toISOString().split('T')[0],
    leaseEndDate: addMonths(new Date(), 12).toISOString().split('T')[0],
    monthlyRent: 0,
    securityDeposit: 0,
    // Emergency contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    // Notes
    moveInNotes: '',
  });

  // Determine which mode we're in
  const isUnitMode = !!unit;
  const isPropertyMode = !unit; // Always property mode if no unit provided

  // Update rent when unit or property changes
  useEffect(() => {
    if (unit) {
      setFormData(prev => ({ ...prev, monthlyRent: unit.rent }));
    } else if (selectedProperty?.price_per_month) {
      setFormData(prev => ({ ...prev, monthlyRent: selectedProperty.price_per_month || 0 }));
    }
  }, [unit, selectedProperty]);

  const updateForm = (field: string, value: string | number | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Search for existing users
  const handleSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;
    
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, phone, avatar_url')
        .or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .neq('id', user?.id)
        .limit(10);

      if (error) throw error;

      const results: UserSearchResult[] = (data || []).map(p => ({
        id: p.id,
        name: p.name || 'Unknown',
        email: '',
        phone: p.phone,
        avatar_url: p.avatar_url,
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        variant: 'destructive',
        title: 'Search failed',
        description: 'Could not search for users',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (userResult: UserSearchResult) => {
    setSelectedUser(userResult);
    setCreateNewUser(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleCreateNewUser = () => {
    setCreateNewUser(true);
    setSelectedUser(null);
    setSearchResults([]);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setCreateNewUser(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPropertyId('');
    setFormData({
      newUserName: '',
      newUserEmail: '',
      newUserPhone: '',
      leaseStartDate: new Date().toISOString().split('T')[0],
      leaseEndDate: addMonths(new Date(), 12).toISOString().split('T')[0],
      monthlyRent: unit?.rent || 0,
      securityDeposit: 0,
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      moveInNotes: '',
    });
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    // Validate property/unit selection
    const propertyId = unit?.propertyId || selectedPropertyId;
    if (!propertyId) {
      toast({
        variant: 'destructive',
        title: 'Select a property',
        description: 'Please select a property for the tenant',
      });
      return;
    }
    
    // Validate tenant selection
    if (!selectedUser && !createNewUser) {
      toast({
        variant: 'destructive',
        title: 'Select a tenant',
        description: 'Please select an existing user or create a new tenant',
      });
      return;
    }

    if (createNewUser && (!formData.newUserName || !formData.newUserPhone)) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please enter tenant name and phone number',
      });
      return;
    }

    if (!formData.leaseStartDate || !formData.leaseEndDate || !formData.monthlyRent) {
      toast({
        variant: 'destructive',
        title: 'Missing lease details',
        description: 'Please fill in all required lease information',
      });
      return;
    }

    setLoading(true);
    try {
      // For independent tenants (createNewUser), we don't create a profile
      // Instead, we store tenant info directly in the tenants table
      let tenantUserId: string | null = selectedUser?.id || null;

      // Create tenant record
      const tenantData: Record<string, unknown> = {
        property_id: propertyId,
        user_id: tenantUserId, // NULL for independent tenants
        landlord_id: user.id,
        lease_start_date: formData.leaseStartDate,
        lease_end_date: formData.leaseEndDate,
        monthly_rent: formData.monthlyRent,
        security_deposit: formData.securityDeposit || 0,
        status: 'active',
        move_in_date: formData.leaseStartDate,
        move_in_condition_notes: formData.moveInNotes || null,
        emergency_contact_name: formData.emergencyContactName || null,
        emergency_contact_phone: formData.emergencyContactPhone || null,
        emergency_contact_relationship: formData.emergencyContactRelationship || null,
      };

      // For independent tenants (no user account), store their info directly
      if (createNewUser) {
        tenantData.tenant_name = formData.newUserName;
        tenantData.tenant_phone = formData.newUserPhone;
        tenantData.tenant_email = formData.newUserEmail || null;
      }

      // Add unit_id for multi-unit properties
      if (unit?.isMultiUnit) {
        tenantData.unit_id = unit.id;
      }

      const { error: tenantError } = await supabase
        .from('tenants')
        .insert(tenantData);

      if (tenantError) throw tenantError;

      // Update unit availability if it's a multi-unit property
      if (unit?.isMultiUnit) {
        await supabase
          .from('property_units')
          .update({ is_available: false })
          .eq('id', unit.id);
      }

      toast({
        title: 'Tenant added successfully',
        description: `${selectedUser?.name || formData.newUserName} has been added as a tenant`,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-stats'] });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to add tenant',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get display info for the selected property/unit
  const getPropertyDisplay = () => {
    if (unit) {
      return {
        name: unit.name,
        subtitle: unit.propertyTitle,
        rent: unit.rent,
      };
    }
    if (selectedProperty) {
      return {
        name: selectedProperty.title,
        subtitle: '',
        rent: selectedProperty.price_per_month || 0,
      };
    }
    return null;
  };

  const propertyDisplay = getPropertyDisplay();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            Add Tenant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Selection (for Tenants page mode) */}
          {isPropertyMode && !selectedPropertyId && (
            <div className="space-y-2">
              <Label>Select Property *</Label>
              {loadingProperties ? (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Loading properties...</span>
                </div>
              ) : properties.length === 0 ? (
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    No approved properties found. Please add and get a property approved first.
                  </p>
                </div>
              ) : (
                <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a property..." />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {p.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Property/Unit Info Display */}
          {propertyDisplay && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{propertyDisplay.name}</p>
                  {propertyDisplay.subtitle && (
                    <p className="text-sm text-gray-600">{propertyDisplay.subtitle}</p>
                  )}
                  <p className="text-sm font-semibold text-blue-600">
                    {formatCurrency(propertyDisplay.rent, { language: i18n.language })}/month
                  </p>
                </div>
                {isPropertyMode && selectedPropertyId && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedPropertyId('')}
                  >
                    Change
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Only show tenant selection after property is selected */}
          {(isUnitMode || selectedPropertyId) && (
            <>
              {/* Step 1: Select or Create Tenant */}
              {!selectedUser && !createNewUser && (
                <div className="space-y-3">
                  <Label>Find Existing User or Create New</Label>
                  
                  {/* Search */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleSearch} disabled={searching || searchQuery.length < 2}>
                      {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                    </Button>
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                      {searchResults.map(result => (
                        <button
                          key={result.id}
                          onClick={() => handleSelectUser(result)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 text-left"
                        >
                          <img
                            src={result.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=3b82f6&color=fff&size=40`}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{result.name}</p>
                            <p className="text-sm text-gray-500">{result.phone || 'No phone'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Create New Button */}
                  <Button
                    variant="outline"
                    onClick={handleCreateNewUser}
                    className="w-full gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create New Tenant
                  </Button>
                </div>
              )}

              {/* Selected User Display */}
              {selectedUser && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=22c55e&color=fff&size=40`}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{selectedUser.name}</p>
                        <p className="text-sm text-gray-600">{selectedUser.phone || 'No phone'}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                      Change
                    </Button>
                  </div>
                </div>
              )}

              {/* New User Form */}
              {createNewUser && (
                <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">New Tenant Details</Label>
                    <Button variant="ghost" size="sm" onClick={() => setCreateNewUser(false)}>
                      Cancel
                    </Button>
                  </div>
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.newUserName}
                      onChange={(e) => updateForm('newUserName', e.target.value)}
                      placeholder="Enter tenant's full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      value={formData.newUserPhone}
                      onChange={(e) => updateForm('newUserPhone', e.target.value)}
                      placeholder="+255712345678"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email (Optional)</Label>
                    <Input
                      type="email"
                      value={formData.newUserEmail}
                      onChange={(e) => updateForm('newUserEmail', e.target.value)}
                      placeholder="tenant@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Lease Details - Show when tenant is selected */}
              {(selectedUser || createNewUser) && (
                <>
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Lease Details</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.leaseStartDate ? format(new Date(formData.leaseStartDate), 'PP') : 'Select'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.leaseStartDate ? new Date(formData.leaseStartDate) : undefined}
                              onSelect={(date) => date && updateForm('leaseStartDate', date.toISOString().split('T')[0])}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>End Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.leaseEndDate ? format(new Date(formData.leaseEndDate), 'PP') : 'Select'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.leaseEndDate ? new Date(formData.leaseEndDate) : undefined}
                              onSelect={(date) => date && updateForm('leaseEndDate', date.toISOString().split('T')[0])}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <Label>Monthly Rent (TZS) *</Label>
                        <Input
                          type="number"
                          value={formData.monthlyRent || ''}
                          onChange={(e) => updateForm('monthlyRent', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Security Deposit (TZS)</Label>
                        <Input
                          type="number"
                          value={formData.securityDeposit || ''}
                          onChange={(e) => updateForm('securityDeposit', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Emergency Contact (Optional)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={formData.emergencyContactName}
                          onChange={(e) => updateForm('emergencyContactName', e.target.value)}
                          placeholder="Contact name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={formData.emergencyContactPhone}
                          onChange={(e) => updateForm('emergencyContactPhone', e.target.value)}
                          placeholder="+255..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>Relationship</Label>
                      <Input
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => updateForm('emergencyContactRelationship', e.target.value)}
                        placeholder="e.g., Parent, Spouse, Sibling"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Move-in Notes */}
                  <div>
                    <Label>Move-in Notes (Optional)</Label>
                    <Textarea
                      value={formData.moveInNotes}
                      onChange={(e) => updateForm('moveInNotes', e.target.value)}
                      placeholder="Any notes about the property condition at move-in..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || (!selectedUser && !createNewUser) || (!unit && !selectedPropertyId)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Tenant'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddTenantModal;
