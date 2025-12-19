import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Review, ReviewFormData, ReviewStatistics, ReviewFilters } from '@/types/review';
import { useToast } from '@/contexts/ToastContext';

export function useReviews(propertyId?: string, filters?: ReviewFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  // Fetch property reviews
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews', propertyId, filters],
    queryFn: async () => {
      if (!propertyId) return [];

      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!reviews_user_id_fkey(id, name, avatar_url),
          property:properties(id, title, images),
          booking:bookings(check_in, check_out)
        `)
        .eq('property_id', propertyId);

      // Apply filters
      if (filters?.rating) {
        query = query.eq('rating', filters.rating);
      }

      if (filters?.hasResponse !== undefined) {
        if (filters.hasResponse) {
          query = query.not('host_response', 'is', null);
        } else {
          query = query.is('host_response', null);
        }
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'highest':
          query = query.order('rating', { ascending: false });
          break;
        case 'lowest':
          query = query.order('rating', { ascending: true });
          break;
        case 'helpful':
          query = query.order('helpful_count', { ascending: false });
          break;
        case 'recent':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!propertyId,
  });

  // Fetch review statistics
  const { data: statistics } = useQuery({
    queryKey: ['review-statistics', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;

      const { data, error } = await supabase
        .rpc('get_review_statistics', { p_property_id: propertyId });

      if (error) throw error;
      return data as ReviewStatistics;
    },
    enabled: !!propertyId,
  });

  // Fetch user's reviews
  const { data: myReviews = [] } = useQuery({
    queryKey: ['my-reviews', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          property:properties(id, title, images),
          booking:bookings(check_in, check_out)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!user?.id,
  });

  // Fetch host's reviews
  const { data: hostReviews = [] } = useQuery({
    queryKey: ['host-reviews', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('reviews')
        .select(`
          *,
          user:profiles!reviews_user_id_fkey(id, name, avatar_url),
          property:properties!reviews_property_id_fkey(id, title, images, host_id),
          booking:bookings(check_in, check_out)
        `)
        .eq('property.host_id', user.id);

      // Apply filters
      if (filters?.rating) {
        query = query.eq('rating', filters.rating);
      }

      if (filters?.hasResponse !== undefined) {
        if (filters.hasResponse) {
          query = query.not('host_response', 'is', null);
        } else {
          query = query.is('host_response', null);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!user?.id,
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: ReviewFormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Upload images if any
      let imageUrls: string[] = [];
      if (reviewData.images && reviewData.images.length > 0) {
        imageUrls = await uploadReviewImages(reviewData.images, user.id);
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          property_id: reviewData.property_id,
          booking_id: reviewData.booking_id,
          user_id: user.id,
          rating: reviewData.rating,
          cleanliness: reviewData.cleanliness,
          accuracy: reviewData.accuracy,
          communication: reviewData.communication,
          location_rating: reviewData.location_rating,
          value: reviewData.value,
          comment: reviewData.comment,
          images: imageUrls.length > 0 ? imageUrls : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      showSuccess('Review submitted successfully!');
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
      showError('Failed to submit review. Please try again.');
    },
  });

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: async ({ reviewId, updates }: { reviewId: string; updates: Partial<Review> }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-reviews'] });
      showSuccess('Review updated successfully!');
    },
    onError: (error) => {
      console.error('Failed to update review:', error);
      showError('Failed to update review. Please try again.');
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      showSuccess('Review deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete review:', error);
      showError('Failed to delete review. Please try again.');
    },
  });

  // Respond to review mutation
  const respondToReviewMutation = useMutation({
    mutationFn: async ({ reviewId, response }: { reviewId: string; response: string }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          host_response: response,
          host_response_date: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['host-reviews'] });
      showSuccess('Response posted successfully!');
    },
    onError: (error) => {
      console.error('Failed to respond to review:', error);
      showError('Failed to post response. Please try again.');
    },
  });

  // Mark review as helpful mutation
  const markHelpfulMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('review_helpful')
        .insert({
          review_id: reviewId,
          user_id: user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      showSuccess('Marked as helpful!');
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        showError('You already marked this review as helpful');
      } else {
        showError('Failed to mark as helpful');
      }
    },
  });

  // Check if user can review a booking
  const canReviewBooking = async (bookingId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .rpc('can_user_review_booking', { p_booking_id: bookingId });

    if (error) {
      console.error('Failed to check review eligibility:', error);
      return false;
    }

    return data;
  };

  return {
    reviews,
    statistics,
    myReviews,
    hostReviews,
    isLoading,
    error,
    createReview: createReviewMutation.mutate,
    updateReview: updateReviewMutation.mutate,
    deleteReview: deleteReviewMutation.mutate,
    respondToReview: respondToReviewMutation.mutate,
    markHelpful: markHelpfulMutation.mutate,
    canReviewBooking,
    isCreating: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
    isDeleting: deleteReviewMutation.isPending,
    isResponding: respondToReviewMutation.isPending,
  };
}

// Helper function to upload review images
async function uploadReviewImages(images: File[], userId: string): Promise<string[]> {
  const uploadPromises = images.map(async (image, index) => {
    const fileExt = image.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_${index}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('review-images')
      .upload(fileName, image, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('review-images')
      .getPublicUrl(data.path);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
}
