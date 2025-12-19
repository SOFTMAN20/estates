import { RatingStars } from './RatingStars';
import type { ReviewStatistics } from '@/types/review';
import { cn } from '@/lib/utils';

interface RatingSummaryProps {
  statistics: ReviewStatistics;
  className?: string;
}

export function RatingSummary({ statistics, className }: RatingSummaryProps) {
  const { average_rating, total_reviews, rating_distribution, category_averages, recommendation_rate } = statistics;

  const getRatingPercentage = (count: number) => {
    if (total_reviews === 0) return 0;
    return Math.round((count / total_reviews) * 100);
  };

  const ratingBars = [
    { stars: 5, count: rating_distribution['5_star'] },
    { stars: 4, count: rating_distribution['4_star'] },
    { stars: 3, count: rating_distribution['3_star'] },
    { stars: 2, count: rating_distribution['2_star'] },
    { stars: 1, count: rating_distribution['1_star'] },
  ];

  const categories = [
    { label: 'Cleanliness', value: category_averages.cleanliness },
    { label: 'Communication', value: category_averages.communication },
    { label: 'Value', value: category_averages.value },
    { label: 'Location', value: category_averages.location },
  ];

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      {/* Overall Rating */}
      <div className="flex items-start gap-8 pb-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {average_rating.toFixed(1)}
          </div>
          <RatingStars value={average_rating} size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingBars.map(({ stars, count }) => {
              const percentage = getRatingPercentage(count);
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-12">{stars} stars</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Averages */}
      <div className="pt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Category Ratings</h3>
        <div className="grid grid-cols-2 gap-4">
          {categories.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <div className="flex items-center gap-2">
                <RatingStars value={value} size="sm" />
                <span className="text-sm font-medium text-gray-900 w-8">
                  {value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Rate */}
      {recommendation_rate > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {recommendation_rate}%
            </span>
            <span className="text-sm text-gray-600">
              of guests recommend this property
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
