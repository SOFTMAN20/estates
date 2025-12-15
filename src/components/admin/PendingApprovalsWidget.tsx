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

  const { data: counts, isLoading } = useQuery({
    queryKey: ['admin', 'pending-approvals'],
    queryFn: async (): Promise<PendingCounts> => {
      // Get pending properties count
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get unresolved reports count (if you have a reports table)
      // For now, we'll use a placeholder
      const reportsCount = 0;

      // Get pending verifications (users awaiting verification)
      // For now, we'll use a placeholder
      const verificationsCount = 0;

      return {
        properties: propertiesCount || 0,
        reports: reportsCount,
        verifications: verificationsCount
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

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
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {/* Pending Properties */}
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-orange-50 group"
              onClick={() => navigate('/admin/properties?status=pending')}
              disabled={counts?.properties === 0}
            >
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Property Submissions</span>
              </div>
              <div className="flex items-center gap-2">
                {counts?.properties ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {counts.properties}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </Button>

            {/* Pending Reports */}
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-orange-50 group"
              onClick={() => navigate('/admin/reports?status=pending')}
              disabled={counts?.reports === 0}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">User Reports</span>
              </div>
              <div className="flex items-center gap-2">
                {counts?.reports ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {counts.reports}
                  </Badge>
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </Button>

            {/* Summary */}
            {totalPending === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">
                ✓ All caught up! No pending approvals.
              </div>
            ) : (
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 text-center">
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
