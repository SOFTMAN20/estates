/**
 * Property Details Modal - Admin View
 * Complete property information with approval/rejection actions
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApproveProperty, useRejectProperty } from '@/hooks/useAdminProperties';
import { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Home,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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

interface PropertyDetailsModalProps {
  propertyId: string;
  onClose: () => void;
}

export function PropertyDetailsModal({ propertyId, onClose }: PropertyDetailsModalProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [notifyHost, setNotifyHost] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');

  const approveProperty = useApproveProperty();
  const rejectProperty = useRejectProperty();

  const { data: property, isLoading } = useQuery({
    queryKey: ['admin', 'property', propertyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:user_id (
            name,
            phone,
            avatar_url,
            created_at
          )
        `)
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = () => {
    approveProperty.mutate(propertyId, {
      onSuccess: () => {
        setShowApproveDialog(false);
        onClose();
      },
    });
  };

  const handleReject = () => {
    const fullReason = rejectionNotes 
      ? `${rejectionReason}: ${rejectionNotes}`
      : rejectionReason;
      
    rejectProperty.mutate(
      { propertyId, reason: fullReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          onClose();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!property) return null;

  const images = property.image_urls || [];
  const amenities = property.amenities || [];

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">{property.title}</DialogTitle>
                <DialogDescription className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </DialogDescription>
              </div>
              <Badge variant={
                property.status === 'approved' ? 'default' :
                property.status === 'pending' ? 'secondary' :
                'destructive'
              }>
                {property.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Images Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{property.property_type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium">{property.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Maximize className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{property.square_meters} m²</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Monthly Rent</p>
                <p className="text-2xl font-bold text-blue-600">
                  TZS {property.price_per_month?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Host Information */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Host Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{property.profiles?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{property.profiles?.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Member since:</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(property.profiles?.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <Label htmlFor="admin-notes">Admin Notes (Private)</Label>
              <Textarea
                id="admin-notes"
                placeholder="Add private notes about this property..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Rejection Reason (if rejected) */}
            {property.status === 'rejected' && property.rejection_reason && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Rejection Reason</h3>
                <p className="text-red-700">{property.rejection_reason}</p>
              </div>
            )}

            {/* Action Buttons */}
            {property.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowApproveDialog(true)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Property
                </Button>
                <Button
                  onClick={() => setShowRejectDialog(true)}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject Property
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this property?</AlertDialogTitle>
            <AlertDialogDescription>
              This property will become visible to all guests and can receive bookings.
              The host will be notified of the approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Property</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger id="rejection-reason" className="mt-2">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incomplete_information">Incomplete Information</SelectItem>
                  <SelectItem value="poor_quality_images">Poor Quality Images</SelectItem>
                  <SelectItem value="policy_violation">Policy Violation</SelectItem>
                  <SelectItem value="misleading_information">Misleading Information</SelectItem>
                  <SelectItem value="duplicate_listing">Duplicate Listing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="rejection-notes">Additional Notes</Label>
              <Textarea
                id="rejection-notes"
                placeholder="Provide additional details..."
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-host"
                checked={notifyHost}
                onCheckedChange={(checked) => setNotifyHost(checked as boolean)}
              />
              <Label htmlFor="notify-host" className="text-sm font-normal">
                Notify host via email
              </Label>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectionReason}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
