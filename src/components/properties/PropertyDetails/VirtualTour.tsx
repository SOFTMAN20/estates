/**
 * VIRTUALTOUR.TSX - VIRTUAL TOUR COMPONENT
 * ========================================
 * 
 * Displays 360° virtual tours and video tours for properties
 * Supports multiple platforms: YouTube, Vimeo, Matterport, Kuula
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Maximize2, Play, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VirtualTourProps {
  virtualTourUrl?: string | null;
  virtualTourType?: '360' | 'video' | 'matterport' | 'youtube' | 'kuula' | null;
  videoTourUrl?: string | null;
  propertyTitle: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({
  virtualTourUrl,
  virtualTourType,
  videoTourUrl,
  propertyTitle,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(
    virtualTourUrl ? '360' : 'video'
  );

  // If no tours available, don't render
  if (!virtualTourUrl && !videoTourUrl) {
    return null;
  }

  /**
   * Extract and format video embed URL
   * Supports YouTube and Vimeo
   */
  const getVideoEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(
        /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
      )?.[1];
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Return as-is if already an embed URL or unknown format
    return url;
  };

  /**
   * Get appropriate iframe attributes based on tour type
   */
  const getTourIframeProps = () => {
    if (virtualTourType === 'matterport') {
      return {
        allow: 'xr-spatial-tracking; gyroscope; accelerometer',
        loading: 'lazy' as const,
      };
    }
    return {
      allow: 'fullscreen',
      loading: 'lazy' as const,
    };
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-serengeti-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-white" />
              <h3 className="text-lg font-semibold text-white">
                {t('propertyDetail.virtualTour.title', 'Virtual Tour')}
              </h3>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              {t('propertyDetail.virtualTour.interactive', 'Interactive')}
            </Badge>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {virtualTourUrl && videoTourUrl ? (
            // Both tours available - show tabs
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="360">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  {t('propertyDetail.virtualTour.360Tour', '360° Tour')}
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Play className="h-4 w-4 mr-2" />
                  {t('propertyDetail.virtualTour.videoTour', 'Video Tour')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="360" className="mt-0">
                <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={virtualTourUrl}
                    frameBorder="0"
                    allowFullScreen
                    title={`${propertyTitle} - 360° Virtual Tour`}
                    {...getTourIframeProps()}
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="mt-0">
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={getVideoEmbedUrl(videoTourUrl)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${propertyTitle} - Video Tour`}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : virtualTourUrl ? (
            // Only 360° tour
            <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={virtualTourUrl}
                frameBorder="0"
                allowFullScreen
                title={`${propertyTitle} - 360° Virtual Tour`}
                {...getTourIframeProps()}
              />
            </div>
          ) : (
            // Only video tour
            <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={getVideoEmbedUrl(videoTourUrl!)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${propertyTitle} - Video Tour`}
              />
            </div>
          )}

          {/* Help/Info Section */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">
                  {t('propertyDetail.virtualTour.tipTitle', 'How to use:')}
                </p>
                <ul className="space-y-1 text-blue-800">
                  <li>• {t('propertyDetail.virtualTour.tip1', 'Click and drag to look around in 360° view')}</li>
                  <li>• {t('propertyDetail.virtualTour.tip2', 'Use mouse wheel or pinch to zoom')}</li>
                  <li>• {t('propertyDetail.virtualTour.tip3', 'Click fullscreen icon for immersive experience')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualTour;
