import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  FileText, 
  Activity, 
  Settings,
  LogOut,
  ArrowLeft,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard,
    description: 'Overview & stats'
  },
  { 
    name: 'Properties', 
    href: '/admin/properties', 
    icon: Home,
    badge: 2,
    badgeVariant: 'default' as const,
    description: 'Manage listings'
  },
  { 
    name: 'Users', 
    href: '/admin/users', 
    icon: Users,
    description: 'User management'
  },
  { 
    name: 'Bookings', 
    href: '/admin/bookings', 
    icon: Calendar,
    description: 'Booking overview'
  },
  { 
    name: 'Payments', 
    href: '/admin/payments', 
    icon: DollarSign,
    description: 'Transactions'
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3,
    description: 'Insights & trends'
  },
  { 
    name: 'Reports', 
    href: '/admin/reports', 
    icon: FileText,
    description: 'Generate reports'
  },
  { 
    name: 'Activity Log', 
    href: '/admin/activity-log', 
    icon: Activity,
    description: 'Audit trail'
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    description: 'Configuration'
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 h-screen flex flex-col sticky top-0 shadow-sm">
      {/* Logo & Brand */}
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">NyumbaLink</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
        <Separator className="mt-4" />
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  {!isActive && (
                    <div className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              
              {item.badge && (
                <Badge 
                  variant={item.badgeVariant} 
                  className={`ml-2 flex-shrink-0 ${isActive ? 'bg-white/20 text-white border-white/30' : ''}`}
                >
                  {item.badge}
                </Badge>
              )}
              
              {isActive && (
                <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 space-y-3 flex-shrink-0 bg-white">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50">
          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">Admin User</div>
            <div className="text-xs text-gray-500 truncate">{user?.email || 'admin@nyumbalink.com'}</div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Admin
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
