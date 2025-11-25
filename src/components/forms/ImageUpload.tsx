
import React, { useState, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Loader2, ImagePlus } from 'lucide-react';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import imageCompression from 'browser-image-compression';
import { rateLimiters } from '@/utils/security';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 6 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  /**
   * CLIENT-SIDE COMPRESSION (First Stage)
   * =====================================
   * 
   * Performs initial compression on the client to reduce upload size.
   * Target: 2MB max size, 1200px max dimensions
   */
  const clientSideCompress = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2, // Target max size: 2MB (before server-side compression)
      maxWidthOrHeight: 1200, // Max width/height: 1200px
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      
      // Log client-side compression results
      console.log('🖼️ Client-Side Compression Results:');
      console.log(`📁 Original: ${file.name}`);
      console.log(`📏 Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📏 Client compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`📊 Client compression ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);
      console.log('---');
      
      return compressedFile;
    } catch (error) {
      console.error('Error in client-side compression:', error);
      throw error;
    }
  };

  /**
   * HYBRID UPLOAD SYSTEM
   * ====================
   * 
   * Sends client-compressed image to Edge Function for final server-side compression
   * Falls back to direct Supabase Storage upload if Edge Function fails
   */
  const uploadToEdgeFunction = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user!.id);

      // Get the user's JWT token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/compress-image`;
      
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('Edge Function failed, falling back to direct upload:', errorText);
        throw new Error(`Server compression failed: ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        console.warn('Edge Function returned error, falling back to direct upload:', result.error);
        throw new Error(result.error || 'Server compression failed');
      }

      // Server-side compression completed successfully
      return result.url;
    } catch (error) {
      console.warn('Edge Function failed, using direct upload fallback:', error);
      // Fallback to direct Supabase Storage upload
      return await uploadDirectToStorage(file);
    }
  };

  /**
   * DIRECT STORAGE UPLOAD FALLBACK
   * ==============================
   * 
   * Direct upload to Supabase Storage as fallback when Edge Function fails
   */
  const uploadDirectToStorage = async (file: File): Promise<string> => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${user!.id}/${timestamp}-${randomId}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Direct upload failed: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  /**
   * VALIDATE IMAGE FILE
   * ==================
   * 
   * Validates file type and size before processing
   */
  const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type with enhanced validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: 'Only JPG, PNG, and WebP images are allowed'
      };
    }

    // Validate file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        error: 'Invalid file extension'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image size must be less than 5MB'
      };
    }

    // Check minimum file size (prevent empty files)
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
      return {
        isValid: false,
        error: 'File is too small or corrupted'
      };
    }

    // Validate filename (prevent path traversal)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return {
        isValid: false,
        error: 'Invalid filename'
      };
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.php$/i,
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.js$/i,
      /\.html$/i,
      /\.htm$/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      return {
        isValid: false,
        error: 'File type not allowed for security reasons'
      };
    }

    return { isValid: true };
  };

  /**
   * DRAG AND DROP HANDLERS
   * ======================
   */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || !user) return;

    // Convert FileList to File array and process
    await processFiles(Array.from(files));
  };

  /**
   * PROCESS FILES (shared by both file input and drag-drop)
   * =======================================================
   */
  const processFiles = async (fileList: File[]) => {
    if (!user) return;

    // Rate limiting check
    const userId = user.id;
    if (!rateLimiters.imageUpload.isAllowed(userId)) {
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: 'Too many image uploads. Please try again later.'
      });
      return;
    }

    if (images.length + fileList.length > maxImages) {
      setCompressionStatus('❌ Too many images selected');
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: `You can only upload ${maxImages} images maximum. Currently have ${images.length}.`
      });
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];
    const validFiles: File[] = [];

    // Validate all files first
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validation = validateImageFile(file);
        
      if (!validation.isValid) {
        toast({
          variant: "destructive",
          title: t('common.error'),
          description: validation.error
        });
        setUploading(false);
        return;
      }
      
      validFiles.push(file);
    }

    try {
      console.log('🚀 Starting hybrid image upload process...');
      
      // Verify user authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid authentication session found. Please sign in again.');
      }
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Step 1: Client-side compression
        const clientCompressedFile = await clientSideCompress(file);

        // Step 2: Send to Edge Function for final compression and upload (with fallback)
        const publicUrl = await uploadToEdgeFunction(clientCompressedFile);

        newImageUrls.push(publicUrl);
      }

      // Update images state
      onImagesChange([...images, ...newImageUrls]);
      
      // Show final success message
      setCompressionStatus(`🎉 Successfully uploaded ${newImageUrls.length} image(s)!`);
      toast({
        title: t('common.success'),
        description: `${newImageUrls.length} image(s) uploaded successfully`
      });

      // Clear success message after 4 seconds
      setTimeout(() => setCompressionStatus(''), 4000);
      
    } catch (error) {
      console.error('❌ Error in hybrid upload process:', error);
      toast({
        variant: "destructive",
        title: t('common.error'),
        description: error instanceof Error ? error.message : "Failed to process images"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    await processFiles(Array.from(files));
    
    // Reset input
    event.target.value = '';

  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm sm:text-base font-medium">
        {t('dashboard.propertyImages', { current: images.length, max: maxImages })}
      </Label>
      
      {/* Drag and Drop Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : uploading || images.length >= maxImages
            ? 'border-gray-200 bg-gray-50 opacity-60'
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-upload"
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary animate-spin" />
              <p className="text-sm sm:text-base font-medium text-gray-700">Processing images...</p>
              <p className="text-xs sm:text-sm text-gray-500">Please wait while we optimize your images</p>
            </div>
          ) : isDragging ? (
            <div className="space-y-3">
              <ImagePlus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-primary animate-bounce" />
              <p className="text-sm sm:text-base font-medium text-primary">Drop images here!</p>
              <p className="text-xs sm:text-sm text-gray-600">Release to upload</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400" />
              <div>
                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Click to upload
                </Label>
                <span className="text-sm sm:text-base text-gray-600"> or drag and drop</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                PNG, JPG, WebP up to 5MB
              </p>
              {images.length < maxImages && (
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  {maxImages - images.length} more image{maxImages - images.length !== 1 ? 's' : ''} can be added
                </p>
              )}
              {images.length >= maxImages && (
                <p className="text-xs sm:text-sm font-medium text-red-600">
                  Maximum {maxImages} images reached
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Status */}
      <div className="space-y-3">

        {/* Compression Status Display */}
        {compressionStatus && (
          <div className={`p-3 rounded-lg text-sm font-medium ${
            compressionStatus.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : compressionStatus.includes('❌')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            {compressionStatus}
          </div>
        )}


      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Picha ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEzLjc5IDkuNzkgMTAuMjEgMTIgOEMxNC4yMSAxMC4yMSAxNC4yMSAxMy43OSAxMiAxNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p>{t('dashboard.noImagesSelected')}</p>
          <p className="text-sm">{t('dashboard.selectPropertyImages')}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
