import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AnalyticsOverview from './AnalyticsOverview';

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string;
  propertyName?: string;
}

export default function AnalyticsModal({
  open,
  onOpenChange,
  propertyId,
  propertyName,
}: AnalyticsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {propertyName ? `Analytics - ${propertyName}` : 'Analytics Overview'}
          </DialogTitle>
        </DialogHeader>
        <AnalyticsOverview propertyId={propertyId} />
      </DialogContent>
    </Dialog>
  );
}
