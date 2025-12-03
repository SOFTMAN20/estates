import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyGridSkeleton } from '@/components/properties/propertyCommon/PropertyCardSkeleton';
import { DeletePropertyDialog } from './DeletePropertyDialog';
import { Home, Plus, Eye, Edit, Trash2, MapPin, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Property } from '@/hooks/useProperties';

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
  onAddProperty
}) => {
  const { t } = useTranslation();
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
    <Card className="p-8 text-center border-dashed border-2 border-gray-300">
      <CardContent className="space-y-6">
        {/* Welcome Icon */}
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Home className="w-8 h-8 text-blue-600" />
        </div>
        
        {/* Welcome Message */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {t('dashboard.welcomeToNyumbaLink')}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
              {t('dashboard.yourProperties', { count: properties.length })}
          </p>
        </div>
              {t('dashboard.manageProperties')}
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button 
            onClick={onAddProperty}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t('dashboard.addFirstPropertyAction')}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleViewExample}
            className="border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Eye className="w-5 h-5" />
            {t('dashboard.addProperty')}
          </Button>
        </div>

        {/* Helpful Tips */}
        <div className="bg-primary/10 rounded-lg p-4 mt-6">
          <p className="text-sm text-primary">
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
    <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative h-48 bg-gray-200">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge 
              className={
                property.status === 'approved' ? "bg-green-500 text-white" :
                property.status === 'pending' ? "bg-yellow-500 text-white" :
                property.status === 'rejected' ? "bg-red-500 text-white" :
                "bg-gray-500 text-white"
              }
            >
              {property.status === 'approved' ? 'Approved' :
               property.status === 'pending' ? 'Pending' :
               property.status === 'rejected' ? 'Rejected' :
               property.status}
            </Badge>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 break-words">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="text-sm break-words">{property.location}</span>
          </div>

          {/* Price */}
          <div className="flex items-start gap-2 text-green-600 font-semibold">
            <DollarSign className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="break-all">TSh {property.price?.toLocaleString()}/mwezi</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(property)}
              className="flex-1 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {t('dashboard.edit')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(property)}
              className="flex-1 flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              {t('dashboard.delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  /**
   * Renders grid of existing properties with add new property button
   */
  const renderPropertiesGrid = () => (
    <div className="space-y-6">
      {/* Header with Add Property Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Nyumba Zako ({properties.length})
          </h2>
          <p className="text-gray-600 text-sm">
            Simamia na hariri nyumba zako zilizotangazwa
          </p>
        </div>
        <Button 
          onClick={onAddProperty}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ongeza Nyumba
        </Button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {properties.map(renderPropertyCard)}
      </div>
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