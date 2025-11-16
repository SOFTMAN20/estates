/**
 * LANGUAGETOGGLE.TSX - LANGUAGE DROPDOWN COMPONENT
 * ================================================
 * 
 * Dropdown for switching between English and Swahili
 */

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 border border-gray-200 ${className}`}
          aria-label="Change language"
        >
          <Globe className="h-5 w-5 text-gray-600" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          className="cursor-pointer flex items-center justify-between"
        >
          <span>English</span>
          {i18n.language === 'en' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => changeLanguage('sw')}
          className="cursor-pointer flex items-center justify-between"
        >
          <span>Swahili</span>
          {i18n.language === 'sw' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
