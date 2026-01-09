/**
 * useDashboardUI.tsx - UI State Management Hook
 * =============================================
 * 
 * Custom hook for managing dashboard UI state.
 * Handles modals, loading states, and view preferences.
 */

import { useState } from 'react';

export interface UIState {
  showAddForm: boolean;
  showProfileDialog: boolean;
  showHelpDialog: boolean;
  showBookingRequestsDialog: boolean;
  loading: boolean;
  submitting: boolean;
  profileLoading: boolean;
  isNewUser: boolean;
  searchQuery: string;
  filterStatus: string;
  viewMode: 'grid' | 'list';
}

interface UseDashboardUIReturn {
  uiState: UIState;
  updateUIState: (updates: Partial<UIState>) => void;
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setProfileLoading: (loading: boolean) => void;
  setIsNewUser: (isNew: boolean) => void;
  openAddForm: () => void;
  closeAddForm: () => void;
  openProfileDialog: () => void;
  closeProfileDialog: () => void;
  openHelpDialog: () => void;
  closeHelpDialog: () => void;
  openBookingRequestsDialog: () => void;
  closeBookingRequestsDialog: () => void;
}

export const useDashboardUI = (): UseDashboardUIReturn => {
  const [uiState, setUIState] = useState<UIState>({
    showAddForm: false,
    showProfileDialog: false,
    showHelpDialog: false,
    showBookingRequestsDialog: false,
    loading: true,
    submitting: false,
    profileLoading: false,
    isNewUser: false,
    searchQuery: '',
    filterStatus: 'all',
    viewMode: 'grid'
  });

  const updateUIState = (updates: Partial<UIState>): void => {
    setUIState(prev => ({ ...prev, ...updates }));
  };

  const setLoading = (loading: boolean): void => {
    updateUIState({ loading });
  };

  const setSubmitting = (submitting: boolean): void => {
    updateUIState({ submitting });
  };

  const setProfileLoading = (profileLoading: boolean): void => {
    updateUIState({ profileLoading });
  };

  const setIsNewUser = (isNewUser: boolean): void => {
    updateUIState({ isNewUser });
  };

  const openAddForm = (): void => {
    updateUIState({ showAddForm: true });
  };

  const closeAddForm = (): void => {
    updateUIState({ showAddForm: false });
  };

  const openProfileDialog = (): void => {
    updateUIState({ showProfileDialog: true });
  };

  const closeProfileDialog = (): void => {
    updateUIState({ showProfileDialog: false });
  };

  const openHelpDialog = (): void => {
    updateUIState({ showHelpDialog: true });
  };

  const closeHelpDialog = (): void => {
    updateUIState({ showHelpDialog: false });
  };

  const openBookingRequestsDialog = (): void => {
    updateUIState({ showBookingRequestsDialog: true });
  };

  const closeBookingRequestsDialog = (): void => {
    updateUIState({ showBookingRequestsDialog: false });
  };

  return {
    uiState,
    updateUIState,
    setLoading,
    setSubmitting,
    setProfileLoading,
    setIsNewUser,
    openAddForm,
    closeAddForm,
    openProfileDialog,
    closeProfileDialog,
    openHelpDialog,
    closeHelpDialog,
    openBookingRequestsDialog,
    closeBookingRequestsDialog
  };
};
