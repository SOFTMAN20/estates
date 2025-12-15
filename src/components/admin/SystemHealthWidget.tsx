/**
 * SYSTEM HEALTH WIDGET
 * ====================
 * 
 * Displays system health status with color-coded indicators
 * Green = Healthy, Yellow = Warning, Red = Critical
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { 
  Activity, 
  Database, 
  Server, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
  icon: React.ReactNode;
}

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  metrics: HealthMetric[];
  lastChecked: string;
}

export function SystemHealthWidget() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['admin', 'system-health'],
    queryFn: async (): Promise<SystemHealth> => {
      const metrics: HealthMetric[] = [];
      let criticalCount = 0;
      let warningCount = 0;

      // Check database connectivity
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        metrics.push({
          name: 'Database',
          status: error ? 'critical' : 'healthy',
          message: error ? 'Connection failed' : 'Connected',
          icon: <Database className="h-4 w-4" />
        });
        if (error) criticalCount++;
      } catch {
        metrics.push({
          name: 'Database',
          status: 'critical',
          message: 'Connection failed',
          icon: <Database className="h-4 w-4" />
        });
        criticalCount++;
      }

      // Check API response time
      const startTime = Date.now();
      await supabase.from('properties').select('id').limit(1);
      const responseTime = Date.now() - startTime;
      
      const apiStatus = responseTime < 500 ? 'healthy' : responseTime < 1000 ? 'warning' : 'critical';
      metrics.push({
        name: 'API Response',
        status: apiStatus,
        message: `${responseTime}ms`,
        icon: <Server className="h-4 w-4" />
      });
      if (apiStatus === 'critical') criticalCount++;
      if (apiStatus === 'warning') warningCount++;

      // Check storage availability
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const storageStatus = buckets && buckets.length > 0 ? 'healthy' : 'warning';
        metrics.push({
          name: 'Storage',
          status: storageStatus,
          message: buckets ? `${buckets.length} buckets` : 'Limited',
          icon: <Zap className="h-4 w-4" />
        });
        if (storageStatus === 'warning') warningCount++;
      } catch {
        metrics.push({
          name: 'Storage',
          status: 'critical',
          message: 'Unavailable',
          icon: <Zap className="h-4 w-4" />
        });
        criticalCount++;
      }

      // Check recent errors (from admin_actions or logs)
      const { count: errorCount } = await supabase
        .from('admin_actions')
        .select('*', { count: 'exact', head: true })
        .eq('action_type', 'unauthorized_access_attempt')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

      const errorStatus = !errorCount ? 'healthy' : errorCount < 5 ? 'warning' : 'critical';
      metrics.push({
        name: 'Error Rate',
        status: errorStatus,
        message: errorCount ? `${errorCount} in last hour` : 'No errors',
        icon: <Activity className="h-4 w-4" />
      });
      if (errorStatus === 'critical') criticalCount++;
      if (errorStatus === 'warning') warningCount++;

      // Determine overall health
      const overall = criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy';

      return {
        overall,
        metrics,
        lastChecked: new Date().toISOString()
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'critical':
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'All Systems Operational';
      case 'warning':
        return 'Minor Issues Detected';
      case 'critical':
        return 'Critical Issues';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            health ? getStatusColor(health.overall) : "bg-gray-100"
          )}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : health ? (
              getStatusIcon(health.overall)
            ) : (
              <Activity className="h-5 w-5" />
            )}
          </div>
          <CardTitle className="text-base font-semibold">
            System Health
          </CardTitle>
        </div>
        {health && (
          <Badge 
            variant={
              health.overall === 'healthy' ? 'default' : 
              health.overall === 'warning' ? 'secondary' : 
              'destructive'
            }
            className={cn(
              health.overall === 'healthy' && 'bg-green-100 text-green-700 hover:bg-green-200',
              health.overall === 'warning' && 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            )}
          >
            {health.overall.toUpperCase()}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : health ? (
          <div className="space-y-3">
            {/* Overall Status */}
            <div className="text-center pb-3 border-b">
              <p className="text-sm font-medium text-gray-900">
                {getStatusText(health.overall)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
              </p>
            </div>

            {/* Individual Metrics */}
            <div className="space-y-2">
              {health.metrics.map((metric, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded",
                      getStatusColor(metric.status)
                    )}>
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {metric.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {metric.message}
                    </span>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      metric.status === 'healthy' && 'bg-green-500',
                      metric.status === 'warning' && 'bg-yellow-500',
                      metric.status === 'critical' && 'bg-red-500'
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-gray-500">
            Unable to check system health
          </div>
        )}
      </CardContent>
    </Card>
  );
}
