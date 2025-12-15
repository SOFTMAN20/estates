/**
 * Payment Types
 * =============
 * Type definitions for payment processing and management
 */

import type { Tables } from '@/lib/integrations/supabase/types';

// Base payment type from database
export type Payment = Tables<'payments'>;

// Payment method types
export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer';

// Payment status types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Payment creation input
export interface CreatePaymentInput {
  booking_id: string;
  amount: number;
  payment_method: PaymentMethod;
  phone_number?: string; // Required for M-Pesa
  transaction_id?: string;
}

// Payment update input
export interface UpdatePaymentInput {
  status?: PaymentStatus;
  transaction_id?: string;
  payment_provider_response?: Record<string, any>;
}

// M-Pesa specific types
export interface MPesaPaymentRequest {
  phone_number: string;
  amount: number;
  account_reference: string; // booking_id
  transaction_desc: string;
}

export interface MPesaCallbackResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata?: {
    Item: Array<{
      Name: string;
      Value: string | number;
    }>;
  };
}

// Card payment types
export interface CardPaymentRequest {
  amount: number;
  currency: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  cardholder_name: string;
}

// Bank transfer types
export interface BankTransferRequest {
  amount: number;
  account_number: string;
  bank_name: string;
  account_name: string;
  reference: string;
}

// Payment with related data
export interface PaymentWithBooking extends Payment {
  booking?: {
    id: string;
    property_id: string;
    guest_id: string;
    check_in: string;
    check_out: string;
    total_amount: number;
    status: string;
    property?: {
      id: string;
      title: string;
      host_id: string;
    };
    guest?: {
      id: string;
      full_name: string;
      email: string;
    };
  };
}

// Payment filters for queries
export interface PaymentFilters {
  status?: PaymentStatus;
  payment_method?: PaymentMethod;
  booking_id?: string;
  date_from?: string;
  date_to?: string;
}

// Payment statistics
export interface PaymentStats {
  total_payments: number;
  total_amount: number;
  completed_payments: number;
  pending_payments: number;
  failed_payments: number;
  refunded_payments: number;
  by_method: {
    mpesa: number;
    card: number;
    bank_transfer: number;
  };
}
