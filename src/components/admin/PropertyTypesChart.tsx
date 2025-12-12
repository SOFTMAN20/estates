import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PropertyTypeDistribution } from '@/types/admin';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PropertyTypesChartProps {
  data: PropertyTypeDistribution[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function PropertyTypesChart({ data }: PropertyTypesChartProps) {
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
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percentage }) => `${type}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
