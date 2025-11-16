import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Star, 
  Eye,
  DollarSign,
  Home,
  FileText,
  Download,
  ArrowLeft,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface AnalyticsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
  summaryStats?: {
    totalRevenue: number;
    totalBookings: number;
    avgOccupancy: number;
    avgRating: number;
  };
  selectedProperty: string;
  onPropertyChange: (propertyId: string) => void;
  propertyList: { id: string; title: string }[];
  selectedProperty: string;
  onPropertyChange: (propertyId: string) => void;
  propertyList: { id: string; title: string }[];
}

export default function AnalyticsSidebar({
  activeTab,
  onTabChange,
  timeRange,
  onTimeRangeChange,
  summaryStats,
  selectedProperty,
  onPropertyChange,
  propertyList,
}: AnalyticsSidebarProps) {
  const navigate = useNavigate();
  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: DollarSign, color: 'text-green-600' },
    { id: 'occupancy', label: 'Occupancy', icon: Home, color: 'text-purple-600' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, color: 'text-blue-600' },
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'text-yellow-600' },
    { id: 'views', label: 'Views', icon: Eye, color: 'text-indigo-600' },
  ];

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 overflow-y-auto pb-20 bg-white border-r border-gray-200">
      <div className="p-4 space-y-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="w-full justify-start gap-2 hover:bg-gray-100 -ml-2"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-base font-semibold">Back</span>
        </Button>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            📊 Analytics
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track your properties' performance
          </p>
        </div>

        {/* Property Selector */}
        <div className="space-y-2">
          <Select value={selectedProperty} onValueChange={onPropertyChange}>
            <SelectTrigger className="w-full bg-white shadow-sm border-gray-300 h-12 text-base">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="font-semibold text-base">All Properties</span>
              </SelectItem>
              {propertyList.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      {/* Navigation */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : tab.color)} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Time Range */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Time Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {timeRanges.map((range) => {
            const isActive = timeRange === range.value;
            
            return (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value as '7d' | '30d' | '90d' | '1y')}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {range.label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2"
          >
            <FileText className="h-4 w-4" />
            Generate PDF
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
