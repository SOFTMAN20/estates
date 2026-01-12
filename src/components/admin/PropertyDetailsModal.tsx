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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Phone, 
  Calendar,
  Home,
  CheckCircle,
  XCircle,
  ExternalLink,
  Mail,
  Building,
  Star
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
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
  const [showHostProfileDialog, setShowHostProfileDialog] = useState(false);
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
          host:profiles!properties_host_id_fkey (
            id,
            name,
            phone,
            avatar_url,
            bio,
            location,
            created_at,
            user_id
          )
        `)
        .eq('id', propertyId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch host's properties count and stats
  const { data: hostStats } = useQuery({
    queryKey: ['admin', 'host-stats', property?.host_id],
    queryFn: async () => {
      if (!property?.host_id) return null;
      
      const { data: properties, error } = await supabase
        .from('properties')
        .select('id, status, average_rating, total_reviews')
        .eq('host_id', property.host_id);

      if (error) throw error;
      
      const totalProperties = properties?.length || 0;
      const approvedProperties = properties?.filter(p => p.status === 'approved').length || 0;
      const pendingProperties = properties?.filter(p => p.status === 'pending').length || 0;
      const rejectedProperties = properties?.filter(p => p.status === 'rejected').length || 0;
      const totalReviews = properties?.reduce((sum, p) => sum + (p.total_reviews || 0), 0) || 0;
      const avgRating = properties?.filter(p => p.average_rating).length > 0
        ? properties.reduce((sum, p) => sum + (p.average_rating || 0), 0) / properties.filter(p => p.average_rating).length
        : 0;

      return {
        totalProperties,
        approvedProperties,
        pendingProperties,
        rejectedProperties,
        totalReviews,
        avgRating: avgRating.toFixed(1)
      };
    },
    enabled: !!property?.host_id,
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

  const images = property.images || [];
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
                  TZS {property.price?.toLocaleString()}
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Host Information</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHostProfileDialog(true)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Host Profile
                </Button>
              </div>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={property.host?.avatar_url} alt={property.host?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {property.host?.name?.charAt(0)?.toUpperCase() || 'H'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{property.host?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{property.host?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">
                      {property.host?.created_at 
                        ? formatDistanceToNow(new Date(property.host.created_at), { addSuffix: true })
                        : 'N/A'
                      }
                    </span>
                  </div>
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

      {/* Host Profile Dialog */}
      <Dialog open={showHostProfileDialog} onOpenChange={setShowHostProfileDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Host Profile
            </DialogTitle>
            <DialogDescription>
              Detailed information about the property host
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Host Avatar & Basic Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                <AvatarImage src={property?.host?.avatar_url} alt={property?.host?.name} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {property?.host?.name?.charAt(0)?.toUpperCase() || 'H'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {property?.host?.name || 'Unknown Host'}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {property?.host?.location || 'Location not set'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Member since {property?.host?.created_at 
                    ? format(new Date(property.host.created_at), 'MMMM yyyy')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 bg-white border rounded-lg">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{property?.host?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {property?.host?.bio && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">About</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {property.host.bio}
                </p>
              </div>
            )}

            {/* Host Statistics */}
            {hostStats && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Host Statistics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <Building className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-blue-600">{hostStats.totalProperties}</p>
                    <p className="text-xs text-gray-600">Total Properties</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-green-600">{hostStats.approvedProperties}</p>
                    <p className="text-xs text-gray-600">Approved</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <Calendar className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-yellow-600">{hostStats.pendingProperties}</p>
                    <p className="text-xs text-gray-600">Pending</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-red-600">{hostStats.rejectedProperties}</p>
                    <p className="text-xs text-gray-600">Rejected</p>
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="mt-3 p-3 bg-amber-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-gray-900">{hostStats.avgRating}</span>
                    <span className="text-sm text-gray-600">Average Rating</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{hostStats.totalReviews}</span>
                    <span className="text-sm text-gray-600 ml-1">Reviews</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowHostProfileDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
