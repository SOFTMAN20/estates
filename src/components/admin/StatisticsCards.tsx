/**
 * Statistics Cards Component
 * Displays key metrics for the admin dashboard
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Home, Calendar, DollarSign } from 'lucide-react';
import { useCommissionRate } from '@/hooks/usePlatformSettings';
import type { DashboardStats } from '@/types/admin';

interface StatisticsCardsProps {
  stats: DashboardStats;
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  // Get dynamic commission rate from platform settings
  const commissionRate = useCommissionRate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users Card */}
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        change={stats.userGrowth}
        icon={<Users className="h-6 w-6" />}
        iconColor="text-blue-600"
        iconBg="bg-blue-100"
      >
        <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
          <span>{stats.regularUsers} Regular</span>
          <span>{stats.adminUsers} Admins</span>
        </div>
      </StatCard>

      {/* Total Properties Card */}
      <StatCard
        title="Total Properties"
        value={stats.totalProperties.toLocaleString()}
        icon={<Home className="h-6 w-6" />}
        iconColor="text-green-600"
        iconBg="bg-green-100"
        badge={stats.pendingProperties > 0 ? {
          value: stats.pendingProperties,
          label: 'Pending',
          variant: 'secondary'
        } : undefined}
      >
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mt-2">
          <div className="text-center">
            <div className="font-semibold text-yellow-600">{stats.pendingProperties}</div>
            <div>Pending</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{stats.approvedProperties}</div>
            <div>Approved</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{stats.rejectedProperties}</div>
            <div>Rejected</div>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {stats.newPropertiesThisMonth} new this month
        </div>
      </StatCard>

      {/* Total Bookings Card */}
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings.toLocaleString()}
        icon={<Calendar className="h-6 w-6" />}
        iconColor="text-purple-600"
        iconBg="bg-purple-100"
      >
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mt-2">
          <div className="text-center">
            <div className="font-semibold text-blue-600">{stats.confirmedBookings}</div>
            <div>Confirmed</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{stats.completedBookings}</div>
            <div>Completed</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-red-600">{stats.cancelledBookings}</div>
            <div>Cancelled</div>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {stats.bookingsThisMonth} this month
        </div>
      </StatCard>

      {/* Platform Revenue Card */}
      <StatCard
        title="Platform Revenue"
        value={`TZS ${(stats.totalRevenue / 1000000).toFixed(2)}M`}
        change={stats.revenueGrowth}
        icon={<DollarSign className="h-6 w-6" />}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-100"
      >
        <div className="space-y-1 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Commission ({commissionRate}%)</span>
            <span className="font-semibold text-emerald-600">
              TZS {(stats.platformCommission / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">This Month</span>
            <span className="font-semibold">
              TZS {(stats.revenueThisMonth / 1000).toFixed(0)}K
            </span>
          </div>
        </div>
      </StatCard>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  badge?: {
    value: number;
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: React.ReactNode;
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  iconColor = 'text-gray-600',
  iconBg = 'bg-gray-100',
  badge,
  children 
}: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="relative">
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <div className={iconColor}>{icon}</div>
          </div>
          {badge && (
            <Badge 
              variant={badge.variant || 'default'}
              className="absolute -top-2 -right-2 h-5 px-1.5 text-xs"
            >
              {badge.value}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change).toFixed(1)}% vs last month
          </div>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
}
