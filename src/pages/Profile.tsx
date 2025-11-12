/**
 * PROFILE.TSX - USER PROFILE PAGE (REFACTORED)
 * ============================================
 * 
 * Ukurasa wa wasifu wa mtumiaji - User profile page
 * 
 * REFACTORED ARCHITECTURE / MUUNDO ULIOBORESHWA:
 * This file now uses custom hooks for better modularity and reusability.
 * All business logic has been extracted into dedicated hooks.
 * 
 * HOOKS USED / HOOKS ZINAZOTUMIKA:
 * - useProfileData: Profile data fetching and management
 * - useProfileForm: Form state and operations
 * - useProfileUtils: Utility functions (date formatting, etc.)
 * 
 * FEATURES / VIPENGELE:
 * - View and edit profile information
 * - Avatar upload
 * - Account statistics
 * - Host/Tenant toggle
 * - Bio and location management
 * - Account status display
 * 
 * BENEFITS OF REFACTORING / FAIDA ZA KUBORESHWA:
 * - Improved maintainability (Uboreshaji wa udumishaji)
 * - Better code organization (Mpangilio bora wa msimbo)
 * - Easier testing (Upimaji rahisi)
 * - Enhanced reusability (Uongezaji wa matumizi tena)
 * - Clearer separation of concerns (Mgawanyiko wazi wa majukumu)
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import AvatarUpload from '@/components/forms/AvatarUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Home,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Import custom profile hooks
import {
  useProfileData,
  useProfileForm,
  useProfileUtils
} from '@/hooks/profileHooks';

/**
 * PROFILE COMPONENT - REFACTORED WITH CUSTOM HOOKS
 * ================================================
 * 
 * Main profile component that orchestrates all profile functionality
 * through smaller, focused custom hooks.
 * 
 * Kipengele kikuu cha wasifu kinachosimamia utendakazi wote wa wasifu
 * kupitia hooks ndogo zilizolenga.
 */
const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile data management hook
  const {
    profile,
    loading,
    fetchProfile,
    createBasicProfile
  } = useProfileData();

  // Profile form management hook
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

  // Profile utility functions hook
  const {
    formatDate
  } = useProfileUtils();

  /**
   * INITIALIZATION AND LIFECYCLE MANAGEMENT
   * =======================================
   */
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
  }, [user, navigate]);

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (profile) {
      initializeFormData(profile);
    } else if (user && !loading) {
      // Create basic profile if doesn't exist
      createBasicProfile(user).then((newProfile) => {
        if (newProfile) {
          initializeFormData(newProfile);
        }
      });
    }
  }, [profile, user, loading]);

  /**
   * HANDLER FUNCTIONS
   * ================
   */
  const onSaveSuccess = async (): Promise<void> => {
    toast({
      title: 'Mafanikio',
      description: 'Wasifu wako umebadilishwa kikamilifu'
    });
    
    if (user) {
      await fetchProfile(user);
    }
  };

  const onSaveError = (message: string): void => {
    toast({
      variant: 'destructive',
      title: 'Hitilafu',
      description: message
    });
  };

  const onAvatarUploadSuccess = (url: string): void => {
    handleAvatarUploadSuccess(url, async () => {
      if (user) {
        await fetchProfile(user);
      }
    });
  };

  /**
   * LOADING STATE RENDERING
   * ======================
   */
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

  /**
   * MAIN PROFILE RENDER
   * ===================
   * 
   * Orchestrates all profile components in a clean, organized layout.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="mb-4 md:mb-0">
                <AvatarUpload
                  currentAvatarUrl={formData.avatar_url}
                  userName={formData.name}
                  userId={user?.id || ''}
                  onUploadSuccess={onAvatarUploadSuccess}
                  size="xl"
                  editable={true}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {formData.name || 'Mtumiaji'}
                  </h1>
                  <div className="flex gap-2 justify-center md:justify-start">
                    {profile?.is_host && (
                      <Badge className="bg-primary">
                        <Home className="h-3 w-3 mr-1" />
                        Mwenye Nyumba
                      </Badge>
                    )}
                    {profile?.profile_completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Kamili
                      </Badge>
                    )}
                    {profile?.role === 'admin' && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-gray-600">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className="h-4 w-4" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3 justify-center md:justify-start">
                  {!editing ? (
                    <Button onClick={() => setEditing(true)} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Hariri Wasifu
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => user && handleSave(user, onSaveSuccess, onSaveError)} 
                        disabled={saving} 
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Inahifadhi...' : 'Hifadhi'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleCancel(profile)} 
                        disabled={saving} 
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Ghairi
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Maelezo ya Wasifu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Jina Kamili
              </Label>
              {editing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Weka jina lako kamili"
                />
              ) : (
                <p className="text-gray-700 pl-6">{formData.name || 'Haijawekwa'}</p>
              )}
            </div>

            <Separator />

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Nambari ya Simu
              </Label>
              {editing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+255712345678"
                />
              ) : (
                <p className="text-gray-700 pl-6">{formData.phone || 'Haijawekwa'}</p>
              )}
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Mahali
              </Label>
              {editing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Mfano: Dar es Salaam, Tanzania"
                />
              ) : (
                <p className="text-gray-700 pl-6">{formData.location || 'Haijawekwa'}</p>
              )}
            </div>

            <Separator />

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Maelezo Mafupi
              </Label>
              {editing ? (
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Eleza kidogo kuhusu wewe..."
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 pl-6 whitespace-pre-wrap">
                  {formData.bio || 'Haijawekwa'}
                </p>
              )}
            </div>

            <Separator />

            {/* Host Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="is_host" className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  Mwenye Nyumba
                </Label>
                <p className="text-sm text-gray-500">
                  Washa ili uweze kutangaza nyumba zako
                </p>
              </div>
              {editing ? (
                <Switch
                  id="is_host"
                  checked={formData.is_host}
                  onCheckedChange={(checked) => handleInputChange('is_host', checked)}
                />
              ) : (
                <Badge variant={formData.is_host ? "default" : "secondary"}>
                  {formData.is_host ? 'Ndio' : 'Hapana'}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Taarifa za Akaunti
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Imeundwa:</span>
                  <p className="font-medium">{formatDate(profile?.created_at || null)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Imesasishwa:</span>
                  <p className="font-medium">{formatDate(profile?.updated_at || null)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Hali ya Akaunti:</span>
                  <p className="font-medium flex items-center gap-1">
                    {profile?.is_suspended ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600">Imesimamishwa</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Inatumika</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Jukumu:</span>
                  <p className="font-medium capitalize">{profile?.role || 'user'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
