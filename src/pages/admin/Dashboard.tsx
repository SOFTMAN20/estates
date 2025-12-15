import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatisticsCards } from '@/components/admin/StatisticsCards';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { UserGrowthChart } from '@/components/admin/UserGrowthChart';
import { BookingTrendsChart } from '@/components/admin/BookingTrendsChart';
import { PropertyTypesChart } from '@/components/admin/PropertyTypesChart';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { useAdminStats, useRevenueData, useUserGrowthData, useBookingTrends, usePropertyTypeDistribution } from '@/hooks/useAdminStats';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminDashboard() {
  // Fetch real data from Supabase
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData(6);
  const { data: userGrowthData, isLoading: userGrowthLoading } = useUserGrowthData(6);
  const { data: bookingTrends, isLoading: bookingTrendsLoading } = useBookingTrends(6);
  const { data: propertyTypes, isLoading: propertyTypesLoading } = usePropertyTypeDistribution();

  // Show loading state
  if (statsLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load dashboard data: {statsError.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Welcome back! Here's what's happening with NyumbaLink.</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="mb-6 md:mb-8">
            <StatisticsCards stats={stats} />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {revenueLoading ? (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : revenueData && revenueData.length > 0 ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <p className="text-gray-500">No revenue data available</p>
            </div>
          )}
                                                                         
          {userGrowthLoading ? (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userGrowthData && userGrowthData.length > 0 ? (
            <UserGrowthChart data={userGrowthData} />
          ) : (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <p className="text-gray-500">No user growth data available</p>
            </div>
          )}

          {bookingTrendsLoading ? (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookingTrends && bookingTrends.length > 0 ? (
            <BookingTrendsChart data={bookingTrends} />
          ) : (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <p className="text-gray-500">No booking data available</p>
            </div>
          )}

          {propertyTypesLoading ? (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : propertyTypes && propertyTypes.length > 0 ? (
            <PropertyTypesChart data={propertyTypes} />
          ) : (
            <div className="flex items-center justify-center h-96 bg-white rounded-lg border">
              <p className="text-gray-500">No property data available</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
