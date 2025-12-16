/**
 * PENDING APPROVALS WIDGET
 * ========================
 * 
 * Shows count of pending items requiring admin approval
 * Clickable to navigate to respective pages
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  Loader2 
} from 'lucide-react';

interface PendingCounts {
  properties: number;
  reports: number;
  verifications: number;
}

export function PendingApprovalsWidget() {
  const navigate = useNavigate();

  const { data: counts, isLoading, error } = useQuery({
    queryKey: ['admin', 'pending-approvals'],
    queryFn: async (): Promise<PendingCounts> => {
      console.log('Fetching pending approvals...');
      
      // Get pending properties count
      const { count: propertiesCount, error: propError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (propError) {
        console.error('Error fetching pending properties:', propError);
      }

      console.log('Pending properties count:', propertiesCount);

      // Get unresolved reports count (if you have a reports table)
      // For now, we'll use a placeholder
      const reportsCount = 0;

      // Get pending verifications (users awaiting verification)
      // For now, we'll use a placeholder
      const verificationsCount = 0;

      const result = {
        properties: propertiesCount || 0,
        reports: reportsCount,
        verifications: verificationsCount
      };

      console.log('Pending approvals result:', result);
      return result;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  console.log('PendingApprovalsWidget render:', { counts, isLoading, error });

  const totalPending = counts 
    ? counts.properties + counts.reports + counts.verifications 
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-100">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <CardTitle className="text-base font-semibold">
            Pending Approvals
          </CardTitle>
        </div>
        {totalPending > 0 && (
          <Badge variant="destructive" className="h-6 px-2">
            {totalPending}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-sm text-red-500">
            Error loading pending approvals
          </div>
        ) : !counts ? (
          <div className="text-center py-8 text-sm text-gray-500">
            Unable to load pending approvals
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Properties */}
            <button
              onClick={() => navigate('/admin/properties?status=pending')}
              disabled={!counts.properties || counts.properties === 0}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <Home className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Property Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                {counts.properties > 0 ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-semibold">
                    {counts.properties}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* Pending Reports */}
            <button
              onClick={() => navigate('/admin/reports?status=pending')}
              disabled={!counts.reports || counts.reports === 0}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">User Reports</span>
              </div>
              <div className="flex items-center gap-2">
                {counts.reports > 0 ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-semibold">
                    {counts.reports}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            {/* Summary */}
            {totalPending === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-lg">
                ✓ All caught up! No pending approvals.
              </div>
            ) : (
              <div className="pt-3 border-t mt-2">
                <p className="text-xs text-gray-600 text-center font-medium">
                  {totalPending} {totalPending === 1 ? 'item' : 'items'} requiring attention
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
