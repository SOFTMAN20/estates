import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface RevenueChartProps {
  data: { date: string; revenue: number; expenses: number; profit: number }[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  propertyId?: string;
}

export default function RevenueChart({ data, timeRange, propertyId }: RevenueChartProps) {

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          💰 Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              formatter={(value: number) => `TSh ${value.toLocaleString()}`}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#059669" 
              strokeWidth={3}
              name="Revenue"
              dot={{ fill: '#059669', r: 5 }}
              activeDot={{ r: 7, fill: '#047857' }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#dc2626" 
              strokeWidth={3}
              name="Expenses"
              dot={{ fill: '#dc2626', r: 5 }}
              activeDot={{ r: 7, fill: '#b91c1c' }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#2563eb" 
              strokeWidth={3}
              name="Profit"
              dot={{ fill: '#2563eb', r: 5 }}
              activeDot={{ r: 7, fill: '#1d4ed8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
