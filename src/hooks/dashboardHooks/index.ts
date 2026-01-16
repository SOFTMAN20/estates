/**
 * Dashboard Hooks Index
 * =====================
 * 
 * Central export point for all dashboard-related custom hooks.
 */

export { useDashboardProfile } from './useDashboardProfile';
export { useDashboardProperties } from './useDashboardProperties';
export { useDashboardUI } from './useDashboardUI';
export { useHostBookings } from './useHostBookings';
export { useRentalProperties } from './useRentalProperties';
export { useRentalUnits } from './useRentalUnits';

export type { ProfileFormData } from './useDashboardProfile';
export type { PropertyFormData, PropertyUnit } from './useDashboardProperties';
export type { UIState } from './useDashboardUI';
export type { HostBooking } from './useHostBookings';
export type { RentalProperty, RentalStats } from './useRentalProperties';
export type { RentalUnit, PropertyOption, UnitStats } from './useRentalUnits';
