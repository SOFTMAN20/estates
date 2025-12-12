import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BookingTrendDataPoint } from '@/types/admin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BookingTrendsChartProps {
  data: BookingTrendDataPoint[];
}

export function BookingTrendsChart({ data }: BookingTrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
        <p className="text-sm text-gray-500">Monthly bookings and revenue</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="bookings" fill="#3b82f6" name="Bookings" />
            <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (TZS)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
