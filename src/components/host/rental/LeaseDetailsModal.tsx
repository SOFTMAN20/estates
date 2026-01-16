/**
 * LEASE DETAILS MODAL - View full lease agreement details
 */

import React from 'react';
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
import { Separator } from '@/components/ui/separator';
import { 
  Home, Calendar, DollarSign, FileText, 
  CheckCircle2, Clock, PenTool, Download,
  User, AlertTriangle, Droplets, Zap, Wifi, Flame
} from 'lucide-react';
import { useSignLease } from '@/hooks/useTenants';
import { format, differenceInDays } from 'date-fns';

interface LeaseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease: any;
}

const UTILITY_ICONS: Record<string, any> = {
  water: Droplets,
  electricity: Zap,
  internet: Wifi,
  gas: Flame,
};

export function LeaseDetailsModal({ open, onOpenChange, lease }: LeaseDetailsModalProps) {
  const signLease = useSignLease();
  const daysRemaining = differenceInDays(new Date(lease.end_date), new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      case 'pending_signature':
        return <Badge className="bg-blue-100 text-blue-700">Pending Signature</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700">Expired</Badge>;
      case 'terminated':
        return <Badge className="bg-gray-100 text-gray-700">Terminated</Badge>;
      default:
        return null;
    }
  };

  const handleSignAsLandlord = async () => {
    await signLease.mutateAsync({ leaseId: lease.id, role: 'landlord' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lease Agreement Details
          </DialogTitle>
        </DialogHeader>

        {/* Header Info */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <img
              src={lease.tenant?.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(lease.tenant?.user?.full_name || 'T')}&background=3b82f6&color=fff`}
              alt={lease.tenant?.user?.full_name || 'Tenant'}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h2 className="text-lg font-semibold">{lease.tenant?.user?.full_name || 'Unknown'}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Home className="h-4 w-4" />
                {lease.tenant?.property?.title}
              </div>
              <p className="text-sm text-gray-400">{lease.tenant?.property?.address}</p>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(lease.status)}
            <p className="text-sm text-gray-500 mt-1 capitalize">{lease.agreement_type?.replace('-', ' ')}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
            <TabsTrigger value="signatures">Signatures</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Key Details */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Monthly Rent</span>
                  </div>
                  <p className="text-lg font-bold">TZS {lease.monthly_rent?.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Security Deposit</span>
                  </div>
                  <p className="text-lg font-bold">TZS {lease.security_deposit?.toLocaleString() || '0'}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="text-sm font-medium">
                    {format(new Date(lease.start_date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {format(new Date(lease.end_date), 'MMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Days Remaining</span>
                  </div>
                  <p className={`text-lg font-bold ${daysRemaining <= 30 ? 'text-red-600' : daysRemaining <= 90 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {daysRemaining > 0 ? daysRemaining : 'Expired'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Terms */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Payment Terms</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Rent Due Day</p>
                    <p className="font-medium">{lease.rent_due_day}th of each month</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Late Fee</p>
                    <p className="font-medium">TZS {lease.late_fee_amount?.toLocaleString() || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Grace Period</p>
                    <p className="font-medium">{lease.late_fee_grace_period || 5} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Utilities Included */}
            {lease.utilities_included && lease.utilities_included.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Utilities Included</h4>
                  <div className="flex flex-wrap gap-2">
                    {lease.utilities_included.map((utility: string) => {
                      const Icon = UTILITY_ICONS[utility] || CheckCircle2;
                      return (
                        <div key={utility} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                          <Icon className="h-4 w-4" />
                          <span className="capitalize">{utility}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms" className="space-y-4 mt-4">
            {lease.terms_and_conditions && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Terms and Conditions</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{lease.terms_and_conditions}</p>
                </CardContent>
              </Card>
            )}

            {lease.special_clauses && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Special Clauses</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{lease.special_clauses}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              {lease.tenant_responsibilities && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Tenant Responsibilities
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lease.tenant_responsibilities}</p>
                  </CardContent>
                </Card>
              )}

              {lease.landlord_responsibilities && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Landlord Responsibilities
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lease.landlord_responsibilities}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {!lease.terms_and_conditions && !lease.special_clauses && !lease.tenant_responsibilities && !lease.landlord_responsibilities && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No additional terms specified</p>
              </div>
            )}
          </TabsContent>

          {/* Signatures Tab */}
          <TabsContent value="signatures" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Landlord Signature */}
              <Card className={lease.landlord_signed ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Landlord</h4>
                    {lease.landlord_signed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  
                  {lease.landlord_signed ? (
                    <div>
                      <p className="text-sm text-green-700 font-medium">Signed</p>
                      <p className="text-xs text-gray-500">
                        {lease.landlord_signature_date && format(new Date(lease.landlord_signature_date), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-yellow-700 mb-3">Pending signature</p>
                      <Button 
                        size="sm" 
                        onClick={handleSignAsLandlord}
                        disabled={signLease.isPending}
                        className="w-full gap-2"
                      >
                        <PenTool className="h-4 w-4" />
                        {signLease.isPending ? 'Signing...' : 'Sign Now'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tenant Signature */}
              <Card className={lease.tenant_signed ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Tenant</h4>
                    {lease.tenant_signed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  
                  {lease.tenant_signed ? (
                    <div>
                      <p className="text-sm text-green-700 font-medium">Signed</p>
                      <p className="text-xs text-gray-500">
                        {lease.tenant_signature_date && format(new Date(lease.tenant_signature_date), 'MMMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-yellow-700">Pending signature</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Waiting for {lease.tenant?.user?.full_name || 'tenant'} to sign
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Signature Status */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-3">Agreement Status</h4>
                <div className="flex items-center gap-3">
                  {lease.landlord_signed && lease.tenant_signed ? (
                    <>
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700">Fully Executed</p>
                        <p className="text-sm text-gray-500">Both parties have signed the agreement</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-700">Pending Signatures</p>
                        <p className="text-sm text-gray-500">
                          {!lease.landlord_signed && !lease.tenant_signed 
                            ? 'Both parties need to sign'
                            : !lease.landlord_signed 
                            ? 'Landlord signature required'
                            : 'Tenant signature required'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            {lease.document_url && (
              <Button variant="outline" className="gap-2" asChild>
                <a href={lease.document_url} download>
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
