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
      cleanliness: data.cleanliness,
      communication: data.communication,
      value: data.value,
      location_rating: data.location_rating,
      comment: data.comment,
      images: images.length > 0 ? images : undefined,
    };

    createReview(reviewData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Property Info */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            {propertyImage && (
              <img
                src={propertyImage}
                alt={propertyName}
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{propertyName}</h3>
              <p className="text-sm text-gray-600">
                {new Date(checkIn).toLocaleDateString()} - {new Date(checkOut).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Overall Rating */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Overall Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4">
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
          <div className="space-y-4">
            <Label className="text-base font-semibold">Category Ratings (Optional)</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Cleanliness</Label>
                <RatingStars
                  value={cleanliness || 0}
                  onChange={(value) => setValue('cleanliness', value)}
                  size="md"
                  interactive
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Communication</Label>
                <RatingStars
                  value={communication || 0}
                  onChange={(value) => setValue('communication', value)}
                  size="md"
                  interactive
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Value for Money</Label>
                <RatingStars
                  value={value || 0}
                  onChange={(value) => setValue('value', value)}
                  size="md"
                  interactive
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Location</Label>
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
            <Label htmlFor="comment" className="text-base font-semibold mb-2 block">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              {...register('comment')}
              placeholder="Share your experience with this property. What did you like? What could be improved?"
              rows={6}
              className={cn(errors.comment && 'border-red-500')}
            />
            <div className="flex items-center justify-between mt-2">
              <span className={cn(
                'text-sm',
                comment.length < 50 ? 'text-red-500' : 'text-gray-500'
              )}>
                {comment.length}/1000 characters (minimum 50)
              </span>
            </div>
            {errors.comment && (
              <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Add Photos (Optional)
            </Label>
            <p className="text-sm text-gray-600 mb-3">
              Upload up to 5 photos to help others see what you experienced
            </p>

            {images.length < 5 && (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload ({5 - images.length} remaining)
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
              <div className="grid grid-cols-5 gap-2 mt-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || rating === 0}
            >
              {isCreating ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
