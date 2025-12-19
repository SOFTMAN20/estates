import { RatingStars } from './RatingStars';

interface RatingDisplayProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export function RatingDisplay({ rating, size = 'md', showNumber = true }: RatingDisplayProps) {
  return (
    <RatingStars
      value={rating}
      size={size}
      showValue={showNumber}
      interactive={false}
    />
  );
}
