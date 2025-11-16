import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, startOfWeek, subDays } from 'date-fns';

export interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalBookings: number;
    avgOccupancy: number;
    avgRating: number;
    revenueChange: number;
    bookingsChange: number;
    occupancyChange: number;
    ratingChange: number;
  };
  revenue: {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  bookings: {
    date: string;
    bookings: number;
    cancellations: number;
  }[];
  occupancy: {
    month: string;
    occupancy: number;
    available: number;
  }[];
  reviews: {
    averageRating: number;
    totalReviews: number;
    distribution: { stars: number; count: number; percentage: number }[];
    categories: { name: string; rating: number }[];
  };
  properties: {
    property: string;
    revenue: number;
    bookings: number;
    rating: number;
  }[];
  earnings: {
    income: { name: string; value: number; color: string }[];
    expenses: { category: string; amount: number; percentage: number }[];
  };
  views: {
    total_views: number;
    views_this_month: number;
    view_to_booking_rate: number;
    views_trend: { date: string; views: number }[];
  };
  bookingStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export function useAnalytics(userId: string | undefined, propertyId?: string, timeRange: '7d' | '30d' | '90d' | '1y' = '30d') {
  return useQuery({
    queryKey: ['analytics', userId, propertyId, timeRange],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case '7d':
          startDate = subDays(now, 7);
          break;
        case '30d':
          startDate = subDays(now, 30);
          break;
        case '90d':
          startDate = subDays(now, 90);
          break;
        case '1y':
          startDate = subDays(now, 365);
          break;
      }

      // First, get user's properties
      const propertiesResult = await supabase
        .from('properties')
        .select('id, title, price')
        .eq('host_id', userId);

      if (propertiesResult.error) throw propertiesResult.error;
      const properties: Property[] = (propertiesResult.data || []).map((p: { id: string; title: string; price: number }) => ({
        id: p.id,
        title: p.title,
        price: p.price
      }));
      const propertyIds = properties.map(p => p.id);

      // Fetch bookings for user's properties
      const bookingsResult = await supabase
        .from('bookings')
        .select('*')
        .in('property_id', propertyIds)
        .gte('created_at', startDate.toISOString());

      if (bookingsResult.error) throw bookingsResult.error;
      let bookings: Booking[] = (bookingsResult.data || []).map((b: {
        id: string;
        property_id: string;
        status: string;
        total_price: number;
        check_in: string;
        check_out: string;
        created_at: string;
      }) => ({
        id: b.id,
        property_id: b.property_id,
        status: b.status,
        total_price: b.total_price,
        check_in: b.check_in,
        check_out: b.check_out,
        created_at: b.created_at
      }));

      // Filter by specific property if provided
      if (propertyId) {
        bookings = bookings.filter(b => b.property_id === propertyId);
      }

      // Fetch reviews for user's properties
      const reviewsResult = await supabase
        .from('reviews')
        .select('*')
        .in('property_id', propertyIds);

      if (reviewsResult.error) throw reviewsResult.error;
      let reviews: Review[] = (reviewsResult.data || []).map((r: {
        id: string;
        property_id: string;
        rating: number;
      }) => ({
        id: r.id,
        property_id: r.property_id,
        rating: r.rating
      }));

      // Filter by specific property if provided
      if (propertyId) {
        reviews = reviews.filter(r => r.property_id === propertyId);
      }

      // Fetch property views
      const viewsResult = await supabase
        .from('property_views')
        .select('*')
        .in('property_id', propertyIds)
        .gte('viewed_at', startDate.toISOString());

      let views = (viewsResult.data || []) as PropertyView[];

      // Filter by specific property if provided
      if (propertyId) {
        views = views.filter(v => v.property_id === propertyId);
      }

      // Calculate analytics
      const analytics = calculateAnalytics(bookings, reviews, properties, views, propertyId);
      
      return analytics;
    },
    enabled: !!userId,
  });
}

interface Booking {
  id: string;
  property_id: string;
  status: string;
  total_price: number;
  check_in: string;
  check_out: string;
  created_at: string;
}

interface Review {
  id: string;
  property_id: string;
  rating: number;
}

interface Property {
  id: string;
  title: string;
  price: number;
}

interface PropertyView {
  id: string;
  property_id: string;
  viewed_at: string;
  user_id?: string;
}

function calculateAnalytics(
  bookings: Booking[],
  reviews: Review[],
  properties: Property[],
  views: PropertyView[],
  propertyId?: string
): AnalyticsData {
  // Calculate total revenue
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  // Calculate total bookings
  const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : 0;

  // Calculate occupancy (simplified - based on bookings vs total days)
  const totalDays = 30; // Last 30 days
  const bookedDays = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
  
  const avgOccupancy = Math.min(100, Math.round((bookedDays / totalDays) * 100));

  // Revenue by month (last 6 months)
  const revenueByMonth = generateRevenueData(bookings);

  // Bookings trend
  const bookingsTrend = generateBookingsTrend(bookings);

  // Occupancy by month
  const occupancyByMonth = generateOccupancyData(bookings);

  // Reviews analytics
  const reviewsAnalytics = generateReviewsAnalytics(reviews);

  // Property comparison
  const propertyComparison = generatePropertyComparison(bookings, reviews, properties);

  // Earnings breakdown
  const earningsBreakdown = generateEarningsBreakdown(bookings);

  // Views analytics
  const viewsAnalytics = generateViewsAnalytics(views, bookings);

  // Booking status distribution
  const bookingStatusData = generateBookingStatusData(bookings);

  return {
    summary: {
      totalRevenue,
      totalBookings,
      avgOccupancy,
      avgRating: Math.round(avgRating * 10) / 10,
      revenueChange: 12.5, // TODO: Calculate actual change
      bookingsChange: 8.2,
      occupancyChange: 5.1,
      ratingChange: 0.2,
    },
    revenue: revenueByMonth,
    bookings: bookingsTrend,
    occupancy: occupancyByMonth,
    reviews: reviewsAnalytics,
    properties: propertyComparison,
    earnings: earningsBreakdown,
    views: viewsAnalytics,
    bookingStatus: bookingStatusData,
  };
}

function generateRevenueData(bookings: Booking[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => {
    const monthBookings = bookings.filter(b => {
      const date = new Date(b.created_at);
      return date.toLocaleString('en', { month: 'short' }) === month;
    });
    
    const revenue = monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const expenses = Math.round(revenue * 0.25); // Estimate 25% expenses
    
    return {
      date: month,
      revenue,
      expenses,
      profit: revenue - expenses,
    };
  });
}

function generateBookingsTrend(bookings: Booking[]) {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
  return weeks.map((week, index) => {
    const weekBookings = bookings.filter(b => {
      const date = new Date(b.created_at);
      const weekNumber = Math.floor((date.getDate() - 1) / 7);
      return weekNumber === index;
    });
    
    return {
      date: week,
      bookings: weekBookings.filter(b => b.status !== 'cancelled').length,
      cancellations: weekBookings.filter(b => b.status === 'cancelled').length,
    };
  });
}

function generateOccupancyData(bookings: Booking[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => {
    const monthBookings = bookings.filter(b => {
      const date = new Date(b.created_at);
      return date.toLocaleString('en', { month: 'short' }) === month;
    });
    
    const occupancy = Math.min(100, monthBookings.length * 10); // Simplified calculation
    
    return {
      month,
      occupancy,
      available: 100 - occupancy,
    };
  });
}

function generateReviewsAnalytics(reviews: Review[]) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
    : 0;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    return {
      stars,
      count,
      percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    };
  });

  // Category ratings (simplified - using overall rating)
  const categories = [
    { name: 'Cleanliness', rating: averageRating },
    { name: 'Communication', rating: averageRating + 0.1 },
    { name: 'Check-in', rating: averageRating - 0.1 },
    { name: 'Accuracy', rating: averageRating },
    { name: 'Location', rating: averageRating + 0.2 },
    { name: 'Value', rating: averageRating - 0.2 },
  ].map(c => ({ ...c, rating: Math.min(5, Math.max(0, c.rating)) }));

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    distribution,
    categories,
  };
}

function generatePropertyComparison(bookings: Booking[], reviews: Review[], properties: Property[]) {
  return properties.slice(0, 4).map(property => {
    const propertyBookings = bookings.filter(b => b.property_id === property.id);
    const propertyReviews = reviews.filter(r => r.property_id === property.id);
    
    const revenue = propertyBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const rating = propertyReviews.length > 0
      ? propertyReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / propertyReviews.length
      : 0;

    return {
      property: property.title,
      revenue,
      bookings: propertyBookings.length,
      rating: Math.round(rating * 10) / 10,
    };
  });
}

function generateEarningsBreakdown(bookings: Booking[]) {
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  
  const rentalIncome = Math.round(totalRevenue * 0.85);
  const cleaningFees = Math.round(totalRevenue * 0.10);
  const serviceFees = Math.round(totalRevenue * 0.05);

  const income = [
    { name: 'Rental Income', value: rentalIncome, color: '#059669' },
    { name: 'Cleaning Fees', value: cleaningFees, color: '#2563eb' },
    { name: 'Service Fees', value: serviceFees, color: '#7c3aed' },
  ];

  const expenses = [
    { category: 'Platform Fees', amount: Math.round(totalRevenue * 0.07), percentage: 7 },
    { category: 'Maintenance', amount: Math.round(totalRevenue * 0.06), percentage: 6 },
    { category: 'Utilities', amount: Math.round(totalRevenue * 0.03), percentage: 3 },
    { category: 'Cleaning', amount: Math.round(totalRevenue * 0.04), percentage: 4 },
    { category: 'Other', amount: Math.round(totalRevenue * 0.02), percentage: 2 },
  ];

  return { income, expenses };
}

function generateViewsAnalytics(views: PropertyView[], bookings: Booking[]) {
  const totalViews = views.length;
  
  // Calculate views this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const viewsThisMonth = views.filter(v => new Date(v.viewed_at) >= startOfMonth).length;
  
  // Calculate view-to-booking rate
  const totalBookings = bookings.filter(b => b.status !== 'cancelled').length;
  const viewToBookingRate = totalViews > 0 ? Math.round((totalBookings / totalViews) * 100) : 0;
  
  // Generate views trend (last 7 days)
  const viewsTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    
    const dayViews = views.filter(v => {
      const viewDate = new Date(v.viewed_at);
      return viewDate.toDateString() === date.toDateString();
    }).length;
    
    viewsTrend.push({ date: dateStr, views: dayViews });
  }
  
  return {
    total_views: totalViews,
    views_this_month: viewsThisMonth,
    view_to_booking_rate: viewToBookingRate,
    views_trend: viewsTrend,
  };
}

function generateBookingStatusData(bookings: Booking[]) {
  const totalBookings = bookings.length;
  
  // Count bookings by status
  const statusCounts: Record<string, number> = {
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    completed: 0,
  };
  
  bookings.forEach(booking => {
    const status = booking.status.toLowerCase();
    if (status in statusCounts) {
      statusCounts[status]++;
    }
  });
  
  // Calculate percentages and format data
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
  }));
  
  return statusData;
}
