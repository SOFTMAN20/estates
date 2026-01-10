import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  value,
  onChange,
  size = 'md',
  interactive = false,
  showValue = false,
  className
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5 sm:w-4 sm:h-4',
    md: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6'
  };

  const touchTargetClasses = {
    sm: 'p-0.5',
    md: 'p-0.5 sm:p-1',
    lg: 'p-1'
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (rating: number) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (interactive) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverValue(null);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = displayValue >= starValue;
    const halfFilled = displayValue >= starValue - 0.5 && displayValue < starValue;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={!interactive}
        aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
        className={cn(
          'relative touch-manipulation',
          touchTargetClasses[size],
          interactive && 'cursor-pointer hover:scale-110 active:scale-95 transition-transform',
          !interactive && 'cursor-default'
        )}
      >
        {halfFilled ? (
          <StarHalf
            className={cn(
              sizeClasses[size],
              'fill-yellow-400 text-yellow-400'
            )}
          />
        ) : (
          <Star
            className={cn(
              sizeClasses[size],
              filled ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300',
              interactive && !filled && 'hover:text-yellow-300'
            )}
          />
        )}
      </button>
    );
  };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <div className="flex items-center -mx-0.5">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      {showValue && (
        <span className="text-xs sm:text-sm font-semibold text-gray-700 ml-1.5">
          {displayValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}
