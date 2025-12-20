import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyGridSkeleton } from '@/components/properties/propertyCommon/PropertyCardSkeleton';
import { DeletePropertyDialog } from './DeletePropertyDialog';
import { Home, Plus, Eye, Edit, Trash2, MapPin, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Property } from '@/hooks/useProperties';
import { formatCurrency } from '@/lib/utils';

/**
 * Props interface for PropertyGrid component
 */
interface PropertyGridProps {
  /** Array of property listings to display */
  properties: Property[];
  /** Function called when user wants to edit a property */
  onEdit: (property: Property) => void;
  /** Function called when user wants to delete a property */
  onDelete: (id: string) => Promise<void>;
  /** Function called when user wants to add a new property */
  onAddProperty: () => void;
  /** View mode for displaying properties */
  viewMode?: 'grid' | 'list';
}

/**
 * PropertyGrid Component
 * 
 * Displays a grid of property listings for landlords to manage.
 * Shows empty state when no properties exist, with options to add first property or view example.
 * For existing properties, displays them in a responsive grid with edit/delete actions.
 */
const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  properties, 
  onEdit, 
  onDelete,
  onAddProperty,
  viewMode = 'grid'
}) => {
  const { t, i18n } = useTranslation();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; property: Property | null }>({
    isOpen: false,
    property: null
  });

  const handleDeleteClick = (property: Property) => {
    setDeleteDialog({ isOpen: true, property });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.property) {
      await onDelete(deleteDialog.property.id);
      setDeleteDialog({ isOpen: false, property: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, property: null });
  };

  /**
   * Handles navigation to property example page
   */
  const handleViewExample = () => {
    window.location.href = '/property-example';
  };

  /**
   * Renders empty state when no properties exist
   * Shows welcome message with options to add first property or view example
   */
  const renderEmptyState = () => (
    <Card className="p-6 sm:p-8 text-center border-dashed border-2 border-gray-300 bg-white/50 backdrop-blur-sm">
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Welcome Icon */}
        <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Home className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {t('dashboard.welcomeToNyumbaLink')}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
            {t('dashboard.noPropertiesYet')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button 
            onClick={onAddProperty}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('dashboard.addFirstPropertyAction')}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleViewExample}
            size="lg"
            className="w-full sm:w-auto"
          >
            <Eye className="w-5 h-5 mr-2" />
            {t('dashboard.viewExample')}
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-700">
            {t('dashboard.goodListingTip')}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Renders individual property card with property details and action buttons
   */
  const renderPropertyCard = (property: Property) => (
    <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative h-40 sm:h-48 bg-gray-200 group">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Home className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge 
              className={
                property.status === 'approved' ? "bg-green-500 hover:bg-green-600 text-white shadow-md" :
                property.status === 'pending' ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md" :
                property.status === 'rejected' ? "bg-red-500 hover:bg-red-600 text-white shadow-md" :
                "bg-gray-500 hover:bg-gray-600 text-white shadow-md"
              }
            >
              {property.status === 'approved' ? '✓ Approved' :
               property.status === 'pending' ? '⏳ Pending' :
               property.status === 'rejected' ? '✕ Rejected' :
               property.status}
            </Badge>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Property Details */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm line-clamp-1">{property.location}</span>
          </div>

          {/* Price */}
          <div className="text-green-600 font-bold">
            <span className="text-base sm:text-lg">
              {formatCurrency(property.price || 0, { language: i18n.language })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(property)}
              className="flex-1 text-xs sm:text-sm"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {t('property.edit')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(property)}
              className="flex-1 text-xs sm:text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {t('property.delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Renders grid of existing properties
   */
  const renderPropertiesGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {properties.map(renderPropertyCard)}
    </div>
  );

  // Main render logic
  return (
    <>
      <div className="space-y-6">
        {properties.length === 0 ? renderEmptyState() : renderPropertiesGrid()}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeletePropertyDialog
        isOpen={deleteDialog.isOpen}
        propertyTitle={deleteDialog.property?.title || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default PropertyGrid;