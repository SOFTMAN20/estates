import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviews } from '@/hooks/useReviews';
import { cn } from '@/lib/utils';
import { Send, X } from 'lucide-react';

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
  const minLength = 10;

  const isValid = response.trim().length >= minLength && response.length <= maxLength;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    respondToReview({ reviewId, response: response.trim() });
    onSuccess();
  };

  const remainingChars = maxLength - response.length;
  const isNearLimit = remainingChars <= 50;

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {existingResponse ? 'Edit your response' : 'Write a response'}
        </label>
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Thank the guest for their feedback and address any concerns they mentioned..."
          rows={4}
          maxLength={maxLength}
          className={cn(
            'resize-none text-sm sm:text-base',
            response.length > maxLength && 'border-red-500 focus:ring-red-500'
          )}
        />
        <div className="flex items-center justify-between mt-2">
          <span className={cn(
            'text-xs sm:text-sm',
            response.length < minLength ? 'text-gray-500' : 
            isNearLimit ? 'text-yellow-600' :
            response.length > maxLength ? 'text-red-500' : 'text-gray-500'
          )}>
            {response.length}/{maxLength}
            {response.length < minLength && ` (min ${minLength})`}
          </span>
          {isNearLimit && response.length <= maxLength && (
            <span className="text-xs text-yellow-600">
              {remainingChars} characters left
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isResponding}
          className="w-full sm:w-auto"
        >
          <X className="w-4 h-4 mr-1.5" />
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isResponding || !isValid}
          className="w-full sm:w-auto"
        >
          {isResponding ? (
            <>
              <span className="animate-spin mr-1.5">⏳</span>
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1.5" />
              {existingResponse ? 'Update Response' : 'Post Response'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
