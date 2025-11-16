import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Star } from 'lucide-react';

interface PropertyPerformanceProps {
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
  propertyId?: string;
}

export default function PropertyPerformance({ summary, propertyId }: PropertyPerformanceProps) {
  const metrics = [
    {
      label: 'Total Revenue',
      value: `TSh ${summary.totalRevenue.toLocaleString()}`,
      change: `+${summary.revenueChange}%`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Total Bookings',
      value: summary.totalBookings.toString(),
      change: `+${summary.bookingsChange}%`,
      trend: 'up' as const,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Avg Occupancy',
      value: `${summary.avgOccupancy}%`,
      change: `+${summary.occupancyChange}%`,
      trend: 'up' as const,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      label: 'Average Rating',
      value: summary.avgRating.toString(),
      change: `+${summary.ratingChange}`,
      trend: 'up' as const,
      icon: Star,
      color: 'text-yellow-600',
    },
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          🎯 Property Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <div
                key={metric.label}
                className="flex items-center justify-between p-3 sm:p-4 border rounded-xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 ${metric.color}`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-lg sm:text-2xl font-bold">{metric.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <TrendIcon
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
