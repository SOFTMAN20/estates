/**
 * RECORD PAYMENT MODAL - Record rent payments for tenants
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecordPayment, useTenantPayments } from '@/hooks/useTenants';
import type { Tenant, PaymentMethod } from '@/types/tenant';

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
}

export function RecordPaymentModal({ open, onOpenChange, tenant }: RecordPaymentModalProps) {
  const { data: payments = [] } = useTenantPayments(tenant.id);
  const recordPayment = useRecordPayment();
  
  // Get pending payments
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'late' || p.status === 'partial');
  
  const [selectedMonth, setSelectedMonth] = useState<string>(
    pendingPayments[0]?.payment_month || new Date().toISOString().slice(0, 10)
  );
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [lateFee, setLateFee] = useState<number>(0);

  // Get selected payment details
  const selectedPayment = payments.find(p => p.payment_month === selectedMonth);
  const amountDue = selectedPayment?.amount_due || tenant.monthly_rent;
  const alreadyPaid = selectedPayment?.amount_paid || 0;
  const remaining = amountDue - alreadyPaid;

  const handleSubmit = async () => {
    if (!selectedMonth || amountPaid <= 0) return;

    try {
      await recordPayment.mutateAsync({
        tenant_id: tenant.id,
        payment_month: selectedMonth,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        transaction_id: transactionId || undefined,
        payment_date: paymentDate.toISOString(),
        notes: notes || undefined,
        late_fee: lateFee || undefined,
      });
      
      onOpenChange(false);
      // Reset form
      setAmountPaid(0);
      setTransactionId('');
      setNotes('');
      setLateFee(0);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tenant Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-medium">{tenant.user?.full_name}</p>
            <p className="text-sm text-gray-500">{tenant.property?.title}</p>
            <p className="text-sm text-gray-500">Monthly Rent: TZS {tenant.monthly_rent.toLocaleString()}</p>
          </div>

          {/* Payment Month */}
          <div>
            <Label>Payment Month *</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {pendingPayments.length > 0 ? (
                  pendingPayments.map(p => (
                    <SelectItem key={p.id} value={p.payment_month}>
                      {format(new Date(p.payment_month), 'MMMM yyyy')} - TZS {p.amount_due.toLocaleString()}
                      {p.status === 'late' && ' (Late)'}
                      {p.status === 'partial' && ` (Partial - ${p.amount_paid.toLocaleString()} paid)`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value={new Date().toISOString().slice(0, 10)}>
                    {format(new Date(), 'MMMM yyyy')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedPayment && alreadyPaid > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Already paid: TZS {alreadyPaid.toLocaleString()} | Remaining: TZS {remaining.toLocaleString()}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <Label>Amount Paid (TZS) *</Label>
            <Input
              type="number"
              value={amountPaid || ''}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              placeholder={remaining.toString()}
              className="mt-1"
            />
            <Button 
              type="button" 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-xs"
              onClick={() => setAmountPaid(remaining)}
            >
              Fill remaining amount (TZS {remaining.toLocaleString()})
            </Button>
          </div>

          {/* Payment Method */}
          <div>
            <Label>Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={(v: PaymentMethod) => setPaymentMethod(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction ID */}
          <div>
            <Label>Transaction ID</Label>
            <Input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g., MPESA123456"
              className="mt-1"
            />
          </div>

          {/* Payment Date */}
          <div>
            <Label>Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(paymentDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={paymentDate}
                  onSelect={(date) => date && setPaymentDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Late Fee */}
          {selectedPayment?.is_late && (
            <div>
              <Label>Late Fee (TZS)</Label>
              <Input
                type="number"
                value={lateFee || ''}
                onChange={(e) => setLateFee(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="mt-1"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this payment..."
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedMonth || amountPaid <= 0 || recordPayment.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {recordPayment.isPending ? 'Recording...' : 'Record Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
