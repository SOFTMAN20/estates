/**
 * PROPERTIES PAGE - HOST PROPERTY MANAGEMENT
 * =========================================
 * 
 * Ukurasa wa kusimamia nyumba - Property management page
 * 
 * This page displays all properties owned by the host with full
 * management capabilities including search, filter, edit, and delete.
 */

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { PropertyForm } from '@/components/host/dashboard/AddPropertyForms';
import { PropertyGridSkeleton } from '@/components/properties/propertyCommon/PropertyCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Search, Edit, Trash2, Bed, Bath, MapPin, Plus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import {
  useDashboardProfile,
  useDashboardProperties
} from '@/hooks/dashboardHooks';
import type { Tables } from '@/lib/integrations/supabase/types';
import { formatCurrency } from '@/lib/utils';

type Property = Tables<'properties'>;

const Properties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  // Profile Management Hook
  const { profile, fetchProfile } = useDashboardProfile();
  
  // Property Management Hook
  const {
    properties,
    formData,
    editingProperty,
    submitting,
    setEditingProperty,
    getMyProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    toggleAvailability,
    preparePropertyForEdit,
    handleInputChange,
    handleServiceToggle,
    handleAmenityToggle,
    resetForm,
    loadSavedDraft
  } = useDashboardProperties();

  // Initialize page
  useEffect(() => {
    const initializePage = async () => {
      if (!user) return;
      
      try {
        await Promise.allSettled([
          fetchProfile(user),
          getMyProperties(user)
        ]);
      } catch (error) {
        console.error('Failed to load properties:', error);
        toast({
          variant: "destructive",
          title: t('common.error'),
          description: 'Imeshindikana kupakia nyumba'
        });
      } finally {
        setLoading(false);
      }
    };

    initializePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Filter properties based on tab and search
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || property.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Count properties by status
  const statusCounts = {
    all: properties.length,
    pending: properties.filter(p => p.status === 'pending').length,
    approved: properties.filter(p => p.status === 'approved').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  };

  // Handlers
  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProperty(null);
    resetForm(profile);
  };

  const onPropertySubmitSuccess = async () => {
    toast({
      title: t('common.success'),
      description: editingProperty 
        ? 'Nyumba yako imesasishwa kikamilifu' 
        : 'Nyumba yako imeongezwa kikamilifu'
    });
    handleCloseForm();
    if (user) {
      await getMyProperties(user);
    }
  };

  const onPropertySubmitError = (message: string) => {
    toast({
      variant: "destructive",
      title: t('common.error'),
      description: message
    });
  };

  const confirmDelete = (id: string) => {
    setPropertyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const onPropertyDeleteSuccess = async () => {
    toast({
      title: t('common.success'),
      description: 'Nyumba imefutwa kikamilifu'
    });
    if (user) {
      await getMyProperties(user);
    }
  };

  const onPropertyDeleteError = () => {
    toast({
      variant: "destructive",
      title: t('common.error'),
      description: 'Imeshindikana kufuta nyumba'
    });
  };

  const handleConfirmDelete = async () => {
    if (propertyToDelete) {
      await deleteProperty(propertyToDelete, onPropertyDeleteSuccess, onPropertyDeleteError);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Property Card Component
  const PropertyCard = ({ property }: { property: Property }) => {
    const mainImage = property.images?.[0] || '/placeholder-property.jpg';
    const isAvailable = property.status === 'approved';
    
    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-44 sm:h-48 overflow-hidden group">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(property.status || 'pending')}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <CardContent className="p-3 sm:p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-600">
              {formatCurrency(property.price, { language: i18n.language })}
            </p>
          </div>

          {/* Rejection Reason Alert */}
          {property.status === 'rejected' && property.rejection_reason && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700 mb-0.5">
                    {i18n.language === 'en' ? 'Rejection Reason' : 'Sababu ya Kukataliwa'}
                  </p>
                  <p className="text-xs text-red-600 line-clamp-2">
                    {property.rejection_reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 pb-3 border-b">
            <div className="flex items-center">
              <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs text-gray-500">
                {property.is_available ? 'Available' : 'Hidden'}
              </span>
              <Switch
                checked={property.is_available ?? true}
                disabled={property.status !== 'approved'}
                className="scale-75 sm:scale-100"
                onCheckedChange={() => {
                  if (property.status !== 'approved') {
                    toast({
                      title: "Info",
                      description: "Property must be approved before toggling availability"
                    });
                    return;
                  }
                  
                  toggleAvailability(
                    property.id,
                    property.is_available ?? true,
                    () => {
                      toast({
                        title: "Success",
                        description: `Property ${property.is_available ? 'hidden' : 'made available'} successfully`
                      });
                      getMyProperties(user!);
                    },
                    () => {
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to update property availability"
                      });
                    }
                  );
                }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs sm:text-sm"
              onClick={async () => {
                await preparePropertyForEdit(property, profile);
                setShowAddForm(true);
              }}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t('property.edit')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => confirmDelete(property.id)}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t('property.delete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <PropertyGridSkeleton count={6} viewMode="grid" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-3 sm:mb-4 -ml-2 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Rudi Dashibodi</span>
            <span className="sm:hidden">Rudi</span>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                Nyumba Zangu
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Simamia na usasisha nyumba zako zote
              </p>
            </div>
            <Button 
              onClick={() => {
                // Try to load saved draft, if none exists, reset form
                const hasSavedDraft = loadSavedDraft(profile);
                if (!hasSavedDraft) {
                  resetForm(profile);
                }
                setShowAddForm(true);
              }} 
              size="default"
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="sm:hidden">Ongeza</span>
              <span className="hidden sm:inline">Ongeza Nyumba</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tafuta nyumba kwa jina..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs for Status Filtering */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white shadow-sm">
            <TabsTrigger 
              value="all"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <span className="font-semibold">Zote</span>
              <span className="text-[10px] sm:text-xs opacity-80">({statusCounts.all})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
            >
              <span className="font-semibold hidden sm:inline">Pending</span>
              <span className="font-semibold sm:hidden">⏳</span>
              <span className="text-[10px] sm:text-xs opacity-80">({statusCounts.pending})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="approved"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <span className="font-semibold hidden sm:inline">Approved</span>
              <span className="font-semibold sm:hidden">✓</span>
              <span className="text-[10px] sm:text-xs opacity-80">({statusCounts.approved})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="rejected"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 px-2 text-xs sm:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <span className="font-semibold hidden sm:inline">Rejected</span>
              <span className="font-semibold sm:hidden">✕</span>
              <span className="text-[10px] sm:text-xs opacity-80">({statusCounts.rejected})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 sm:mt-6">
            {filteredProperties.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center bg-white/50 backdrop-blur-sm">
                <div className="max-w-md mx-auto">
                  <Home className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Hakuna nyumba
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    {searchQuery 
                      ? 'Hakuna nyumba zinazolingana na utafutaji wako'
                      : 'Bado hujaorodhesha nyumba yoyote. Orodhesha nyumba yako ya kwanza!'}
                  </p>
                  {!searchQuery && (
                    <Button 
                      onClick={() => {
                        // Try to load saved draft, if none exists, reset form
                        const hasSavedDraft = loadSavedDraft(profile);
                        if (!hasSavedDraft) {
                          resetForm(profile);
                        }
                        setShowAddForm(true);
                      }} 
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Orodhesha Nyumba
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Property Form Modal */}
        <PropertyForm
          isOpen={showAddForm}
          editingProperty={editingProperty}
          formData={formData}
          profile={profile}
          submitting={submitting}
          onClose={handleCloseForm}
          onSubmit={async (e) => {
            if (user) {
              if (editingProperty) {
                await updateProperty(
                  e,
                  user,
                  editingProperty.id,
                  onPropertySubmitSuccess,
                  onPropertySubmitError
                );
              } else {
                await createProperty(
                  e,
                  user,
                  onPropertySubmitSuccess,
                  onPropertySubmitError
                );
              }
            }
          }}
          onInputChange={handleInputChange}
          onServiceToggle={handleServiceToggle}
          onAmenityToggle={handleAmenityToggle}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Je, una uhakika?</AlertDialogTitle>
              <AlertDialogDescription>
                Hatua hii haiwezi kutenduliwa. Hii itafuta nyumba kabisa kutoka kwenye mfumo wetu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Ghairi</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Futa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Properties;
