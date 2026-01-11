import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, CalendarCheck, Home, FileText, ShieldCheck, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type UserType = 'renter' | 'host';

const HowItWorks = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<UserType>('renter');

  const renterSteps = [
    {
      icon: Search,
      title: t('howItWorks.renter.step1.title'),
      description: t('howItWorks.renter.step1.description'),
    },
    {
      icon: CalendarCheck,
      title: t('howItWorks.renter.step2.title'),
      description: t('howItWorks.renter.step2.description'),
    },
    {
      icon: Home,
      title: t('howItWorks.renter.step3.title'),
      description: t('howItWorks.renter.step3.description'),
    },
  ];

  const hostSteps = [
    {
      icon: FileText,
      title: t('howItWorks.host.step1.title'),
      description: t('howItWorks.host.step1.description'),
    },
    {
      icon: ShieldCheck,
      title: t('howItWorks.host.step2.title'),
      description: t('howItWorks.host.step2.description'),
    },
    {
      icon: Wallet,
      title: t('howItWorks.host.step3.title'),
      description: t('howItWorks.host.step3.description'),
    },
  ];

  const steps = activeTab === 'renter' ? renterSteps : hostSteps;

  return (
    <section className="py-16 bg-gradient-to-br from-white via-safari-50/30 to-serengeti-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-serengeti-100/30 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent mb-3">
            {t('howItWorks.title')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
            <button
              onClick={() => setActiveTab('renter')}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === 'renter'
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {t('howItWorks.tabs.renter')}
            </button>
            <button
              onClick={() => setActiveTab('host')}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === 'host'
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {t('howItWorks.tabs.host')}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line (hidden on mobile, shown between cards on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 relative">
                {/* Step number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-serengeti-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
