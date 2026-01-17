/**
 * TENANTS PAGE - Complete tenant management
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, Phone, Mail, MoreHorizontal, 
  CheckCircle2, Clock, AlertTriangle, Calendar,
  Home, DollarSign, FileText, MessageSquare, Users,
  TrendingUp, Eye, UserX
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
import { useTenants, useTenantStats, useLandlordProperties } from '@/hooks/useTenants';
import { AddTenantModal } from '@/components/host/rental/AddTenantModal';
import { TenantDetailsModal } from '@/components/host/rental/TenantDetailsModal';
import { RecordPaymentModal } from '@/components/host/rental/RecordPaymentModal';
import { EndTenancyModal } from '@/components/host/rental/EndTenancyModal';
import type { Tenant, TenantFilters } from '@/types/tenant';

const Tenants = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'ended' | 'evicted'>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEndTenancyModal, setShowEndTenancyModal] = useState(false);

  // Data
  const filters: TenantFilters = {
    status: statusFilter,
    property_id: propertyFilter !== 'all' ? propertyFilter : undefined,
    payment_status: paymentFilter,
  };
  
  const { data: tenants = [], isLoading } = useTenants(filters);
  const { data: stats } = useTenantStats();
  const { data: properties = [], isLoading: propertiesLoading } = useLandlordProperties();

  // Filter tenants by search
  const filteredTenants = tenants.filter(tenant => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      tenant.user?.full_name?.toLowerCase().includes(searchLower) ||
      tenant.user?.email?.toLowerCase().includes(searchLower) ||
      tenant.property?.title?.toLowerCase().includes(searchLower);
    
    // Payment status filter
    if (paymentFilter === 'overdue' && !tenant.is_late_on_rent) return false;
    if (paymentFilter === 'paid' && tenant.is_late_on_rent) return false;
    
    return matchesSearch;
  });

  const getPaymentBadge = (tenant: Tenant) => {
    if (tenant.is_late_on_rent) {
      return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><AlertTriangle className="h-3 w-3" />Overdue</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />On Time</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>;
      case 'ended':
        return <Badge className="bg-gray-100 text-gray-700 border-0">Ended</Badge>;
      case 'evicted':
        return <Badge className="bg-red-100 text-red-700 border-0">Evicted</Badge>;
      default:
        return null;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDetailsModal(true);
  };

  const handleRecordPayment = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowPaymentModal(true);
  };

  const handleEndTenancy = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowEndTenancyModal(true);
  };

  return (
    <RentalManagerLayout 
      title="Tenants" 
      subtitle="Manage your tenants"
      action={
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_tenants || 0}</p>
                <p className="text-sm text-gray-500">Total Tenants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats?.active_tenants || 0}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  TZS {((stats?.total_monthly_rent || 0) / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-500">Monthly Rent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats?.on_time_payment_rate || 100}%</p>
                <p className="text-sm text-gray-500">On-Time Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats?.late_payments_count || 0}</p>
                <p className="text-sm text-gray-500">Late Payments</p>
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
                placeholder="Search tenants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            
            {/* Property Filter */}
            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Payment Status Filter */}
            <Select value={paymentFilter} onValueChange={(v: any) => setPaymentFilter(v)}>
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">On Time</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)} className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All ({tenants.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({tenants.filter(t => t.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="ended">Past ({tenants.filter(t => t.status === 'ended').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tenants List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading tenants...</p>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tenants found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Add your first tenant to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Tenant
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTenants.map((tenant) => {
            const daysRemaining = getDaysRemaining(tenant.lease_end_date);
            // Get tenant display name - use tenant_name for independent tenants
            const tenantName = tenant.user?.full_name || tenant.tenant_name || 'Unknown Tenant';
            const tenantEmail = tenant.user?.email || tenant.tenant_email;
            const tenantPhone = tenant.user?.phone || tenant.tenant_phone;
            const tenantAvatar = tenant.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=3b82f6&color=fff`;
            
            return (
              <Card key={tenant.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar & Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={tenantAvatar}
                        alt={tenantName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {tenantName}
                          </h3>
                          {getStatusBadge(tenant.status)}
                          {!tenant.user_id && (
                            <Badge variant="outline" className="text-xs">Independent</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Home className="h-3.5 w-3.5" />
                          <span className="truncate">{tenant.property?.title || 'Unknown Property'}</span>
                        </div>
                        {tenantEmail && (
                          <p className="text-xs text-gray-400 truncate">{tenantEmail}</p>
                        )}
                      </div>
                    </div>

                    {/* Rent & Lease Info */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="text-sm">
                        <p className="text-gray-500">Rent</p>
                        <p className="font-semibold text-gray-900">TZS {tenant.monthly_rent.toLocaleString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Lease Ends</p>
                        <p className="font-medium text-gray-900">
                          {new Date(tenant.lease_end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        {tenant.status === 'active' && daysRemaining <= 30 && daysRemaining > 0 && (
                          <p className="text-xs text-yellow-600">{daysRemaining} days left</p>
                        )}
                      </div>
                      {tenant.status === 'active' && getPaymentBadge(tenant)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {tenantPhone && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${tenantPhone}`}>
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      {tenantEmail && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${tenantEmail}`}>
                            <Mail className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(tenant)}>
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/messages?tenant=${tenant.user_id}`)}>
                            <MessageSquare className="h-4 w-4 mr-2" />Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDetails(tenant)}>
                            <FileText className="h-4 w-4 mr-2" />View Lease
                          </DropdownMenuItem>
                          {tenant.status === 'active' && (
                            <>
                              <DropdownMenuItem onClick={() => handleRecordPayment(tenant)}>
                                <DollarSign className="h-4 w-4 mr-2" />Record Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewDetails(tenant)}>
                                <Calendar className="h-4 w-4 mr-2" />Renew Lease
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleEndTenancy(tenant)}
                                className="text-red-600"
                              >
                                <UserX className="h-4 w-4 mr-2" />End Tenancy
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddTenantModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        properties={properties}
      />
      
      {selectedTenant && (
        <>
          <TenantDetailsModal
            open={showDetailsModal}
            onOpenChange={setShowDetailsModal}
            tenant={selectedTenant}
          />
          
          <RecordPaymentModal
            open={showPaymentModal}
            onOpenChange={setShowPaymentModal}
            tenant={selectedTenant}
          />
          
          <EndTenancyModal
            open={showEndTenancyModal}
            onOpenChange={setShowEndTenancyModal}
            tenant={selectedTenant}
          />
        </>
      )}
    </RentalManagerLayout>
  );
};

export default Tenants;
