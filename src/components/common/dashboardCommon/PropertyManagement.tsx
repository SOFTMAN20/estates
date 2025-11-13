/**
 * PROPERTYMANAGEMENT.TSX - PROPERTY MANAGEMENT COMPONENT
 * =====================================================
 * 
 * Kipengele cha usimamizi wa nyumba - Property management component
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays and manages property listings (Kuonyesha na kusimamia orodha za nyumba)
 * - Provides search and filtering capabilities (Kutoa uwezo wa utafutaji na kuchuja)
 * - Handles property grid display (Kushughulikia onyesho la gridi ya nyumba)
 * - Manages view mode switching (Kusimamia kubadilisha hali ya kuona)
 * 
 * FEATURES / VIPENGELE:
 * - Property search functionality (Utendakazi wa kutafuta nyumba)
 * - Status filtering (active/inactive) (Kuchuja kwa hali)
 * - Grid/List view toggle (Kubadilisha kuona kama gridi/orodha)
 * - Property CRUD operations (Vitendo vya kuongeza, kusoma, kusasisha, kufuta nyumba)
 */

import React from 'react';
import PropertyGrid from './PropertyGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Home, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';

type Property = Tables<'properties'>;

interface PropertyManagementProps {
  properties: Property[];
  searchQuery: string;
  filterStatus: string;
  viewMode: 'grid' | 'list';
  onSearchChange: (query: string) => void;
  onFilterChange: (status: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onEditProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => Promise<void>;
  onAddProperty: () => void;
}

/**
 * PROPERTY MANAGEMENT COMPONENT
 * ============================
 * 
 * Main component for managing property listings with search,
 * filtering, and CRUD operations.
 * 
 * Kipengele kikuu cha kusimamia orodha za nyumba na utafutaji,
 * kuchuja, na vitendo vya CRUD.
 */
const PropertyManagement: React.FC<PropertyManagementProps> = ({
  properties,
  searchQuery,
  filterStatus,
  viewMode,
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  onEditProperty,
  onDeleteProperty,
  onAddProperty
}) => {
  const { t } = useTranslation();

  /**
   * STATUS COUNTS
   * =============
   * 
   * Calculate counts for each status
   */
  const statusCounts = {
    all: properties.length,
    approved: properties.filter(p => p.status === 'approved').length,
    pending: properties.filter(p => p.status === 'pending').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
    active: properties.filter(p => p.status === 'approved').length,
    inactive: properties.filter(p => p.status === 'pending' || p.status === 'rejected').length
  };

  /**
   * PROPERTY FILTERING LOGIC
   * =======================
   * 
   * Filters properties based on search query and status filter.
   * Status mapping:
   * - approved = active
   * - pending = inactive
   * - rejected = inactive
   */
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'all') {
      matchesStatus = true;
    } else if (filterStatus === 'active') {
      matchesStatus = property.status === 'approved';
    } else if (filterStatus === 'inactive') {
      matchesStatus = property.status === 'pending' || property.status === 'rejected';
    } else if (filterStatus === 'pending') {
      matchesStatus = property.status === 'pending';
    } else if (filterStatus === 'rejected') {
      matchesStatus = property.status === 'rejected';
    } else if (filterStatus === 'approved') {
      matchesStatus = property.status === 'approved';
    }
    
    return matchesSearch && matchesStatus;
  });

  /**
   * SEARCH AND FILTER CONTROLS
   * ==========================
   * 
   * Renders the search input, status filter, and view mode toggle.
   */
  const renderSearchAndFilters = () => (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative">
        <Input
          placeholder={t('dashboard.searchProperties')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full sm:w-64"
        />
      </div>
      
      <Select value={filterStatus} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder={t('dashboard.status')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Zote ({statusCounts.all})</SelectItem>
          <SelectItem value="active">Active ({statusCounts.active})</SelectItem>
          <SelectItem value="inactive">Inactive ({statusCounts.inactive})</SelectItem>
          <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
          <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
          <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex border rounded-lg">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="rounded-r-none"
        >
          <Home className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="rounded-l-none"
        >
          <TrendingUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="border-b bg-white/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('dashboard.yourProperties', { count: filteredProperties.length })}
            </CardTitle>
            <p className="text-gray-600 mt-1">
              {t('dashboard.manageProperties')}
            </p>
          </div>
          
          {renderSearchAndFilters()}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <PropertyGrid
          properties={filteredProperties}
          onEdit={onEditProperty}
          onDelete={onDeleteProperty}
          onAddProperty={onAddProperty}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyManagement;