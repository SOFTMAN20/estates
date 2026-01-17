/**
 * MAINTENANCE DETAILS MODAL
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Wrench, User, Home, Calendar as CalendarIcon, Clock, 
  DollarSign, CheckCircle2, MessageSquare, Send, Phone,
  MapPin, Image as ImageIcon, AlertTriangle, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  useMaintenanceComments, 
  useUpdateMaintenanceRequest,
  useAssignMaintenance,
  useScheduleMaintenance,
  useCompleteMaintenance,
  useAddMaintenanceComment,
} from '@/hooks/useMaintenance';
import type { MaintenanceRequest, MaintenanceStatus } from '@/types/tenant';

interface MaintenanceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MaintenanceRequest;
}

const STATUS_OPTIONS: { value: MaintenanceStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'assigned', label: 'Assigned', color: 'bg-blue-100 text-blue-700' },
  { value: 'scheduled', label: 'Scheduled', color: 'bg-purple-100 text-purple-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'pending_parts', label: 'Pending Parts', color: 'bg-orange-100 text-orange-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-700' },
];

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  hvac: 'HVAC / AC',
  appliance: 'Appliance',
  structural: 'Structural',
  pest_control: 'Pest Control',
  other: 'Other',
};

export function MaintenanceDetailsModal({ open, onOpenChange, request }: MaintenanceDetailsModalProps) {
  const { data: comments = [] } = useMaintenanceComments(request.id);
  const updateRequest = useUpdateMaintenanceRequest();
  const assignMaintenance = useAssignMaintenance();
  const scheduleMaintenance = useScheduleMaintenance();
  const completeMaintenance = useCompleteMaintenance();
  const addComment = useAddMaintenanceComment();

  // Assignment form
  const [assignedTo, setAssignedTo] = useState(request.assigned_to || '');
  const [assignedContact, setAssignedContact] = useState(request.assigned_contact || '');
  
  // Schedule form
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    request.scheduled_date ? new Date(request.scheduled_date) : undefined
  );
  const [estimatedCost, setEstimatedCost] = useState(request.estimated_cost?.toString() || '');
  
  // Complete form
  const [resolutionNotes, setResolutionNotes] = useState(request.resolution_notes || '');
  const [actualCost, setActualCost] = useState(request.actual_cost?.toString() || '');
  
  // Comment form
  const [newComment, setNewComment] = useState('');

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find(s => s.value === status);
    return option ? (
      <Badge className={`${option.color} border-0`}>{option.label}</Badge>
    ) : null;
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><AlertTriangle className="h-3 w-3" />Emergency</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-700 border-0">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-700 border-0">Low</Badge>;
      default:
        return null;
    }
  };

  const handleAssign = async () => {
    if (!assignedTo) return;
    await assignMaintenance.mutateAsync({
      requestId: request.id,
      assignedTo,
      assignedContact: assignedContact || undefined,
    });
  };

  const handleSchedule = async () => {
    if (!scheduledDate) return;
    await scheduleMaintenance.mutateAsync({
      requestId: request.id,
      scheduledDate: scheduledDate.toISOString(),
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
    });
  };

  const handleComplete = async () => {
    await completeMaintenance.mutateAsync({
      requestId: request.id,
      resolutionNotes: resolutionNotes || undefined,
      actualCost: actualCost ? parseFloat(actualCost) : undefined,
    });
  };

  const handleStatusChange = async (status: MaintenanceStatus) => {
    await updateRequest.mutateAsync({
      requestId: request.id,
      data: { status },
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addComment.mutateAsync({
      maintenanceId: request.id,
      comment: newComment,
    });
    setNewComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                {request.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(request.status)}
                {getPriorityBadge(request.priority)}
                <Badge variant="outline">{CATEGORY_LABELS[request.category]}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Property & Tenant Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Home className="h-4 w-4" />
                    <span className="text-xs font-medium">Property</span>
                  </div>
                  <p className="font-medium">{request.property?.title}</p>
                  <p className="text-sm text-gray-500">{request.property?.location}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-medium">Reported By</span>
                  </div>
                  {request.tenant ? (
                    <>
                      <p className="font-medium">{request.tenant.user?.full_name}</p>
                      <p className="text-sm text-gray-500">{request.tenant.user?.phone}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Landlord reported</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{request.description}</p>
              </CardContent>
            </Card>

            {/* Location */}
            {request.location_in_property && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">Location in Property</h4>
                  </div>
                  <p className="text-gray-700">{request.location_in_property}</p>
                </CardContent>
              </Card>
            )}

            {/* Images */}
            {request.images && request.images.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">Photos</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {request.images.map((url, index) => (
                      <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={url}
                          alt={`Issue ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Access Info */}
            {(request.tenant_available_times || request.access_instructions) && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  {request.tenant_available_times && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Tenant Available Times</h4>
                      <p className="text-gray-700">{request.tenant_available_times}</p>
                    </div>
                  )}
                  {request.access_instructions && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Access Instructions</h4>
                      <p className="text-gray-700">{request.access_instructions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Created: {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}</span>
              </div>
              {request.completed_at && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed: {format(new Date(request.completed_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>

            {/* Status Change */}
            {request.status !== 'completed' && request.status !== 'cancelled' && (
              <div>
                <Label>Update Status</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {STATUS_OPTIONS.filter(s => s.value !== 'completed' && s.value !== request.status).map(status => (
                    <Button
                      key={status.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(status.value)}
                      disabled={updateRequest.isPending}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Assignment Tab */}
          <TabsContent value="assignment" className="space-y-4 mt-4">
            {request.assigned_to ? (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Currently Assigned</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{request.assigned_to}</span>
                    </div>
                    {request.assigned_contact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a href={`tel:${request.assigned_contact}`} className="text-blue-600 hover:underline">
                          {request.assigned_contact}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">{request.assigned_to ? 'Reassign' : 'Assign Vendor'}</h4>
                <div>
                  <Label>Vendor / Contractor Name *</Label>
                  <Input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g., ABC Plumbing Services"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={assignedContact}
                    onChange={(e) => setAssignedContact(e.target.value)}
                    placeholder="e.g., +255 712 345 678"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAssign}
                  disabled={!assignedTo || assignMaintenance.isPending}
                  className="w-full"
                >
                  {assignMaintenance.isPending ? 'Assigning...' : 'Assign Vendor'}
                </Button>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Schedule Visit</h4>
                <div>
                  <Label>Scheduled Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Estimated Cost (TZS)</Label>
                  <Input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleSchedule}
                  disabled={!scheduledDate || scheduleMaintenance.isPending}
                  className="w-full"
                >
                  {scheduleMaintenance.isPending ? 'Scheduling...' : 'Schedule'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Estimated Cost</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {request.estimated_cost 
                      ? `TZS ${request.estimated_cost.toLocaleString()}` 
                      : '-'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Actual Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {request.actual_cost 
                      ? `TZS ${request.actual_cost.toLocaleString()}` 
                      : '-'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Complete Form */}
            {request.status !== 'completed' && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Mark as Complete
                  </h4>
                  <div>
                    <Label>Resolution Notes</Label>
                    <Textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Describe what was done to resolve the issue..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Actual Cost (TZS)</Label>
                    <Input
                      type="number"
                      value={actualCost}
                      onChange={(e) => setActualCost(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <Button 
                    onClick={handleComplete}
                    disabled={completeMaintenance.isPending}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {completeMaintenance.isPending ? 'Completing...' : 'Mark Complete'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Resolution Notes (if completed) */}
            {request.status === 'completed' && request.resolution_notes && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">Resolution Notes</h4>
                  </div>
                  <p className="text-gray-700">{request.resolution_notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4 mt-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No comments yet</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.full_name || 'U')}&background=3b82f6&color=fff`}
                      alt=""
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{comment.user?.full_name}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || addComment.isPending}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
