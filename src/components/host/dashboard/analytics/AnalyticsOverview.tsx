import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign, Calendar, Star, Loader2 } from 'lucide-react';
import PropertyPerformance from '@/components/host/dashboard/analytics/PropertyPerformance';
import RevenueChart from '@/components/host/dashboard/analytics/RevenueChart';
import OccupancyChart from '@/components/host/dashboard/analytics/OccupancyChart';
import BookingsChart from '@/components/host/dashboard/analytics/BookingsChart';
import PropertyComparison from '@/components/host/dashboard/analytics/PropertyComparison';
import ReviewsAnalytics from '@/components/host/dashboard/analytics/ReviewsAnalytics';
import EarningsBreakdown from '@/components/host/dashboard/analytics/EarningsBreakdown';
import PropertyViews from '@/components/host/dashboard/analytics/PropertyViews';
import BookingsStatusChart from '@/components/host/dashboard/analytics/BookingsStatusChart';
import AnalyticsSidebar from '@/components/host/dashboard/analytics/AnalyticsSidebar';
import { useAnalytics } from '@/hooks/analyticsHooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsOverviewProps {
  propertyId?: string;
  onPropertyChange?: (propertyId: string) => void;
  propertyList?: { id: string; title: string }[];
}

export default function AnalyticsOverview({ 
  propertyId, 
  onPropertyChange = () => {}, 
  propertyList = [] 
}: AnalyticsOverviewProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState('revenue');
  const { user } = useAuth();
  
  // Fetch real analytics data
  const { data: analytics, isLoading, error } = useAnalytics(user?.id, propertyId, timeRange);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">Failed to load analytics data</p>
        <p className="text-sm text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  // Show empty state
  if (!analytics) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-800">No analytics data available</p>
        <p className="text-sm text-gray-600 mt-2">Start by adding properties and getting bookings</p>
      </div>
    );
  }

  const summaryStats = analytics.summary;

  return (
    <div className="flex">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block flex-shrink-0">
        <AnalyticsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          summaryStats={analytics.summary}
          selectedProperty={propertyId || 'all'}
          onPropertyChange={onPropertyChange}
          propertyList={propertyList}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6 sm:space-y-8 lg:pl-6">
      {/* Property Filter Indicator */}
      {propertyId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-center justify-center gap-2 max-w-2xl mx-auto">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-xs sm:text-sm text-blue-800">
            <span className="font-medium">Filtered View:</span> Showing analytics for selected property
          </p>
        </div>
      )}

        {/* Quick Actions - Centered */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-6xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Revenue</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              TSh {summaryStats.totalRevenue >= 1000 
                ? `${(summaryStats.totalRevenue / 1000).toFixed(1)}k` 
                : summaryStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">↑ {summaryStats.revenueChange}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Bookings</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{summaryStats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">↑ {summaryStats.bookingsChange}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Occupancy</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{summaryStats.avgOccupancy}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">↑ {summaryStats.occupancyChange}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Rating</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 fill-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{summaryStats.avgRating || 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">↑ {summaryStats.ratingChange}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector - Mobile Only */}
      <div className="flex justify-center lg:hidden">
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as '7d' | '30d' | '90d' | '1y')}>
          <TabsList className="grid grid-cols-4 w-full sm:w-auto shadow-md">
            <TabsTrigger value="7d" className="text-xs sm:text-sm">7D</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs sm:text-sm">30D</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs sm:text-sm">90D</TabsTrigger>
            <TabsTrigger value="1y" className="text-xs sm:text-sm">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Charts Section - Centered */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Mobile Tab Navigation */}
        <div className="flex justify-center lg:hidden">
          <TabsList className="grid grid-cols-5 w-full sm:w-auto shadow-md">
            <TabsTrigger value="revenue" className="text-xs sm:text-sm">Revenue</TabsTrigger>
            <TabsTrigger value="occupancy" className="text-xs sm:text-sm">Occupancy</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs sm:text-sm">Bookings</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
            <TabsTrigger value="views" className="text-xs sm:text-sm">Views</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="revenue" className="space-y-6 max-w-6xl mx-auto">
          <RevenueChart data={analytics.revenue} timeRange={timeRange} propertyId={propertyId} />
          <EarningsBreakdown data={analytics.earnings} propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6 max-w-4xl mx-auto">
          <OccupancyChart data={analytics.occupancy} timeRange={timeRange} propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6 max-w-6xl mx-auto">
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <BookingsChart data={analytics.bookings} timeRange={timeRange} propertyId={propertyId} />
            <BookingsStatusChart data={analytics.bookingStatus} />
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6 max-w-6xl mx-auto">
          <ReviewsAnalytics data={analytics.reviews} propertyId={propertyId} />
        </TabsContent>

        <TabsContent value="views" className="space-y-6 max-w-5xl mx-auto">
          <PropertyViews data={analytics.views} />
        </TabsContent>
      </Tabs>

        {/* Property Performance & Comparison - Centered */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          <PropertyPerformance summary={analytics.summary} propertyId={propertyId} />
          <PropertyComparison data={analytics.properties} />
        </div>
      </div>
    </div>
  );
}
