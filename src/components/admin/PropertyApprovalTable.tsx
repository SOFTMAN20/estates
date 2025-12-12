import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Check, X, Eye, MapPin, Home } from 'lucide-react';
import { format } from 'date-fns';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  images: string[];
  landlord_id: string;
  profiles?: {
    full_name: string;
    phone: string;
  };
}

// Mock data for UI preview
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BR Apartment in Masaki',
    location: 'Masaki, Dar es Salaam',
    price: 1500000,
    property_type: 'apartment',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    images: ['/placeholder-property.jpg'],
    landlord_id: '1',
    profiles: {
      full_name: 'John Mwangi',
      phone: '+255 712 345 678',
    },
  },
  {
    id: '2',
    title: 'Cozy Studio in Mikocheni',
    location: 'Mikocheni, Dar es Salaam',
    price: 650000,
    property_type: 'studio',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    images: ['/placeholder-property.jpg'],
    landlord_id: '2',
    profiles: {
      full_name: 'Sarah Kimani',
      phone: '+255 713 456 789',
    },
  },
  {
    id: '3',
    title: 'Spacious 4BR House in Oysterbay',
    location: 'Oysterbay, Dar es Salaam',
    price: 2500000,
    property_type: 'house',
    status: 'approved',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    images: ['/placeholder-property.jpg'],
    landlord_id: '3',
    profiles: {
      full_name: 'David Omondi',
      phone: '+255 714 567 890',
    },
  },
  {
    id: '4',
    title: 'Single Room in Kinondoni',
    location: 'Kinondoni, Dar es Salaam',
    price: 350000,
    property_type: 'room',
    status: 'rejected',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    images: ['/placeholder-property.jpg'],
    landlord_id: '4',
    profiles: {
      full_name: 'Grace Wanjiru',
      phone: '+255 715 678 901',
    },
  },
  {
    id: '5',
    title: 'Luxury Villa in Mbezi Beach',
    location: 'Mbezi Beach, Dar es Salaam',
    price: 3200000,
    property_type: 'house',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    images: ['/placeholder-property.jpg'],
    landlord_id: '5',
    profiles: {
      full_name: 'Peter Kamau',
      phone: '+255 716 789 012',
    },
  },
];

export function PropertyApprovalTable() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Using mock data for UI preview
  const isLoading = false;
  const allProperties = mockProperties;
  const properties = filter === 'all' 
    ? allProperties 
    : allProperties.filter(p => p.status === filter);

  const handleApprove = (property: Property) => {
    toast.success(`Property "${property.title}" approved (Mock action)`);
  };

  const handleReject = (property: Property) => {
    setSelectedProperty(property);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!selectedProperty) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    toast.success(`Property "${selectedProperty.title}" rejected (Mock action)`);
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedProperty(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = allProperties.filter(p => p.status === 'pending').length;
  const approvedCount = allProperties.filter(p => p.status === 'approved').length;
  const rejectedCount = allProperties.filter(p => p.status === 'rejected').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          onClick={() => setFilter('all')}
          className="rounded-b-none"
        >
          All ({allProperties.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'ghost'}
          onClick={() => setFilter('pending')}
          className="rounded-b-none"
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'ghost'}
          onClick={() => setFilter('approved')}
          className="rounded-b-none"
        >
          Approved ({approvedCount})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'ghost'}
          onClick={() => setFilter('rejected')}
          className="rounded-b-none"
        >
          Rejected ({rejectedCount})
        </Button>
      </div>

      {/* Properties Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No properties found</p>
                </TableCell>
              </TableRow>
            ) : (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {property.images?.[0] && (
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <Home className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{property.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.profiles?.full_name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{property.profiles?.phone || ''}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(property.price)}
                  </TableCell>
                  <TableCell className="capitalize">{property.property_type}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(property.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('View property (Mock action)')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {property.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(property)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(property)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedProperty?.title}". This will be sent to the host.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
