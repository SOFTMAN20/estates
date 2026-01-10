import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingStars } from './RatingStars';
import { useReviews } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';
import type { ReviewFormData } from '@/types/review';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  cleanliness: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
  location_rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(50, 'Review must be at least 50 characters').max(1000, 'Review must not exceed 1000 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  bookingId: string;
  propertyName: string;
  propertyImage?: string;
  checkIn: string;
  checkOut: string;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  propertyId,
  bookingId,
  propertyName,
  propertyImage,
  checkIn,
  checkOut,
}: ReviewFormModalProps) {
  const { createReview, isCreating } = useReviews();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      cleanliness: 0,
      communication: 0,
      value: 0,
      location_rating: 0,
      comment: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const comment = watch('comment');
  const rating = watch('rating');
  const cleanliness = watch('cleanliness');
  const communication = watch('communication');
  const value = watch('value');
  const location_rating = watch('location_rating');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setImages(prev => [...prev, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReviewFormValues) => {
    const reviewData: ReviewFormData = {
      property_id: propertyId,
      booking_id: bookingId,
      rating: data.rating,
      cleanliness: data.cleanliness || undefined,
      communication: data.communication || undefined,
      value: data.value || undefined,
      location_rating: data.location_rating || undefined,
      comment: data.comment,
      images: images.length > 0 ? images : undefined,
    };

    createReview(reviewData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg sm:text-xl">Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          {/* Property Info */}
          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            {propertyImage && (
              <img
                src={propertyImage}
                alt={propertyName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{propertyName}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 block">
              Overall Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <RatingStars
                value={rating}
                onChange={(value) => setValue('rating', value)}
                size="lg"
                interactive
              />
              {rating > 0 && (
                <span className="text-sm text-gray-600">
                  {rating === 5 && 'Excellent'}
                  {rating === 4 && 'Very Good'}
                  {rating === 3 && 'Good'}
                  {rating === 2 && 'Fair'}
                  {rating === 1 && 'Poor'}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500 mt-1">Please select a rating</p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="space-y-3 sm:space-y-4">
            <Label className="text-sm sm:text-base font-semibold">Category Ratings (Optional)</Label>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">✨ Cleanliness</Label>
                <RatingStars
                  value={cleanliness || 0}
                  onChange={(value) => setValue('cleanliness', value)}
                  size="md"
                  interactive
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">💬 Communication</Label>
                <RatingStars
                  value={communication || 0}
                  onChange={(value) => setValue('communication', value)}
                  size="md"
                  interactive
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">💰 Value for Money</Label>
                <RatingStars
                  value={value || 0}
                  onChange={(value) => setValue('value', value)}
                  size="md"
                  interactive
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">📍 Location</Label>
                <RatingStars
                  value={location_rating || 0}
                  onChange={(value) => setValue('location_rating', value)}
                  size="md"
                  interactive
                />
              </div>
            </div>
          </div>

          {/* Written Review */}
          <div>
            <Label htmlFor="comment" className="text-sm sm:text-base font-semibold mb-2 block">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Share your experience with this property. What did you like? What could be improved?"
              rows={5}
              className={cn('text-sm sm:text-base', errors.comment && 'border-red-500')}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={cn(
                'text-xs sm:text-sm',
                comment.length < 50 ? 'text-red-500' : 'text-gray-500'
              )}>
                {comment.length}/1000 (min 50)
              </span>
            </div>
            {errors.comment && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.comment.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 block">
              Add Photos (Optional)
            </Label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              Upload up to 5 photos to help others see what you experienced
            </p>

            {images.length < 5 && (
              <label className="flex items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors active:bg-gray-50">
                <div className="text-center">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-1 sm:mb-2" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    Tap to upload ({5 - images.length} remaining)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || rating === 0 || comment.length < 50}
              className="w-full sm:w-auto"
            >
              {isCreating ? 'Submitting...' : rating === 0 ? 'Select a Rating' : comment.length < 50 ? `Need ${50 - comment.length} more chars` : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
