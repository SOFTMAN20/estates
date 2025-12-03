/**
 * ANALYTICS TYPES
 * ===============
 * 
 * Type definitions for analytics, metrics, charts, and dashboard data
 */

/**
 * Time Range Type
 * Available time ranges for analytics data
 */
export type TimeRange = '7d' | '30d' | '90d' | '1y';

/**
 * Analytics Summary
 * High-level metrics summary
 */
export interface AnalyticsSummary {
  totalRevenue: number;
  totalBookings: number;
  avgOccupancy: number;
  avgRating: number;
  revenueChange: number;
  bookingsChange: number;
  occupancyChange: number;
  ratingChange: number;
}

/**
 * Revenue Data Point
 * Single data point for revenue chart
 */
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

/**
 * Bookings Data Point
 * Single data point for bookings chart
 */
export interface BookingsDataPoint {
  date: string;
  bookings: number;
  cancellations: number;
}

/**
 * Occupancy Data Point
 * Single data point for occupancy chart
 */
export interface OccupancyDataPoint {
  month: string;
  occupancy: number;
  available: number;
}

/**
 * Rating Distribution
 * Distribution of ratings by star count
 */
export interface RatingDistribution {
  stars: number;
  count: number;
  percentage: number;
}

/**
 * Rating Category
 * Rating breakdown by category
 */
export interface RatingCategory {
  name: string;
  rating: number;
}

/**
 * Reviews Analytics
 * Analytics data for reviews and ratings
 */
export interface ReviewsAnalytics {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution[];
  categories: RatingCategory[];
}

/**
 * Property Performance
 * Performance metrics for a single property
 */
export interface PropertyPerformance {
  property: string;
  revenue: number;
  bookings: number;
  rating: number;
}

/**
 * Income Source
 * Income breakdown by source
 */
export interface IncomeSource {
  name: string;
  value: number;
  color: string;
}

/**
 * Expense Category
 * Expense breakdown by category
 */
export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

/**
 * Earnings Analytics
 * Income and expense analytics
 */
export interface EarningsAnalytics {
  income: IncomeSource[];
  expenses: ExpenseCategory[];
}

/**
 * Views Trend Data Point
 * Single data point for views trend
 */
export interface ViewsTrendDataPoint {
  date: string;
  views: number;
}

/**
 * Views Analytics
 * Property views and conversion analytics
 */
export interface ViewsAnalytics {
  total_views: number;
  views_this_month: number;
  view_to_booking_rate: number;
  views_trend: ViewsTrendDataPoint[];
}

/**
 * Booking Status Data
 * Booking count by status
 */
export interface BookingStatusData {
  status: string;
  count: number;
  percentage: number;
}

/**
 * Complete Analytics Data
 * Full analytics data structure
 */
export interface AnalyticsData {
  summary: AnalyticsSummary;
  revenue: RevenueDataPoint[];
  bookings: BookingsDataPoint[];
  occupancy: OccupancyDataPoint[];
  reviews: ReviewsAnalytics;
  properties: PropertyPerformance[];
  earnings: EarningsAnalytics;
  views: ViewsAnalytics;
  bookingStatus: BookingStatusData[];
}

/**
 * Stats Card Props
 * Props for statistics card component
 */
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
}

/**
 * Chart Props Base
 * Base props for chart components
 */
export interface ChartPropsBase {
  timeRange: TimeRange;
}

/**
 * Revenue Chart Props
 */
export interface RevenueChartProps extends ChartPropsBase {
  data: RevenueDataPoint[];
}

/**
 * Bookings Chart Props
 */
export interface BookingsChartProps extends ChartPropsBase {
  data: BookingsDataPoint[];
}

/**
 * Occupancy Chart Props
 */
export interface OccupancyChartProps extends ChartPropsBase {
  data: OccupancyDataPoint[];
}

/**
 * Bookings Status Chart Props
 */
export interface BookingsStatusChartProps {
  data: BookingStatusData[];
}

/**
 * Reviews Analytics Props
 */
export interface ReviewsAnalyticsProps {
  data: ReviewsAnalytics;
}

/**
 * Analytics Overview Props
 */
export interface AnalyticsOverviewProps {
  propertyId?: string;
  onPropertyChange?: (propertyId: string) => void;
}

/**
 * Analytics Sidebar Props
 */
export interface AnalyticsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  properties?: { id: string; title: string }[];
}

/**
 * Analytics Modal Props
 */
export interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string;
}

/**
 * Bookings Stats
 * Statistics for bookings
 */
export interface BookingsStats {
  totalBookings: number;
  isLoading: boolean;
  error?: Error | null;
}

/**
 * Cache Metrics
 * Performance metrics for caching
 */
export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
}
