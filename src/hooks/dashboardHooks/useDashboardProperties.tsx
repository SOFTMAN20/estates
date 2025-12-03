/**
 * useDashboardProperties.tsx - Property Management Hook
 * =====================================================
 * 
 * Custom hook for managing property CRUD operations in the dashboard.
 * Handles property fetching, creation, updating, and deletion.
 */

import { useState } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import type { Tables } from '@/lib/integrations/supabase/types';
import type { User } from '@supabase/supabase-js';
import type { PropertyFormData as BasePropertyFormData } from '@/types/property';

type Property = Tables<'properties'>;
type Profile = Tables<'profiles'>;

// Extend the base PropertyFormData with dashboard-specific fields
export interface PropertyFormData extends BasePropertyFormData {
  price_period: string;
  square_meters: string;
}

interface UseDashboardPropertiesReturn {
  properties: Property[];
  formData: PropertyFormData;
  editingProperty: Property | null;
  submitting: boolean;
  setProperties: (properties: Property[]) => void;
  setFormData: (data: PropertyFormData) => void;
  setEditingProperty: (property: Property | null) => void;
  setSubmitting: (submitting: boolean) => void;
  fetchProperties: (user: User) => Promise<void>;
  handlePropertySubmit: (
    e: React.FormEvent,
    user: User,
    editingProperty: Property | null,
    onSuccess: () => void,
    onError: (message: string) => void
  ) => Promise<void>;
  handleEditProperty: (property: Property, profile: Profile | null) => Promise<void>;
  handleDeleteProperty: (id: string, onSuccess: () => void, onError: () => void) => Promise<void>;
  handleInputChange: (field: keyof PropertyFormData, value: unknown) => void;
  handleServiceToggle: (service: string) => void;
  handleAmenityToggle: (amenity: string) => void;
  resetForm: (profile: Profile | null) => void;
  validateFormData: () => { isValid: boolean; errors: string[] };
}

export const useDashboardProperties = (): UseDashboardPropertiesReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    price_period: 'per_month',
    location: '',
    full_address: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    square_meters: '',
    contact_phone: '',
    contact_whatsapp_phone: '',
    amenities: [],
    nearby_services: [],
    images: []
  });

  const fetchProperties = async (user: User): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data as Property[]) || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  };

  const validateFormData = () => {
    const errors: string[] = [];
    
    // Required field validation
    if (!formData.title?.trim() || formData.title.trim().length < 5) {
      errors.push('Jina la nyumba lazima liwe na angalau herufi 5');
    }
    if (!formData.description?.trim() || formData.description.trim().length < 10) {
      errors.push('Maelezo ya nyumba lazima yawe na angalau herufi 10');
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.push('Bei ya nyumba lazima iwe zaidi ya 0');
    }
    if (!formData.location?.trim() || formData.location.trim().length < 2) {
      errors.push('Eneo la nyumba lazima liwe na angalau herufi 2');
    }
    // Phone number validation - must start with country code
    if (!formData.contact_phone?.trim()) {
      errors.push('Nambari ya simu ni lazima');
    } else {
      const phone = formData.contact_phone.trim();
      // Check if starts with + (country code)
      if (!phone.startsWith('+')) {
        errors.push('Nambari ya simu lazima ianze na country code (mfano: +255)');
      } else if (phone.startsWith('+255') && phone.length < 13) {
        // Tanzania number should be +255 followed by 9 digits (total 13 characters)
        errors.push('Nambari ya simu ya Tanzania lazima iwe +255 na nambari 9 (mfano: +255712345678)');
      } else if (phone.length < 10) {
        errors.push('Nambari ya simu si sahihi');
      }
    }
    
    // WhatsApp phone validation (optional but must be valid if provided)
    if (formData.contact_whatsapp_phone?.trim()) {
      const whatsapp = formData.contact_whatsapp_phone.trim();
      if (!whatsapp.startsWith('+')) {
        errors.push('Nambari ya WhatsApp lazima ianze na country code (mfano: +255)');
      } else if (whatsapp.startsWith('+255') && whatsapp.length < 13) {
        errors.push('Nambari ya WhatsApp ya Tanzania lazima iwe +255 na nambari 9');
      }
    }
    
    // Property type validation
    const allowedTypes = ['Apartment', 'House', 'Studio', 'Shared Room', 'Bedsitter', 'Lodge', 'Hotel', 'Office'];
    if (!formData.property_type?.trim()) {
      errors.push('Chagua aina ya nyumba');
    } else if (!allowedTypes.includes(formData.property_type)) {
      errors.push('Aina ya nyumba si sahihi');
    }
    
    // Images validation
    if (!formData.images || formData.images.length < 3) {
      errors.push('Ongeza angalau picha 3 za nyumba');
    }
    
    // Bathrooms validation
    if (formData.bathrooms && parseInt(formData.bathrooms) < 1) {
      errors.push('Idadi ya vyoo lazima iwe angalau 1');
    }
    
    // Bedrooms validation
    if (formData.bedrooms && parseInt(formData.bedrooms) < 0) {
      errors.push('Idadi ya vyumba vya kulala lazima iwe 0 au zaidi');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const buildPropertyData = (user: User) => {
    return {
      host_id: user.id,
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      price: parseFloat(formData.price) || 0,
      price_period: formData.price_period || 'per_month',
      location: formData.location?.trim(),
      property_type: formData.property_type?.trim() || null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 1,
      square_meters: formData.square_meters ? parseInt(formData.square_meters) : null,
      contact_phone: formData.contact_phone?.trim() || null,
      contact_whatsapp_phone: formData.contact_whatsapp_phone?.trim() || null,
      amenities: formData.amenities || [],
      nearby_services: formData.nearby_services || [],
      images: formData.images || []
    };
  };

  const handlePropertySubmit = async (
    e: React.FormEvent,
    user: User,
    editingProperty: Property | null,
    onSuccess: () => void,
    onError: (message: string) => void
  ): Promise<void> => {
    e.preventDefault();
    
    if (!user) {
      onError('Lazima uingie kwanza kabla ya kuongeza nyumba');
      return;
    }

    try {
      setSubmitting(true);
      
      // Verify session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        onError('Hujaingia kikamilifu. Tafadhali ingia tena.');
        return;
      }
      
      // Validate form
      const validationResult = validateFormData();
      if (!validationResult.isValid) {
        onError(validationResult.errors[0] || 'Tafadhali jaza taarifa zote za lazima');
        return;
      }
      
      const propertyData = buildPropertyData(user);
      
      // Create authenticated client
      const { createClient } = await import('@supabase/supabase-js');
      const authenticatedClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        }
      );
      
      let propertyId: string;
      
      if (editingProperty) {
        // Update existing property
        const { error } = await authenticatedClient
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id)
          .select();

        if (error) {
          if (error.message.includes('row-level security')) {
            throw new Error('Huna ruhusa ya kusasisha nyumba hii.');
          }
          throw new Error(`Hitilafu ya database: ${error.message}`);
        }
        propertyId = editingProperty.id;
      } else {
        // Create new property
        const { data, error } = await authenticatedClient
          .from('properties')
          .insert([propertyData])
          .select();

        if (error) {
          if (error.message.includes('row-level security')) {
            throw new Error('Huna ruhusa ya kuongeza nyumba.');
          } else if (error.code === '23514') {
            throw new Error('Taarifa ulizojaza hazikidhi mahitaji ya database.');
          }
          throw new Error(`Hitilafu ya database: ${error.message}`);
        }
        propertyId = data[0].id;
      }
      
      // Parse and save address details to property_addresses table
      if (formData.full_address) {
        const addressLines = formData.full_address.split('\n');
        const addressData = {
          property_id: propertyId,
          full_address: formData.full_address,
          street: addressLines[0]?.trim() || null,
          city: addressLines[2]?.trim() || null,
          region: addressLines[3]?.trim() || null,
          postal_code: addressLines[4]?.trim() || null,
          country: 'Tanzania'
        };
        
        // Check if address already exists
        const { data: existingAddress } = await authenticatedClient
          .from('property_addresses')
          .select('id')
          .eq('property_id', propertyId)
          .single();
        
        if (existingAddress) {
          // Update existing address
          const { error: addressError } = await authenticatedClient
            .from('property_addresses')
            .update(addressData)
            .eq('property_id', propertyId);
          
          if (addressError) {
            console.error('Error updating property address:', addressError);
          }
        } else {
          // Insert new address
          const { error: addressError } = await authenticatedClient
            .from('property_addresses')
            .insert([addressData]);
          
          if (addressError) {
            console.error('Error inserting property address:', addressError);
          }
        }
      }
      
      // Clear saved form data
      localStorage.removeItem('nyumba_link_property_form_data');
      localStorage.removeItem('nyumba_link_property_form_step');
      
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Imeshindikana kuongeza nyumba yako.';
      onError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProperty = async (property: Property, profile: Profile | null): Promise<void> => {
    setEditingProperty(property);
    
    // Fetch address from property_addresses table
    let fullAddress = '';
    try {
      const { data: addressData } = await supabase
        .from('property_addresses')
        .select('full_address')
        .eq('property_id', property.id)
        .single();
      
      if (addressData) {
        fullAddress = addressData.full_address || '';
      }
    } catch (error) {
      console.error('Error fetching property address:', error);
    }
    
    setFormData({
      title: property.title || '',
      description: property.description || '',
      price: property.price?.toString() || '',
      price_period: property.price_period || 'per_month',
      location: property.location || '',
      full_address: fullAddress,
      property_type: property.property_type || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      area_sqm: property.square_meters?.toString() || '',
      square_meters: property.square_meters?.toString() || '',
      contact_phone: property.contact_phone || profile?.phone || '',
      contact_whatsapp_phone: property.contact_whatsapp_phone || profile?.phone || '',
      amenities: property.amenities || [],
      nearby_services: property.nearby_services || [],
      images: property.images || []
    });
  };

  const handleDeleteProperty = async (
    id: string,
    onSuccess: () => void,
    onError: () => void
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error deleting property:', error);
      onError();
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: unknown): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string): void => {
    setFormData(prev => ({
      ...prev,
      nearby_services: prev.nearby_services.includes(service)
        ? prev.nearby_services.filter(s => s !== service)
        : [...prev.nearby_services, service]
    }));
  };

  const handleAmenityToggle = (amenity: string): void => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetForm = (profile: Profile | null): void => {
    setFormData({
      title: '',
      description: '',
      price: '',
      price_period: 'per_month',
      location: '',
      full_address: '',
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      area_sqm: '',
      square_meters: '',
      contact_phone: profile?.phone || '',
      contact_whatsapp_phone: profile?.phone || '',
      amenities: [],
      nearby_services: [],
      images: []
    });
  };

  return {
    properties,
    formData,
    editingProperty,
    submitting,
    setProperties,
    setFormData,
    setEditingProperty,
    setSubmitting,
    fetchProperties,
    handlePropertySubmit,
    handleEditProperty,
    handleDeleteProperty,
    handleInputChange,
    handleServiceToggle,
    handleAmenityToggle,
    resetForm,
    validateFormData
  };
};
