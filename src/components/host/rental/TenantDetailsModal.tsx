/**
 * TENANT DETAILS MODAL - View full tenant information with tabs
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, Mail, Home, Calendar, DollarSign, FileText, 
  AlertTriangle, CheckCircle2, Clock, User, Shield,
  Download, MessageSquare
} from 'lucide-react';
import { useTenantPayments, useTenantLease } from '@/hooks/useTenants';
import type { Tenant } from '@/types/tenant';
import { format } from 'date-fns';

interface TenantDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
}

export function TenantDetailsModal({ open, onOpenChange, tenant }: TenantDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: payments = [] } = useTenantPayments(tenant.id);
  const { data: lease } = useTenantLease(tenant.id);

  // Get tenant info - support both linked users and independent tenants
  const tenantName = tenant.user?.full_name || tenant.tenant_name || 'Unknown Tenant';
  const tenantEmail = tenant.user?.email || tenant.tenant_email;
  const tenantPhone = tenant.user?.phone || tenant.tenant_phone;
  const tenantAvatar = tenant.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=3b82f6&color=fff`;
  const isIndependent = !tenant.user_id;

  const getDaysRemaining = () => {
    const end = new Date(tenant.lease_end_date);
    const today = new Date();
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const paidPayments = payments.filter(p => p.status === 'paid');
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'late');
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount_paid, 0);
  const totalDue = pendingPayments.reduce((sum, p) => sum + p.amount_due, 0);

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 border-0">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-700 border-0">Late</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-700 border-0">Partial</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tenant Details</DialogTitle>
        </DialogHeader>

        {/* Tenant Header */}
        <div className="flex items-start gap-4 pb-4 border-b">
          <img
            src={tenantAvatar}
            alt={tenantName}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{tenantName}</h2>
              <Badge className={tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                {tenant.status}
              </Badge>
              {isIndependent && (
                <Badge variant="outline" className="text-xs">Independent</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              {tenantEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {tenantEmail}
                </span>
              )}
              {tenantPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {tenantPhone}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <Home className="h-4 w-4" />
              {tenant.property?.title} - {tenant.property?.location}
            </div>
          </div>
          <div className="flex gap-2">
            {tenantEmail && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${tenantEmail}`}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </a>
              </Button>
            )}
            {tenantPhone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${tenantPhone}`}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lease">Lease</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                  <p className="text-lg font-bold">TZS {tenant.monthly_rent.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-500">Security Deposit</p>
                  <p className="text-lg font-bold">TZS {tenant.security_deposit.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-500">Lease Ends</p>
                  <p className="text-lg font-bold">{format(new Date(tenant.lease_end_date), 'MMM d, yyyy')}</p>
                  {tenant.status === 'active' && daysRemaining <= 30 && (
                    <p className="text-xs text-yellow-600">{daysRemaining} days left</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-500">Payment Status</p>
                  <div className="flex items-center gap-1 mt-1">
                    {tenant.is_late_on_rent ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">Overdue</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">On Time</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Contact */}
            {tenant.emergency_contact_name && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{tenant.emergency_contact_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{tenant.emergency_contact_phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Relationship</p>
                      <p className="font-medium capitalize">{tenant.emergency_contact_relationship || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Move-In Details */}
            {tenant.move_in_date && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Move-In Details</h4>
                  <div className="text-sm">
                    <p className="text-gray-500">Move-In Date</p>
                    <p className="font-medium">{format(new Date(tenant.move_in_date), 'MMMM d, yyyy')}</p>
                    {tenant.move_in_condition_notes && (
                      <div className="mt-2">
                        <p className="text-gray-500">Condition Notes</p>
                        <p className="text-gray-700">{tenant.move_in_condition_notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Payments */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Recent Payments</h4>
                {payments.slice(0, 5).length > 0 ? (
                  <div className="space-y-2">
                    {payments.slice(0, 5).map(payment => (
                      <div key={payment.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{format(new Date(payment.payment_month), 'MMMM yyyy')}</p>
                          <p className="text-xs text-gray-500">Due: {format(new Date(payment.due_date), 'MMM d')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">TZS {payment.amount_due.toLocaleString()}</p>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No payment records yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lease Tab */}
          <TabsContent value="lease" className="space-y-4 mt-4">
            {lease ? (
              <>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Lease Agreement</h4>
                      <Badge className={
                        lease.status === 'active' ? 'bg-green-100 text-green-700' :
                        lease.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {lease.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Agreement Type</p>
                        <p className="font-medium capitalize">{lease.agreement_type.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium">
                          {format(new Date(lease.start_date), 'MMM d, yyyy')} - {format(new Date(lease.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monthly Rent</p>
                        <p className="font-medium">TZS {lease.monthly_rent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Security Deposit</p>
                        <p className="font-medium">TZS {lease.security_deposit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rent Due Day</p>
                        <p className="font-medium">{lease.rent_due_day}th of each month</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Late Fee</p>
                        <p className="font-medium">
                          TZS {lease.late_fee_amount.toLocaleString()} (after {lease.late_fee_grace_period} days)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Signatures */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Signatures</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        {lease.landlord_signed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">Landlord</p>
                          <p className="text-xs text-gray-500">
                            {lease.landlord_signed 
                              ? `Signed on ${format(new Date(lease.landlord_signature_date!), 'MMM d, yyyy')}`
                              : 'Pending signature'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lease.tenant_signed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">Tenant</p>
                          <p className="text-xs text-gray-500">
                            {lease.tenant_signed 
                              ? `Signed on ${format(new Date(lease.tenant_signature_date!), 'MMM d, yyyy')}`
                              : 'Pending signature'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {lease.document_url && (
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Lease Agreement PDF
                  </Button>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No lease agreement found</p>
                <Button className="mt-3">Create Lease Agreement</Button>
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 mt-4">
            {/* Payment Summary */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-500">Total Paid</p>
                  <p className="text-lg font-bold text-green-600">TZS {totalPaid.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-500">Outstanding</p>
                  <p className="text-lg font-bold text-red-600">TZS {totalDue.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-xs text-gray-500">Payments Made</p>
                  <p className="text-lg font-bold">{paidPayments.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                {payments.length > 0 ? (
                  <div className="space-y-2">
                    {payments.map(payment => (
                      <div key={payment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <p className="font-medium">{format(new Date(payment.payment_month), 'MMMM yyyy')}</p>
                          <p className="text-xs text-gray-500">
                            Due: {format(new Date(payment.due_date), 'MMM d, yyyy')}
                            {payment.payment_date && ` • Paid: ${format(new Date(payment.payment_date), 'MMM d, yyyy')}`}
                          </p>
                          {payment.payment_method && (
                            <p className="text-xs text-gray-400 capitalize">{payment.payment_method.replace('_', ' ')}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">TZS {payment.amount_due.toLocaleString()}</p>
                          {payment.amount_paid > 0 && payment.amount_paid < payment.amount_due && (
                            <p className="text-xs text-blue-600">Paid: TZS {payment.amount_paid.toLocaleString()}</p>
                          )}
                          {payment.late_fee > 0 && (
                            <p className="text-xs text-red-500">Late fee: TZS {payment.late_fee.toLocaleString()}</p>
                          )}
                          <div className="mt-1">{getPaymentStatusBadge(payment.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No payment records</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No documents uploaded yet</p>
              <Button variant="outline">Upload Document</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
