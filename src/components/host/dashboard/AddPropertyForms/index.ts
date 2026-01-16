/**
 * Add Property Forms Index
 * =========================
 * 
 * Central export point for all property form components.
 * Makes imports cleaner and more maintainable.
 * 
 * @example
 * ```tsx
 * import { PropertyForm, ImageUpload, PriceInput } from '@/components/host/dashboard/AddPropertyForms';
 * ```
 */

// Main Form Component
export { default as PropertyForm } from './PropertyForm';

// Upload Components
export { default as ImageUpload } from './ImageUpload';

// Input Components
export { PriceInput, type PricePeriod } from './property_formInput/PriceInput';
export { RoomCounter } from './property_formInput/RoomCounter';

// Selector Components
export { PropertyTypeSelector, type PropertyType } from './property_formInput/PropertyTypeSelector';
export { AmenitiesSelector, type AmenityKey } from './property_formInput/AmenitiesSelector';

// Form Steps (re-export from propertyFormSteps/index.ts)
export {
  Step1BasicInfo,
  Step2PropertyAddress,
  Step3PropertyDetails,
  Step4PhotoUpload,
  Step5ContactInfo,
  Step6UnitsRooms,
  StepNavigation,
  FormNavigationButtons,
  type PropertyUnit
} from './propertyFormSteps';
