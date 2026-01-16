/**
 * CREATE MAINTENANCE REQUEST MODAL
 */

import React, { useState, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Wrench, Upload, X, Image as ImageIcon, AlertTriangle,
  Droplets, Zap, Wind, Microwave, Building, Bug
} from 'lucide-react';
import { useCreateMaintenanceRequest } from '@/hooks/useMaintenance';
import { useLandlordProperties, useTenants } from '@/hooks/useTenants';
import { supabase } from '@/lib/integrations/supabase/client';
import type { MaintenanceCategory, MaintenancePriority, Tenant } from '@/types/tenant';

interface CreateMaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES: { value: MaintenanceCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'plumbing', label: 'Plumbing', icon: <Droplets className="h-4 w-4" /> },
  { value: 'electrical', label: 'Electrical', icon: <Zap className="h-4 w-4" /> },
  { value: 'hvac', label: 'HVAC / AC', icon: <Wind className="h-4 w-4" /> },
  { value: 'appliance', label: 'Appliance', icon: <Microwave className="h-4 w-4" /> },
  { value: 'structural', label: 'Structural', icon: <Building className="h-4 w-4" /> },
  { value: 'pest_control', label: 'Pest Control', icon: <Bug className="h-4 w-4" /> },
  { value: 'other', label: 'Other', icon: <Wrench className="h-4 w-4" /> },
];

const PRIORITIES: { value: MaintenancePriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-700' },
];

export function CreateMaintenanceModal({ open, onOpenChange }: CreateMaintenanceModalProps) {
  const createRequest = useCreateMaintenanceRequest();
  const { data: properties = [] } = useLandlordProperties();
  const { data: allTenants = [] } = useTenants({ status: 'active' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [propertyId, setPropertyId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaintenanceCategory>('other');
  const [priority, setPriority] = useState<MaintenancePriority>('medium');
  const [locationInProperty, setLocationInProperty] = useState('');
  const [tenantAvailableTimes, setTenantAvailableTimes] = useState('');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Filter tenants by selected property
  const propertyTenants = allTenants.filter(t => t.property_id === propertyId);

  const resetForm = () => {
    setPropertyId('');
    setTenantId('');
    setTitle('');
    setDescription('');
    setCategory('other');
    setPriority('medium');
    setLocationInProperty('');
    setTenantAvailableTimes('');
    setAccessInstructions('');
    setImages([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `maintenance/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!propertyId || !title || !description) return;

    try {
      await createRequest.mutateAsync({
        property_id: propertyId,
        tenant_id: tenantId || undefined,
        title,
        description,
        category,
        priority,
        location_in_property: locationInProperty || undefined,
        images: images.length > 0 ? images : undefined,
        tenant_available_times: tenantAvailableTimes || undefined,
        access_instructions: accessInstructions || undefined,
      });
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Create Maintenance Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Selection */}
          <div>
            <Label>Property *</Label>
            <Select value={propertyId} onValueChange={(v) => { setPropertyId(v); setTenantId(''); }}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tenant Selection (optional) */}
          {propertyId && propertyTenants.length > 0 && (
            <div>
              <Label>Reported By (Tenant)</Label>
              <Select value={tenantId} onValueChange={setTenantId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select tenant (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No tenant selected</SelectItem>
                  {propertyTenants.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.user?.full_name || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div>
            <Label>Issue Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Water heater not working"
              className="mt-1"
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    category === cat.value 
                      ? 'bg-blue-50 border-blue-300 text-blue-700' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {cat.icon}
                    <span className="text-xs">{cat.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <Label>Priority *</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`p-2 rounded-lg border text-center text-sm transition-colors ${
                    priority === p.value 
                      ? `${p.color} border-current` 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {priority === 'emergency' && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Emergency requests require immediate attention
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Location in Property */}
          <div>
            <Label>Location in Property</Label>
            <Input
              value={locationInProperty}
              onChange={(e) => setLocationInProperty(e.target.value)}
              placeholder="e.g., Master bedroom, Kitchen, Bathroom"
              className="mt-1"
            />
          </div>

          {/* Images */}
          <div>
            <Label>Photos</Label>
            <div className="mt-1">
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full gap-2"
              >
                {uploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Photos
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Upload photos of the issue to help with diagnosis
              </p>
            </div>
          </div>

          {/* Tenant Available Times */}
          <div>
            <Label>Tenant Available Times</Label>
            <Textarea
              value={tenantAvailableTimes}
              onChange={(e) => setTenantAvailableTimes(e.target.value)}
              placeholder="e.g., Weekdays after 5pm, Saturdays 9am-12pm"
              className="mt-1"
              rows={2}
            />
          </div>

          {/* Access Instructions */}
          <div>
            <Label>Access Instructions</Label>
            <Textarea
              value={accessInstructions}
              onChange={(e) => setAccessInstructions(e.target.value)}
              placeholder="e.g., Key under mat, call before arriving, gate code: 1234"
              className="mt-1"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!propertyId || !title || !description || createRequest.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createRequest.isPending ? 'Creating...' : 'Create Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
