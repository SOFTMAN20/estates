import { useState, useRef } from 'react';
import { Filter, SortAsc, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ReviewCard } from './ReviewCard';
import type { Review, ReviewSortOption } from '@/types/review';
import { cn } from '@/lib/utils';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Mobile carousel navigation
  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.85; // 85% of container width
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.85;
      const newIndex = Math.round(container.scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < displayedReviews.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No reviews yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Be the first to leave a review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters and Sort */}
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col gap-3">
          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 flex-shrink-0">
                <Filter className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Filter:</span>
              </div>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="flex-1 sm:w-[160px] bg-white text-sm">
                  <SelectValue placeholder="All Ratings" />
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

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 flex-shrink-0">
                <SortAsc className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Sort:</span>
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as ReviewSortOption)}>
                <SelectTrigger className="flex-1 sm:w-[160px] bg-white text-sm">
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
          <div className="pt-2 sm:pt-3 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Showing <span className="text-primary font-bold">{displayedReviews.length}</span> of{' '}
              <span className="font-bold">{filteredReviews.length}</span> review{filteredReviews.length !== 1 ? 's' : ''}
              {filterRating !== 'all' && (
                <span className="text-gray-500 ml-1">
                  ({filterRating} star{filterRating !== '1' ? 's' : ''})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews match your filter</p>
          <Button
            variant="link"
            onClick={() => setFilterRating('all')}
            className="mt-2"
          >
            Clear filter
          </Button>
        </div>
      ) : (
        <>
          {/* Mobile: Horizontal Swipeable Carousel */}
          <div className="block sm:hidden">
            <div className="relative">
              {/* Carousel Container */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-4 gap-3"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayedReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="flex-shrink-0 w-[85%] snap-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <ReviewCard
                      review={review}
                      isHostView={isHostView}
                      showPropertyInfo={showPropertyInfo}
                      onEdit={onEdit}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {displayedReviews.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity",
                      currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={currentIndex === displayedReviews.length - 1}
                    className={cn(
                      "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity",
                      currentIndex === displayedReviews.length - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100"
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Pagination Dots */}
            {displayedReviews.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {displayedReviews.slice(0, Math.min(displayedReviews.length, 10)).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentIndex
                        ? "bg-primary w-4"
                        : "bg-gray-300 hover:bg-gray-400"
                    )}
                    aria-label={`Go to review ${index + 1}`}
                  />
                ))}
                {displayedReviews.length > 10 && (
                  <span className="text-xs text-gray-500 ml-1">+{displayedReviews.length - 10}</span>
                )}
              </div>
            )}

            {/* Swipe Hint */}
            {displayedReviews.length > 1 && currentIndex === 0 && (
              <p className="text-center text-xs text-gray-400 mt-2">
                ← Swipe to see more reviews →
              </p>
            )}
          </div>

          {/* Desktop: Vertical List */}
          <div className="hidden sm:block divide-y divide-gray-200">
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
        </>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => setDisplayCount(prev => prev + 10)}
            className="w-full sm:w-auto"
          >
            Load More Reviews ({filteredReviews.length - displayCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
