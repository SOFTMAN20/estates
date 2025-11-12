/**
 * PropertyTypeSelector.tsx - Reusable Property Type Selector
 * ==========================================================
 * 
 * A modular component for selecting property types with visual cards.
 * Uses shadcn/ui components and Lucide React icons.
 * 
 * Features:
 * - Visual card-based selection
 * - Icon representation for each type
 * - Hover and active states
 * - Accessible and responsive
 * - Customizable property types
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Home, Building, Bed, Users, Briefcase, LucideIcon } from 'lucide-react';
import { cn } from '@/utils/utils';

export type PropertyType = 'Apartment' | 'House' | 'Shared Room' | 'Studio' | 'Bedsitter';

interface PropertyTypeOption {
  value: PropertyType;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface PropertyTypeSelectorProps {
  /** Currently selected property type */
  value: string;
  /** Callback when selection changes */
  onChange: (value: PropertyType) => void;
  /** Label text */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Custom property type options */
  options?: PropertyTypeOption[];
  /** Custom className for the container */
  className?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
}

/**
 * Default property type options
 */
const DEFAULT_OPTIONS: PropertyTypeOption[] = [
  { 
    value: 'Apartment', 
    label: 'Apartment', 
    icon: Building,
    description: 'Ghorofa au flat'
  },
  { 
    value: 'House', 
    label: 'Nyumba', 
    icon: Home,
    description: 'Nyumba kamili'
  },
  { 
    value: 'Shared Room', 
    label: 'Chumba', 
    icon: Bed,
    description: 'Chumba kimoja'
  },
  { 
    value: 'Studio', 
    label: 'Studio', 
    icon: Users,
    description: 'Chumba kimoja chenye jiko'
  },
  { 
    value: 'Bedsitter', 
    label: 'Bedsitter', 
    icon: Briefcase,
    description: 'Chumba na jiko ndani'
  },
];

/**
 * PropertyTypeSelector Component
 * 
 * @example
 * ```tsx
 * <PropertyTypeSelector
 *   value={propertyType}
 *   onChange={setPropertyType}
 *   label="Property Type"
 *   required
 * />
 * ```
 */
export const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  value,
  onChange,
  label = 'Aina ya Nyumba',
  required = false,
  options = DEFAULT_OPTIONS,
  className,
  disabled = false,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Home className="h-4 w-4 text-primary" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Property Type Cards */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ value: optionValue, label: optionLabel, icon: Icon, description }) => {
          const isSelected = value === optionValue;
          
          return (
            <button
              key={optionValue}
              type="button"
              onClick={() => !disabled && onChange(optionValue)}
              disabled={disabled}
              className={cn(
                'p-4 border-2 rounded-lg transition-all duration-200 text-left',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300',
                disabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
              )}
              aria-pressed={isSelected}
              aria-label={`Select ${optionLabel}`}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isSelected ? 'text-primary' : 'text-gray-400'
                  )} 
                />
                <div className="flex-1 min-w-0">
                  <span 
                    className={cn(
                      'font-medium block truncate',
                      isSelected ? 'text-primary' : 'text-gray-700'
                    )}
                  >
                    {optionLabel}
                  </span>
                  {description && (
                    <span className="text-xs text-gray-500 block truncate">
                      {description}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      {!value && (
        <p className="text-xs text-gray-500">
          Chagua aina ya nyumba unayoipangisha
        </p>
      )}
    </div>
  );
};

export default PropertyTypeSelector;
