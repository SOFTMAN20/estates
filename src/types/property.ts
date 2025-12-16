/**
 * PROPERTY TYPES
 * ==============
 * 
 * Type definitions for properties, listings, and property-related data
 */

import type { Tables } from '@/lib/integrations/supabase/types';

/**
 * Property Type (Legacy)
 * Basic property interface
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  landlord_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Extended Property Type
 * Property with profile/host information
 */
export type ExtendedProperty = Tables<'properties'> & {
  profiles?: {
    id?: string;
    name: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string | null;
  };
};

/**
 * Property Form Data
 * Form data structure for creating/editing properties
 */
export interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  full_address: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  area_sqm: string;
  contact_phone: string;
  contact_whatsapp_phone: string;
  amenities: string[];
  nearby_services: string[];
  images: string[];
}

/**
 * Property Status Enum
 */
export enum PropertyStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

/**
 * Property Type Enum
 */
export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  STUDIO = 'studio',
  ROOM = 'room',
  COMMERCIAL = 'commercial',
  LAND = 'land'
}

/**
 * Property Filters
 * Filter criteria for property search
 */
export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  status?: PropertyStatus;
}

/**
 * Property Card Props
 * Props for PropertyCard component
 */
export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  phone?: string;
  contactPhone?: string;
  contactWhatsappPhone?: string;
  bedrooms?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  viewMode?: 'grid' | 'list';
}
