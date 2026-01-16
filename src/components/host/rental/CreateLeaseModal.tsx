/**
 * CREATE LEASE MODAL - Create new lease agreements
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Check, FileText, User, DollarSign, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateLeaseAgreement, useTenants } from '@/hooks/useTenants';

interface CreateLeaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Array<{ id: string; title: string; address: string; city: string }>;
}

const steps = [
  { id: 1, title: 'Tenant', icon: User },
  { id: 2, title: 'Terms', icon: DollarSign },
  { id: 3, title: 'Details', icon: ScrollText },
  { id: 4, title: 'Review', icon: FileText },
];

const UTILITIES = [
  { id: 'water', label: 'Water' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'internet', label: 'Internet' },
  { id: 'gas', label: 'Gas' },
  { id: 'garbage', label: 'Garbage Collection' },
  { id: 'security', label: 'Security' },
];

export function CreateLeaseModal({ open, onOpenChange, properties }: CreateLeaseModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const createLease = useCreateLeaseAgreement();
  const { data: tenants = [] } = useTenants({ status: 'active' });
  
  // Form state
  const [formData, setFormData] = useState({
    tenant_id: '',
    property_id: '',
    agreement_type: 'standard',
    start_date: '',
    end_date: '',
    monthly_rent: 0,
    security_deposit: 0,
    rent_due_day: 1,
    late_fee_amount: 0,
    late_fee_grace_period: 5,
    terms_and_conditions: '',
    special_clauses: '',
    utilities_included: [] as string[],
    tenant_responsibilities: '',
    landlord_responsibilities: '',
  });

  const updateForm = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleUtility = (utilityId: string) => {
    setFormData(prev => ({
      ...prev,
      utilities_included: prev.utilities_included.includes(utilityId)
        ? prev.utilities_included.filter(u => u !== utilityId)
        : [...prev.utilities_included, utilityId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.tenant_id || !formData.start_date || !formData.end_date || !formData.monthly_rent) {
      return;
    }

    // Get property_id from selected tenant
    const selectedTenant = tenants.find(t => t.id === formData.tenant_id);
    
    try {
      await createLease.mutateAsync({
        ...formData,
        property_id: selectedTenant?.property_id || formData.property_id,
      });
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({
        tenant_id: '',
        property_id: '',
        agreement_type: 'standard',
        start_date: '',
        end_date: '',
        monthly_rent: 0,
        security_deposit: 0,
        rent_due_day: 1,
        late_fee_amount: 0,
        late_fee_grace_period: 5,
        terms_and_conditions: '',
        special_clauses: '',
        utilities_included: [],
        tenant_responsibilities: '',
        landlord_responsibilities: '',
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.tenant_id;
      case 2:
        return !!(formData.start_date && formData.end_date && formData.monthly_rent);
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const selectedTenant = tenants.find(t => t.id === formData.tenant_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Lease Agreement</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  currentStep > step.id 
                    ? "bg-green-500 border-green-500 text-white"
                    : currentStep === step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                )}>
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2",
                  currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[350px]">
          {/* Step 1: Select Tenant */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Select Tenant *</Label>
                <Select value={formData.tenant_id} onValueChange={(v) => updateForm('tenant_id', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map(tenant => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={tenant.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.user?.full_name || 'T')}&background=3b82f6&color=fff&size=24`}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{tenant.user?.full_name}</p>
                            <p className="text-xs text-gray-500">{tenant.property?.title}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tenants.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    No active tenants found. Add a tenant first.
                  </p>
                )}
              </div>

              <div>
                <Label>Agreement Type *</Label>
                <Select value={formData.agreement_type} onValueChange={(v) => updateForm('agreement_type', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Lease</SelectItem>
                    <SelectItem value="month-to-month">Month-to-Month</SelectItem>
                    <SelectItem value="fixed-term">Fixed Term</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTenant && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Tenant</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedTenant.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTenant.user?.full_name || 'T')}&background=3b82f6&color=fff`}
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedTenant.user?.full_name}</p>
                      <p className="text-sm text-gray-600">{selectedTenant.property?.title}</p>
                      <p className="text-sm text-gray-500">{selectedTenant.user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Lease Terms */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.start_date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? format(new Date(formData.start_date), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.start_date ? new Date(formData.start_date) : undefined}
                        onSelect={(date) => updateForm('start_date', date?.toISOString().split('T')[0])}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.end_date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? format(new Date(formData.end_date), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.end_date ? new Date(formData.end_date) : undefined}
                        onSelect={(date) => updateForm('end_date', date?.toISOString().split('T')[0])}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monthly Rent (TZS) *</Label>
                  <Input
                    type="number"
                    value={formData.monthly_rent || ''}
                    onChange={(e) => updateForm('monthly_rent', parseFloat(e.target.value))}
                    placeholder="500000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Security Deposit (TZS)</Label>
                  <Input
                    type="number"
                    value={formData.security_deposit || ''}
                    onChange={(e) => updateForm('security_deposit', parseFloat(e.target.value))}
                    placeholder="1000000"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Rent Due Day</Label>
                  <Select 
                    value={String(formData.rent_due_day)} 
                    onValueChange={(v) => updateForm('rent_due_day', parseInt(v))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Late Fee (TZS)</Label>
                  <Input
                    type="number"
                    value={formData.late_fee_amount || ''}
                    onChange={(e) => updateForm('late_fee_amount', parseFloat(e.target.value))}
                    placeholder="50000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Grace Period (days)</Label>
                  <Input
                    type="number"
                    value={formData.late_fee_grace_period}
                    onChange={(e) => updateForm('late_fee_grace_period', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {/* Utilities Included */}
              <div>
                <Label className="mb-2 block">Utilities Included</Label>
                <div className="grid grid-cols-2 gap-2">
                  {UTILITIES.map(utility => (
                    <div key={utility.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={utility.id}
                        checked={formData.utilities_included.includes(utility.id)}
                        onCheckedChange={() => toggleUtility(utility.id)}
                      />
                      <label htmlFor={utility.id} className="text-sm cursor-pointer">
                        {utility.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Terms and Conditions</Label>
                <Textarea
                  value={formData.terms_and_conditions}
                  onChange={(e) => updateForm('terms_and_conditions', e.target.value)}
                  placeholder="Enter the main terms and conditions of the lease..."
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label>Special Clauses</Label>
                <Textarea
                  value={formData.special_clauses}
                  onChange={(e) => updateForm('special_clauses', e.target.value)}
                  placeholder="Any special clauses or agreements..."
                  className="mt-1 min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tenant Responsibilities</Label>
                  <Textarea
                    value={formData.tenant_responsibilities}
                    onChange={(e) => updateForm('tenant_responsibilities', e.target.value)}
                    placeholder="e.g., Maintain cleanliness, report damages..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>
                <div>
                  <Label>Landlord Responsibilities</Label>
                  <Textarea
                    value={formData.landlord_responsibilities}
                    onChange={(e) => updateForm('landlord_responsibilities', e.target.value)}
                    placeholder="e.g., Major repairs, structural maintenance..."
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Lease Summary</h4>
                
                {/* Tenant Info */}
                {selectedTenant && (
                  <div className="flex items-center gap-3 pb-3 border-b mb-3">
                    <img
                      src={selectedTenant.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTenant.user?.full_name || 'T')}&background=3b82f6&color=fff`}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{selectedTenant.user?.full_name}</p>
                      <p className="text-sm text-gray-500">{selectedTenant.property?.title}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Agreement Type</p>
                    <p className="font-medium capitalize">{formData.agreement_type.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">
                      {formData.start_date && formData.end_date 
                        ? `${format(new Date(formData.start_date), 'MMM d, yyyy')} - ${format(new Date(formData.end_date), 'MMM d, yyyy')}`
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monthly Rent</p>
                    <p className="font-medium">TZS {formData.monthly_rent?.toLocaleString() || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Security Deposit</p>
                    <p className="font-medium">TZS {formData.security_deposit?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rent Due Day</p>
                    <p className="font-medium">{formData.rent_due_day}th of each month</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Late Fee</p>
                    <p className="font-medium">
                      TZS {formData.late_fee_amount?.toLocaleString() || '0'} (after {formData.late_fee_grace_period} days)
                    </p>
                  </div>
                </div>

                {formData.utilities_included.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-gray-500 text-sm mb-1">Utilities Included</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.utilities_included.map(u => (
                        <span key={u} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs capitalize">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500">
                By creating this lease, a draft agreement will be generated. You can then sign it and send it to the tenant for their signature.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createLease.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createLease.isPending ? 'Creating...' : 'Create Lease'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
