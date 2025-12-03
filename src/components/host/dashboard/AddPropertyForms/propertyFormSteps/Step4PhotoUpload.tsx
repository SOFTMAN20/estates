/**
 * Step4PhotoUpload.tsx - Property Form Step 4
 * ============================================
 * 
 * Photo upload step: Property images.
 * Single responsibility: Handle image upload and management.
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import ImageUpload from '@/components/host/dashboard/AddPropertyForms/ImageUpload';
import { Camera, Info, CheckCircle, X } from 'lucide-react';

interface Step4PhotoUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  isValid: boolean;
}

export const Step4PhotoUpload: React.FC<Step4PhotoUploadProps> = ({
  images,
  onImagesChange,
  isValid,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-safari-500 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Picha za Nyumba *</h3>
        <p className="text-gray-600">Ongeza picha nzuri za nyumba yako ili kuvutia wapangaji</p>
        <p className="text-sm text-red-600 font-medium">⚠️ Picha ni za lazima - ongeza angalau picha 3</p>
      </div>

      {/* Photo Upload Component */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
        <ImageUpload
          images={images}
          onImagesChange={onImagesChange}
        />
      </div>

      {/* Photo Tips */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Vidokezo vya Picha Nzuri
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Piga picha za sebule, chumba cha kulala, na jiko</li>
          <li>• Hakikisha mwanga wa kutosha</li>
          <li>• Onyesha mazingira ya nje ya nyumba</li>
          <li>• Tumia picha za quality nzuri</li>
        </ul>
      </div>

    </div>
  );
};

export default Step4PhotoUpload;
