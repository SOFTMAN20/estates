/**
 * RoomCounter.tsx - Reusable Room Counter Component
 * =================================================
 * 
 * A modular component for counting rooms (bedrooms, bathrooms, etc.).
 * Uses shadcn/ui components and Lucide React icons.
 * 
 * Features:
 * - Increment/decrement buttons
 * - Direct input support
 * - Icon representation
 * - Min/max validation
 * - Accessible and responsive
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, LucideIcon } from 'lucide-react';
import { cn } from '@/utils/utils';

interface RoomCounterProps {
  /** Current count value */
  value: string | number;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Label text */
  label: string;
  /** Icon component */
  icon: LucideIcon;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Custom className for the container */
  className?: string;
  /** Whether the counter is disabled */
  disabled?: boolean;
  /** Helper text */
  helperText?: string;
}

/**
 * RoomCounter Component
 * 
 * @example
 * ```tsx
 * <RoomCounter
 *   value={bedrooms}
 *   onChange={setBedrooms}
 *   label="Bedrooms"
 *   icon={Bed}
 *   min={0}
 *   max={10}
 * />
 * ```
 */
export const RoomCounter: React.FC<RoomCounterProps> = ({
  value,
  onChange,
  label,
  icon: Icon,
  min = 0,
  max = 20,
  className,
  disabled = false,
  helperText,
}) => {
  const numValue = parseInt(value?.toString() || '0');
  const isAtMin = numValue <= min;
  const isAtMax = numValue >= max;

  const handleIncrement = () => {
    if (!isAtMax && !disabled) {
      onChange((numValue + 1).toString());
    }
  };

  const handleDecrement = () => {
    if (!isAtMin && !disabled) {
      onChange((numValue - 1).toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string for user to type
    if (newValue === '') {
      onChange('0');
      return;
    }

    const num = parseInt(newValue);
    
    // Validate range
    if (!isNaN(num)) {
      if (num < min) {
        onChange(min.toString());
      } else if (num > max) {
        onChange(max.toString());
      } else {
        onChange(num.toString());
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>

      {/* Counter Controls */}
      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={disabled || isAtMin}
          className={cn(
            'h-10 w-10 rounded-lg transition-all',
            'hover:bg-primary hover:text-white',
            (disabled || isAtMin) && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>

        {/* Input Field */}
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          min={min}
          max={max}
          className={cn(
            'text-center font-semibold text-lg h-10 w-20',
            'focus:ring-2 focus:ring-primary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={label}
        />

        {/* Increment Button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={disabled || isAtMax}
          className={cn(
            'h-10 w-10 rounded-lg transition-all',
            'hover:bg-primary hover:text-white',
            (disabled || isAtMax) && 'opacity-50 cursor-not-allowed'
          )}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {/* Range Info */}
      {(isAtMin || isAtMax) && (
        <p className="text-xs text-amber-600">
          {isAtMin && `Minimum: ${min}`}
          {isAtMax && `Maximum: ${max}`}
        </p>
      )}
    </div>
  );
};

export default RoomCounter;
