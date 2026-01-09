/**
 * PriceInput.tsx - Reusable Price Input with Period Selector
 * ==========================================================
 * 
 * A modular component for entering rental prices with period selection.
 * Uses shadcn/ui components and Lucide React icons.
 * 
 * Features:
 * - Price input with currency prefix
 * - Period selector (per day, month, year)
 * - Minimum rental months input (when per_month is selected)
 * - Validation feedback
 * - Accessible and responsive
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Star, Calendar } from 'lucide-react';
import { cn } from '@/utils/utils';

export type PricePeriod = 'per_day' | 'per_month' | 'per_year';

interface PriceInputProps {
  /** Current price value */
  value: string;
  /** Current period value */
  period: PricePeriod;
  /** Callback when price changes */
  onPriceChange: (value: string) => void;
  /** Callback when period changes */
  onPeriodChange: (period: PricePeriod) => void;
  /** Minimum rental months value (only used when period is per_month) */
  minRentalMonths?: string;
  /** Callback when minimum rental months changes */
  onMinRentalMonthsChange?: (value: string) => void;
  /** Label text */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Currency code */
  currency?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether to show validation feedback */
  showFeedback?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * Period options with Swahili labels
 */
const PERIOD_OPTIONS = [
  { value: 'per_day' as PricePeriod, label: 'Kwa Siku', labelEn: 'Per Day' },
  { value: 'per_month' as PricePeriod, label: 'Kwa Mwezi', labelEn: 'Per Month' },
  { value: 'per_year' as PricePeriod, label: 'Kwa Mwaka', labelEn: 'Per Year' },
] as const;

/**
 * Get period label in Swahili
 */
const getPeriodLabel = (period: PricePeriod): string => {
  const option = PERIOD_OPTIONS.find(opt => opt.value === period);
  return option?.label.toLowerCase() || 'kwa mwezi';
};

/**
 * Format price with thousand separators
 */
const formatPrice = (value: string): string => {
  const numValue = parseInt(value || '0');
  return numValue.toLocaleString();
};

/**
 * PriceInput Component
 * 
 * @example
 * ```tsx
 * <PriceInput
 *   value={price}
 *   period={pricePeriod}
 *   onPriceChange={setPrice}
 *   onPeriodChange={setPricePeriod}
 *   label="Rent Price"
 *   required
 * />
 * ```
 */
export const PriceInput: React.FC<PriceInputProps> = ({
  value,
  period,
  onPriceChange,
  onPeriodChange,
  minRentalMonths = '1',
  onMinRentalMonthsChange,
  label = 'Bei ya Kodi',
  placeholder = '800000',
  currency = 'TZS',
  required = false,
  showFeedback = true,
  className,
  disabled = false,
}) => {
  const hasValue = value && parseFloat(value) > 0;
  const showMinRentalMonths = period === 'per_month';

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      <Label 
        htmlFor="price-input" 
        className="flex items-center gap-2 text-sm font-medium"
      >
        <Star className="h-4 w-4 text-primary" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Input Group */}
      <div className="flex gap-2">
        {/* Price Input */}
        <div className="relative flex-1">
          <Input
            id="price-input"
            type="number"
            value={value}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'pl-12 transition-all duration-200',
              hasValue && 'border-green-300 bg-green-50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            required={required}
            min="0"
            step="1000"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium pointer-events-none">
            {currency}
          </div>
        </div>

        {/* Period Selector */}
        <Select
          value={period}
          onValueChange={(value) => onPeriodChange(value as PricePeriod)}
          disabled={disabled}
        >
          <SelectTrigger className={cn(
            'w-[140px]',
            disabled && 'opacity-50 cursor-not-allowed'
          )}>
            <SelectValue placeholder="Kipindi" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Minimum Rental Months Input - Only shown when period is per_month */}
      {showMinRentalMonths && onMinRentalMonthsChange && (
        <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Label 
            htmlFor="min-rental-months" 
            className="flex items-center gap-2 text-sm font-medium text-blue-900"
          >
            <Calendar className="h-4 w-4 text-blue-600" />
            Miezi ya Chini ya Kukodi *
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="min-rental-months"
              type="number"
              value={minRentalMonths}
              onChange={(e) => onMinRentalMonthsChange(e.target.value)}
              placeholder="1"
              disabled={disabled}
              className={cn(
                'w-24 transition-all duration-200',
                parseInt(minRentalMonths) >= 1 && 'border-green-300 bg-green-50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              min="1"
              max="24"
            />
            <span className="text-sm text-blue-800">
              {parseInt(minRentalMonths) === 1 ? 'mwezi' : 'miezi'}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            Weka idadi ya chini ya miezi ambayo mpangaji anaweza kukodi nyumba hii
          </p>
        </div>
      )}

      {/* Validation Feedback */}
      {showFeedback && hasValue && (
        <div className="flex items-center gap-1 text-green-600 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle className="h-3 w-3" />
          <span>
            Bei: {currency} {formatPrice(value)} {getPeriodLabel(period)}
            {showMinRentalMonths && parseInt(minRentalMonths) > 1 && (
              <span className="ml-1">(chini ya miezi {minRentalMonths})</span>
            )}
          </span>
        </div>
      )}

      {/* Helper Text */}
      {!hasValue && (
        <p className="text-xs text-gray-500">
          Weka bei ya kodi na chagua kipindi
        </p>
      )}
    </div>
  );
};

export default PriceInput;
