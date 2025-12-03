import { useState, useEffect } from 'react';
import AnalyticsOverview from '@/components/host/dashboard/analytics/AnalyticsOverview';
import Navigation from '@/components/layout/navbarLayout/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';

interface PropertyOption {
  id: string;
  title: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [propertyList, setPropertyList] = useState<PropertyOption[]>([]);

  // Fetch user's properties
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const properties: PropertyOption[] = data.map((p: { id: string; title: string }) => ({
          id: p.id,
          title: p.title
        }));
        setPropertyList(properties);
      }
    };

    fetchProperties();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navigation />
      
      <div className="w-full">
        <div className="w-full max-w-[1600px] mx-auto lg:pl-0 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8">


          {/* Analytics Content */}
          <AnalyticsOverview 
            propertyId={selectedProperty === 'all' ? undefined : selectedProperty}
            onPropertyChange={setSelectedProperty}
            propertyList={propertyList}
          />
        </div>
      </div>
    </div>
  );
}
