/**
 * PROFILE.TSX - USER PROFILE PAGE (REFACTORED)
 * ============================================
 * 
 * Clean, modular profile page using reusable components
 * 
 * ARCHITECTURE:
 * - ProfileHeader: Avatar, name, badges, and action buttons
 * - ProfileForm: Editable form fields
 * - ProfileView: Read-only account information
 * 
 * HOOKS USED:
 * - useProfileData: Profile data fetching and management
 * - useProfileForm: Form state and operations
 * - useProfileUtils: Utility functions (date formatting, etc.)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Import custom profile hooks
import {
  useProfileData,
  useProfileForm,
  useProfileUtils
} from '@/hooks/profileHooks';

// Import profile components
import { ProfileHeader, ProfileForm, ProfileView } from '@/components/profile';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile data management
  const { profile, loading, fetchProfile, createBasicProfile } = useProfileData();

  // Profile form management
  const {
    formData,
    editing,
    saving,
    setEditing,
    handleInputChange,
    handleSave,
    handleCancel,
    initializeFormData,
    handleAvatarUploadSuccess
  } = useProfileForm();

  // Profile utilities
  const { formatDate } = useProfileUtils();

  // Initialize profile on mount
  useEffect(() => {
    const initializeProfile = async () => {
      if (user) {
        try {
          await fetchProfile(user);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          toast({
            variant: 'destructive',
            title: 'Hitilafu',
            description: 'Imeshindikana kupakia wasifu wako'
          });
        }
      } else {
        navigate('/signin');
      }
    };

    initializeProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, navigate]);

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      initializeFormData(profile);
    } else if (user && !loading && !profile) {
      createBasicProfile(user).then((newProfile) => {
        if (newProfile) {
          initializeFormData(newProfile);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.user_id, user?.id, loading]);

  // Handlers
  const handleSaveClick = async () => {
    if (!user) return;
    
    await handleSave(user, async () => {
      toast({
        title: 'Mafanikio',
        description: 'Wasifu wako umebadilishwa kikamilifu'
      });
      await fetchProfile(user);
    }, (message: string) => {
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: message
      });
    });
  };

  const handleAvatarUpload = async (url: string) => {
    handleAvatarUploadSuccess(url, async () => {
      if (user) {
        await fetchProfile(user);
      }
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header with Avatar and Actions */}
        <ProfileHeader
          userId={user?.id || ''}
          email={user?.email || ''}
          name={formData.name}
          phone={formData.phone}
          location={formData.location}
          avatarUrl={formData.avatar_url}
          isHost={formData.is_host}
          isProfileCompleted={profile?.profile_completed || false}
          role={profile?.role}
          editing={editing}
          saving={saving}
          onEdit={() => setEditing(true)}
          onSave={handleSaveClick}
          onCancel={() => handleCancel(profile)}
          onAvatarUpload={handleAvatarUpload}
        />

        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Maelezo ya Wasifu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Editable Profile Form */}
            <ProfileForm
              name={formData.name}
              phone={formData.phone}
              location={formData.location}
              bio={formData.bio}
              isHost={formData.is_host}
              editing={editing}
              onChange={handleInputChange}
            />

            <Separator />

            {/* Account Information */}
            <ProfileView
              createdAt={profile?.created_at || null}
              updatedAt={profile?.updated_at || null}
              isSuspended={profile?.is_suspended || false}
              role={profile?.role || 'user'}
              formatDate={formatDate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
