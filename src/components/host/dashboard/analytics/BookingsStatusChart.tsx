import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CheckCircle, Clock, XCircle, Package } from 'lucide-react';

interface BookingsStatusChartProps {
  data: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export default function BookingsStatusChart({ data }: BookingsStatusChartProps) {
  // Color mapping for each status
  const statusColors: Record<string, string> = {
    confirmed: '#059669', // Emerald 600
    pending: '#d97706',   // Amber 600
    cancelled: '#dc2626', // Red 600
    completed: '#2563eb', // Blue 600
  };

  // Icon mapping for each status
  const statusIcons: Record<string, React.ReactNode> = {
    confirmed: <CheckCircle className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
    completed: <Package className="h-4 w-4" />,
  };

  // Format data for pie chart
  const chartData = data.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    percentage: item.percentage,
    color: statusColors[item.status] || '#94a3b8',
  }));

  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);

  // Custom label renderer
  const renderCustomLabel = ({ name, percentage }: { name: string; percentage: number }) => {
    return `${name}: ${percentage}%`;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          📋 Bookings Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Donut Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomLabel}
              outerRadius={90}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} bookings`, 'Count']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Status Breakdown */}
        <div className="mt-4 space-y-3">
          <div className="text-center pb-3 border-b">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>

          {data.map((item) => (
            <div 
              key={item.status}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${statusColors[item.status]}20`,
                    color: statusColors[item.status]
                  }}
                >
                  {statusIcons[item.status]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {item.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.percentage}% of total
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{item.count}</p>
                <p className="text-xs text-gray-500">bookings</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Quick Insights</h4>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
            {data.find(d => d.status === 'confirmed') && data.find(d => d.status === 'confirmed')!.percentage > 50 && (
              <li className="text-green-700">✅ Great! Most bookings are confirmed</li>
            )}
            {data.find(d => d.status === 'pending') && data.find(d => d.status === 'pending')!.percentage > 30 && (
              <li className="text-amber-700">⏳ High pending bookings - review and confirm quickly</li>
            )}
            {data.find(d => d.status === 'cancelled') && data.find(d => d.status === 'cancelled')!.percentage > 20 && (
              <li className="text-red-700">⚠️ High cancellation rate - review policies</li>
            )}
            {data.find(d => d.status === 'completed') && data.find(d => d.status === 'completed')!.percentage > 40 && (
              <li className="text-blue-700">🎉 Many completed bookings - great track record!</li>
            )}
            {totalBookings === 0 && (
              <li className="text-gray-600">📝 No bookings yet - start promoting your property</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
