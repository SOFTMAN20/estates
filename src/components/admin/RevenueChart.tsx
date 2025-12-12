import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RevenueDataPoint } from '@/types/admin';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <p className="text-sm text-gray-500">Last 6 months revenue and commission</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `TZS ${Number(value).toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Total Revenue" />
            <Line type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={2} name="Platform Commission" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
