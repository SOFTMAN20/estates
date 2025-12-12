import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

// Mock data for UI preview
const mockActivities = [
  {
    id: '1',
    type: 'user_registration' as const,
    title: 'New User Registration',
    description: 'John Doe joined NyumbaLink',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    name: 'John Doe',
  },
  {
    id: '2',
    type: 'property_submission' as const,
    title: 'New Property Submitted',
    description: 'Modern 3BR Apartment in Masaki',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    name: 'Host',
  },
  {
    id: '3',
    type: 'booking_completed' as const,
    title: 'Booking Completed',
    description: 'TZS 1,200,000',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    name: 'Guest',
  },
  {
    id: '4',
    type: 'user_registration' as const,
    title: 'New User Registration',
    description: 'Sarah Smith joined NyumbaLink',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    name: 'Sarah Smith',
  },
  {
    id: '5',
    type: 'property_submission' as const,
    title: 'New Property Submitted',
    description: 'Cozy Studio in Mikocheni',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    name: 'Host',
  },
  {
    id: '6',
    type: 'booking_completed' as const,
    title: 'Booking Completed',
    description: 'TZS 850,000',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    name: 'Guest',
  },
  {
    id: '7',
    type: 'user_registration' as const,
    title: 'New User Registration',
    description: 'Michael Johnson joined NyumbaLink',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    name: 'Michael Johnson',
  },
];

export function RecentActivity() {
  const activities = mockActivities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-gray-500">Latest platform activities</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => (
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
      </CardContent>
    </Card>
  );
}
