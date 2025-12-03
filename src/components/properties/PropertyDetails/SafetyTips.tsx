/**
 * SAFETYTIPS.TSX - SAFETY TIPS COMPONENT
 * ======================================
 * 
 * Displays safety tips for property renters
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertCircle, Eye, FileText, Ban, CheckCircle } from 'lucide-react';

interface SafetyTipsProps {
  className?: string;
}

const SafetyTips: React.FC<SafetyTipsProps> = ({ className = '' }) => {
  const tips = [
    {
      icon: Eye,
      text: 'Visit the property before making any payment',
      color: 'text-blue-600',
    },
    {
      icon: CheckCircle,
      text: 'Verify the landlord\'s identity and ownership documents',
      color: 'text-green-600',
    },
    {
      icon: FileText,
      text: 'Read and understand all rental agreements carefully',
      color: 'text-purple-600',
    },
    {
      icon: Ban,
      text: 'Never send money before viewing the property',
      color: 'text-red-600',
    },
    {
      icon: Shield,
      text: 'Use official channels for all transactions',
      color: 'text-orange-600',
    },
  ];

  return (
    <Card className={className}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg sm:text-xl font-semibold">Safety Tips</h3>
        </div>
        <div className="space-y-3">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 ${tip.color}`} />
                <span className="leading-relaxed">{tip.text}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Important:</strong> Always prioritize your safety and verify all information before making any commitments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyTips;
