/**
 * AvatarUpload.tsx - Avatar Upload Component
 * ==========================================
 * 
 * Reusable component for uploading user avatars to Supabase Storage.
 * Handles validation, upload, and preview.
 */

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
  userId: string;
  onUploadSuccess: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userName,
  userId,
  onUploadSuccess,
  size = 'lg',
  editable = true
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
    xl: 'h-40 w-40'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Aina ya faili si sahihi',
        description: 'Tafadhali chagua picha ya aina ya JPG, PNG au WEBP'
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'Faili kubwa sana',
        description: 'Ukubwa wa juu ni 5MB'
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldFileName = currentAvatarUrl.split('/').pop();
        if (oldFileName && oldFileName.startsWith(userId)) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl } as never)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Call success callback
      onUploadSuccess(publicUrl);

      toast({
        title: 'Mafanikio!',
        description: 'Picha ya wasifu imebadilishwa kikamilifu'
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setPreviewUrl(null);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kupakia picha. Jaribu tena.'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-lg transition-all duration-200 ${uploading ? 'opacity-50' : ''}`}>
        <AvatarImage 
          src={previewUrl || currentAvatarUrl} 
          alt={userName}
          className="object-cover"
        />
        <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-serengeti-500 text-white">
          {getInitials(userName || 'U')}
        </AvatarFallback>
      </Avatar>

      {/* Upload overlay when uploading */}
      {uploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}

      {/* Camera button */}
      {editable && (
        <label 
          className={`absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl ${
            uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          }`}
        >
          <Camera className={iconSizes[size]} />
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      )}

      {/* Upload hint */}
      {editable && !uploading && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-xs text-gray-500 text-center">
            Bofya kamera kubadilisha
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
