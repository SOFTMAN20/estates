/**
 * ProfileHeader.tsx - Profile Header Component
 * ============================================
 * 
 * Displays user avatar, name, badges, and basic contact info
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AvatarUpload from '@/components/forms/AvatarUpload';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Home,
  Shield,
  CheckCircle
} from 'lucide-react';

interface ProfileHeaderProps {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  isHost: boolean;
  isProfileCompleted: boolean;
  role?: string;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAvatarUpload: (url: string) => void;
}

export const ProfileHeader = ({
  userId,
  email,
  name,
  phone,
  location,
  avatarUrl,
  isHost,
  isProfileCompleted,
  role,
  editing,
  saving,
  onEdit,
  onSave,
  onCancel,
  onAvatarUpload
}: ProfileHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="mb-4 md:mb-0">
            <AvatarUpload
              currentAvatarUrl={avatarUrl}
              userName={name}
              userId={userId}
              onUploadSuccess={onAvatarUpload}
              size="xl"
              editable={true}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {name || 'Mtumiaji'}
              </h1>
              <div className="flex gap-2 justify-center md:justify-start">
                {isHost && (
                  <Badge className="bg-primary">
                    <Home className="h-3 w-3 mr-1" />
                    Mwenye Nyumba
                  </Badge>
                )}
                {isProfileCompleted && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Kamili
                  </Badge>
                )}
                {role === 'admin' && (
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
                <span>{email}</span>
              </div>
              {phone && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="h-4 w-4" />
                  <span>{phone}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3 justify-center md:justify-start">
              {!editing ? (
                <Button onClick={onEdit} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Hariri Wasifu
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={onSave} 
                    disabled={saving} 
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Inahifadhi...' : 'Hifadhi'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onCancel} 
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
  );
};
