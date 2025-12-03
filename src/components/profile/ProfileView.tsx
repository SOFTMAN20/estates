/**
 * ProfileView.tsx - Profile Account Info Component
 * ================================================
 * 
 * Displays read-only account information and statistics
 */

import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileViewProps {
  createdAt: string | null;
  updatedAt: string | null;
  isSuspended: boolean;
  role: string;
  formatDate: (date: string | null) => string;
}

export const ProfileView = ({
  createdAt,
  updatedAt,
  isSuspended,
  role,
  formatDate
}: ProfileViewProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-primary" />
        Taarifa za Akaunti
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Imeundwa:</span>
          <p className="font-medium">{formatDate(createdAt)}</p>
        </div>
        <div>
          <span className="text-gray-600">Imesasishwa:</span>
          <p className="font-medium">{formatDate(updatedAt)}</p>
        </div>
        <div>
          <span className="text-gray-600">Hali ya Akaunti:</span>
          <p className="font-medium flex items-center gap-1">
            {isSuspended ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Imesimamishwa</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Inatumika</span>
              </>
            )}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Jukumu:</span>
          <p className="font-medium capitalize">{role || 'user'}</p>
        </div>
      </div>
    </div>
  );
};
