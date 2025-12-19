import { useState } from 'react';
import { User, ThumbsUp, Flag, Edit, Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export function ReviewCard({ review, showPropertyInfo = false, isHostView = false, onEdit }: ReviewCardProps) {
  const { user } = useAuth();
  const { markHelpful, deleteReview, isDeleting } = useReviews();
  const [showCategories, setShowCategories] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  const isOwnReview = user?.id === review.user_id;
  const canEdit = isOwnReview && new Date(review.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const canDelete = canEdit;

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
    <div className="border-b border-gray-200 py-6 last:border-0">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {review.user?.avatar_url ? (
            <img
              src={review.user.avatar_url}
              alt={review.user?.name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                <Badge variant="secondary" className="text-xs">
                  Verified Guest
                </Badge>
              </div>
              {review.booking && (
                <p className="text-sm text-gray-500">
                  Stayed {new Date(review.booking.check_in).toLocaleDateString()} - {new Date(review.booking.check_out).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
              </p>
            </div>
            <RatingStars value={review.rating} size="md" showValue />
          </div>

          {/* Property Info (for My Reviews page) */}
          {showPropertyInfo && review.property && (
            <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
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
            <div className="mb-3">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showCategories ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                Category Ratings
              </button>
              {showCategories && (
                <div className="grid grid-cols-2 gap-3 mt-2 pl-6">
                  {review.cleanliness && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cleanliness</span>
                      <RatingStars value={review.cleanliness} size="sm" />
                    </div>
                  )}
                  {review.communication && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Communication</span>
                      <RatingStars value={review.communication} size="sm" />
                    </div>
                  )}
                  {review.value && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Value</span>
                      <RatingStars value={review.value} size="sm" />
                    </div>
                  )}
                  {review.location_rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Location</span>
                      <RatingStars value={review.location_rating} size="sm" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Review Text */}
          <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}

          {/* Host Response */}
          {review.host_response && (
            <div className="mt-4 pl-4 border-l-2 border-primary/20 bg-gray-50 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-900">Response from host</span>
                {review.host_response_date && (
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(review.host_response_date), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-700">{review.host_response}</p>
            </div>
          )}

          {/* Host Response Form */}
          {showResponseForm && (
            <div className="mt-4">
              <HostResponseForm
                reviewId={review.id}
                existingResponse={review.host_response}
                onCancel={() => setShowResponseForm(false)}
                onSuccess={() => setShowResponseForm(false)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-4">
            {!isOwnReview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpful}
                className="text-gray-600 hover:text-primary"
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
              </Button>
            )}

            {isHostView && !review.host_response && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponseForm(!showResponseForm)}
                className="text-gray-600 hover:text-primary"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Respond
              </Button>
            )}

            {isHostView && review.host_response && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResponseForm(!showResponseForm)}
                className="text-gray-600 hover:text-primary"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Response
              </Button>
            )}

            {canEdit && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(review)}
                className="text-gray-600 hover:text-primary"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-600 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}

            {!isOwnReview && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-500 ml-auto"
              >
                <Flag className="w-4 h-4 mr-1" />
                Report
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
