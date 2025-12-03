/**
 * AmenitiesSelector.tsx - Reusable Amenities Selector
 * ===================================================
 * 
 * A modular component for selecting property amenities with visual cards.
 * Uses shadcn/ui components and Lucide React icons.
 * 
 * Features:
 * - Multi-select with visual feedback
 * - Icon representation for each amenity
 * - Color-coded categories
 * - Accessible and responsive
 * - Customizable amenities list
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Droplets, 
  Sofa, 
  Car, 
  Shield, 
  Wifi,
  Wind,
  Tv,
  LucideIcon,
  Award,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/utils/utils';

export type AmenityKey = string;

interface AmenityOption {
  key: AmenityKey;
  label: string;
  icon: LucideIcon;
  colorClass: string;
}

interface AmenitiesSelectorProps {
  /** Currently selected amenities */
  value: string[];
  /** Callback when selection changes */
  onChange: (amenities: string[]) => void;
  /** Label text */
  label?: string;
  /** Custom amenity options */
  options?: AmenityOption[];
  /** Custom className for the container */
  className?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Maximum number of selections allowed */
  maxSelections?: number;
}

/**
 * Default amenity options with Swahili labels
 */
const DEFAULT_OPTIONS: AmenityOption[] = [
  { 
    key: 'electricity', 
    label: 'Umeme', 
    icon: Zap, 
    colorClass: 'border-yellow-300 bg-yellow-50 text-yellow-600' 
  },
  { 
    key: 'water', 
    label: 'Maji', 
    icon: Droplets, 
    colorClass: 'border-blue-300 bg-blue-50 text-blue-600' 
  },
  { 
    key: 'furnished', 
    label: 'Samani', 
    icon: Sofa, 
    colorClass: 'border-purple-300 bg-purple-50 text-purple-600' 
  },
  { 
    key: 'parking', 
    label: 'Maegesho', 
    icon: Car, 
    colorClass: 'border-green-300 bg-green-50 text-green-600' 
  },
  { 
    key: 'security', 
    label: 'Usalama', 
    icon: Shield, 
    colorClass: 'border-red-300 bg-red-50 text-red-600' 
  },
  { 
    key: 'wifi', 
    label: 'WiFi', 
    icon: Wifi, 
    colorClass: 'border-indigo-300 bg-indigo-50 text-indigo-600' 
  },
  { 
    key: 'ac', 
    label: 'AC', 
    icon: Wind, 
    colorClass: 'border-cyan-300 bg-cyan-50 text-cyan-600' 
  },
  { 
    key: 'tv', 
    label: 'TV', 
    icon: Tv, 
    colorClass: 'border-pink-300 bg-pink-50 text-pink-600' 
  },
];

/**
 * AmenitiesSelector Component
 * 
 * @example
 * ```tsx
 * <AmenitiesSelector
 *   value={amenities}
 *   onChange={setAmenities}
 *   label="Property Amenities"
 * />
 * ```
 */
export const AmenitiesSelector: React.FC<AmenitiesSelectorProps> = ({
  value,
  onChange,
  label = 'Huduma za Msingi',
  options = DEFAULT_OPTIONS,
  className,
  disabled = false,
  maxSelections,
}) => {
  const handleToggle = (key: string) => {
    if (disabled) return;
    
    const isSelected = value.includes(key);
    
    if (isSelected) {
      // Remove from selection
      onChange(value.filter(item => item !== key));
    } else {
      // Add to selection (if not at max)
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, key]);
      }
    }
  };

  const isMaxReached = maxSelections && value.length >= maxSelections;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label with count */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Award className="h-4 w-4 text-primary" />
          {label}
        </Label>
        {value.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {value.length} {maxSelections ? `/ ${maxSelections}` : ''} selected
          </Badge>
        )}
      </div>

      {/* Amenity Cards */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(({ key, label: optionLabel, icon: Icon, colorClass }) => {
          const isSelected = value.includes(key);
          const isDisabled = disabled || (!isSelected && isMaxReached);
          
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleToggle(key)}
              disabled={isDisabled}
              className={cn(
                'p-4 border-2 rounded-lg transition-all duration-200 text-left',
                'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isSelected 
                  ? `${colorClass} shadow-md` 
                  : 'border-gray-200 hover:border-gray-300',
                isDisabled && 'opacity-50 cursor-not-allowed hover:shadow-none'
              )}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? 'Deselect' : 'Select'} ${optionLabel}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon 
                    className={cn(
                      'h-5 w-5 transition-colors',
                      isSelected ? colorClass.split(' ')[2] : 'text-gray-400'
                    )} 
                  />
                  <span 
                    className={cn(
                      'font-medium',
                      isSelected ? 'text-gray-700' : 'text-gray-700'
                    )}
                  >
                    {optionLabel}
                  </span>
                </div>
                {isSelected && (
                  <CheckCircle 
                    className={cn('h-5 w-5', colorClass.split(' ')[2])} 
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      {value.length === 0 && (
        <p className="text-xs text-gray-500">
          Chagua huduma zinazopatikana kwenye nyumba yako
        </p>
      )}
      
      {isMaxReached && (
        <p className="text-xs text-amber-600">
          Umefika kikomo cha huduma unazoweza kuchagua
        </p>
      )}
    </div>
  );
};

export default AmenitiesSelector;
