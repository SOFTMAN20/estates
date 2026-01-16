/**
 * TENANT TYPES
 * ============
 * Type definitions for tenant management system
 */

export type TenantStatus = 'active' | 'ended' | 'evicted';
export type LeaseAgreementType = 'standard' | 'month-to-month' | 'fixed-term';
export type LeaseStatus = 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
export type RentPaymentStatus = 'pending' | 'paid' | 'partial' | 'late' | 'waived';
export type PaymentMethod = 'mpesa' | 'bank_transfer' | 'cash' | 'card';

export interface Tenant {
  id: string;
  property_id: string;
  user_id: string;
  landlord_id: string;
  
  // Emergency Contact
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  
  // Lease Information
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  security_deposit: number;
  
  // Status
  status: TenantStatus;
  is_late_on_rent: boolean;
  
  // Move-in/Move-out
  move_in_date: string | null;
  move_out_date: string | null;
  move_in_condition_notes: string | null;
  move_out_condition_notes: string | null;
  move_in_photos: string[];
  move_out_photos: string[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  property?: {
    id: string;
    title: string;
    address: string;
    city: string;
    image_urls: string[];
  };
}

export interface LeaseAgreement {
  id: string;
  tenant_id: string;
  property_id: string;
  landlord_id: string;
  
  // Agreement Details
  agreement_type: LeaseAgreementType;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  
  // Terms
  terms_and_conditions: string | null;
  special_clauses: string | null;
  utilities_included: string[];
  tenant_responsibilities: string | null;
  landlord_responsibilities: string | null;
  
  // Payment Terms
  rent_due_day: number;
  late_fee_amount: number;
  late_fee_grace_period: number;
  
  // Signatures
  landlord_signed: boolean;
  landlord_signature_date: string | null;
  tenant_signed: boolean;
  tenant_signature_date: string | null;
  
  // Documents
  document_url: string | null;
  
  // Status
  status: LeaseStatus;
  
  created_at: string;
  updated_at: string;
}

export interface RentPayment {
  id: string;
  tenant_id: string;
  property_id: string;
  landlord_id: string;
  
  // Payment Details
  payment_month: string;
  amount_due: number;
  amount_paid: number;
  late_fee: number;
  
  // Payment Information
  payment_method: PaymentMethod | null;
  transaction_id: string | null;
  payment_date: string | null;
  
  // Status
  status: RentPaymentStatus;
  is_late: boolean;
  
  // Due Date
  due_date: string;
  
  // Notes
  notes: string | null;
  receipt_url: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  tenant?: Tenant;
}


// Form types for creating/updating
export interface CreateTenantData {
  property_id: string;
  user_id?: string; // If existing user
  
  // New user info (if not existing)
  tenant_email?: string;
  tenant_name?: string;
  tenant_phone?: string;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  
  // Lease Information
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  security_deposit?: number;
  
  // Move-in Details
  move_in_date?: string;
  move_in_condition_notes?: string;
  move_in_photos?: string[];
  
  // Lease Terms
  rent_due_day?: number;
  late_fee_amount?: number;
  late_fee_grace_period?: number;
}

export interface UpdateTenantData {
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  monthly_rent?: number;
  security_deposit?: number;
  lease_end_date?: string;
  status?: TenantStatus;
  move_out_date?: string;
  move_out_condition_notes?: string;
  move_out_photos?: string[];
}

export interface RecordPaymentData {
  tenant_id: string;
  payment_month: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  transaction_id?: string;
  payment_date?: string;
  notes?: string;
  late_fee?: number;
}

export interface EndTenancyData {
  tenant_id: string;
  move_out_date: string;
  move_out_condition_notes?: string;
  move_out_photos?: string[];
  security_deposit_return?: number;
  final_notes?: string;
}

export interface TenantStats {
  total_tenants: number;
  active_tenants: number;
  total_monthly_rent: number;
  on_time_payment_rate: number;
  late_payments_count: number;
}

export interface TenantFilters {
  status?: TenantStatus | 'all';
  property_id?: string;
  payment_status?: 'paid' | 'pending' | 'overdue' | 'all';
  search?: string;
}


// ============================================
// MAINTENANCE TYPES
// ============================================

export type MaintenanceCategory = 
  | 'plumbing' 
  | 'electrical' 
  | 'hvac' 
  | 'appliance' 
  | 'structural' 
  | 'pest_control' 
  | 'other';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';

export type MaintenanceStatus = 
  | 'pending' 
  | 'assigned' 
  | 'scheduled' 
  | 'in_progress' 
  | 'pending_parts' 
  | 'completed' 
  | 'cancelled';

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  tenant_id: string | null;
  landlord_id: string;
  
  // Request Details
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  
  // Location
  location_in_property: string | null;
  
  // Images
  images: string[];
  
  // Assignment
  assigned_to: string | null;
  assigned_contact: string | null;
  
  // Scheduling
  scheduled_date: string | null;
  tenant_available_times: string | null;
  access_instructions: string | null;
  
  // Costs
  estimated_cost: number | null;
  actual_cost: number | null;
  
  // Resolution
  resolution_notes: string | null;
  completed_at: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  tenant?: Tenant;
  property?: {
    id: string;
    title: string;
    address: string;
    city: string;
    image_urls: string[];
  };
}

export interface MaintenanceComment {
  id: string;
  maintenance_id: string;
  user_id: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
  user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateMaintenanceData {
  property_id: string;
  tenant_id?: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  location_in_property?: string;
  images?: string[];
  tenant_available_times?: string;
  access_instructions?: string;
}

export interface UpdateMaintenanceData {
  title?: string;
  description?: string;
  category?: MaintenanceCategory;
  priority?: MaintenancePriority;
  status?: MaintenanceStatus;
  location_in_property?: string;
  images?: string[];
  assigned_to?: string;
  assigned_contact?: string;
  scheduled_date?: string;
  tenant_available_times?: string;
  access_instructions?: string;
  estimated_cost?: number;
  actual_cost?: number;
  resolution_notes?: string;
}

export interface MaintenanceStats {
  total: number;
  pending: number;
  in_progress: number;
  scheduled: number;
  pending_parts: number;
  completed: number;
  high_priority: number;
  emergency: number;
}

export interface MaintenanceFilters {
  status?: MaintenanceStatus | 'all';
  priority?: MaintenancePriority | 'all';
  category?: MaintenanceCategory | 'all';
  property_id?: string;
  tenant_id?: string;
}
