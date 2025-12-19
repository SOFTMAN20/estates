import { useState } from 'react';
import { Star, Filter } from 'lucide-react';
import { useReviews } from '@/hooks/useReviews';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewFormModal } from '@/components/reviews/ReviewFormModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Review } from '@/types/review';

export default function MyReviews() {
  const { myReviews, isLoading } = useReviews();
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Get unique properties from reviews
  const properties = Array.from(
    new Set(myReviews.map(r => r.property?.id).filter(Boolean))
  ).map(id => {
    const review = myReviews.find(r => r.property?.id === id);
    return {
      id: id!,
      title: review?.property?.title || 'Unknown Property'
    };
  });

  // Filter reviews by property
  const filteredReviews = filterProperty === 'all'
    ? myReviews
    : myReviews.filter(r => r.property?.id === filterProperty);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600">
                {myReviews.length} review{myReviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {properties.length > 1 && (
          <div className="mb-6 flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterProperty} onValueChange={setFilterProperty}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ReviewList
              reviews={filteredReviews}
              showPropertyInfo={true}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewFormModal
          isOpen={true}
          onClose={() => setEditingReview(null)}
          propertyId={editingReview.property_id}
          bookingId={editingReview.booking_id}
          propertyName={editingReview.property?.title || 'Property'}
          propertyImage={editingReview.property?.images?.[0]}
          checkIn={editingReview.booking?.check_in || ''}
          checkOut={editingReview.booking?.check_out || ''}
        />
      )}
    </div>
  );
}
