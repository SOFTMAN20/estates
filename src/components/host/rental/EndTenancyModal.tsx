/**
 * END TENANCY MODAL - End a tenant's lease
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEndTenancy } from '@/hooks/useTenants';
import type { Tenant } from '@/types/tenant';

interface EndTenancyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
}

export function EndTenancyModal({ open, onOpenChange, tenant }: EndTenancyModalProps) {
  const endTenancy = useEndTenancy();
  
  const [moveOutDate, setMoveOutDate] = useState<Date>(new Date());
  const [conditionNotes, setConditionNotes] = useState('');
  const [depositReturn, setDepositReturn] = useState<number>(tenant.security_deposit);
  const [finalNotes, setFinalNotes] = useState('');

  const handleSubmit = async () => {
    try {
      await endTenancy.mutateAsync({
        tenant_id: tenant.id,
        move_out_date: moveOutDate.toISOString().split('T')[0],
        move_out_condition_notes: conditionNotes || undefined,
        security_deposit_return: depositReturn,
        final_notes: finalNotes || undefined,
      });
      
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            End Tenancy
          </DialogTitle>
          <DialogDescription>
            This will end the tenancy for {tenant.user?.full_name} at {tenant.property?.title}.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tenant Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="font-medium text-red-900">{tenant.user?.full_name}</p>
            <p className="text-sm text-red-700">{tenant.property?.title}</p>
            <p className="text-sm text-red-700">
              Lease: {format(new Date(tenant.lease_start_date), 'MMM d, yyyy')} - {format(new Date(tenant.lease_end_date), 'MMM d, yyyy')}
            </p>
          </div>

          {/* Move-Out Date */}
          <div>
            <Label>Move-Out Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(moveOutDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={moveOutDate}
                  onSelect={(date) => date && setMoveOutDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Move-Out Condition Notes */}
          <div>
            <Label>Move-Out Condition Notes</Label>
            <Textarea
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Document the condition of the property at move-out..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Security Deposit Return */}
          <div>
            <Label>Security Deposit Return (TZS)</Label>
            <Input
              type="number"
              value={depositReturn}
              onChange={(e) => setDepositReturn(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Original deposit: TZS {tenant.security_deposit.toLocaleString()}
            </p>
          </div>

          {/* Final Notes */}
          <div>
            <Label>Final Settlement Notes</Label>
            <Textarea
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              placeholder="Any final notes about the tenancy..."
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
            disabled={endTenancy.isPending}
            variant="destructive"
          >
            {endTenancy.isPending ? 'Ending...' : 'End Tenancy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
