import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PropertyTypeDistribution } from '@/types/admin';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PropertyTypesChartProps {
  data: PropertyTypeDistribution[];
}

// Colors for all 9 property types
const TYPE_COLORS: Record<string, string> = {
  'Apartment': '#3b82f6',    // Blue
  'House': '#10b981',        // Green
  'Studio': '#f59e0b',       // Amber
  'Shared Room': '#ef4444',  // Red
  'Bedsitter': '#8b5cf6',    // Purple
  'Lodge': '#ec4899',        // Pink
  'Hotel': '#06b6d4',        // Cyan
  'Hostel': '#84cc16',       // Lime
  'Office': '#f97316',       // Orange
  'other': '#6b7280',        // Gray
};

// Fallback colors for unknown types
const FALLBACK_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'];

export function PropertyTypesChart({ data }: PropertyTypesChartProps) {
  // Format data with proper labels
  const formattedData = data.map(item => ({
    ...item,
    name: item.type, // For legend display
  }));

  const getColor = (type: string, index: number) => {
    return TYPE_COLORS[type] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties by Type</CardTitle>
        <p className="text-sm text-gray-500">Distribution of property types</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percentage }) => percentage > 5 ? `${percentage}%` : ''}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="name"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.type, index)} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [`${value} properties`, name]}
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
