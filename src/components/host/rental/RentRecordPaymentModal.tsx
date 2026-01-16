/**
 * RENT RECORD PAYMENT MODAL - Full payment recording with all fields
 */

import React, { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
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
import { CalendarIcon, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecordPayment, useRentPayments, useAddLateFee } from '@/hooks/useTenants';
import type { Tenant, PaymentMethod } from '@/types/tenant';

interface RentRecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: any;
  tenants: Tenant[];
}

export function RentRecordPaymentModal({ open, onOpenChange, payment, tenants }: RentRecordPaymentModalProps) {
  const recordPayment = useRecordPayment();
  const addLateFee = useAddLateFee();
  
  // Form state
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  const [lateFee, setLateFee] = useState<number>(0);
  const [applyLateFee, setApplyLateFee] = useState(false);

  // Get pending payments for selected tenant
  const { data: tenantPayments = [] } = useRentPayments({ 
    tenant_id: selectedTenantId || undefined 
  });
  const pendingPayments = tenantPayments.filter(p => 
    p.status === 'pending' || p.status === 'late' || p.status === 'partial'
  );

  // Pre-fill form when payment is provided
  useEffect(() => {
    if (payment) {
      setSelectedTenantId(payment.tenant_id);
      setSelectedMonth(payment.payment_month);
      setAmountPaid(payment.amount_due - (payment.amount_paid || 0));
      setLateFee(payment.late_fee || 0);
      setApplyLateFee(payment.is_late || false);
    } else {
      resetForm();
    }
  }, [payment, open]);

  const resetForm = () => {
    setSelectedTenantId('');
    setSelectedMonth('');
    setAmountPaid(0);
    setPaymentMethod('mpesa');
    setTransactionId('');
    setPaymentDate(new Date());
    setNotes('');
    setLateFee(0);
    setApplyLateFee(false);
  };

  // Get selected payment details
  const selectedPayment = payment || pendingPayments.find(p => p.payment_month === selectedMonth);
  const amountDue = selectedPayment?.amount_due || 0;
  const alreadyPaid = selectedPayment?.amount_paid || 0;
  const remaining = amountDue - alreadyPaid;
  const isLate = selectedPayment?.is_late || false;

  const handleSubmit = async () => {
    if (!selectedTenantId || !selectedMonth || amountPaid <= 0) return;

    try {
      // Add late fee if applicable
      if (applyLateFee && lateFee > 0 && selectedPayment) {
        await addLateFee.mutateAsync({ 
          paymentId: selectedPayment.id, 
          lateFee 
        });
      }

      await recordPayment.mutateAsync({
        tenant_id: selectedTenantId,
        payment_month: selectedMonth,
        amount_paid: amountPaid,
        payment_method: paymentMethod,
        transaction_id: transactionId || undefined,
        payment_date: paymentDate.toISOString(),
        notes: notes || undefined,
        late_fee: applyLateFee ? lateFee : undefined,
      });
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const selectedTenant = tenants.find(t => t.id === selectedTenantId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Rent Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tenant Selection (if not pre-selected) */}
          {!payment && (
            <div>
              <Label>Select Tenant *</Label>
              <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map(tenant => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      <div className="flex items-center gap-2">
                        <img
                          src={tenant.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(tenant.user?.full_name || 'T')}&background=3b82f6&color=fff&size=24`}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{tenant.user?.full_name}</span>
                        <span className="text-xs text-gray-500">- {tenant.property?.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tenant Info (if pre-selected) */}
          {(payment || selectedTenant) && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <img
                  src={(payment?.tenant?.user || selectedTenant?.user)?.avatar_url || `https://ui-avatars.com/api/?name=T&background=3b82f6&color=fff`}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{(payment?.tenant?.user || selectedTenant?.user)?.full_name}</p>
                  <p className="text-sm text-gray-500">{(payment?.tenant?.property || selectedTenant?.property)?.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Month Selection */}
          {!payment && selectedTenantId && (
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
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{format(new Date(p.payment_month), 'MMMM yyyy')}</span>
                          <span className="text-gray-500">TZS {p.amount_due?.toLocaleString()}</span>
                          {p.status === 'late' && (
                            <Badge className="bg-red-100 text-red-700 text-xs">Late</Badge>
                          )}
                          {p.status === 'partial' && (
                            <Badge className="bg-blue-100 text-blue-700 text-xs">Partial</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No pending payments</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Payment Month Display (if pre-selected) */}
          {payment && (
            <div>
              <Label>Payment Month</Label>
              <div className="mt-1 p-2 bg-gray-100 rounded-md flex items-center justify-between">
                <span className="font-medium">{format(new Date(payment.payment_month), 'MMMM yyyy')}</span>
                {payment.status === 'late' && (
                  <Badge className="bg-red-100 text-red-700">Late</Badge>
                )}
              </div>
            </div>
          )}

          {/* Amount Details */}
          {selectedPayment && (
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount Due:</span>
                <span className="font-semibold">TZS {amountDue.toLocaleString()}</span>
              </div>
              {alreadyPaid > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-semibold text-green-600">TZS {alreadyPaid.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-gray-600">Remaining:</span>
                <span className="font-bold text-blue-600">TZS {remaining.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Amount Paid */}
          <div>
            <Label>Amount Paid (TZS) *</Label>
            <Input
              type="number"
              value={amountPaid || ''}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              placeholder={remaining.toString()}
              className="mt-1"
            />
            <div className="flex gap-2 mt-1">
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-xs"
                onClick={() => setAmountPaid(remaining)}
              >
                Full amount (TZS {remaining.toLocaleString()})
              </Button>
              {remaining > 0 && (
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto text-xs text-gray-500"
                  onClick={() => setAmountPaid(Math.round(remaining / 2))}
                >
                  Half (TZS {Math.round(remaining / 2).toLocaleString()})
                </Button>
              )}
            </div>
          </div>

          {/* Late Fee */}
          {(isLate || selectedPayment?.status === 'late') && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Late Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="applyLateFee"
                  checked={applyLateFee}
                  onChange={(e) => setApplyLateFee(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="applyLateFee" className="text-sm text-gray-700">Apply late fee</label>
              </div>
              {applyLateFee && (
                <div className="mt-2">
                  <Label className="text-sm">Late Fee Amount (TZS)</Label>
                  <Input
                    type="number"
                    value={lateFee || ''}
                    onChange={(e) => setLateFee(parseFloat(e.target.value) || 0)}
                    placeholder="50000"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}

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
            <Label>Transaction ID / Reference</Label>
            <Input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder={paymentMethod === 'mpesa' ? 'e.g., QK7H3JXYZ9' : 'Reference number'}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {paymentMethod === 'mpesa' && 'Enter the M-Pesa confirmation code'}
              {paymentMethod === 'bank_transfer' && 'Enter the bank transfer reference'}
              {paymentMethod === 'card' && 'Enter the card transaction reference'}
              {paymentMethod === 'cash' && 'Enter receipt number if available'}
            </p>
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

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this payment..."
              className="mt-1"
            />
          </div>

          {/* Summary */}
          {amountPaid > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Payment Summary</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">TZS {amountPaid.toLocaleString()}</span>
                </div>
                {applyLateFee && lateFee > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span>Late Fee:</span>
                    <span className="font-semibold">TZS {lateFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-1 font-bold">
                  <span>Total:</span>
                  <span>TZS {(amountPaid + (applyLateFee ? lateFee : 0)).toLocaleString()}</span>
                </div>
                {amountPaid < remaining && (
                  <p className="text-xs text-blue-600 mt-2">
                    This will be recorded as a partial payment. Remaining: TZS {(remaining - amountPaid).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedTenantId || !selectedMonth || amountPaid <= 0 || recordPayment.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {recordPayment.isPending ? 'Recording...' : 'Record Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
