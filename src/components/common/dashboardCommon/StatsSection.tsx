/**
 * STATSSECTION.TSX - DASHBOARD STATISTICS COMPONENT
 * ================================================
 * 
 * Kipengele cha takwimu za dashibodi - Dashboard statistics component
 * 
 * FUNCTIONALITY / KAZI:
 * - Displays key performance metrics (Kuonyesha vipimo vikuu vya utendaji)
 * - Shows property statistics (Kuonyesha takwimu za nyumba)
 * - Calculates and presents analytics (Kuhesabu na kuonyesha uchambuzi)
 * - Provides visual feedback on performance (Kutoa maoni ya kuona juu ya utendaji)
 * 
 * FEATURES / VIPENGELE:
 * - Total properties count (Jumla ya nyumba)
 * - Total views across all properties (Jumla ya miwani kwa nyumba zote)
 * - Active properties count (Idadi ya nyumba zinazoonekana)
 * - Average property price (Bei ya wastani ya nyumba)
 */

import React from 'react';
import StatsCard from './StatsCard';
import { Home, Eye, TrendingUp, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';

type Property = Tables<'properties'>;

interface StatsSectionProps {
  properties: Property[];
}

/**
 * STATISTICS SECTION COMPONENT
 * ===========================
 * 
 * Renders a grid of statistics cards showing key metrics
 * about the user's properties and their performance.
 * 
 * Inaonyesha gridi ya kadi za takwimu zinazoonyesha vipimo vikuu
 * kuhusu nyumba za mtumiaji na utendaji wao.
 */
const StatsSection: React.FC<StatsSectionProps> = ({ properties }) => {
  const { t } = useTranslation();

  /**
   * STATISTICS CALCULATION FUNCTIONS
   * ================================
   */

  /**
   * Calculates total views across all properties
   */
  const getTotalViews = (): number => {
    return properties.reduce((sum, property) => sum + (property.views_count || 0), 0);
  };

  /**
   * Calculates average price of all properties
   */
  const getAveragePrice = (): number => {
    return properties.length > 0 
      ? properties.reduce((sum, property) => sum + Number(property.price), 0) / properties.length
      : 0;
  };

  /**
   * Counts active properties
   */
  const getActivePropertiesCount = (): number => {
    return properties.filter(p => p.status === 'active').length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title={t('dashboard.totalProperties')}
        value={properties.length}
        icon={Home}
        trend={{ value: 12, isPositive: true }}
        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <StatsCard
        title={t('dashboard.totalViews')}
        value={getTotalViews()}
        icon={Eye}
        trend={{ value: 8, isPositive: true }}
        gradient="bg-gradient-to-br from-green-500 to-green-600"
      />
      <StatsCard
        title={t('dashboard.activeProperties')}
        value={getActivePropertiesCount()}
        icon={TrendingUp}
        trend={{ value: 5, isPositive: true }}
        gradient="bg-gradient-to-br from-purple-500 to-purple-600"
      />
      <StatsCard
        title={t('dashboard.averagePrice')}
        value={getAveragePrice() ? `TZS ${Math.round(getAveragePrice()).toLocaleString()}` : 'TZS 0'}
        icon={DollarSign}
        gradient="bg-gradient-to-br from-orange-500 to-orange-600"
      />
    </div>
  );
};

export default StatsSection;