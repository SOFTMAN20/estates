/**
 * RENTAL MANAGER LAYOUT - Shared layout with sidebar
 * ==================================================
 */

import React, { useState } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Building2,
  Home,
  Users,
  CreditCard,
  MessageSquare,
  Bell,
  FileText,
  Wrench,
  UserCheck,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface RentalManagerLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

// Sidebar menu items
const sidebarItems = [
  { id: 'properties', label: 'Properties', icon: Building2, path: '/host/rental-management', badge: null },
  { id: 'units', label: 'Units/Rooms', icon: Home, path: '/host/rental-management/units', badge: null },
  { id: 'tenants', label: 'Tenants', icon: Users, path: '/host/rental-management/tenants', badge: null },
  { id: 'payments', label: 'Payments', icon: CreditCard, path: '/host/rental-management/payments', badge: '3' },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/host/rental-management/messages', badge: '5' },
  { id: 'applications', label: 'Applications', icon: ClipboardList, path: '/host/rental-management/applications', badge: '3' },
  { id: 'alerts', label: 'Alerts', icon: Bell, path: '/host/rental-management/alerts', badge: '4' },
  { id: 'leases', label: 'Leases', icon: FileText, path: '/host/rental-management/leases', badge: null },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, path: '/host/rental-management/maintenance', badge: '1' },
  { id: 'screening', label: 'Screening', icon: UserCheck, path: '/host/rental-management/screening', badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/host/rental-management/analytics', badge: null },
];

const bottomSidebarItems = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/account', badge: null },
  { id: 'help', label: 'Help Center', icon: HelpCircle, path: '/help', badge: null },
];

const RentalManagerLayout: React.FC<RentalManagerLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  action 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isActiveRoute = (path: string) => location.pathname === path;

  // Sidebar Component
  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-white ${isMobile ? '' : 'border-r border-gray-200'}`}>
      {/* Sidebar Header */}
      <div className={`p-4 border-b border-gray-100 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="flex items-center justify-between">
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Rental Manager</span>
            </div>
          )}
          {isMobile ? (
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          ) : (
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-100 rounded hidden lg:block"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5 text-gray-500" /> : <ChevronLeft className="h-5 w-5 text-gray-500" />}
            </button>
          )}
        </div>
      </div>

      {/* Add Property Button */}
      <div className={`p-3 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}>
        <Button 
          className={`w-full gap-2 bg-blue-600 hover:bg-blue-700 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}
          onClick={() => navigate('/dashboard', { state: { openAddForm: true } })}
        >
          <Plus className="h-4 w-4" />
          {(!sidebarCollapsed || isMobile) && <span>Add Listing</span>}
        </Button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                isActiveRoute(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              } ${sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''}`}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-500'}`} />
              {(!sidebarCollapsed || isMobile) && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="p-2 border-t border-gray-100">
        {bottomSidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 ${
              sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0 text-gray-400" />
            {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Back to Dashboard */}
      <div className={`p-3 border-t border-gray-100 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}>
        <button
          onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors ${
            sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''
          }`}
        >
          <Home className="h-4 w-4" />
          {(!sidebarCollapsed || isMobile) && <span>Back to Dashboard</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 transition-all duration-300`}>
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar isMobile />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            {/* Mobile Header */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
              </div>
              {action}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RentalManagerLayout;
