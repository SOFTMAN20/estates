import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { BookingsChartProps } from '@/types/analytics';

interface BookingsChartPropsExtended extends BookingsChartProps {
  propertyId?: string;
}

export default function BookingsChart({ data, timeRange, propertyId }: BookingsChartPropsExtended) {

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          📅 Bookings Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="bookings" 
              stackId="1"
              stroke="#2563eb" 
              fill="#3b82f6" 
              fillOpacity={0.7}
              name="Bookings"
            />
            <Area 
              type="monotone" 
              dataKey="cancellations" 
              stackId="2"
              stroke="#dc2626" 
              fill="#ef4444" 
              fillOpacity={0.7}
              name="Cancellations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
