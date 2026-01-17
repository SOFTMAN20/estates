/**
 * RENTAL MANAGEMENT PAGE - Zillow-inspired Design with Sidebar
 * =============================================================
 * 
 * Ukurasa wa kusimamia nyumba na wapangaji - Property & Tenant management
 * Now integrated with Supabase backend for real data
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Search, MoreHorizontal, Home, Users, DollarSign,
  Eye, Edit, Trash2, MessageSquare, FileText, Building2, MapPin,
  Bed, Bath, CheckCircle2, Clock, AlertTriangle, Filter, Bell,
  CreditCard, Settings, HelpCircle, BarChart3, Wrench, ClipboardList,
  UserCheck, ChevronLeft, ChevronRight, Menu, X, RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRentalProperties, type RentalProperty } from '@/hooks/dashboardHooks';
import { formatCurrency } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sidebar menu items
const sidebarItems = [
  { id: 'properties', label: 'Properties', icon: Building2, path: '/host/rental-management', badge: null },
  { id: 'units', label: 'Units/Rooms', icon: Home, path: '/host/rental-management/units', badge: null },
  { id: 'tenants', label: 'Tenants', icon: Users, path: '/host/rental-management/tenants', badge: null },
  { id: 'payments', label: 'Payments', icon: CreditCard, path: '/host/rental-management/payments', badge: null },
  { id: 'messages', label: 'Messages', icon: MessageSquare, path: '/messages', badge: null },
  { id: 'applications', label: 'Applications', icon: ClipboardList, path: '/host/rental-management/applications', badge: null },
  { id: 'alerts', label: 'Alerts', icon: Bell, path: '/notifications', badge: null },
  { id: 'leases', label: 'Leases', icon: FileText, path: '/host/rental-management/leases', badge: null },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, path: '/host/rental-management/maintenance', badge: null },
  { id: 'screening', label: 'Screening', icon: UserCheck, path: '/host/rental-management/screening', badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', badge: null },
];

const bottomSidebarItems = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/account', badge: null },
  { id: 'help', label: 'Help Center', icon: HelpCircle, path: '/help', badge: null },
];

type FilterTab = 'all' | 'active' | 'rented' | 'vacant' | 'draft';


const RentalManagement = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { properties, stats, loading, error, fetchRentalProperties, refreshProperties } = useRentalProperties();

  useEffect(() => {
    if (user) {
      fetchRentalProperties(user);
    }
  }, [user, fetchRentalProperties]);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && property.status === 'approved' && property.is_available;
    if (activeTab === 'rented') return matchesSearch && property.rentedUnits > 0;
    if (activeTab === 'vacant') return matchesSearch && property.rentedUnits === 0 && property.status === 'approved';
    if (activeTab === 'draft') return matchesSearch && property.status === 'pending';
    return matchesSearch;
  });

  const tabCounts = {
    all: properties.length,
    active: properties.filter(p => p.status === 'approved' && p.is_available).length,
    rented: properties.filter(p => p.rentedUnits > 0).length,
    vacant: properties.filter(p => p.rentedUnits === 0 && p.status === 'approved').length,
    draft: properties.filter(p => p.status === 'pending').length,
  };

  const getStatusBadge = (property: RentalProperty) => {
    if (property.status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
    }
    if (property.status === 'rejected') {
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
    }
    if (property.rentedUnits > 0) {
      return <Badge className="bg-green-100 text-green-700 border-0">Rented</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-700 border-0">Available</Badge>;
  };

  const getPaymentStatus = (property: RentalProperty) => {
    if (property.hasOverduePayments) {
      return <span className="flex items-center gap-1 text-red-600 text-sm"><AlertTriangle className="h-4 w-4" />Overdue</span>;
    }
    if (property.hasPendingPayments) {
      return <span className="flex items-center gap-1 text-yellow-600 text-sm"><Clock className="h-4 w-4" />Payment Due</span>;
    }
    if (property.rentedUnits > 0) {
      return <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="h-4 w-4" />Rent Paid</span>;
    }
    return null;
  };

  const tabs = [
    { id: 'all', label: 'All', count: tabCounts.all },
    { id: 'active', label: 'Active', count: tabCounts.active },
    { id: 'rented', label: 'Rented', count: tabCounts.rented },
    { id: 'vacant', label: 'Vacant', count: tabCounts.vacant },
    { id: 'draft', label: 'Drafts', count: tabCounts.draft },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;


  const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`flex flex-col h-full bg-white ${isMobile ? '' : 'border-r border-gray-200'}`}>
      <div className={`p-4 border-b border-gray-100 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}>
        <div className="flex items-center justify-between">
          {(!sidebarCollapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg"><Building2 className="h-5 w-5 text-white" /></div>
              <span className="font-bold text-gray-900">Rental Manager</span>
            </div>
          )}
          {isMobile ? (
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          ) : (
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-gray-100 rounded hidden lg:block">
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5 text-gray-500" /> : <ChevronLeft className="h-5 w-5 text-gray-500" />}
            </button>
          )}
        </div>
      </div>
      <div className={`p-3 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}>
        <Button className={`w-full gap-2 bg-blue-600 hover:bg-blue-700 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}
          onClick={() => navigate('/dashboard', { state: { openAddForm: true } })}>
          <Plus className="h-4 w-4" />
          {(!sidebarCollapsed || isMobile) && <span>Add Listing</span>}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button key={item.id} onClick={() => { navigate(item.path); if (isMobile) setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActiveRoute(item.path) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              } ${sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''}`}>
              <item.icon className={`h-5 w-5 flex-shrink-0 ${isActiveRoute(item.path) ? 'text-blue-600' : 'text-gray-500'}`} />
              {(!sidebarCollapsed || isMobile) && <span className="flex-1 text-left">{item.label}</span>}
            </button>
          ))}
        </div>
      </nav>
      <div className="p-2 border-t border-gray-100">
        {bottomSidebarItems.map((item) => (
          <button key={item.id} onClick={() => { navigate(item.path); if (isMobile) setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 ${
              sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''}`}>
            <item.icon className="h-5 w-5 flex-shrink-0 text-gray-400" />
            {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
          </button>
        ))}
      </div>
      <div className={`p-3 border-t border-gray-100 ${sidebarCollapsed && !isMobile ? 'px-2' : ''}`}>
        <button onClick={() => navigate('/dashboard')}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg ${
            sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''}`}>
          <Home className="h-4 w-4" />
          {(!sidebarCollapsed || isMobile) && <span>Back to Dashboard</span>}
        </button>
      </div>
    </div>
  );


  const PropertySkeleton = () => (
    <Card className="overflow-hidden border-gray-200">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <Skeleton className="sm:w-48 lg:w-56 h-40 sm:h-36" />
          <div className="flex-1 p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        <aside className={`hidden lg:block ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 transition-all duration-300`}>
          <Sidebar />
        </aside>
        {mobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}
        <aside className={`fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 lg:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar isMobile />
        </aside>
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <button onClick={() => setMobileSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Properties</h1>
            </div>
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                <p className="text-gray-500 text-sm">Manage your rental listings</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={refreshProperties} disabled={loading} className="gap-2">
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
                </Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/dashboard', { state: { openAddForm: true } })}>
                  <Plus className="h-4 w-4" />Add a Listing
                </Button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
                <Button variant="outline" size="sm" onClick={refreshProperties} className="mt-2">Try Again</Button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search properties..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-gray-200" />
                </div>
                <Button variant="outline" className="gap-2 flex-shrink-0"><Filter className="h-4 w-4" />Filters</Button>
              </div>
              <div className="flex gap-1 mt-4 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as FilterTab)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="space-y-4">{[1, 2, 3].map(i => <PropertySkeleton key={i} />)}</div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">{searchQuery ? 'Try a different search term' : 'Add your first property to get started'}</p>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/dashboard', { state: { openAddForm: true } })}>
                  <Plus className="h-4 w-4" />Add a Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <Card key={property.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 lg:w-56 h-40 sm:h-36 relative flex-shrink-0">
                          <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'} alt={property.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2">{getStatusBadge(property)}</div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-gray-900 truncate mb-1">{property.title}</h3>
                              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" /><span className="truncate">{property.location}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm mb-3">
                                <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.bedrooms}</span>
                                <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms}</span>
                                <span className="font-medium text-gray-900">{formatCurrency(Number(property.price), { language: i18n.language })}/mo</span>
                              </div>

                              {property.tenants.length > 0 ? (() => {
                                const firstTenant = property.tenants[0];
                                const tenantName = firstTenant?.user?.name || 
                                  (firstTenant as { tenant_name?: string })?.tenant_name || 'Tenant';
                                return (
                                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{tenantName}</p>
                                    </div>
                                    {getPaymentStatus(property)}
                                  </div>
                                );
                              })() : (
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1"><Eye className="h-4 w-4" />No tenants</span>
                                </div>
                              )}
                            </div>
                            <div className="flex sm:flex-col gap-2 flex-shrink-0">
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs" onClick={() => navigate(`/property/${property.id}`)}>View</Button>
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs" onClick={() => navigate('/host/properties')}>Edit</Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="px-2"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  {property.tenants.length > 0 && (
                                    <>
                                      <DropdownMenuItem><MessageSquare className="h-4 w-4 mr-2" />Message</DropdownMenuItem>
                                      <DropdownMenuItem><DollarSign className="h-4 w-4 mr-2" />Record Payment</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Card className="border-gray-200">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded"><Building2 className="h-4 w-4 text-blue-600" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{stats.totalProperties}</p>
                    <p className="text-xs text-gray-500">Properties</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded"><Home className="h-4 w-4 text-purple-600" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{stats.totalUnits}</p>
                    <p className="text-xs text-gray-500">Total Units</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 rounded"><Users className="h-4 w-4 text-green-600" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{stats.rentedUnits}</p>
                    <p className="text-xs text-gray-500">Rented</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-gray-200">
                <CardContent className="p-3 flex items-center gap-2">
                  <div className="p-1.5 bg-orange-100 rounded"><DollarSign className="h-4 w-4 text-orange-600" /></div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{(stats.monthlyIncome / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500">Monthly</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RentalManagement;
