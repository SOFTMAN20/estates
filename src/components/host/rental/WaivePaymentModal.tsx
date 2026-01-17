/**
 * WAIVE PAYMENT MODAL - Waive a rent payment with reason
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, Ban, Home, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { useWaivePayment } from '@/hooks/useTenants';

interface WaivePaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any;
}

const WAIVE_REASONS = [
  { value: 'hardship', label: 'Financial Hardship' },
  { value: 'agreement', label: 'Mutual Agreement' },
  { value: 'maintenance', label: 'Maintenance Compensation' },
  { value: 'error', label: 'Billing Error' },
  { value: 'promotion', label: 'Promotional Discount' },
  { value: 'other', label: 'Other' },
];

export function WaivePaymentModal({ open, onOpenChange, payment }: WaivePaymentModalProps) {
  const waivePayment = useWaivePayment();
  
  // Support both linked and independent tenants
  const tenantName = payment.tenant?.user?.full_name || payment.tenant?.tenant_name || 'Unknown Tenant';
  const tenantAvatar = payment.tenant?.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenantName)}&background=3b82f6&color=fff`;
  
  const [reason, setReason] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!reason) return;

    const reasonLabel = WAIVE_REASONS.find(r => r.value === reason)?.label || reason;
    const fullNotes = `Reason: ${reasonLabel}${notes ? `\n\nAdditional notes: ${notes}` : ''}`;

    try {
      await waivePayment.mutateAsync({
        paymentId: payment.id,
        notes: fullNotes,
      });
      
      onOpenChange(false);
      setReason('');
      setNotes('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const amountToWaive = payment.amount_due - (payment.amount_paid || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-700">
            <Ban className="h-5 w-5" />
            Waive Payment
          </DialogTitle>
          <DialogDescription>
            This will mark the payment as waived. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Are you sure you want to waive this payment?</p>
            <p className="mt-1">The tenant will no longer be required to pay this amount.</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={tenantAvatar}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{tenantName}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Home className="h-3.5 w-3.5" />
                {payment.tenant?.property?.title}
              </div>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Payment Month</span>
              </div>
              <span className="font-medium">{format(new Date(payment.payment_month), 'MMMM yyyy')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>Amount to Waive</span>
              </div>
              <span className="font-bold text-red-600">TZS {amountToWaive.toLocaleString()}</span>
            </div>
            {payment.amount_paid > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Already Paid</span>
                <span className="text-green-600">TZS {payment.amount_paid.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reason Selection */}
        <div>
          <Label>Reason for Waiving *</Label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              {WAIVE_REASONS.map(r => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Notes */}
        <div>
          <Label>Additional Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details about why this payment is being waived..."
            className="mt-1"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!reason || waivePayment.isPending}
            variant="destructive"
            className="gap-2"
          >
            <Ban className="h-4 w-4" />
            {waivePayment.isPending ? 'Waiving...' : 'Waive Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
