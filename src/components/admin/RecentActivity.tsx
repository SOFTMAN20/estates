import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Activity {
  id: string;
  type: 'user_registration' | 'property_submission' | 'booking_completed';
  title: string;
  description: string;
  timestamp: string;
  name: string;
}

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin', 'recent-activity'],
    queryFn: async (): Promise<Activity[]> => {
      const activityList: Activity[] = [];

      // Fetch recent user registrations
      const { data: users } = await supabase
        .from('profiles')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      users?.forEach((user) => {
        activityList.push({
          id: `user-${user.id}`,
          type: 'user_registration',
          title: 'New User Registration',
          description: `${user.name || 'New user'} joined NyumbaLink`,
          timestamp: user.created_at || new Date().toISOString(),
          name: user.name || 'User',
        });
      });

      // Fetch recent property submissions
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, created_at, host_id, profiles!properties_host_id_fkey(name)')
        .order('created_at', { ascending: false })
        .limit(3);

      properties?.forEach((property) => {
        const hostProfile = property.profiles as { name: string | null } | null;
        activityList.push({
          id: `property-${property.id}`,
          type: 'property_submission',
          title: 'New Property Submitted',
          description: property.title || 'New property',
          timestamp: property.created_at || new Date().toISOString(),
          name: hostProfile?.name || 'Host',
        });
      });

      // Fetch recent completed bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, total_amount, created_at, guest_id, profiles!bookings_guest_id_fkey(name)')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(3);

      bookings?.forEach((booking) => {
        const guestProfile = booking.profiles as { name: string | null } | null;
        activityList.push({
          id: `booking-${booking.id}`,
          type: 'booking_completed',
          title: 'Booking Completed',
          description: `TZS ${booking.total_amount?.toLocaleString() || '0'}`,
          timestamp: booking.created_at || new Date().toISOString(),
          name: guestProfile?.name || 'Guest',
        });
      });

      // Sort all activities by timestamp (most recent first)
      return activityList.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 10); // Limit to 10 most recent activities
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-gray-500">Latest platform activities</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar>
                  <AvatarFallback>{activity.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <Badge variant={
                      activity.type === 'user_registration' ? 'default' :
                      activity.type === 'property_submission' ? 'secondary' :
                      'outline'
                    }>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        )}
      </CardContent>
    </Card>
  );
}
