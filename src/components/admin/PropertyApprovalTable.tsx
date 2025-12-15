import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Check, X, Eye, MapPin, Home, Loader2, Bed, Bath, Calendar, User, Mail, Phone, Maximize2, Package } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAdminProperties, useApproveProperty, useRejectProperty, type AdminProperty } from '@/hooks/useAdminProperties';
import type { SortOption } from '@/pages/admin/properties';

interface PropertyApprovalTableProps {
  statusFilter?: 'all' | 'pending' | 'approved' | 'rejected';
  searchQuery?: string;
  sortBy?: SortOption;
}

export function PropertyApprovalTable({ statusFilter = 'pending', searchQuery = '', sortBy = 'date_desc' }: PropertyApprovalTableProps) {
  const [selectedProperty, setSelectedProperty] = useState<AdminProperty | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showBulkApproveConfirm, setShowBulkApproveConfirm] = useState(false);
  const [showBulkRejectDialog, setShowBulkRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [notifyHost, setNotifyHost] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch properties with filters
  const { data: fetchedProperties = [], isLoading } = useAdminProperties({
    status: statusFilter,
    search: searchQuery,
  });

  // Sort properties
  const properties = [...fetchedProperties].sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'date_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'price_desc':
        return b.price - a.price;
      case 'price_asc':
        return a.price - b.price;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Mutations
  const approveMutation = useApproveProperty();
  const rejectMutation = useRejectProperty();

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === properties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(properties.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleViewDetails = (property: AdminProperty) => {
    setSelectedProperty(property);
    setShowDetailsDialog(true);
  };

  const handleApprove = (property: AdminProperty) => {
    setSelectedProperty(property);
    setShowApproveConfirm(true);
  };

  const confirmApprove = () => {
    if (!selectedProperty) return;
    approveMutation.mutate(selectedProperty.id, {
      onSuccess: () => {
        setShowApproveConfirm(false);
        setSelectedProperty(null);
      },
    });
  };

  const handleReject = (property: AdminProperty) => {
    setSelectedProperty(property);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!selectedProperty) return;
    if (!rejectionCategory) {
      toast.error('Please select a rejection reason');
      return;
    }
    
    // Combine category and notes for full rejection reason
    const fullReason = rejectionCategory + (rejectionNotes.trim() ? `\n\nAdditional notes: ${rejectionNotes}` : '');
    
    rejectMutation.mutate(
      { propertyId: selectedProperty.id, reason: fullReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectionCategory('');
          setRejectionNotes('');
          setNotifyHost(true);
          setSelectedProperty(null);
          
          if (notifyHost) {
            toast.success('Property rejected and host notified');
          } else {
            toast.success('Property rejected');
          }
        },
      }
    );
  };

  // Bulk actions
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select properties to approve');
      return;
    }
    setShowBulkApproveConfirm(true);
  };

  const confirmBulkApprove = async () => {
    for (const id of selectedIds) {
      await approveMutation.mutateAsync(id);
    }
    setShowBulkApproveConfirm(false);
    clearSelection();
    toast.success(`${selectedIds.length} properties approved`);
  };

  const handleBulkReject = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select properties to reject');
      return;
    }
    setShowBulkRejectDialog(true);
  };

  const confirmBulkReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    for (const id of selectedIds) {
      await rejectMutation.mutateAsync({ propertyId: id, reason: rejectionReason });
    }
    setShowBulkRejectDialog(false);
    setRejectionReason('');
    clearSelection();
    toast.success(`${selectedIds.length} properties rejected`);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedIds.length === properties.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedIds.length} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={clearSelection}
            >
              Clear Selection
            </Button>
            {statusFilter === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleBulkApprove}
                  disabled={approveMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Bulk Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkReject}
                  disabled={rejectMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Bulk Reject
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === properties.length && properties.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Price/Month</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Submitted</TableHead>
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
                <TableRow key={property.id} className={selectedIds.includes(property.id) ? 'bg-blue-50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(property.id)}
                      onCheckedChange={() => toggleSelect(property.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                      {property.images?.[0] ? (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg></div>';
                          }}
                        />
                      ) : (
                        <Home className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{property.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {property.bedrooms} bed
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {property.bathrooms} bath
                        </span>
                        <span className="capitalize">{property.property_type}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{property.profiles?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{property.profiles?.phone || ''}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {formatPrice(property.price)}
                  </TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(property.created_at), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(property)}
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
                            disabled={approveMutation.isPending}
                          >
                            {approveMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(property)}
                            disabled={rejectMutation.isPending}
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

      {/* Enhanced Property Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Property Details - Admin View</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-6">
              {/* Image Gallery */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Property Images ({selectedProperty.images.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedProperty.images.map((img, idx) => (
                      <div key={idx} className="aspect-video bg-gray-200 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                        <img src={img} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Information */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedProperty.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedProperty.location}</span>
                    </div>
                    {selectedProperty.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Property Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {selectedProperty.property_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span>{selectedProperty.bedrooms} Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span>{selectedProperty.bathrooms} Bathrooms</span>
                      </div>
                      {selectedProperty.square_meters && (
                        <div className="flex items-center gap-2">
                          <Maximize2 className="h-4 w-4 text-gray-500" />
                          <span>{selectedProperty.square_meters} m²</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.amenities.map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="capitalize">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                    <p className="text-3xl font-bold text-gray-900">{formatPrice(selectedProperty.price)}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Host Information */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Host Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{selectedProperty.profiles?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedProperty.profiles?.phone || 'N/A'}</span>
                      </div>
                      {selectedProperty.profiles?.created_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Member since {format(new Date(selectedProperty.profiles.created_at), 'MMM yyyy')}</span>
                        </div>
                      )}
                      <Button variant="link" className="p-0 h-auto text-blue-600" size="sm">
                        View Host Profile →
                      </Button>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedProperty.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Submitted {formatDistanceToNow(new Date(selectedProperty.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(selectedProperty.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                      </p>
                      {selectedProperty.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                          <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{selectedProperty.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes Section */}
                  <div className="border rounded-lg p-4 bg-yellow-50">
                    <h4 className="font-semibold mb-3 text-yellow-900">Admin Notes (Private)</h4>
                    <Textarea
                      placeholder="Add private notes about this property..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="resize-none bg-white"
                    />
                    <Button size="sm" className="mt-2" variant="outline">
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedProperty?.status === 'pending' && (
              <>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleReject(selectedProperty);
                  }}
                >
                  <X className="h-5 w-5 mr-2" />
                  Reject Property
                </Button>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowDetailsDialog(false);
                    handleApprove(selectedProperty);
                  }}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Approve Property
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve "{selectedProperty?.title}"? This property will be visible to all users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhanced Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Please select a reason for rejecting "{selectedProperty?.title}". This will be sent to the host.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Rejection Reason Dropdown */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rejection Reason *</label>
              <Select value={rejectionCategory} onValueChange={setRejectionCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Incomplete information">Incomplete information</SelectItem>
                  <SelectItem value="Poor quality images">Poor quality images</SelectItem>
                  <SelectItem value="Policy violation">Policy violation</SelectItem>
                  <SelectItem value="Misleading information">Misleading information</SelectItem>
                  <SelectItem value="Duplicate listing">Duplicate listing</SelectItem>
                  <SelectItem value="Inappropriate content">Inappropriate content</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Additional Notes (Optional)</label>
              <Textarea
                placeholder="Provide more details about the rejection..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Notify Host Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-host"
                checked={notifyHost}
                onCheckedChange={(checked) => setNotifyHost(checked as boolean)}
              />
              <label
                htmlFor="notify-host"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Notify host via email
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionCategory('');
                setRejectionNotes('');
                setNotifyHost(true);
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionCategory || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                'Confirm Rejection'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Approve Confirmation */}
      <AlertDialog open={showBulkApproveConfirm} onOpenChange={setShowBulkApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bulk Approve Properties</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedIds.length} properties? They will all be visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve {selectedIds.length} Properties
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={showBulkRejectDialog} onOpenChange={setShowBulkRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Reject Properties</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedIds.length} properties. This will be sent to all hosts.
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
                setShowBulkRejectDialog(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmBulkReject}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                `Reject ${selectedIds.length} Properties`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
