import { RatingStars } from './RatingStars';
import type { ReviewStatistics } from '@/types/review';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, Star, ThumbsUp } from 'lucide-react';

interface RatingSummaryProps {
  statistics: ReviewStatistics;
  className?: string;
}

export function RatingSummary({ statistics, className }: RatingSummaryProps) {
  const { 
    average_rating = 0, 
    total_reviews = 0, 
    rating_distribution = { '5_star': 0, '4_star': 0, '3_star': 0, '2_star': 0, '1_star': 0 }, 
    category_averages = { cleanliness: 0, communication: 0, value: 0, location: 0 }, 
    recommendation_rate = 0 
  } = statistics || {};

  const getRatingPercentage = (count: number) => {
    if (!total_reviews || total_reviews === 0) return 0;
    return Math.round((count / total_reviews) * 100);
  };

  const ratingBars = [
    { stars: 5, count: rating_distribution?.['5_star'] || 0 },
    { stars: 4, count: rating_distribution?.['4_star'] || 0 },
    { stars: 3, count: rating_distribution?.['3_star'] || 0 },
    { stars: 2, count: rating_distribution?.['2_star'] || 0 },
    { stars: 1, count: rating_distribution?.['1_star'] || 0 },
  ];

  const categories = [
    { label: 'Cleanliness', value: category_averages?.cleanliness || 0, icon: '✨' },
    { label: 'Communication', value: category_averages?.communication || 0, icon: '💬' },
    { label: 'Value', value: category_averages?.value || 0, icon: '💰' },
    { label: 'Location', value: category_averages?.location || 0, icon: '📍' },
  ];

  return (
    <div className={cn('bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden', className)}>
      {/* Overall Rating Section */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Large Rating Display */}
          <div className="flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 lg:min-w-[160px]">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-yellow-400 text-yellow-400" />
              <div className="text-4xl sm:text-5xl font-bold text-gray-900">
                {average_rating.toFixed(1)}
              </div>
            </div>
            <div className="flex flex-col items-center lg:items-center">
              <RatingStars value={average_rating} size="md" className="mb-1" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 w-full">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Rating Distribution
            </h3>
            <div className="space-y-2">
              {ratingBars.map(({ stars, count }) => {
                const percentage = getRatingPercentage(count);
                return (
                  <div key={stars} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 w-10 sm:w-16 flex-shrink-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600 w-10 sm:w-14 text-right flex-shrink-0">
                      {count > 0 ? `${percentage}%` : '0%'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Ratings Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Category Ratings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {categories.map(({ label, value, icon }) => (
            <div 
              key={label} 
              className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base sm:text-xl flex-shrink-0">{icon}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{label}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <RatingStars value={value} size="sm" className="hidden xs:flex" />
                <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[28px] sm:min-w-[32px] text-right">
                  {value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Rate */}
      {recommendation_rate > 0 && (
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-gray-100">
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex-shrink-0">
              <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {recommendation_rate}%
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  recommend
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Tenants would recommend this property
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
