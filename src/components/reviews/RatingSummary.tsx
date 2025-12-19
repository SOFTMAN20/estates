import { RatingStars } from './RatingStars';
import type { ReviewStatistics } from '@/types/review';
import { cn } from '@/lib/utils';
import { Sparkles, TrendingUp, Star } from 'lucide-react';

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
    { label: 'Cleanliness', value: category_averages.cleanliness, icon: '✨' },
    { label: 'Communication', value: category_averages.communication, icon: '💬' },
    { label: 'Value', value: category_averages.value, icon: '💰' },
    { label: 'Location', value: category_averages.location, icon: '📍' },
  ];

  return (
    <div className={cn('bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm', className)}>
      {/* Overall Rating Section */}
      <div className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          {/* Large Rating Display */}
          <div className="flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-w-[160px]">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              <div className="text-5xl font-bold text-gray-900">
                {average_rating.toFixed(1)}
              </div>
            </div>
            <RatingStars value={average_rating} size="lg" className="mb-2" />
            <p className="text-sm font-medium text-gray-600">
              {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
            </p>
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
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">{stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-14 text-right">
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
      <div className="px-6 py-5 bg-white border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Category Ratings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(({ label, value, icon }) => (
            <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <RatingStars value={value} size="sm" />
                <span className="text-sm font-bold text-gray-900 min-w-[32px] text-right">
                  {value.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Rate */}
      {recommendation_rate > 0 && (
        <div className="px-6 py-5 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-gray-100 rounded-b-xl">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <span className="text-2xl">👍</span>
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {recommendation_rate}%
                </span>
                <span className="text-sm font-medium text-gray-600">
                  recommend
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Guests would recommend this property
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
