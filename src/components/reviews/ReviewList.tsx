import { useState } from 'react';
import { Filter, SortAsc } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import type { Review, ReviewSortOption } from '@/types/review';

interface ReviewListProps {
  reviews: Review[];
  isHostView?: boolean;
  showPropertyInfo?: boolean;
  onEdit?: (review: Review) => void;
}

export function ReviewList({ reviews, isHostView = false, showPropertyInfo = false, onEdit }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('recent');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(10);

  // Filter reviews
  let filteredReviews = [...reviews];
  if (filterRating !== 'all') {
    const rating = parseInt(filterRating);
    filteredReviews = filteredReviews.filter(r => r.rating === rating);
  }

  // Sort reviews
  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful_count - a.helpful_count;
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const displayedReviews = filteredReviews.slice(0, displayCount);
  const hasMore = filteredReviews.length > displayCount;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to leave a review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">⭐ All Ratings</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                <SelectItem value="1">⭐ 1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-gray-700">
              <SortAsc className="w-4 h-4" />
              <span className="text-sm font-medium">Sort:</span>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as ReviewSortOption)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">🕒 Most Recent</SelectItem>
                <SelectItem value="highest">📈 Highest Rating</SelectItem>
                <SelectItem value="lowest">📉 Lowest Rating</SelectItem>
                <SelectItem value="helpful">👍 Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Review Count */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            Showing <span className="text-primary font-bold">{displayedReviews.length}</span> of <span className="font-bold">{filteredReviews.length}</span> review{filteredReviews.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="divide-y divide-gray-200">
        {displayedReviews.map(review => (
          <ReviewCard
            key={review.id}
            review={review}
            isHostView={isHostView}
            showPropertyInfo={showPropertyInfo}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => setDisplayCount(prev => prev + 10)}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
