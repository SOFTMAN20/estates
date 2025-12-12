import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserGrowthDataPoint } from '@/types/admin';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserGrowthChartProps {
  data: UserGrowthDataPoint[];
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <p className="text-sm text-gray-500">Total users and hosts over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="users" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Total Users" />
            <Area type="monotone" dataKey="hosts" stackId="2" stroke="#f59e0b" fill="#f59e0b" name="Hosts" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
