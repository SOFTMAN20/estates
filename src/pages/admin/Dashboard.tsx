import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatisticsCards } from '@/components/admin/StatisticsCards';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { UserGrowthChart } from '@/components/admin/UserGrowthChart';
import { BookingTrendsChart } from '@/components/admin/BookingTrendsChart';
import { PropertyTypesChart } from '@/components/admin/PropertyTypesChart';
import { RecentActivity } from '@/components/admin/RecentActivity';

// Mock data for UI preview
const mockStats = {
  totalUsers: 1247,
  userGrowth: 12.5,
  regularUsers: 1245,
  adminUsers: 2,
  
  totalProperties: 342,
  pendingProperties: 23,
  approvedProperties: 298,
  rejectedProperties: 21,
  newPropertiesThisMonth: 45,
  
  totalBookings: 856,
  confirmedBookings: 678,
  completedBookings: 734,
  cancelledBookings: 122,
  bookingsThisMonth: 156,
  
  totalRevenue: 45678900,
  platformCommission: 4567890,
  revenueThisMonth: 5200000,
  revenueGrowth: 15.3,
};

const mockRevenueData = [
  { month: 'Jul', revenue: 3200000, commission: 320000 },
  { month: 'Aug', revenue: 3800000, commission: 380000 },
  { month: 'Sep', revenue: 4100000, commission: 410000 },
  { month: 'Oct', revenue: 3900000, commission: 390000 },
  { month: 'Nov', revenue: 4500000, commission: 450000 },
  { month: 'Dec', revenue: 5200000, commission: 520000 },
];

const mockUserGrowthData = [
  { month: 'Jul', users: 850, hosts: 145 },
  { month: 'Aug', users: 920, hosts: 162 },
  { month: 'Sep', users: 1050, hosts: 189 },
  { month: 'Oct', users: 1120, hosts: 205 },
  { month: 'Nov', users: 1180, hosts: 223 },
  { month: 'Dec', users: 1247, hosts: 245 },
];

const mockBookingTrends = [
  { month: 'Jul', bookings: 120, revenue: 3200000 },
  { month: 'Aug', bookings: 135, revenue: 3800000 },
  { month: 'Sep', bookings: 148, revenue: 4100000 },
  { month: 'Oct', bookings: 142, revenue: 3900000 },
  { month: 'Nov', bookings: 156, revenue: 4500000 },
  { month: 'Dec', bookings: 155, revenue: 5200000 },
];

const mockPropertyTypes = [
  { type: 'Apartment', count: 145, percentage: 42 },
  { type: 'House', count: 98, percentage: 29 },
  { type: 'Studio', count: 67, percentage: 20 },
  { type: 'Room', count: 32, percentage: 9 },
];

export default function AdminDashboard() {
  // Using mock data for UI preview

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1 md:mt-2">Welcome back! Here's what's happening with NyumbaLink.</p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 md:mb-8">
          <StatisticsCards stats={mockStats} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <RevenueChart data={mockRevenueData} />
          <UserGrowthChart data={mockUserGrowthData} />
          <BookingTrendsChart data={mockBookingTrends} />
          <PropertyTypesChart data={mockPropertyTypes} />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
