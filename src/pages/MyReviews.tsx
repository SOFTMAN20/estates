import { useState } from 'react';
import { Star, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReviews } from '@/hooks/useReviews';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewFormModal } from '@/components/reviews/ReviewFormModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/loading-spinner';
import type { Review } from '@/types/review';

export default function MyReviews() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button - Mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2 sm:hidden"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-sm sm:text-base text-gray-600">
                {myReviews.length} review{myReviews.length !== 1 ? 's' : ''} written
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        {properties.length > 1 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Filter by property:</span>
            </div>
            <Select value={filterProperty} onValueChange={setFilterProperty}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    <span className="truncate">{property.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600">Loading your reviews...</p>
            </div>
          ) : myReviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                After completing a stay, you can leave a review to help other guests.
              </p>
              <Button onClick={() => navigate('/bookings')}>
                View My Bookings
              </Button>
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

      <Footer />
    </div>
  );
}
