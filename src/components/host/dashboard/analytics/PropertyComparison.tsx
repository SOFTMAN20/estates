import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PropertyComparisonProps {
  data: { property: string; revenue: number; bookings: number; rating: number }[];
}

export default function PropertyComparison({ data }: PropertyComparisonProps) {

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          🏘️ Property Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12 }}
              stroke="#888"
            />
            <YAxis 
              dataKey="property" 
              type="category" 
              width={100}
              tick={{ fontSize: 11 }}
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
            <Bar 
              dataKey="revenue" 
              fill="#059669" 
              name="Revenue"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 space-y-2">
          {data.map((property) => (
            <div key={property.property} className="flex items-center justify-between text-xs sm:text-sm p-2 rounded-lg hover:bg-gray-50">
              <span className="font-medium truncate max-w-[120px] sm:max-w-none">{property.property}</span>
              <div className="flex gap-2 sm:gap-4 text-muted-foreground">
                <span className="whitespace-nowrap">{property.bookings} 📦</span>
                <span className="whitespace-nowrap">⭐ {property.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
