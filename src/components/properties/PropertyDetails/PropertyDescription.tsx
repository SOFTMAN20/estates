/**
 * PROPERTYDESCRIPTION.TSX - PROPERTY DESCRIPTION COMPONENT
 * ========================================================
 * 
 * Displays the property description text
 */

import React from 'react';

interface PropertyDescriptionProps {
  description?: string;
  className?: string;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  description,
  className = '',
}) => {
  if (!description) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <h3 className="text-lg sm:text-xl font-semibold mb-3">Description</h3>
      <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words overflow-hidden whitespace-normal">
        {description}
      </p>
    </div>
  );
};

export default PropertyDescription;
