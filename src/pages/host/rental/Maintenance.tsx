/**
 * MAINTENANCE PAGE - Complete maintenance request tracking
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, Wrench, Clock, CheckCircle2, AlertTriangle,
  Calendar, User, Home, MoreHorizontal, MessageSquare, Eye,
  Droplets, Zap, Wind, Microwave, Building, Bug, Package,
  Phone, MapPin, Image as ImageIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMaintenanceRequests, useMaintenanceStats, useUpdateMaintenanceRequest } from '@/hooks/useMaintenance';
import { useLandlordProperties } from '@/hooks/useTenants';
import { CreateMaintenanceModal } from '@/components/host/rental/CreateMaintenanceModal';
import { MaintenanceDetailsModal } from '@/components/host/rental/MaintenanceDetailsModal';
import { format } from 'date-fns';
import type { MaintenanceRequest, MaintenanceStatus, MaintenanceCategory, MaintenancePriority } from '@/types/tenant';

const CATEGORY_ICONS: Record<MaintenanceCategory, React.ReactNode> = {
  plumbing: <Droplets className="h-4 w-4 text-blue-500" />,
  electrical: <Zap className="h-4 w-4 text-yellow-500" />,
  hvac: <Wind className="h-4 w-4 text-cyan-500" />,
  appliance: <Microwave className="h-4 w-4 text-purple-500" />,
  structural: <Building className="h-4 w-4 text-gray-500" />,
  pest_control: <Bug className="h-4 w-4 text-green-500" />,
  other: <Wrench className="h-4 w-4 text-gray-500" />,
};

const CATEGORY_LABELS: Record<MaintenanceCategory, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC / AC',
  appliance: 'Appliance',
  structural: 'Structural',
  pest_control: 'Pest Control',
  other: 'Other',
};

const Maintenance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Data
  const { data: requests = [], isLoading } = useMaintenanceRequests({
    status: statusFilter !== 'all' ? statusFilter as MaintenanceStatus : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter as MaintenancePriority : undefined,
    category: categoryFilter !== 'all' ? categoryFilter as MaintenanceCategory : undefined,
    property_id: propertyFilter !== 'all' ? propertyFilter : undefined,
  });
  const { data: stats } = useMaintenanceStats();
  const { data: properties = [] } = useLandlordProperties();
  const updateRequest = useUpdateMaintenanceRequest();

  // Filter by search
  const filteredRequests = requests.filter(req => {
    const searchLower = searchQuery.toLowerCase();
    return (
      req.title.toLowerCase().includes(searchLower) ||
      req.description.toLowerCase().includes(searchLower) ||
      req.tenant?.user?.full_name?.toLowerCase().includes(searchLower) ||
      req.property?.title?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-100 text-blue-700 border-0 gap-1"><User className="h-3 w-3" />Assigned</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-700 border-0 gap-1"><Calendar className="h-3 w-3" />Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-indigo-100 text-indigo-700 border-0 gap-1"><Wrench className="h-3 w-3" />In Progress</Badge>;
      case 'pending_parts':
        return <Badge className="bg-orange-100 text-orange-700 border-0 gap-1"><Package className="h-3 w-3" />Pending Parts</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 border-0">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: MaintenancePriority) => {
    switch (priority) {
      case 'emergency':
        return <Badge variant="outline" className="border-red-300 text-red-600 bg-red-50 gap-1"><AlertTriangle className="h-3 w-3" />Emergency</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-orange-300 text-orange-600 bg-orange-50">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-600 bg-yellow-50">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-gray-300 text-gray-600 bg-gray-50">Low</Badge>;
      default:
        return null;
    }
  };

  const handleViewDetails = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleQuickStatusChange = async (requestId: string, status: MaintenanceStatus) => {
    await updateRequest.mutateAsync({ requestId, data: { status } });
  };

  return (
    <RentalManagerLayout 
      title="Maintenance" 
      subtitle="Track and manage maintenance requests"
      action={
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Card className={`border-gray-200 cursor-pointer transition-colors ${statusFilter === 'all' ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-gray-200 cursor-pointer transition-colors ${statusFilter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`} onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-gray-200 cursor-pointer transition-colors ${statusFilter === 'in_progress' ? 'ring-2 ring-indigo-500' : ''}`} onClick={() => setStatusFilter('in_progress')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-indigo-600">{stats?.in_progress || 0}</p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Wrench className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-gray-200 cursor-pointer transition-colors ${statusFilter === 'completed' ? 'ring-2 ring-green-500' : ''}`} onClick={() => setStatusFilter('completed')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{(stats?.high_priority || 0) + (stats?.emergency || 0)}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            
            {/* Property Filter */}
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[130px]">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No maintenance requests</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Create your first maintenance request'}
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Category Icon */}
                  <div className="hidden lg:flex p-3 bg-gray-100 rounded-lg">
                    {CATEGORY_ICONS[request.category]}
                  </div>
                  
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      {getPriorityBadge(request.priority)}
                      <Badge variant="outline" className="text-xs">
                        {CATEGORY_LABELS[request.category]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {request.tenant && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {request.tenant.user?.full_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        {request.property?.title}
                      </span>
                      {request.location_in_property && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.location_in_property}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>

                    {/* Assignment & Schedule Info */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      {request.assigned_to && (
                        <span className="text-sm text-blue-600 flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {request.assigned_to}
                          {request.assigned_contact && (
                            <a href={`tel:${request.assigned_contact}`} className="ml-1">
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </span>
                      )}
                      {request.scheduled_date && (
                        <span className="text-sm text-purple-600 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Scheduled: {format(new Date(request.scheduled_date), 'MMM d')}
                        </span>
                      )}
                      {request.images && request.images.length > 0 && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <ImageIcon className="h-3.5 w-3.5" />
                          {request.images.length} photo{request.images.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    {getStatusBadge(request.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                          <Eye className="h-4 w-4 mr-2" />View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {request.status !== 'completed' && request.status !== 'cancelled' && (
                          <>
                            {request.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleQuickStatusChange(request.id, 'in_progress')}>
                                <Wrench className="h-4 w-4 mr-2" />Start Work
                              </DropdownMenuItem>
                            )}
                            {request.status === 'in_progress' && (
                              <DropdownMenuItem onClick={() => handleQuickStatusChange(request.id, 'pending_parts')}>
                                <Package className="h-4 w-4 mr-2" />Waiting for Parts
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleQuickStatusChange(request.id, 'completed')}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleQuickStatusChange(request.id, 'cancelled')}
                              className="text-red-600"
                            >
                              Cancel Request
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateMaintenanceModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
      
      {selectedRequest && (
        <MaintenanceDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          request={selectedRequest}
        />
      )}
    </RentalManagerLayout>
  );
};

export default Maintenance;
