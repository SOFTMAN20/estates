/**
 * ADMIN TYPES
 * ===========
 * 
 * Type definitions for admin dashboard, analytics, and management features
 */

import type { Tables } from '@/lib/integrations/supabase/types';

/**
 * Dashboard Statistics
 */
export interface DashboardStats {
  totalUsers: number;
  userGrowth: number;
  regularUsers: number;
  adminUsers: number;
  
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  newPropertiesThisMonth: number;
  
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  bookingsThisMonth: number;
  
  totalRevenue: number;
  platformCommission: number;
  revenueThisMonth: number;
  revenueGrowth: number;
}

/**
 * Revenue Data Point
 */
export interface RevenueDataPoint {
  month: string;
  revenue: number;
  commission: number;
}

/**
 * User Growth Data Point
 */
export interface UserGrowthDataPoint {
  month: string;
  users: number;
  hosts: number;
}

/**
 * Booking Trend Data Point
 */
export interface BookingTrendDataPoint {
  month: string;
  bookings: number;
  revenue: number;
}

/**
 * Property Type Distribution
 */
export interface PropertyTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

/**
 * Recent Activity Item
 */
export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'property_submission' | 'booking_completed' | 'payment';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Admin Activity Log Entry
 */
export interface AdminActivityLog {
  id: string;
  admin_id: string;
  action_type: 'approve_property' | 'reject_property' | 'suspend_user' | 'activate_user' | 'update_settings' | 'cancel_booking' | 'process_refund';
  target_id?: string;
  target_type?: 'property' | 'user' | 'booking' | 'payment' | 'settings';
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
  admin?: {
    name: string;
    email: string;
  };
}

/**
 * Property Approval Data
 */
export interface PropertyApprovalData {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  host: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    total_properties: number;
    member_since: string;
  };
}

/**
 * User Management Data
 */
export interface UserManagementData {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  is_host: boolean;
  is_suspended: boolean;
  properties_count: number;
  bookings_count: number;
  total_spent: number;
  total_earned: number;
  created_at: string;
}

/**
 * Booking Management Data
 */
export interface BookingManagementData {
  id: string;
  property_id: string;
  property_title: string;
  guest_id: string;
  guest_name: string;
  host_id: string;
  host_name: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

/**
 * Payment Management Data
 */
export interface PaymentManagementData {
  id: string;
  booking_id: string;
  transaction_id: string;
  amount: number;
  platform_fee: number;
  payment_method: 'mpesa' | 'card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  guest_name: string;
  host_name: string;
  created_at: string;
}

/**
 * Platform Settings
 */
export interface PlatformSettings {
  commission_rate: number;
  min_booking_duration: number;
  max_advance_booking: number;
  currency: string;
  mpesa_enabled: boolean;
  card_payment_enabled: boolean;
  bank_transfer_enabled: boolean;
  mpesa_business_shortcode?: string;
  mpesa_passkey?: string;
  auto_approve_properties: boolean;
  auto_approve_days?: number;
  auto_approve_verified_hosts: boolean;
  maintenance_mode: boolean;
  maintenance_message?: string;
}

/**
 * Report Type
 */
export type ReportType = 'financial' | 'user_activity' | 'property_performance' | 'booking_summary' | 'platform_analytics';

/**
 * Report Date Range
 */
export type ReportDateRange = 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_6_months' | 'last_year' | 'custom';

/**
 * Report Export Format
 */
export type ReportExportFormat = 'pdf' | 'xlsx' | 'csv';

/**
 * Report Generation Request
 */
export interface ReportGenerationRequest {
  type: ReportType;
  dateRange: ReportDateRange;
  startDate?: string;
  endDate?: string;
  format: ReportExportFormat;
}

/**
 * Generated Report
 */
export interface GeneratedReport {
  id: string;
  type: ReportType;
  date_range: string;
  format: ReportExportFormat;
  file_url: string;
  generated_at: string;
  generated_by: string;
}

/**
 * Platform Health Metrics
 */
export interface PlatformHealthMetrics {
  active_listings: number;
  occupancy_rate: number;
  average_response_time: number;
  uptime_percentage: number;
  error_count_30_days: number;
  user_satisfaction_score: number;
}

/**
 * Top Property
 */
export interface TopProperty {
  id: string;
  title: string;
  location: string;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  views: number;
}

/**
 * Admin Filter Options
 */
export interface AdminFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  role?: string;
  propertyType?: string;
  paymentMethod?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
