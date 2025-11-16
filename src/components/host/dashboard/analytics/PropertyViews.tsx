import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, TrendingUp, MousePointerClick } from 'lucide-react';

interface PropertyViewsProps {
  data: {
    total_views: number;
    views_this_month: number;
    view_to_booking_rate: number;
    views_trend: { date: string; views: number }[];
  };
}

export default function PropertyViews({ data }: PropertyViewsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Views</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {data.total_views.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time property views
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">This Month</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {data.views_this_month.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Views in current month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Conversion Rate</CardTitle>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center">
              <MousePointerClick className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              {data.view_to_booking_rate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Views to bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Views Trend Chart */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            👁️ Views Trend (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.views_trend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <Tooltip 
                formatter={(value: number) => [`${value} views`, 'Views']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 5 }}
                activeDot={{ r: 7, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Insights */}
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Insights</h4>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li>• {data.total_views > 0 ? `Your properties have been viewed ${data.total_views.toLocaleString()} times` : 'No views yet'}</li>
              <li>• {data.views_this_month > 0 ? `${data.views_this_month} views this month` : 'No views this month yet'}</li>
              <li>• {data.view_to_booking_rate > 0 
                ? `${data.view_to_booking_rate}% of viewers book your property` 
                : 'Start getting bookings to see conversion rate'}</li>
              {data.view_to_booking_rate < 5 && data.total_views > 20 && (
                <li className="text-orange-700">⚠️ Low conversion rate - consider improving photos or pricing</li>
              )}
              {data.view_to_booking_rate >= 10 && (
                <li className="text-green-700">✅ Great conversion rate! Your property is attractive to guests</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
