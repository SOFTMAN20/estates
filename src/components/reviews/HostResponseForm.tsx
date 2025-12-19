import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';

interface HostResponseFormProps {
  reviewId: string;
  existingResponse?: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function HostResponseForm({ reviewId, existingResponse, onCancel, onSuccess }: HostResponseFormProps) {
  const { respondToReview, isResponding } = useReviews();
  const [response, setResponse] = useState(existingResponse || '');
  const maxLength = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim().length === 0) return;

    respondToReview({ reviewId, response: response.trim() });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your response to this review..."
          rows={4}
          maxLength={maxLength}
          className={cn(
            'resize-none',
            response.length > maxLength && 'border-red-500'
          )}
        />
        <div className="flex items-center justify-between mt-2">
          <span className={cn(
            'text-sm',
            response.length > maxLength ? 'text-red-500' : 'text-gray-500'
          )}>
            {response.length}/{maxLength} characters
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={isResponding || response.trim().length === 0 || response.length > maxLength}
        >
          {isResponding ? 'Posting...' : existingResponse ? 'Update Response' : 'Post Response'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isResponding}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
