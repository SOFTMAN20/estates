/**
 * UNITS PAGE - Manage all units/rooms across properties
 * Shows properties grouped with their units for multi-unit properties
 */

import React, { useState, useEffect } from 'react';
import RentalManagerLayout from '@/components/host/rental/RentalManagerLayout';
import { AddTenantModal } from '@/components/host/rental/AddTenantModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, Plus, MoreHorizontal, Home, RefreshCw, ChevronDown, ChevronRight,
  CheckCircle2, Clock, AlertTriangle, User, Building2, Layers, MapPin, Bed, Bath
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/useAuth';
import { useRentalUnits, type RentalUnit } from '@/hooks/dashboardHooks';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const UNIT_TYPE_LABELS: Record<string, string> = {
  'property': 'Property',
  'room': 'Room',
  'suite': 'Suite',
  'studio': 'Studio',
  'apartment': 'Apartment',
  'dormitory': 'Dormitory',
  'single': 'Single Room',
  'double': 'Double Room',
  'twin': 'Twin Room',
  'family': 'Family Room',
};

// Group units by property
interface PropertyGroup {
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  location: string;
  isMultiUnit: boolean;
  totalUnits: number;
  rentedUnits: number;
  vacantUnits: number;
  totalRent: number;
  image: string | null;
  units: RentalUnit[];
}

const Units = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const { units, properties, stats, loading, error, fetchUnits, refreshUnits } = useRentalUnits();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [filter, setFilter] = useState<'all' | 'rented' | 'vacant'>('all');
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set());
  
  // Add Tenant Modal state
  const [addTenantModalOpen, setAddTenantModalOpen] = useState(false);
  const [selectedUnitForTenant, setSelectedUnitForTenant] = useState<{
    id: string;
    name: string;
    unitNumber?: string;
    propertyId: string;
    propertyTitle: string;
    rent: number;
    isMultiUnit: boolean;
  } | null>(null);

  useEffect(() => {
    if (user) fetchUnits(user);
  }, [user, fetchUnits]);

  // Auto-expand all properties when data loads
  useEffect(() => {
    if (units.length > 0) {
      const propertyIds = new Set(units.map(u => u.propertyId));
      setExpandedProperties(propertyIds);
    }
  }, [units]);

  // Handle Add Tenant click
  const handleAddTenant = (unit: RentalUnit) => {
    setSelectedUnitForTenant({
      id: unit.id,
      name: unit.name,
      unitNumber: unit.unitNumber,
      propertyId: unit.propertyId,
      propertyTitle: unit.propertyTitle,
      rent: unit.rent,
      isMultiUnit: unit.isMultiUnit,
    });
    setAddTenantModalOpen(true);
  };

  const handleTenantAdded = () => {
    refreshUnits();
  };

  // Group units by property
  const groupedProperties: PropertyGroup[] = React.useMemo(() => {
    const groups: Record<string, PropertyGroup> = {};
    
    units.forEach(unit => {
      if (!groups[unit.propertyId]) {
        groups[unit.propertyId] = {
          propertyId: unit.propertyId,
          propertyTitle: unit.propertyTitle,
          propertyType: unit.propertyType,
          location: unit.location,
          isMultiUnit: unit.isMultiUnit,
          totalUnits: 0,
          rentedUnits: 0,
          vacantUnits: 0,
          totalRent: 0,
          image: unit.image,
          units: []
        };
      }
      
      groups[unit.propertyId].units.push(unit);
      groups[unit.propertyId].totalUnits++;
      if (unit.status === 'rented') {
        groups[unit.propertyId].rentedUnits++;
        groups[unit.propertyId].totalRent += unit.rent;
      } else {
        groups[unit.propertyId].vacantUnits++;
      }
    });
    
    return Object.values(groups);
  }, [units]);

  // Filter properties
  const filteredProperties = groupedProperties.filter(group => {
    const matchesSearch = group.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.units.some(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProperty = selectedProperty === 'all' || group.propertyId === selectedProperty;
    
    if (filter === 'all') return matchesSearch && matchesProperty;
    if (filter === 'rented') return matchesSearch && matchesProperty && group.rentedUnits > 0;
    if (filter === 'vacant') return matchesSearch && matchesProperty && group.vacantUnits > 0;
    return matchesSearch && matchesProperty;
  });

  const toggleExpanded = (propertyId: string) => {
    setExpandedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedProperties(new Set(groupedProperties.map(g => g.propertyId)));
  };

  const collapseAll = () => {
    setExpandedProperties(new Set());
  };

  const getStatusBadge = (unit: RentalUnit) => {
    if (unit.status === 'vacant') {
      return <Badge className="bg-blue-100 text-blue-700 border-0">Vacant</Badge>;
    }
    if (unit.tenant?.paymentStatus === 'paid') {
      return <Badge className="bg-green-100 text-green-700 border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Paid</Badge>;
    }
    if (unit.tenant?.paymentStatus === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-700 border-0 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 border-0 gap-1"><AlertTriangle className="h-3 w-3" />Overdue</Badge>;
  };

  const PropertySkeleton = () => (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <RentalManagerLayout 
      title="Units & Rooms" 
      subtitle="Manage all your rental units across properties"
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshUnits} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />Add Unit
          </Button>
        </div>
      }
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" size="sm" onClick={refreshUnits} className="mt-2">Try Again</Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <button onClick={() => setFilter('all')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'all' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Units</p>
        </button>
        <button onClick={() => setFilter('rented')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'rented' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-green-600">{stats.rented}</p>
          <p className="text-sm text-gray-500">Rented</p>
        </button>
        <button onClick={() => setFilter('vacant')} className={`p-3 rounded-lg border text-left transition-colors ${filter === 'vacant' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
          <p className="text-2xl font-bold text-blue-600">{stats.vacant}</p>
          <p className="text-sm text-gray-500">Vacant</p>
        </button>
        <div className="p-3 rounded-lg border bg-white border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyIncome, { language: i18n.language, compact: true })}</p>
          <p className="text-sm text-gray-500">Monthly Income</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search properties or units..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white" />
        </div>
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Select property" />
          </SelectTrigger>
          <SelectContent>
            {properties.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">Expand All</Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">Collapse All</Button>
        </div>
      </div>

      {/* Properties with Units */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <PropertySkeleton key={i} />)}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500 mb-6">{searchQuery ? 'Try a different search term' : 'Add your first property to see units here'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((group) => (
            <Collapsible 
              key={group.propertyId} 
              open={expandedProperties.has(group.propertyId)}
              onOpenChange={() => toggleExpanded(group.propertyId)}
            >
              <Card className="border-gray-200 overflow-hidden">
                {/* Property Header */}
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
                    <div className="flex items-center gap-4">
                      {/* Property Image */}
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {group.image ? (
                          <img src={group.image} alt={group.propertyTitle} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        {group.isMultiUnit && (
                          <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded">
                            {group.totalUnits}
                          </div>
                        )}
                      </div>
                      
                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{group.propertyTitle}</h3>
                          <Badge variant="outline" className="text-xs">{group.propertyType}</Badge>
                          {group.isMultiUnit && (
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs gap-1">
                              <Layers className="h-3 w-3" />Multi-Unit
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />{group.location}
                        </p>
                      </div>
                      
                      {/* Stats Summary */}
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{group.totalUnits}</p>
                          <p className="text-xs text-gray-500">Units</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-600">{group.rentedUnits}</p>
                          <p className="text-xs text-gray-500">Rented</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-blue-600">{group.vacantUnits}</p>
                          <p className="text-xs text-gray-500">Vacant</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{formatCurrency(group.totalRent, { language: i18n.language, compact: true })}</p>
                          <p className="text-xs text-gray-500">Income</p>
                        </div>
                      </div>
                      
                      {/* Expand Icon */}
                      <div className="flex items-center gap-2">
                        {expandedProperties.has(group.propertyId) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Stats */}
                    <div className="flex md:hidden items-center gap-4 mt-3 pt-3 border-t text-sm">
                      <span className="text-gray-600">{group.totalUnits} units</span>
                      <span className="text-green-600">{group.rentedUnits} rented</span>
                      <span className="text-blue-600">{group.vacantUnits} vacant</span>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                {/* Units List */}
                <CollapsibleContent>
                  <CardContent className="pt-0 border-t bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                      {group.units
                        .filter(unit => {
                          if (filter === 'all') return true;
                          return unit.status === filter;
                        })
                        .map((unit) => (
                        <div 
                          key={unit.id} 
                          className={`p-3 rounded-lg border bg-white ${unit.status === 'rented' ? 'border-green-200' : 'border-gray-200'} hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded ${unit.status === 'rented' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                <Home className={`h-3.5 w-3.5 ${unit.status === 'rented' ? 'text-green-600' : 'text-blue-600'}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-gray-900 text-sm">{unit.name}</span>
                                  {unit.unitNumber && (
                                    <span className="text-xs text-gray-400">#{unit.unitNumber}</span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{UNIT_TYPE_LABELS[unit.unitType] || unit.unitType}</span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Unit</DropdownMenuItem>
                                {unit.status === 'vacant' && (
                                  <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    handleAddTenant(unit);
                                  }}>
                                    Add Tenant
                                  </DropdownMenuItem>
                                )}
                                {unit.status === 'rented' && <DropdownMenuItem>Record Payment</DropdownMenuItem>}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {/* Unit Details */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1"><Bed className="h-3 w-3" />{unit.bedrooms}</span>
                            <span className="flex items-center gap-1"><Bath className="h-3 w-3" />{unit.bathrooms}</span>
                            {unit.floorNumber && <span>Floor {unit.floorNumber}</span>}
                          </div>
                          
                          {/* Price & Status */}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900 text-sm">
                              {formatCurrency(unit.rent, { language: i18n.language })}
                              <span className="text-xs text-gray-400 font-normal">/{unit.pricePeriod?.replace('per_', '') || 'month'}</span>
                            </span>
                            {getStatusBadge(unit)}
                          </div>
                          
                          {/* Tenant Info */}
                          {unit.tenant && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                              <User className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-xs text-gray-600 truncate">{unit.tenant.name}</span>
                            </div>
                          )}
                          
                          {/* Add Tenant Button for Vacant */}
                          {unit.status === 'vacant' && (
                            <Button 
                              size="sm" 
                              className="w-full mt-2 h-7 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleAddTenant(unit);
                              }}
                            >
                              Add Tenant
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Add Unit Button */}
                    {group.isMultiUnit && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />Add Unit to {group.propertyTitle}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Add Tenant Modal */}
      <AddTenantModal
        open={addTenantModalOpen}
        onOpenChange={setAddTenantModalOpen}
        unit={selectedUnitForTenant}
        onSuccess={handleTenantAdded}
      />
    </RentalManagerLayout>
  );
};

export default Units;
