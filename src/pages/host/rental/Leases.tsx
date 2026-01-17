/**
 * LEASES PAGE - Complete lease agreement management
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, FileText, MoreHorizontal, 
  CheckCircle2, Clock, AlertTriangle, Calendar,
  Home, Download, Eye, Edit, Trash2, RefreshCw,
  PenTool, Send, FileSignature
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
import { useLeaseAgreements, useLandlordProperties, useSignLease, useTerminateLease } from '@/hooks/useTenants';
import { CreateLeaseModal } from '@/components/host/rental/CreateLeaseModal';
import { LeaseDetailsModal } from '@/components/host/rental/LeaseDetailsModal';
import { format, differenceInDays } from 'date-fns';
import type { LeaseAgreement } from '@/types/tenant';

const Leases = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Data
  const { data: leases = [], isLoading } = useLeaseAgreements({ 
    status: statusFilter !== 'all' ? statusFilter : undefined,
    property_id: propertyFilter !== 'all' ? propertyFilter : undefined 
  });
  const { data: properties = [] } = useLandlordProperties();
  const signLease = useSignLease();
  const terminateLease = useTerminateLease();

  // Filter leases by search
  const filteredLeases = leases.filter(lease => {
    const searchLower = searchQuery.toLowerCase();
    const tenantName = lease.tenant?.user?.full_name || lease.tenant?.tenant_name || '';
    return (
      tenantName.toLowerCase().includes(searchLower) ||
      lease.tenant?.property?.title?.toLowerCase().includes(searchLower)
    );
  });

  // Stats
  const stats = {
    total: leases.length,
    draft: leases.filter(l => l.status === 'draft').length,
    pending: leases.filter(l => l.status === 'pending_signature').length,
    active: leases.filter(l => l.status === 'active').length,
    expiring: leases.filter(l => {
      if (l.status !== 'active') return false;
      const daysLeft = differenceInDays(new Date(l.end_date), new Date());
      return daysLeft <= 30 && daysLeft > 0;
    }).length,
    expired: leases.filter(l => l.status === 'expired').length,
  };

  const getStatusBadge = (status: string, endDate: string) => {
    const daysLeft = differenceInDays(new Date(endDate), new Date());
    
    if (status === 'active' && daysLeft <= 30 && daysLeft > 0) {
      return <Badge className="bg-yellow-100 text-yellow-700 border-0 gap-1"><Clock className="h-3 w-3" />Expiring Soon</Badge>;
    }
    
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-0 gap-1"><FileText className="h-3 w-3" />Draft</Badge>;
      case 'pending_signature':
        return <Badge className="bg-blue-100 text-blue-700 border-0 gap-1"><PenTool className="h-3 w-3" />Pending Signature</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><AlertTriangle className="h-3 w-3" />Expired</Badge>;
      case 'terminated':
        return <Badge className="bg-gray-100 text-gray-700 border-0 gap-1"><Trash2 className="h-3 w-3" />Terminated</Badge>;
      default:
        return null;
    }
  };

  const getAgreementTypeBadge = (type: string) => {
    switch (type) {
      case 'standard':
        return <Badge variant="outline" className="text-xs">Standard</Badge>;
      case 'month-to-month':
        return <Badge variant="outline" className="text-xs">Month-to-Month</Badge>;
      case 'fixed-term':
        return <Badge variant="outline" className="text-xs">Fixed Term</Badge>;
      default:
        return null;
    }
  };

  const handleViewDetails = (lease: any) => {
    setSelectedLease(lease);
    setShowDetailsModal(true);
  };

  const handleSignLease = async (leaseId: string) => {
    await signLease.mutateAsync({ leaseId, role: 'landlord' });
  };

  const handleTerminate = async (leaseId: string) => {
    if (confirm('Are you sure you want to terminate this lease?')) {
      await terminateLease.mutateAsync(leaseId);
    }
  };

  return (
    <RentalManagerLayout 
      title="Lease Agreements" 
      subtitle="Manage lease contracts"
      action={
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Lease
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <button 
          onClick={() => setStatusFilter('all')} 
          className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === 'all' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total</p>
        </button>
        <button 
          onClick={() => setStatusFilter('draft')} 
          className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === 'draft' ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
          <p className="text-sm text-gray-500">Draft</p>
        </button>
        <button 
          onClick={() => setStatusFilter('pending_signature')} 
          className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === 'pending_signature' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </button>
        <button 
          onClick={() => setStatusFilter('active')} 
          className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === 'active' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Active</p>
        </button>
        <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-200">
          <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
          <p className="text-sm text-gray-500">Expiring</p>
        </div>
        <button 
          onClick={() => setStatusFilter('expired')} 
          className={`p-3 rounded-lg border text-left transition-colors ${statusFilter === 'expired' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
        >
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
          <p className="text-sm text-gray-500">Expired</p>
        </button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leases..."
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
          </div>
        </CardContent>
      </Card>

      {/* Leases List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading leases...</p>
        </div>
      ) : filteredLeases.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No lease agreements found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Create your first lease agreement'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Lease
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeases.map((lease) => {
            const daysRemaining = differenceInDays(new Date(lease.end_date), new Date());
            // Support both linked and independent tenants
            const tenantName = lease.tenant?.user?.full_name || lease.tenant?.tenant_name || 'Unknown Tenant';
            const tenantAvatar = lease.tenant?.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=3b82f6&color=fff`;
            
            return (
              <Card key={lease.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Tenant & Property Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <img
                          src={tenantAvatar}
                          alt={tenantName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                          <FileSignature className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {tenantName}
                          </h3>
                          {getAgreementTypeBadge(lease.agreement_type)}
                          {!lease.tenant?.user_id && (
                            <Badge variant="outline" className="text-xs">Independent</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Home className="h-3.5 w-3.5" />
                          <span className="truncate">{lease.tenant?.property?.title || 'Unknown Property'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lease Details */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      <div className="text-sm">
                        <p className="text-gray-500">Monthly Rent</p>
                        <p className="font-semibold text-gray-900">TZS {lease.monthly_rent?.toLocaleString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Deposit</p>
                        <p className="font-medium text-gray-900">TZS {lease.security_deposit?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(lease.start_date), 'MMM d')} - {format(new Date(lease.end_date), 'MMM d, yy')}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-500">Days Left</p>
                        <p className={`font-semibold ${daysRemaining <= 30 ? 'text-red-600' : daysRemaining <= 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {daysRemaining > 0 ? daysRemaining : 'Expired'}
                        </p>
                      </div>
                      
                      {/* Signatures */}
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${lease.landlord_signed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <PenTool className={`h-3 w-3 ${lease.landlord_signed ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${lease.tenant_signed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <PenTool className={`h-3 w-3 ${lease.tenant_signed ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      
                      {getStatusBadge(lease.status, lease.end_date)}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(lease)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {lease.document_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={lease.document_url} download>
                            <Download className="h-3.5 w-3.5" />
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
                          <DropdownMenuItem onClick={() => handleViewDetails(lease)}>
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </DropdownMenuItem>
                          {lease.status === 'draft' && (
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />Edit Lease
                            </DropdownMenuItem>
                          )}
                          {!lease.landlord_signed && lease.status !== 'terminated' && (
                            <DropdownMenuItem onClick={() => handleSignLease(lease.id)}>
                              <PenTool className="h-4 w-4 mr-2" />Sign as Landlord
                            </DropdownMenuItem>
                          )}
                          {lease.status === 'draft' && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />Send to Tenant
                            </DropdownMenuItem>
                          )}
                          {lease.document_url && (
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />Download PDF
                            </DropdownMenuItem>
                          )}
                          {(lease.status === 'expired' || lease.status === 'active') && (
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />Renew Lease
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />Set Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {lease.status !== 'terminated' && lease.status !== 'expired' && (
                            <DropdownMenuItem 
                              onClick={() => handleTerminate(lease.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />Terminate
                            </DropdownMenuItem>
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
      <CreateLeaseModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal}
      />
      
      {selectedLease && (
        <LeaseDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          lease={selectedLease}
        />
      )}
    </RentalManagerLayout>
  );
};

export default Leases;
