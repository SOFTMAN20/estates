/**
 * RELIABLE IMAGE COMPONENT
 * =======================
 * 
 * Image component with lazy loading, skeleton placeholder,
 * and smooth fade-in animation
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/utils';

interface ReliableImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
}

const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  onLoad,
  onError,
  fallback = '/placeholder.svg',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageSrc = hasError ? fallback : src;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100"
    >
      {/* Skeleton placeholder - shows while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Main image - only render when in viewport */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default ReliableImage;