/**
 * PROPERTYLOCATION.TSX - PROPERTY LOCATION MAP COMPONENT
 * ======================================================
 * 
 * Displays property location on a map
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Map from '@/components/ui/map';

interface PropertyLocationProps {
  location: string;
  fullAddress?: string | null;
  title: string;
  className?: string;
}

const PropertyLocation: React.FC<PropertyLocationProps> = ({
  location,
  fullAddress,
  title,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Location</h3>
        <Map
          location={fullAddress || location}
          title={title}
          height="h-64"
        />
      </CardContent>
    </Card>
  );
};

export default PropertyLocation;
