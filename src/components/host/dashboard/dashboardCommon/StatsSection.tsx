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
 * - Active properties count (Idadi ya nyumba zinazoonekana)
 * - Pending approval count (Idadi ya nyumba zinazosubiri idhini)
 * - Total bookings count (Jumla ya mahifadhi)
 * - Average property price (Bei ya wastani ya nyumba)
 */

import React from 'react';
import StatsCard from './StatsCard';
import { Home, TrendingUp, DollarSign, Clock, Calendar } from 'lucide-react';
import type { Tables } from '@/lib/integrations/supabase/types';

type Property = Tables<'properties'>;

interface StatsSectionProps {
  properties: Property[];
  totalBookings?: number;
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
const StatsSection: React.FC<StatsSectionProps> = ({ properties, totalBookings = 0 }) => {

  /**
   * STATISTICS CALCULATION FUNCTIONS
   * ================================
   */



  /**
   * Calculates average price of all properties
   */
  const getAveragePrice = (): number => {
    return properties.length > 0 
      ? properties.reduce((sum, property) => sum + Number(property.price), 0) / properties.length
      : 0;
  };

  /**
   * Counts active properties (approved)
   */
  const getActivePropertiesCount = (): number => {
    return properties.filter(p => p.status === 'approved').length;
  };

  /**
   * Counts pending approval properties
   */
  const getPendingApprovalCount = (): number => {
    return properties.filter(p => p.status === 'pending').length;
  };



  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
      <StatsCard
        title="Total Properties"
        value={properties.length}
        icon={Home}
        trend={{ value: 12, isPositive: true }}
        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <StatsCard
        title="Active"
        value={getActivePropertiesCount()}
        icon={TrendingUp}
        trend={{ value: 5, isPositive: true }}
        gradient="bg-gradient-to-br from-green-500 to-green-600"
      />
      <StatsCard
        title="Pending Approval"
        value={getPendingApprovalCount()}
        icon={Clock}
        gradient="bg-gradient-to-br from-amber-500 to-amber-600"
      />
      <StatsCard
        title="Total Bookings"
        value={totalBookings}
        icon={Calendar}
        gradient="bg-gradient-to-br from-pink-500 to-pink-600"
      />
      <StatsCard
        title="Avg Price"
        value={getAveragePrice() ? `${Math.round(getAveragePrice() / 1000)}k` : '0'}
        icon={DollarSign}
        gradient="bg-gradient-to-br from-orange-500 to-orange-600"
      />
    </div>
  );
};

export default StatsSection;