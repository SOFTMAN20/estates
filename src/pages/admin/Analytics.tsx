/**
 * Admin Analytics Page
 * Detailed analytics and insights
 */

import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Home, Calendar, 
  DollarSign, MapPin, Clock, Star 
} from 'lucide-react';

// Mock data
const revenueByMonth = [
  { month: 'Jan', revenue: 2800000, bookings: 95, properties: 280 },
  { month: 'Feb', revenue: 3100000, bookings: 105, properties: 295 },
  { month: 'Mar', revenue: 3400000, bookings: 115, properties: 310 },
  { month: 'Apr', revenue: 3200000, bookings: 108, properties: 320 },
  { month: 'May', revenue: 3600000, bookings: 122, properties: 330 },
  { month: 'Jun', revenue: 3900000, bookings: 132, properties: 335 },
  { month: 'Jul', revenue: 4200000, bookings: 142, properties: 340 },
  { month: 'Aug', revenue: 4500000, bookings: 152, properties: 342 },
];

const propertyTypePerformance = [
  { type: 'Apartment', bookings: 245, revenue: 18500000, avgRating: 4.5 },
  { type: 'House', bookings: 189, revenue: 24300000, avgRating: 4.7 },
  { type: 'Studio', bookings: 156, revenue: 9800000, avgRating: 4.3 },
  { type: 'Room', bookings: 98, revenue: 4200000, avgRating: 4.1 },
];

const locationAnalytics = [
  { location: 'Masaki', properties: 45, bookings: 156, revenue: 12400000 },
  { location: 'Mikocheni', properties: 38, bookings: 132, revenue: 8900000 },
  { location: 'Oysterbay', properties: 32, bookings: 98, revenue: 15600000 },
  { location: 'Mbezi Beach', properties: 28, bookings: 87, revenue: 11200000 },
  { location: 'Kinondoni', properties: 52, bookings: 178, revenue: 7800000 },
];

const userGrowthData = [
  { month: 'Jan', guests: 680, hosts: 125 },
  { month: 'Feb', guests: 745, hosts: 138 },
  { month: 'Mar', guests: 820, hosts: 152 },
  { month: 'Apr', guests: 890, hosts: 168 },
  { month: 'May', guests: 965, hosts: 185 },
  { month: 'Jun', guests: 1045, hosts: 203 },
  { month: 'Jul', guests: 1125, hosts: 221 },
  { month: 'Aug', guests: 1205, hosts: 245 },
];

const bookingDurationData = [
  { duration: '1 month', count: 245, percentage: 35 },
  { duration: '2-3 months', count: 312, percentage: 45 },
  { duration: '4-6 months', count: 98, percentage: 14 },
  { duration: '6+ months', count: 42, percentage: 6 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('6months');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(price);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Detailed insights and performance metrics</p>
          </div>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(28700000)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+12.5%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(1245000)}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+8.2%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+5.3%</span> from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.6</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+0.2</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different analytics */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          {/* Revenue Analytics */}
          <TabsContent value="revenue" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatPrice(value)} />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Property Type</CardTitle>
                  <CardDescription>Performance comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={propertyTypePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis tickFormatter={(value) => formatPrice(value)} />
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                      <Bar dataKey="revenue" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Booking Duration Distribution</CardTitle>
                <CardDescription>How long guests typically stay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={bookingDurationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ duration, percentage }) => `${duration}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {bookingDurationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {bookingDurationData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{item.duration}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.count}</div>
                          <div className="text-sm text-gray-500">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Property Analytics */}
          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Growth</CardTitle>
                <CardDescription>New properties added over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="properties" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Type Performance</CardTitle>
                <CardDescription>Bookings and ratings by property type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {propertyTypePerformance.map((property, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-lg">{property.type}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {property.bookings} bookings • {formatPrice(property.revenue)} revenue
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{property.avgRating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Analytics */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Guests and hosts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="guests" stroke="#3b82f6" strokeWidth={2} name="Guests" />
                    <Line type="monotone" dataKey="hosts" stroke="#10b981" strokeWidth={2} name="Hosts" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,450</div>
                  <p className="text-xs text-muted-foreground mt-1">+156 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Active Hosts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">245</div>
                  <p className="text-xs text-muted-foreground mt-1">+24 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Guest Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground mt-1">Repeat bookings</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Location Analytics */}
          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Performance by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationAnalytics.map((location, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-lg">{location.location}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {location.properties} properties • {location.bookings} bookings
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatPrice(location.revenue)}</div>
                        <div className="text-sm text-gray-500">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Revenue Comparison</CardTitle>
                <CardDescription>Revenue by location</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationAnalytics} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatPrice(value)} />
                    <YAxis dataKey="location" type="category" width={100} />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
