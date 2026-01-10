import { useState } from 'react';
import { User, ThumbsUp, Flag, Edit, Trash2, MessageSquare, ChevronDown, ChevronUp, X } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RatingStars } from './RatingStars';
import { HostResponseForm } from './HostResponseForm';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import type { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review;
  showPropertyInfo?: boolean;
  isHostView?: boolean;
  onEdit?: (review: Review) => void;
}

// Character limit for truncated text
const CHAR_LIMIT = 150;

export function ReviewCard({ review, showPropertyInfo = false, isHostView = false, onEdit }: ReviewCardProps) {
  const { user } = useAuth();
  const { markHelpful, deleteReview, isDeleting } = useReviews();
  const [showCategories, setShowCategories] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showFullReviewModal, setShowFullReviewModal] = useState(false);

  const isOwnReview = user?.id === review.user_id;
  const canEdit = isOwnReview && new Date(review.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const canDelete = canEdit;

  // Check if comment needs truncation
  const commentText = review.comment || '';
  const needsTruncation = commentText.length > CHAR_LIMIT;
  const truncatedComment = needsTruncation 
    ? commentText.slice(0, CHAR_LIMIT).trim() + '...'
    : commentText;

  const handleHelpful = () => {
    markHelpful(review.id);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview(review.id);
    }
  };

  const hasCategories = review.cleanliness || review.communication || review.value || review.location_rating;

  return (
    <>
      <div className="border-b border-gray-200 py-4 sm:py-6 last:border-0 hover:bg-gray-50/50 transition-colors rounded-lg px-2 sm:px-4 overflow-hidden">
        {/* Compact Card Layout - Airbnb Style */}
        <div className="space-y-3">
          {/* Rating and Date Row */}
          <div className="flex items-center gap-2">
            <RatingStars value={review.rating} size="sm" />
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-sm text-gray-600">
              {format(new Date(review.created_at), 'MMMM yyyy')}
            </span>
          </div>

          {/* Truncated Comment */}
          <div>
            <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
              {truncatedComment || <span className="text-gray-400 italic">No comment provided</span>}
            </p>
            {needsTruncation && (
              <button
                onClick={() => setShowFullReviewModal(true)}
                className="text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-primary mt-1 transition-colors"
              >
                Show more
              </button>
            )}
          </div>

          {/* User Info Row */}
          <div className="flex items-center gap-3 pt-2">
            {review.user?.avatar_url ? (
              <img
                src={review.user.avatar_url}
                alt={review.user?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</h4>
              {review.booking && (
                <p className="text-xs text-gray-500">
                  {format(new Date(review.booking.check_in), 'MMM yyyy')} - {format(new Date(review.booking.check_out), 'MMM yyyy')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Review Modal */}
      <Dialog open={showFullReviewModal} onOpenChange={setShowFullReviewModal}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sticky top-0 bg-white z-10 p-4 sm:p-6 border-b">
            <DialogTitle className="text-lg sm:text-xl font-semibold">Review</DialogTitle>
          </DialogHeader>
          
          <div className="p-4 sm:p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-start gap-4">
              {review.user?.avatar_url ? (
                <img
                  src={review.user.avatar_url}
                  alt={review.user?.name || 'User'}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg">{review.user?.name || 'Anonymous'}</h4>
                {review.booking && (
                  <p className="text-sm text-gray-600">
                    Stayed: {format(new Date(review.booking.check_in), 'MMM d, yyyy')} - {format(new Date(review.booking.check_out), 'MMM d, yyyy')}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <RatingStars value={review.rating} size="md" showValue />
                  <span className="text-sm text-gray-500">·</span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Info (if applicable) */}
            {showPropertyInfo && review.property && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {review.property.images?.[0] && (
                  <img
                    src={review.property.images[0]}
                    alt={review.property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h5 className="font-medium text-gray-900">{review.property.title}</h5>
                </div>
              </div>
            )}

            {/* Category Ratings */}
            {hasCategories && (
              <div className="space-y-3">
                <h5 className="font-semibold text-gray-900">Detailed Ratings</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {review.cleanliness && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">✨ Cleanliness</span>
                      <div className="flex items-center gap-2">
                        <RatingStars value={review.cleanliness} size="sm" />
                        <span className="text-sm font-bold">{review.cleanliness.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {review.communication && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">💬 Communication</span>
                      <div className="flex items-center gap-2">
                        <RatingStars value={review.communication} size="sm" />
                        <span className="text-sm font-bold">{review.communication.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {review.value && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">💰 Value</span>
                      <div className="flex items-center gap-2">
                        <RatingStars value={review.value} size="sm" />
                        <span className="text-sm font-bold">{review.value.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {review.location_rating && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">📍 Location</span>
                      <div className="flex items-center gap-2">
                        <RatingStars value={review.location_rating} size="sm" />
                        <span className="text-sm font-bold">{review.location_rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                  {review.accuracy && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">✓ Accuracy</span>
                      <div className="flex items-center gap-2">
                        <RatingStars value={review.accuracy} size="sm" />
                        <span className="text-sm font-bold">{review.accuracy.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full Comment */}
            <div>
              <p className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                {review.comment || <span className="text-gray-400 italic">No comment provided</span>}
              </p>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Photos</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Host Response */}
            {review.host_response && (
              <div className="border-l-4 border-primary/30 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-gray-900">Response from host</span>
                  {review.host_response_date && (
                    <span className="text-xs text-gray-500">
                      · {formatDistanceToNow(new Date(review.host_response_date), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{review.host_response}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
              {!isOwnReview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleHelpful}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
                </Button>
              )}

              {isHostView && !review.host_response && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFullReviewModal(false);
                    setShowResponseForm(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Respond
                </Button>
              )}

              {canEdit && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFullReviewModal(false);
                    onEdit(review);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}

              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}

              {!isOwnReview && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-gray-500"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Host Response Form (outside modal) */}
      {showResponseForm && (
        <div className="px-2 sm:px-4 pb-4">
          <HostResponseForm
            reviewId={review.id}
            existingResponse={review.host_response}
            onCancel={() => setShowResponseForm(false)}
            onSuccess={() => setShowResponseForm(false)}
          />
        </div>
      )}
    </>
  );
}
