/**
 * DASHBOARD.TSX - MAIN DASHBOARD ORCHESTRATOR
 * ==========================================
 * 
 * Dashibodi kuu ya usimamizi - Main dashboard orchestrator
 * 
 * REFACTORED ARCHITECTURE / MUUNDO ULIOBORESHWA:
 * This file now serves as the main orchestrator for the dashboard,
 * delegating specific responsibilities to smaller, focused components and hooks.
 * 
 * COMPONENT BREAKDOWN / MGAWANYIKO WA VIPENGELE:
 * - QuickActions: Action buttons for common tasks
 * - StatsSection: Performance metrics and statistics
 * - PropertyManagement: Property listing and management
 * - PropertyForm: Property creation and editing modal
 * - ProfileSettings: User profile editing modal
 * - GetHelpSection: Help and support modal
 * 
 * HOOKS BREAKDOWN / MGAWANYIKO WA HOOKS:
 * - useDashboardUI: UI state management (modals, loading, view modes)
 * - useDashboardProfile: Profile CRUD operations
 * - useDashboardProperties: Property CRUD operations
 * 
 * BENEFITS OF REFACTORING / FAIDA ZA KUBORESHWA:
 * - Improved maintainability (Uboreshaji wa udumishaji)
 * - Better code organization (Mpangilio bora wa msimbo)
 * - Easier testing (Upimaji rahisi)
 * - Enhanced reusability (Uongezaji wa matumizi tena)
 * - Clearer separation of concerns (Mgawanyiko wazi wa majukumu)
 */

import React, { useEffect, useRef } from 'react';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import QuickActions from '@/components/host/dashboard/dashboardCommon/QuickActions';
import StatsSection from '@/components/host/dashboard/dashboardCommon/StatsSection';
import PropertyManagement from '@/components/host/dashboard/dashboardCommon/PropertyManagement';
import { PropertyForm } from '@/components/host/dashboard/AddPropertyForms';
import { ProfileSettings } from '@/components/forms';
import GetHelpSection from '@/components/host/dashboard/dashboardCommon/GetHelpSection';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

// Import custom dashboard hooks
import {
  useDashboardUI,
  useDashboardProfile,
  useDashboardProperties
} from '@/hooks/dashboardHooks';
import { useBookingsStats } from '@/hooks/dashboardHooks/useBookingsStats';

/**
 * DASHBOARD COMPONENT - REFACTORED WITH CUSTOM HOOKS
 * =================================================
 * 
 * Main dashboard component that orchestrates all dashboard functionality
 * through smaller, focused child components and custom hooks.
 * 
 * Kipengele kikuu cha dashibodi kinachosimamia utendakazi wote wa dashibodi
 * kupitia vipengele vidogo na hooks maalum.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const hasOpenedFormRef = useRef(false);
  
  // UI State Management Hook
  const {
    uiState,
    updateUIState,
    setLoading,
    openAddForm,
    closeAddForm,
    openProfileDialog,
    closeProfileDialog,
    openHelpDialog,
    closeHelpDialog
  } = useDashboardUI();
  
  // Profile Management Hook
  const {
    profile,
    profileForm,
    profileLoading,
    fetchProfile,
    handleProfileSubmit,
    handleProfileInputChange
  } = useDashboardProfile();
  
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
    resetForm
  } = useDashboardProperties();

  // Bookings Statistics Hook
  const { totalBookings } = useBookingsStats(user?.id);

  /**
   * INITIALIZATION AND LIFECYCLE MANAGEMENT
   * =======================================
   */
  const initializeDashboard = async (): Promise<void> => {
    if (!user) return;
    
    try {
      // Fetch profile and properties in parallel
      const results = await Promise.allSettled([
        fetchProfile(user),
        getMyProperties(user)
      ]);
      
      // Log any failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const operation = index === 0 ? 'fetchProfile' : 'getMyProperties';
          console.warn(`${operation} failed:`, result.reason);
        }
      });
      
      checkIfNewUser();
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      showErrorToast('Imeshindikana kupakia dashibodi');
    } finally {
      setLoading(false);
    }
  };

  const checkIfNewUser = (): void => {
    if (!user) return;
    
    const userCreatedAt = new Date(user.created_at);
    const now = new Date();
    const timeDiff = now.getTime() - userCreatedAt.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 5) {
      updateUIState({ isNewUser: true });
    }
  };

  // Initialize dashboard when user is available
  useEffect(() => {
    if (user) {
      initializeDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Check if we should open the add property form from navigation state
  useEffect(() => {
    if (location.state?.openAddForm && !hasOpenedFormRef.current) {
      hasOpenedFormRef.current = true;
      openAddForm();
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, openAddForm]);

  /**
   * HANDLER FUNCTIONS
   * ================
   */
  const handleCloseForm = (): void => {
    closeAddForm();
    setEditingProperty(null);
    resetForm(profile);
  };

  const onPropertySubmitSuccess = async (): Promise<void> => {
    showSuccessToast(
      editingProperty 
        ? 'Nyumba yako imesasishwa kikamilifu' 
        : 'Nyumba yako imeongezwa kikamilifu'
    );
    handleCloseForm();
    if (user) {
      await getMyProperties(user);
    }
  };

  const onPropertySubmitError = (message: string): void => {
    showErrorToast(message);
  };

  const onProfileSubmitSuccess = (): void => {
    showSuccessToast('Maelezo ya akaunti yako yamebadilishwa kikamilifu');
    closeProfileDialog();
  };

  const onProfileSubmitError = (): void => {
    showErrorToast('Imeshindikana kubadilisha maelezo ya akaunti yako');
  };

  const onPropertyDeleteSuccess = async (): Promise<void> => {
    showSuccessToast('Nyumba imefutwa kikamilifu');
    if (user) {
      await getMyProperties(user);
    }
  };

  const onPropertyDeleteError = (): void => {
    showErrorToast('Imeshindikana kufuta nyumba');
  };

  /**
   * UTILITY FUNCTIONS
   * ================
   */
  const showSuccessToast = (message: string): void => {
    toast({
      title: t('common.success'),
      description: message
    });
  };

  const showErrorToast = (message: string): void => {
    toast({
      variant: "destructive",
      title: t('common.error'),
      description: message
    });
  };

  /**
   * LOADING STATE RENDERING
   * ======================
   */
  if (uiState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    );
  }

  /**
   * MAIN DASHBOARD RENDER
   * ====================
   * 
   * Orchestrates all dashboard components in a clean, organized layout.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Quick Actions */}
        <QuickActions
          onAddProperty={openAddForm}
          onShowHelp={openHelpDialog}
          isNewUser={uiState.isNewUser}
          propertiesCount={properties.length}
        />

        {/* Statistics Section */}
        <StatsSection properties={properties} totalBookings={totalBookings} />

        {/* Property Management - Limited to 4 properties */}
        <PropertyManagement
          properties={properties}
          searchQuery={uiState.searchQuery}
          filterStatus={uiState.filterStatus}
          viewMode={uiState.viewMode}
          onSearchChange={(query) => updateUIState({ searchQuery: query })}
          onFilterChange={(status) => updateUIState({ filterStatus: status })}
          onViewModeChange={(mode) => updateUIState({ viewMode: mode })}
          onEditProperty={async (property) => {
            await preparePropertyForEdit(property, profile);
            openAddForm();
          }}
          onDeleteProperty={(id) => deleteProperty(id, onPropertyDeleteSuccess, onPropertyDeleteError)}
          onAddProperty={openAddForm}
          limit={4}
          showViewAll={true}
          onViewAll={() => navigate('/host/properties')}
        />

        {/* Property Form Modal */}
        <PropertyForm
          isOpen={uiState.showAddForm}
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

        {/* Profile Settings Modal */}
        <ProfileSettings
          isOpen={uiState.showProfileDialog}
          profileForm={profileForm}
          profileLoading={profileLoading}
          onClose={closeProfileDialog}
          onSubmit={async (e) => {
            if (user) {
              await handleProfileSubmit(e, user, onProfileSubmitSuccess)
                .catch(onProfileSubmitError);
            }
          }}
          onInputChange={handleProfileInputChange}
        />
        
        {/* Help Modal */}
        <GetHelpSection 
          isOpen={uiState.showHelpDialog}
          onClose={closeHelpDialog}
        />
      </div>
    </div>
  );
};

export default Dashboard;
