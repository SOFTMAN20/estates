/**
 * ADD TENANT MODAL - Multi-step form for adding new tenants
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
import { CalendarIcon, ChevronLeft, ChevronRight, Check, Home, User, FileText, DoorOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateTenant } from '@/hooks/useTenants';
import type { CreateTenantData } from '@/types/tenant';

interface AddTenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Array<{ id: string; title: string; address: string; city: string }>;
}

const steps = [
  { id: 1, title: 'Property', icon: Home },
  { id: 2, title: 'Tenant Info', icon: User },
  { id: 3, title: 'Lease Details', icon: FileText },
  { id: 4, title: 'Move-In', icon: DoorOpen },
];

export function AddTenantModal({ open, onOpenChange, properties }: AddTenantModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const createTenant = useCreateTenant();
  
  // Form state
  const [formData, setFormData] = useState<Partial<CreateTenantData>>({
    rent_due_day: 1,
    late_fee_grace_period: 5,
  });

  const updateForm = (field: keyof CreateTenantData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.property_id || !formData.lease_start_date || !formData.lease_end_date || !formData.monthly_rent) {
      return;
    }

    try {
      await createTenant.mutateAsync(formData as CreateTenantData);
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({ rent_due_day: 1, late_fee_grace_period: 5 });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.property_id;
      case 2:
        return !!(formData.tenant_name && formData.tenant_email);
      case 3:
        return !!(formData.lease_start_date && formData.lease_end_date && formData.monthly_rent);
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
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
        <div className="min-h-[300px]">
          {/* Step 1: Select Property */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Select Property *</Label>
                <Select value={formData.property_id} onValueChange={(v) => updateForm('property_id', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <div>
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.address}, {p.city}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {properties.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No approved properties found. Please add a property first.
                </p>
              )}
            </div>
          )}

          {/* Step 2: Tenant Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.tenant_name || ''}
                    onChange={(e) => updateForm('tenant_name', e.target.value)}
                    placeholder="John Mwangi"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.tenant_email || ''}
                    onChange={(e) => updateForm('tenant_email', e.target.value)}
                    placeholder="john@email.com"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={formData.tenant_phone || ''}
                  onChange={(e) => updateForm('tenant_phone', e.target.value)}
                  placeholder="+255 712 345 678"
                  className="mt-1"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Name</Label>
                    <Input
                      value={formData.emergency_contact_name || ''}
                      onChange={(e) => updateForm('emergency_contact_name', e.target.value)}
                      placeholder="Jane Mwangi"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      value={formData.emergency_contact_phone || ''}
                      onChange={(e) => updateForm('emergency_contact_phone', e.target.value)}
                      placeholder="+255 754 987 654"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <Label>Relationship</Label>
                  <Select 
                    value={formData.emergency_contact_relationship || ''} 
                    onValueChange={(v) => updateForm('emergency_contact_relationship', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Lease Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Lease Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.lease_start_date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.lease_start_date ? format(new Date(formData.lease_start_date), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.lease_start_date ? new Date(formData.lease_start_date) : undefined}
                        onSelect={(date) => updateForm('lease_start_date', date?.toISOString().split('T')[0])}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Lease End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.lease_end_date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.lease_end_date ? format(new Date(formData.lease_end_date), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.lease_end_date ? new Date(formData.lease_end_date) : undefined}
                        onSelect={(date) => updateForm('lease_end_date', date?.toISOString().split('T')[0])}
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
                    value={String(formData.rent_due_day || 1)} 
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
                    value={formData.late_fee_grace_period || 5}
                    onChange={(e) => updateForm('late_fee_grace_period', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Move-In Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Move-In Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !formData.move_in_date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.move_in_date ? format(new Date(formData.move_in_date), 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.move_in_date ? new Date(formData.move_in_date) : undefined}
                      onSelect={(date) => updateForm('move_in_date', date?.toISOString().split('T')[0])}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Move-In Condition Notes</Label>
                <Textarea
                  value={formData.move_in_condition_notes || ''}
                  onChange={(e) => updateForm('move_in_condition_notes', e.target.value)}
                  placeholder="Document the condition of the property at move-in..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Property:</span>
                    <span className="font-medium">{properties.find(p => p.id === formData.property_id)?.title || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tenant:</span>
                    <span className="font-medium">{formData.tenant_name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lease Period:</span>
                    <span className="font-medium">
                      {formData.lease_start_date && formData.lease_end_date 
                        ? `${format(new Date(formData.lease_start_date), 'MMM d, yyyy')} - ${format(new Date(formData.lease_end_date), 'MMM d, yyyy')}`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Rent:</span>
                    <span className="font-medium">TZS {formData.monthly_rent?.toLocaleString() || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Deposit:</span>
                    <span className="font-medium">TZS {formData.security_deposit?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
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
              disabled={createTenant.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {createTenant.isPending ? 'Adding...' : 'Add Tenant'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
