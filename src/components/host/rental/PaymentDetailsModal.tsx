/**
 * PAYMENT DETAILS MODAL - View full payment details
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
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, Calendar, Home, User, Receipt, 
  CheckCircle2, Clock, AlertTriangle, Ban,
  CreditCard, Smartphone, Building2, Banknote,
  FileText, Download
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface PaymentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any;
}

export function PaymentDetailsModal({ open, onOpenChange, payment }: PaymentDetailsModalProps) {
  const daysOverdue = differenceInDays(new Date(), new Date(payment.due_date));
  const remaining = payment.amount_due - (payment.amount_paid || 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle2 className="h-3 w-3" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-700 gap-1"><AlertTriangle className="h-3 w-3" />Late</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-700 gap-1"><DollarSign className="h-3 w-3" />Partial</Badge>;
      case 'waived':
        return <Badge className="bg-gray-100 text-gray-700 gap-1"><Ban className="h-3 w-3" />Waived</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case 'mpesa':
        return <Smartphone className="h-5 w-5 text-green-600" />;
      case 'bank_transfer':
        return <Building2 className="h-5 w-5 text-blue-600" />;
      case 'card':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'cash':
        return <Banknote className="h-5 w-5 text-yellow-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment Details
          </DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src={payment.tenant?.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(payment.tenant?.user?.full_name || 'T')}&background=3b82f6&color=fff`}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{payment.tenant?.user?.full_name}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Home className="h-3.5 w-3.5" />
                {payment.tenant?.property?.title}
              </div>
            </div>
          </div>
          {getStatusBadge(payment.status)}
        </div>

        {/* Payment Month */}
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Payment for</p>
          <p className="text-2xl font-bold">{format(new Date(payment.payment_month), 'MMMM yyyy')}</p>
        </div>

        {/* Amount Details */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Due</span>
              <span className="font-semibold">TZS {payment.amount_due?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className={`font-semibold ${payment.amount_paid >= payment.amount_due ? 'text-green-600' : ''}`}>
                TZS {(payment.amount_paid || 0).toLocaleString()}
              </span>
            </div>
            {payment.late_fee > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Late Fee</span>
                <span className="font-semibold">TZS {payment.late_fee.toLocaleString()}</span>
              </div>
            )}
            {remaining > 0 && payment.status !== 'waived' && (
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Remaining</span>
                <span className="font-bold text-red-600">TZS {remaining.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Due Date</span>
              </div>
              <p className="font-medium">{format(new Date(payment.due_date), 'MMM d, yyyy')}</p>
              {payment.status === 'late' && daysOverdue > 0 && (
                <p className="text-xs text-red-500">{daysOverdue} days overdue</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs">Payment Date</span>
              </div>
              {payment.payment_date ? (
                <p className="font-medium">{format(new Date(payment.payment_date), 'MMM d, yyyy')}</p>
              ) : (
                <p className="text-gray-400">Not paid yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Method & Transaction */}
        {payment.payment_method && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {getPaymentMethodIcon(payment.payment_method)}
                <div>
                  <p className="font-medium capitalize">{payment.payment_method?.replace('_', ' ')}</p>
                  {payment.transaction_id && (
                    <p className="text-sm text-gray-500">
                      Transaction ID: <span className="font-mono">{payment.transaction_id}</span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {payment.notes && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">Notes</span>
              </div>
              <p className="text-sm text-gray-700">{payment.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {payment.receipt_url && (
            <Button variant="outline" className="gap-2" asChild>
              <a href={payment.receipt_url} download>
                <Download className="h-4 w-4" />
                Download Receipt
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
