/**
 * STEP 6: UNITS/ROOMS - For Multi-Unit Properties
 * ================================================
 * 
 * This step appears only for multi-unit property types:
 * - Hostel, Hotel, Lodge, Guest House, Apartment Building
 * 
 * Allows hosts to add individual units/rooms with their own pricing.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Plus, Trash2, Edit2, Home, Bed, Bath, 
  DollarSign, CheckCircle2, Building2, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

// Unit type definition
export interface PropertyUnit {
  id: string;
  unit_name: string;
  unit_number: string;
  unit_type: string;
  floor_number: number | null;
  bedrooms: number;
  bathrooms: number;
  square_meters: number | null;
  price: number;
  price_period: string;
  description: string;
  amenities: string[];
}

interface Step6UnitsRoomsProps {
  units: PropertyUnit[];
  propertyType: string;
  onUnitsChange: (units: PropertyUnit[]) => void;
  isValid: boolean;
}

// Unit types based on property type
const UNIT_TYPES: Record<string, string[]> = {
  'Hostel': ['dormitory', 'single', 'double', 'twin'],
  'Hotel': ['single', 'double', 'twin', 'suite', 'family'],
  'Lodge': ['room', 'suite', 'family'],
  'Guest House': ['room', 'single', 'double', 'family'],
  'Apartment': ['studio', 'apartment', 'single', 'double'],
};

const UNIT_TYPE_LABELS: Record<string, string> = {
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

const DEFAULT_UNIT: Omit<PropertyUnit, 'id'> = {
  unit_name: '',
  unit_number: '',
  unit_type: 'room',
  floor_number: null,
  bedrooms: 1,
  bathrooms: 1,
  square_meters: null,
  price: 0,
  price_period: 'per_night',
  description: '',
  amenities: [],
};

const Step6UnitsRooms: React.FC<Step6UnitsRoomsProps> = ({
  units,
  propertyType,
  onUnitsChange,
  isValid
}) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);
  const [formData, setFormData] = useState<Omit<PropertyUnit, 'id'>>(DEFAULT_UNIT);

  const availableUnitTypes = UNIT_TYPES[propertyType] || ['room', 'single', 'double'];

  const generateId = () => `unit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const openAddModal = () => {
    setEditingUnit(null);
    setFormData({ ...DEFAULT_UNIT, unit_type: availableUnitTypes[0] });
    setIsModalOpen(true);
  };

  const openEditModal = (unit: PropertyUnit) => {
    setEditingUnit(unit);
    setFormData({
      unit_name: unit.unit_name,
      unit_number: unit.unit_number,
      unit_type: unit.unit_type,
      floor_number: unit.floor_number,
      bedrooms: unit.bedrooms,
      bathrooms: unit.bathrooms,
      square_meters: unit.square_meters,
      price: unit.price,
      price_period: unit.price_period,
      description: unit.description,
      amenities: unit.amenities,
    });
    setIsModalOpen(true);
  };

  const handleSaveUnit = () => {
    if (!formData.unit_name.trim() || formData.price <= 0) return;

    if (editingUnit) {
      // Update existing unit
      const updatedUnits = units.map(u => 
        u.id === editingUnit.id ? { ...formData, id: editingUnit.id } : u
      );
      onUnitsChange(updatedUnits);
    } else {
      // Add new unit
      const newUnit: PropertyUnit = {
        ...formData,
        id: generateId(),
      };
      onUnitsChange([...units, newUnit]);
    }
    setIsModalOpen(false);
    setFormData(DEFAULT_UNIT);
    setEditingUnit(null);
  };

  const handleDeleteUnit = (unitId: string) => {
    onUnitsChange(units.filter(u => u.id !== unitId));
  };

  const handleInputChange = (field: keyof Omit<PropertyUnit, 'id'>, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalMonthlyIncome = units.reduce((sum, unit) => {
    if (unit.price_period === 'per_night') return sum + (unit.price * 30);
    if (unit.price_period === 'per_week') return sum + (unit.price * 4);
    return sum + unit.price;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Building2 className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Add Units/Rooms</h2>
        <p className="text-gray-500 mt-1">
          Add individual units or rooms for your {propertyType.toLowerCase()}
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-700">{units.length}</p>
            <p className="text-sm text-blue-600">Total Units</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(totalMonthlyIncome, { language: i18n.language, compact: true })}
            </p>
            <p className="text-sm text-green-600">Est. Monthly Income</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Unit Button */}
      <Button 
        onClick={openAddModal}
        className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="h-4 w-4" />
        Add Unit/Room
      </Button>

      {/* Units List */}
      {units.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <Home className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No units added yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click the button above to add your first unit
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {units.map((unit, index) => (
            <Card key={unit.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Home className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{unit.unit_name}</h4>
                        {unit.unit_number && (
                          <Badge variant="outline" className="text-xs">
                            #{unit.unit_number}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {UNIT_TYPE_LABELS[unit.unit_type] || unit.unit_type}
                        {unit.floor_number && ` • Floor ${unit.floor_number}`}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" /> {unit.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" /> {unit.bathrooms}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-green-600">
                          <DollarSign className="h-3.5 w-3.5" />
                          {formatCurrency(unit.price, { language: i18n.language })}
                          <span className="text-xs text-gray-400">
                            /{unit.price_period.replace('per_', '')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(unit)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Validation Message */}
      {!isValid && units.length === 0 && (
        <p className="text-sm text-amber-600 text-center">
          Add at least one unit to continue (or skip this step)
        </p>
      )}

      {/* Add/Edit Unit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-600" />
              {editingUnit ? 'Edit Unit' : 'Add New Unit'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Unit Name */}
            <div className="space-y-2">
              <Label htmlFor="unit_name">Unit Name *</Label>
              <Input
                id="unit_name"
                placeholder="e.g., Room 101, Suite A"
                value={formData.unit_name}
                onChange={(e) => handleInputChange('unit_name', e.target.value)}
              />
            </div>

            {/* Unit Number & Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="unit_number">Unit Number</Label>
                <Input
                  id="unit_number"
                  placeholder="e.g., 101"
                  value={formData.unit_number}
                  onChange={(e) => handleInputChange('unit_number', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Type</Label>
                <Select
                  value={formData.unit_type}
                  onValueChange={(value) => handleInputChange('unit_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnitTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {UNIT_TYPE_LABELS[type] || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Floor & Size */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="floor_number">Floor</Label>
                <Input
                  id="floor_number"
                  type="number"
                  min="0"
                  placeholder="e.g., 1"
                  value={formData.floor_number || ''}
                  onChange={(e) => handleInputChange('floor_number', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="square_meters">Size (m²)</Label>
                <Input
                  id="square_meters"
                  type="number"
                  min="1"
                  placeholder="e.g., 25"
                  value={formData.square_meters || ''}
                  onChange={(e) => handleInputChange('square_meters', e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (TZS) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="e.g., 50000"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Price Period</Label>
                <Select
                  value={formData.price_period}
                  onValueChange={(value) => handleInputChange('price_period', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per_night">Per Night</SelectItem>
                    <SelectItem value="per_week">Per Week</SelectItem>
                    <SelectItem value="per_month">Per Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this unit..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUnit}
              disabled={!formData.unit_name.trim() || formData.price <= 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {editingUnit ? 'Update Unit' : 'Add Unit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Step6UnitsRooms;
