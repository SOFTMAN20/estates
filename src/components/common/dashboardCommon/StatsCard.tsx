import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  gradient 
}) => {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`absolute inset-0 ${gradient} opacity-10`} />
      <CardContent className="p-3 sm:p-4 lg:p-5 relative">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0 overflow-hidden">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 break-all">{value}</p>
              {trend && (
                <span className={`text-xs font-medium flex items-center whitespace-nowrap ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-1.5 sm:p-2 lg:p-2.5 rounded-full ${gradient} bg-opacity-20 flex-shrink-0`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;