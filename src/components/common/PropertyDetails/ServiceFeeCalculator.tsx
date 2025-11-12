/**
 * SERVICE FEE CALCULATOR COMPONENT
 * =================================
 * 
 * Calculates and displays the 50% service fee based on monthly rent
 * Kuhesabu na kuonyesha ada ya huduma ya 50% kulingana na kodi ya mwezi
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Receipt, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react';

interface ServiceFeeCalculatorProps {
  monthlyRent: number;
  serviceFeePercentage?: number; // Default 50%
}

const ServiceFeeCalculator: React.FC<ServiceFeeCalculatorProps> = ({
  monthlyRent,
  serviceFeePercentage = 50,
}) => {
  // Calculate service fee
  const serviceFee = (monthlyRent * serviceFeePercentage) / 100;
  const totalAmount = monthlyRent + serviceFee;

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-50/50 to-blue-50/50 opacity-60"></div>

      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>

      <CardContent className="relative p-5 sm:p-6">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                Payment Summary
                <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Muhtasari wa Malipo</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 shadow-md">
            {serviceFeePercentage}% Fee
          </Badge>
        </div>

        {/* Price breakdown */}
        <div className="space-y-4 mb-5">
          {/* Monthly Rent */}
          <div className="flex justify-between items-center p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-primary/30 transition-colors">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">
                Monthly Rent
                <span className="block text-xs text-gray-500">Kodi ya Mwezi</span>
              </span>
            </div>
            <span className="font-bold text-gray-900 text-lg">
              TZS {monthlyRent.toLocaleString()}
            </span>
          </div>

          {/* Service Fee */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/5 to-purple-50/50 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                Service Fee ({serviceFeePercentage}%)
                <span className="block text-xs text-gray-500">Ada ya Huduma</span>
              </span>
            </div>
            <span className="font-bold text-primary text-lg">
              TZS {serviceFee.toLocaleString()}
            </span>
          </div>

          <Separator className="my-3" />

          {/* Total Amount - Highlighted */}
          <div className="relative p-4 bg-gradient-to-r from-primary to-primary/90 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-white" />
                <span className="text-base sm:text-lg font-bold text-white">
                  Total Amount
                  <span className="block text-xs text-white/90 font-normal">Jumla ya Malipo</span>
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  TZS {totalAmount.toLocaleString()}
                </div>
                <div className="text-xs text-white/80">One-time payment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
              <Receipt className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
                <strong className="font-semibold">💡 Kumbuka:</strong> Ada ya huduma ni malipo ya mara moja tu wakati wa kupanga nyumba.
              </p>
              <p className="text-xs sm:text-sm text-blue-800 mt-1 leading-relaxed">
                <strong className="font-semibold">💡 Note:</strong> Service fee is a one-time payment when booking the property.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative bottom accent */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-full"></div>
      </CardContent>
    </Card>
  );
};

export default ServiceFeeCalculator;
