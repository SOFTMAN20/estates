import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  User, 
  BarChart3, 
  MessageSquare,
  Eye,
  Settings,
  HelpCircle,
  Zap,
  Headphones
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onAddProperty: () => void;
  onEditProfile: () => void;
  onShowHelp: () => void;
  isNewUser: boolean;
  propertiesCount: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddProperty,
  onEditProfile,
  onShowHelp,
  isNewUser,
  propertiesCount
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      id: 'add-property',
      title: isNewUser ? t('dashboard.addFirstProperty') : t('dashboard.addNewProperty'),
      description: isNewUser ? t('dashboard.startJourney') : t('dashboard.addToList'),
      icon: Plus,
      onClick: onAddProperty,
      primary: true,
      highlight: isNewUser,
      color: 'bg-primary hover:bg-primary/90'
    },
    {
      id: 'edit-profile',
      title: t('dashboard.updateAccountInfo'),
      description: t('dashboard.changeAccountDetails'),
      icon: User,
      onClick: onEditProfile,
      primary: false,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'view-analytics',
      title: t('dashboard.viewAnalytics'),
      description: t('dashboard.viewPerformance'),
      icon: BarChart3,
      onClick: () => navigate('/analytics'),
      primary: false,
      disabled: propertiesCount === 0,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'help',
      title: t('dashboard.quickHelp'),
      description: t('dashboard.contactSupport'),
      icon: Headphones,
      onClick: onShowHelp,
      primary: false,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => (
        <Card 
          key={action.id}
          className={`group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            action.highlight ? 'ring-2 ring-primary/50 animate-pulse' : ''
          } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={action.disabled ? undefined : action.onClick}
        >
          <CardContent className="p-6 text-center">
            <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {action.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {action.description}
            </p>
            {action.highlight && (
              <div className="mt-3">
                <div className="flex items-center justify-center text-xs text-primary font-medium">
                    {t('dashboard.startNow')}
                  Anza Sasa!
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;