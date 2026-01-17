/**
 * PAYMENTS PAGE - Complete rent payment tracking
 */

import React, { useState } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, Download, CheckCircle2, Clock, AlertTriangle,
  DollarSign, TrendingUp, Calendar, MoreHorizontal, 
  ArrowUpRight, ArrowDownRight, Receipt, FileText, Ban,
  CreditCard, Smartphone, Building2, Banknote, Eye
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
import { useRentPayments, useRentPaymentStats, useLandlordProperties, useTenants } from '@/hooks/useTenants';
import { RentRecordPaymentModal } from '@/components/host/rental/RentRecordPaymentModal';
import { PaymentDetailsModal } from '@/components/host/rental/PaymentDetailsModal';
import { WaivePaymentModal } from '@/components/host/rental/WaivePaymentModal';
import { format, differenceInDays } from 'date-fns';
import type { RentPayment } from '@/types/tenant';

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  
  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showWaiveModal, setShowWaiveModal] = useState(false);

  // Data
  const { data: payments = [], isLoading } = useRentPayments({ 
    status: statusFilter !== 'all' ? statusFilter : undefined,
    property_id: propertyFilter !== 'all' ? propertyFilter : undefined,
    tenant_id: tenantFilter !== 'all' ? tenantFilter : undefined,
  });
  const { data: stats } = useRentPaymentStats();
  const { data: properties = [] } = useLandlordProperties();
  const { data: tenants = [] } = useTenants({ status: 'active' });

  // Filter payments by search
  const filteredPayments = payments.filter(payment => {
    const searchLower = searchQuery.toLowerCase();
    const tenantName = payment.tenant?.user?.full_name || payment.tenant?.tenant_name || '';
    return (
      tenantName.toLowerCase().includes(searchLower) ||
      payment.tenant?.property?.title?.toLowerCase().includes(searchLower) ||
      payment.transaction_id?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><AlertTriangle className="h-3 w-3" />Late</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-700 border-0 gap-1"><DollarSign className="h-3 w-3" />Partial</Badge>;
      case 'waived':
        return <Badge className="bg-gray-100 text-gray-700 border-0 gap-1"><Ban className="h-3 w-3" />Waived</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case 'mpesa':
        return <Smartphone className="h-4 w-4 text-green-600" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case 'cash':
        return <Banknote className="h-4 w-4 text-yellow-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRecordPayment = (payment?: any) => {
    setSelectedPayment(payment || null);
    setShowRecordModal(true);
  };

  const handleWaivePayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowWaiveModal(true);
  };

  const getDaysOverdue = (dueDate: string) => {
    const days = differenceInDays(new Date(), new Date(dueDate));
    return days > 0 ? days : 0;
  };

  return (
    <RentalManagerLayout 
      title="Rent Payments" 
      subtitle="Track and manage rent payments"
      action={
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => handleRecordPayment()} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Collected</p>
                <p className="text-2xl font-bold text-green-600">
                  TZS {((stats?.totalCollected || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  TZS {((stats?.totalPending || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  TZS {((stats?.totalOverdue || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Late Fees</p>
                <p className="text-2xl font-bold text-orange-600">
                  TZS {((stats?.totalLateFees || 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.currentMonthExpected ? 
                    Math.round((stats.currentMonthCollected / stats.currentMonthExpected) * 100) : 0}%
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
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
                placeholder="Search by tenant, property, or transaction ID..."
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
            
            {/* Tenant Filter */}
            <Select value={tenantFilter} onValueChange={setTenantFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="All Tenants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tenants</SelectItem>
                {tenants.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.user?.full_name || t.tenant_name || 'Unknown Tenant'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mt-4">
            <TabsList>
              <TabsTrigger value="all">All ({payments.length})</TabsTrigger>
              <TabsTrigger value="paid">Paid ({stats?.paidCount || 0})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats?.pendingCount || 0})</TabsTrigger>
              <TabsTrigger value="late">Late ({stats?.lateCount || 0})</TabsTrigger>
              <TabsTrigger value="partial">Partial ({stats?.partialCount || 0})</TabsTrigger>
              <TabsTrigger value="waived">Waived ({stats?.waivedCount || 0})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payments Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading payments...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No payments found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Try adjusting your search' : 'Payment records will appear here'}
          </p>
        </div>
      ) : (
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Tenant</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Month</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount Due</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount Paid</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Late Fee</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Due Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Method</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => {
                    const daysOverdue = getDaysOverdue(payment.due_date);
                    const remaining = payment.amount_due - (payment.amount_paid || 0);
                    // Support both linked and independent tenants
                    const tenantName = payment.tenant?.user?.full_name || payment.tenant?.tenant_name || 'Unknown Tenant';
                    const tenantAvatar = payment.tenant?.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=3b82f6&color=fff&size=32`;
                    
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={tenantAvatar}
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{tenantName}</p>
                              <p className="text-xs text-gray-500">{payment.tenant?.property?.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {format(new Date(payment.payment_month), 'MMM yyyy')}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">TZS {payment.amount_due?.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`font-semibold ${payment.amount_paid >= payment.amount_due ? 'text-green-600' : 'text-gray-900'}`}>
                            TZS {(payment.amount_paid || 0).toLocaleString()}
                          </p>
                          {payment.status === 'partial' && remaining > 0 && (
                            <p className="text-xs text-red-500">Remaining: TZS {remaining.toLocaleString()}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {payment.late_fee > 0 ? (
                            <p className="font-medium text-orange-600">TZS {payment.late_fee.toLocaleString()}</p>
                          ) : (
                            <p className="text-gray-400">-</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600">
                            {format(new Date(payment.due_date), 'MMM d, yyyy')}
                          </p>
                          {payment.status === 'late' && daysOverdue > 0 && (
                            <p className="text-xs text-red-500">{daysOverdue} days overdue</p>
                          )}
                          {payment.payment_date && (
                            <p className="text-xs text-green-600">
                              Paid: {format(new Date(payment.payment_date), 'MMM d')}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(payment.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(payment.payment_method)}
                            <span className="text-xs text-gray-500 capitalize">
                              {payment.payment_method?.replace('_', ' ') || '-'}
                            </span>
                          </div>
                          {payment.transaction_id && (
                            <p className="text-xs text-gray-400 truncate max-w-[100px]" title={payment.transaction_id}>
                              {payment.transaction_id}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {payment.status !== 'paid' && payment.status !== 'waived' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleRecordPayment(payment)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Record
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                                  <Eye className="h-4 w-4 mr-2" />View Details
                                </DropdownMenuItem>
                                {payment.status !== 'paid' && payment.status !== 'waived' && (
                                  <DropdownMenuItem onClick={() => handleRecordPayment(payment)}>
                                    <DollarSign className="h-4 w-4 mr-2" />Record Payment
                                  </DropdownMenuItem>
                                )}
                                {payment.receipt_url && (
                                  <DropdownMenuItem asChild>
                                    <a href={payment.receipt_url} download>
                                      <Receipt className="h-4 w-4 mr-2" />Download Receipt
                                    </a>
                                  </DropdownMenuItem>
                                )}
                                {payment.status !== 'waived' && payment.status !== 'paid' && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleWaivePayment(payment)}
                                      className="text-gray-600"
                                    >
                                      <Ban className="h-4 w-4 mr-2" />Waive Payment
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <RentRecordPaymentModal 
        open={showRecordModal} 
        onOpenChange={setShowRecordModal}
        payment={selectedPayment}
        tenants={tenants}
      />
      
      {selectedPayment && (
        <>
          <PaymentDetailsModal
            open={showDetailsModal}
            onOpenChange={setShowDetailsModal}
            payment={selectedPayment}
          />
          
          <WaivePaymentModal
            open={showWaiveModal}
            onOpenChange={setShowWaiveModal}
            payment={selectedPayment}
          />
        </>
      )}
    </RentalManagerLayout>
  );
};

export default Payments;
