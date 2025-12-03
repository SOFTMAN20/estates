import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AnalyticsCard() {
  const navigate = useNavigate();

  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 bg-gradient-to-br from-green-50 to-white"
      onClick={() => navigate('/analytics')}
    >
      <CardContent className="p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <BarChart3 className="w-10 h-10 text-white" />
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          View Analytics
        </h3>
        
        {/* Description */}
        <p className="text-gray-600">
          View your properties' performance
        </p>
      </CardContent>
    </Card>
  );
}
